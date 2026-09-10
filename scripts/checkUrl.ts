import { Resolver } from "node:dns/promises";

export type Verdict = "alive" | "dead" | "moved" | "unverified";

export interface Check {
  verdict: Verdict;
  detail: string;
  movedTo?: string;
}

// A declared checker UA gets 200/404 from medium.com and codepen.io, where a default
// UA gets a blanket 403. Never spoof Googlebot: reverse-DNS validation flags a fake one.
const headers = {
  "user-agent": "obsidian-linkcheck/1.0 (+https://github.com/e-krebs/knowledge-base)",
  accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "accept-language": "en-US,en;q=0.9",
};

const TIMEOUT = 20_000;
const MAX_HOPS = 5;
const REDIRECTS = [301, 302, 303, 307, 308];
const PERMANENT = [301, 308];

// Cloudflare Turnstile blocks every client here, a real browser included.
const UNCHECKABLE = ["codesandbox.io"];

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Two URLs that differ only by https, www or a trailing slash point at the same page.
export const urlShape = (url: string): string => {
  const { hostname, pathname, search } = new URL(url);
  return `${hostname.replace(/^www\./, "")}${pathname.replace(/\/$/, "")}${search}`;
};

const sameResource = (a: string, b: string): boolean => urlShape(a) === urlShape(b);

const bareHost = (url: string) => new URL(url).hostname.replace(/^www\./, "");

// Landing on the root of the same site means the page is gone. Landing on the root of
// another domain is a project moving house, which is a live page at a new address.
const isSoft404 = ({ url, final }: { url: string; final: string }): boolean =>
  new URL(final).pathname === "/" &&
  new URL(url).pathname !== "/" &&
  bareHost(url) === bareHost(final);

const get = (url: string) =>
  fetch(url, { headers, redirect: "manual", signal: AbortSignal.timeout(TIMEOUT) });

interface Walked {
  status: number;
  final: string;
  wasPermanent: boolean;
}

const walk = async ({
  url,
  hops = 0,
  wasPermanent = false,
}: {
  url: string;
  hops?: number;
  wasPermanent?: boolean;
}): Promise<Walked> => {
  const response = await get(url);
  const location = response.headers.get("location");
  if (!REDIRECTS.includes(response.status) || !location || hops >= MAX_HOPS) {
    return { status: response.status, final: url, wasPermanent };
  }
  return walk({
    url: new URL(location, url).toString(),
    hops: hops + 1,
    wasPermanent: wasPermanent || PERMANENT.includes(response.status),
  });
};

// Two independent resolvers, because one failing proves nothing.
const resolves = async (hostname: string): Promise<boolean> => {
  const attempts = await Promise.all(
    ["1.1.1.1", "8.8.8.8"].map(async (server) => {
      const resolver = new Resolver({ timeout: 5000, tries: 2 });
      resolver.setServers([server]);
      try {
        const addresses = await resolver.resolve4(hostname).catch(() => resolver.resolve6(hostname));
        return addresses.length > 0;
      } catch {
        return false;
      }
    })
  );
  return attempts.some(Boolean);
};

const json = async (url: string): Promise<number> => {
  const response = await fetch(url, { headers, signal: AbortSignal.timeout(TIMEOUT) });
  return response.status;
};

// x.com, youtube.com, reddit.com and bsky.app all serve 200 for a deleted item, so only
// oEmbed tells the truth. It matches on the item id alone, so a wrong author reads alive.
// `supports` is load-bearing: these endpoints 404 on a profile or a channel URL, which
// would read as a death. Anything they do not cover falls through to a plain request.
const oembed =
  ({
    endpoint,
    supports,
    rewrite,
  }: {
    endpoint: string;
    supports: (url: URL) => boolean;
    rewrite?: (url: URL) => string;
  }) =>
  async (url: string): Promise<Check | undefined> => {
    const parsed = new URL(url);
    if (!supports(parsed)) return undefined;
    const status = await json(`${endpoint}${encodeURIComponent(rewrite?.(parsed) ?? url)}`);
    if (status === 200) return { verdict: "alive", detail: "oembed 200" };
    if (status === 404) return { verdict: "dead", detail: "oembed 404" };
    return undefined;
  };

const tweet = oembed({
  endpoint: "https://publish.x.com/oembed?url=",
  supports: ({ pathname }) => pathname.includes("/status/"),
});

const video = oembed({
  endpoint: "https://www.youtube.com/oembed?format=json&url=",
  supports: ({ pathname, searchParams }) =>
    (pathname === "/watch" && searchParams.has("v")) || pathname.startsWith("/shorts/"),
});

// A pen has four view URLs - pen, full, details, pres - and oEmbed only answers for pen.
const pen = oembed({
  endpoint: "https://codepen.io/api/oembed?format=json&url=",
  supports: ({ pathname }) => /^\/[^/]+\/(pen|full|details|pres)\/[^/]+/.test(pathname),
  rewrite: ({ origin, pathname }) =>
    `${origin}${pathname.replace(/^\/([^/]+)\/(pen|full|details|pres)\//, "/$1/pen/")}`,
});

