---
source: https://spacejelly.dev/posts/how-to-add-a-sitemap-rss-feed-in-next-js-app-router
fetched: 2026-09-11
published: 2024-03-29
status: fresh
---
Next.js App Router has a built-in convention for a dynamic sitemap (`app/sitemap.ts`) and lets you build an RSS or JSON feed yourself with a Route Handler. Reach for this on any blog or content-driven site that needs to be crawlable (sitemap) or offer a subscribable content feed (RSS/JSON), instead of hand-writing XML.

## how
### Dynamic sitemap
`app/sitemap.ts` exports a function returning `MetadataRoute.Sitemap`; Next.js serves it at `/sitemap.xml`:

```ts
import { MetadataRoute } from 'next';
import { getPosts } from '@/lib/posts'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const links = [{ url: 'https://yourwebsite.com', lastModified: new Date() }]

  const posts = await getPosts();
  posts.forEach(post => {
    links.push({ url: `https://yourwebsite.com/${post.slug}`, lastModified: post.lastModified })
  })

  return links;
}
```

### RSS feed via a Route Handler
Create `app/feed.xml/route.ts`, build the feed with the `rss` package, and return it with the right content type:

```ts
import RSS from 'rss';

export async function GET() {
  const feed = new RSS({
    title: 'Your Website',
    site_url: 'https://yourwebsite.com',
    feed_url: 'https://yourwebsite.com/feed.xml',
    pubDate: new Date(),
  });

  const posts = await getPosts();
  posts.map((post) => {
    feed.item({
      title: post.title,
      guid: `https://yourwebsite.com/${post.slug}`,
      url: `https://yourwebsite.com/${post.slug}`,
      date: post.date,
      description: post.excerpt,
    });
  });

  return new Response(feed.xml({ indent: true }), {
    headers: { 'Content-Type': 'application/atom+xml; charset=utf-8' },
  });
}
```

Advertise the feed in `layout.tsx` metadata: `alternates: { types: { 'application/rss+xml': 'https://yourwebsite.com/feed.xml' } }`.
A plain JSON feed is the same Route Handler pattern, just returning `JSON.stringify(posts)` with `Content-Type: application/json`.

## gotchas
- `priority` and `changeFrequency` can be set on sitemap links but Google ignores both values.
- Validate the RSS output with the W3C Feed Validation Service.
- Decide a caching/revalidation strategy for these feed routes; they aren't cached for you automatically.
