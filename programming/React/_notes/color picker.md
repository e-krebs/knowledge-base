---
source: https://polar.sh/emilwidlund/posts/a-new-kind-of-color-picker-with-react-typescript
fetched: 2026-09-11
published: 2024-01-13
status: fresh
---
Building a color picker that suggests harmonious palettes (analogous, complementary, triadic, tetradic, square) is easy in the HSV color model, because each harmony is just a hue rotation by a fixed number of degrees. The picker renders an HSV color wheel on a `canvas`, tracks a draggable pointer in polar coordinates, and derives harmony colors by rotating the picked hue. Reach for this approach whenever you need a color picker that also proposes color combinations, rather than just picking one color.

## how
Define each harmony as the degree offsets to rotate the base hue by:

```ts
const harmonies = {
    triad: [120, 240],
    tetradic: [60, 180, 240],
    complementary: [180],
    analogous: [-30, 30],
    square: [90, 180, 270]
} as const;
```

Convert the draggable pointer's x/y to polar coordinates to get the current hue, then rotate it per harmony and convert each result back to x/y to place the harmony markers:

```ts
const harmonyPairs = useMemo(() => {
    const x = position.x - radius;
    const y = position.y - radius;
    const [r, phi] = xy2polar(x, y);
    const hue = rad2deg(phi);
    const saturation = r / radius;

    return harmony.map(harmonyHue => {
        let newHue = (hue + harmonyHue) % 360;
        newHue = newHue < 0 ? 360 + newHue : newHue;
        const [x, y] = polar2xy(r, newHue * (Math.PI / 180));
        return { x: -x + radius, y: -y + radius, hue: newHue, saturation, value: 1.0 };
    });
}, [position, harmony, radius]);
```

The wheel itself is drawn pixel-by-pixel on a `canvas` (polar angle -> hue, distance from center -> saturation, `hsv2rgb` -> RGB), and the pointer is a `react-draggable` element clamped to the wheel's radius before being converted back to polar to read off hue/saturation.

## gotchas
- Clamp the canvas to a circle via CSS `border-radius` on the element rather than skipping out-of-radius pixels in the draw loop — skipping pixels produces jagged, unantialiased edges.
- No native browser or React replacement exists for this drag-based interactive picker; CSS Color 4's relative color syntax can rotate hues declaratively in CSS but doesn't provide the interactive wheel.
