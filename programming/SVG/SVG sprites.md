>Bonus: [online SVG sprite optimization](https://sprite-your-svgs.vercel.app/)

1. Create an SVG sprite containing the symbols you want to reuse:
```html
<svg xmlns="http://www.w3.org/2000/svg" style="display:none;">
  <symbol id="icon-circle" viewBox="0 0 32 32">
    <circle cx="16" cy="16" r="16" />
  </symbol>
  <symbol id="icon-square" viewBox="0 0 32 32">
    <rect x="0" y="0" width="32" height="32" />
  </symbol>
</svg>
```
2. Use the SVG symbols throughout your site:
```html
<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32">
  <use href="#icon-circle" />
</svg>

<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32">
  <use href="#icon-square" />
</svg>
```
With React:
```tsx
import React from "react";
import ReactDOM from "react-dom";

// keep a list of the icon ids we put in the symbol
const icons = ["icon-circle", "icon-square"];

// then define an Icon component that references the 
function Icon({ id, ...props }) {
  return (
    <svg {...props}>
      <use href={`/images/sprite.svg#${id}`} />
    </svg>
  );
}

// In your App, you can now render the icons
function App() {
  return (
    <div className="App">
      {icons.map((id) => {
        return <Icon key={id} id={id} />;
      })}
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
```
