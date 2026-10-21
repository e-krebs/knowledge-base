---
source: https://kyleshevlin.com/ui-composition
fetched: 2026-09-11
published: 2023-10-03
status: fresh
---
When a component grows egregious conditionals or hacky CSS to handle several distinct jobs at once (e.g. a `Card` that both wraps-with-border and pads-its-content and now needs internal dividers), it has too many responsibilities. Split it into a compound component — separate pieces for each job, composed by the caller — instead of reaching for CSS workarounds.

## how
```jsx
const CardContext = React.useContext(false)
const useCardContext = () => {
  const context = React.useContext(CardContext)
  if (!context) {
    throw new Error('You may only use Card compound components inside of a `Card.Wrap` component')
  }
}

Card.Wrap = function Wrap({ children }) {
  return (
    <CardContext.Provider value={true}>
      <div style={{ border: '2px solid var(--colors-offsetMore)', borderRadius: 4, boxShadow: '8px 8px var(--colors-accent)' }}>
        {children}
      </div>
    </CardContext.Provider>
  )
}

Card.Section = function Section({ children }) {
  useCardContext()
  // nested Provider blocks Sections/Dividers from nesting inside a Section
  return <CardContext.Provider value={false}><div style={{ padding: '1rem' }}>{children}</div></CardContext.Provider>
}

Card.Divider = function Divider() {
  useCardContext()
  return <hr />
}
```
Compose: `<Card.Wrap><Card.Section>…</Card.Section><Card.Divider /><Card.Section>…</Card.Section></Card.Wrap>`. Keep a default `Card = ({ children }) => <Card.Wrap><Card.Section>{children}</Card.Section></Card.Wrap>` for the simple single-section case.

## gotchas
- The Context guard only throws when a compound piece (`Card.Section`, `Card.Divider`) is used outside `Card.Wrap` — it's an authoring safeguard, not state you read.
