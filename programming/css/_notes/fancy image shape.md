---
source: https://shrutibalasa.substack.com/p/make-your-images-interesting-with
fetched: 2026-09-10
published: 2023-03-08
status: fresh
---
Setting multiple, unequal values on `border-radius` turns a squared-off image into an organic, blob-shaped one in a single declaration. Reach for it as a quick way to make a hero or profile image feel less rigid, once the image is already cropped to a fixed size.

## how
Crop the image into a square first:
```css
img {
  width: 500px;
  height: 500px;
  object-fit: cover;
}
```
Then apply asymmetric corner radii:
```css
img {
  width: 500px;
  height: 500px;
  object-fit: cover;
  border-radius: 62% 38% 62% 38% / 65% 69% 31% 35%;
}
```
No need to memorize the syntax by hand — a border-radius generator tool produces the values.
