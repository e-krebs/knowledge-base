// Verbatim page dumps: fetch the HTML, keep headings, paragraphs, lists and code, drop the rest.
const [file, scratch] = Bun.argv.slice(2);
type Row = { n: number; verdict: string; url: string; page: string | null };
const rows = (JSON.parse(await Bun.file(file).text()) as Row[]).filter((x) => x.verdict !== "link");
const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36";

const decode = (s: string) =>
  s
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'")
    .replace(/&nbsp;/g, " ").replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(+d))
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16))).replace(/&amp;/g, "&");

const toText = (html: string): string => {
  let h = html.replace(/<script[\s\S]*?<\/script>/gi, "").replace(/<style[\s\S]*?<\/style>/gi, "").replace(/<!--[\s\S]*?-->/g, "");
  h = h.replace(/<(nav|footer|header|aside|form|svg|noscript)\b[\s\S]*?<\/\1>/gi, "");
  const main = h.match(/<article\b[\s\S]*?<\/article>/i)?.[0] ?? h.match(/<main\b[\s\S]*?<\/main>/i)?.[0] ?? h;
  const pres: string[] = [];
  let t = main.replace(/<pre\b[\s\S]*?<\/pre>/gi, (m) => {
    const code = decode(m.replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, ""));
    pres.push(code.replace(/^\n+|\n+$/g, ""));
    return `\n@@PRE${pres.length - 1}@@\n`;
  });
  t = t
    .replace(/<h([1-6])[^>]*>/gi, (_, l) => `\n\n${"#".repeat(+l)} `).replace(/<\/h[1-6]>/gi, "\n\n")
    .replace(/<li[^>]*>/gi, "\n- ").replace(/<\/(p|div|section|blockquote|tr|ul|ol|figure|figcaption|dd|dt)>/gi, "\n\n")
    .replace(/<br\s*\/?>/gi, "\n").replace(/<(code|kbd)[^>]*>/gi, "`").replace(/<\/(code|kbd)>/gi, "`")
    .replace(/<img[^>]*alt="([^"]*)"[^>]*>/gi, (_, a) => (a ? `[image: ${a}]` : ""))
    .replace(/<[^>]+>/g, "");
  t = decode(t).replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").replace(/^[ \t]+/gm, "");
  return t.replace(/@@PRE(\d+)@@/g, (_, i) => "```\n" + pres[+i] + "\n```").trim();
};

const get = async (url: string) => {
  const res = await fetch(url, { headers: { "user-agent": UA, accept: "text/html" }, redirect: "follow" });
  if (!res.ok) throw new Error(`${res.status}`);
  return res.text();
};
const wayback = async (url: string) => {
  const cdx = `https://web.archive.org/cdx/search/cdx?output=json&filter=statuscode:200&fl=timestamp,original&limit=-1&url=${encodeURIComponent(url)}`;
  const rowsCdx = (await (await fetch(cdx)).json()) as string[][];
  const last = rowsCdx.at(-1);
  if (!last || last[0] === "timestamp") throw new Error("no snapshot");
  return { html: await get(`https://web.archive.org/web/${last[0]}id_/${last[1]}`), via: `wayback ${last[0]}` };
};

const report: string[] = [];
const one = async (x: Row) => {
  const out = `${scratch}/pages/${String(x.n).padStart(2, "0")}-full.md`;
  try {
    let html: string;
    let via = "live";
    try {
      html = await get(x.url);
    } catch {
      ({ html, via } = await wayback(x.url));
    }
    const text = toText(html);
    await Bun.write(out, `source: ${x.url}\nvia: ${via}\n\n${text}\n`);
    report.push(`${x.n} | ${text.length} | ${via}`);
  } catch (e) {
    report.push(`${x.n} | FAILED | ${(e as Error).message}`);
  }
};
// four lanes keep the hosts happy
const queue = [...rows];
const lane = async (): Promise<void> => {
  const x = queue.shift();
  if (!x) return;
  await one(x);
  return lane();
};
await Promise.all([lane(), lane(), lane(), lane()]);
console.log(report.sort((a, b) => +a.split(" ")[0] - +b.split(" ")[0]).join("\n"));
