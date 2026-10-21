---
source: https://howtotestfrontend.com/resources/vitest-browser-mode-guide-and-setup-info
fetched: 2026-09-13
published: 2025-11-30
status: stale
---
Vitest Browser Mode runs component tests in a real browser (via Playwright) instead of jsdom, so Web APIs like `localStorage`, `IntersectionObserver`, and `navigator.clipboard` work out of the box, plus a visual preview and screenshot regression. It still tests one component at a time, like normal Vitest/RTL, and can be added alongside existing tests rather than replacing them.

## how
Install with `npm install --save-dev @vitest/browser-playwright @vitest/ui vitest vitest-browser-react`.

`vitest.browser.config.ts`:

```ts
import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';

export default defineConfig({
  test: {
    browser: {
      enabled: true,
      provider: playwright(),
      instances: [{ browser: 'chromium' }],
    },
  },
});
```

Install Playwright browsers once (`yarn playwright install --with-deps`), then run `yarn vitest --browser --config=vitest.browser.config.ts --ui`.

Locator API:

```jsx
import { render } from 'vitest-browser-react';

test('can render', async () => {
  const screen = await render(<YourComponent />);
  const locator = screen.getByRole('heading');
  expect(locator).toHaveTextContent('some heading');

  await expect.element(locator).toHaveTextContent('updated');
  await screen.getByRole('button').click();
});
```

## gotchas
- Locators are lazy/synchronous; only `await expect.element(...)` polls for async updates, similar to but not identical to RTL's `findBy...`
- there is no `queryBy...`; use `getBy...` with `.not.toBeInTheDocument()` instead
- Vitest 5.0 shipped 2026-09-03, after this Nov 2025 guide written against Vitest 4; the Locator API, `render()`/`page` imports, and the `@vitest/browser-playwright` package name are unchanged, but v5 tightened browser-mode/provider config defaults this guide doesn't cover
