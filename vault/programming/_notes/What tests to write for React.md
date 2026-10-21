---
source: https://dev.to/franciscomoretti/what-tests-to-write-for-react-56ki
fetched: 2026-09-13
published: 2025-04-04
status: fresh
---
The Testing Trophy is Kent C. Dodds's model for how to weight test types on a React project, replacing Martin Fowler's Test Pyramid now that UI testing tools are fast and stable. Reach for it when deciding where to spend test-writing effort, favoring integration tests over deeply mocked units or a large, slow end-to-end suite.

## how
Four layers, bottom to top:
- **Static** (TypeScript, ESLint, Biome) — checks code without running it; cheapest way to catch typos and type errors.
- **Unit** — verifies isolated functions/logic; fast but doesn't prove components work together.
- **Integration** (the trophy's largest section) — tests components interacting, mocking as little as possible; best confidence-to-cost ratio, and more resilient to refactors than unit tests.
- **End-to-end** (Playwright/Cypress) — full-app browser flows; most confidence, slowest and priciest to maintain.

```jsx
// Integration: testing a form component with React Testing Library
test('submits the form with user credentials', async () => {
  const handleSubmit = vi.fn()
  render(<LoginForm onSubmit={handleSubmit} />)

  await userEvent.type(screen.getByLabelText(/email/i), 'user@example.com')
  await userEvent.type(screen.getByLabelText(/password/i), 'password123')
  await userEvent.click(screen.getByRole('button', { name: /log in/i }))

  expect(handleSubmit).toHaveBeenCalledWith({
    email: 'user@example.com',
    password: 'password123',
  })
})
```

## gotchas
- Don't aim for 100% coverage — it tends to push tests toward asserting implementation details instead of behavior.
- If a test is hard to write, that's often a sign about the code's design, not the test.
- The ideal test mix still depends on the project: app complexity, team size, stability requirements, and dev phase all shift the balance.
