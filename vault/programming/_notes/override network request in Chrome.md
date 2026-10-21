---
source: https://developer.chrome.com/blog/new-in-devtools-117/
fetched: 2026-09-13
published: 2023-08-16
status: fresh
---
Chrome 117 streamlined DevTools' local-overrides feature so you can mock a request's response headers and body straight from the Network panel, including XHR and fetch requests. Reach for this to mock API responses and debug a page before its backend or API is ready.

## how
1. In the Network panel, right-click the request you want to override and select **Override content**.
2. If local overrides are set up but disabled, DevTools enables them. If they aren't set up yet, DevTools prompts you in the action bar at the top — pick a folder to store the overrides in and grant DevTools access to it.
3. Once set up, DevTools takes you to **Sources > Overrides > Editor** to edit the content.
4. Overridden resources show an icon in the Network panel; hover it to see what's overridden.

Supported request types for content overrides: images (e.g. avif, png), fonts, fetch and XHR, scripts (css and js), and documents (html). DevTools grays out **Override content** for unsupported types.

## gotchas
- Vault link used to be Addy Osmani's tweet (2023-08-16), which only holds a video; the tweet itself links to this Chrome 117 post.