// github.com needs no API handler: its pages answer 404 for a deleted repo or a missing
// file, and 301 for a rename, which the redirect walk already follows. The API is worse
// here, because a reserved route such as /mcp or /features/copilot is neither a user nor
// a repo, so the API calls a live page dead.

// Stack Overflow answers every script with a Cloudflare challenge. The API needs no key,
// and it always returns 200, so existence is the item count.
const stackOverflow = async (url: string): Promise<Check | undefined> => {
  const [section, id] = new URL(url).pathname.split("/").filter(Boolean);
  if (section !== "questions" || !id?.match(/^\d+$/)) return undefined;
  const response = await fetch(
    `https://api.stackexchange.com/2.3/questions/${id}?site=stackoverflow`,
    { headers, signal: AbortSignal.timeout(TIMEOUT) }
  );
  if (response.status !== 200) return undefined;
  const { items } = (await response.json()) as { items?: unknown[] };
  return items?.length
    ? { verdict: "alive", detail: "stackexchange api" }
    : { verdict: "dead", detail: "stackexchange api: no such question" };
};

const authoritative: Record<string, (url: string) => Promise<Check | undefined>> = {
  "stackoverflow.com": stackOverflow,
  "x.com": tweet,
  "twitter.com": tweet,
  "www.youtube.com": video,
  "youtu.be": oembed({
    endpoint: "https://www.youtube.com/oembed?format=json&url=",
    supports: ({ pathname }) => pathname.length > 1,
  }),
  "codepen.io": pen,
  "www.reddit.com": oembed({
    endpoint: "https://www.reddit.com/oembed?url=",
    supports: ({ pathname }) => pathname.includes("/comments/"),
  }),
  "bsky.app": oembed({
    endpoint: "https://embed.bsky.app/oembed?format=json&url=",
    supports: ({ pathname }) => pathname.includes("/post/"),
  }),
};

const verdictOf = async (url: string): Promise<Check> => {
  const { hostname } = new URL(url);
  if (UNCHECKABLE.includes(hostname)) {
    return { verdict: "unverified", detail: "no working check for this host" };
  }

  const handler = authoritative[hostname];
  if (handler) {
    const check = await handler(url).catch(() => undefined);
    if (check) return check;
  }

  try {
    const { status, final, wasPermanent } = await walk({ url });
    if (status === 404 || status === 410) return { verdict: "dead", detail: `${status}` };
    if (status === 451) return { verdict: "dead", detail: "451 (legally removed)" };
    if (status >= 200 && status < 300) {
      if (!wasPermanent || sameResource(url, final)) return { verdict: "alive", detail: `${status}` };
      return isSoft404({ url, final })
        ? { verdict: "dead", detail: "redirects to the homepage" }
        : { verdict: "moved", detail: "permanent redirect", movedTo: final };
    }
    // 403, 401, 429, 405, 999 and every 5xx prove nothing about the page.
    return { verdict: "unverified", detail: `${status}` };
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    if (await resolves(hostname)) return { verdict: "unverified", detail: reason };
    return { verdict: "dead", detail: "hostname resolves to nothing" };
  }
};

// The newest snapshot the archive holds, for a link that is already proven dead. The CDX
// API needs no key, answers 200 with an empty list when nothing was ever archived, and is
// sometimes offline, so a failure here just means no suggestion.
export const wayback = async (url: string, attempt = 1): Promise<string | undefined> => {
  const endpoint =
    "https://web.archive.org/cdx/search/cdx?output=json&filter=statuscode:200" +
    `&fl=timestamp,original&limit=-1&url=${encodeURIComponent(url)}`;
  const rows = await fetch(endpoint, { headers, signal: AbortSignal.timeout(40_000) })
    .then((response) => (response.ok ? (response.json() as Promise<string[][]>) : undefined))
    .catch(() => undefined);

  if (!rows) {
    if (attempt >= 3) return undefined;
    await sleep(attempt * 4_000);
    return wayback(url, attempt + 1);
  }

  const snapshot = rows.at(-1);
  if (!snapshot || snapshot[0] === "timestamp") return undefined;
  return `https://web.archive.org/web/${snapshot[0]}/${snapshot[1]}`;
};

// A death must survive three spaced attempts. Every single-pass failure measured in this
// vault, a 429 burst and one timeout, turned out to be a live page.
export const checkUrl = async (url: string): Promise<Check> => {
  const first = await verdictOf(url);
  if (first.verdict !== "dead") return first;

  await sleep(2_000);
  const second = await verdictOf(url);
  if (second.verdict !== "dead") return { ...second, detail: `${second.detail}, was dead once` };

  await sleep(5_000);
  const third = await verdictOf(url);
  return third.verdict === "dead"
    ? { ...third, detail: `${third.detail}, three times` }
    : { ...third, detail: `${third.detail}, was dead twice` };
};
