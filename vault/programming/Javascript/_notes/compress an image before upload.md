---
source: https://pqina.nl/blog/compress-image-before-upload
fetched: 2026-09-11
published: 2023-01-01
status: fresh
---
Before uploading a file selected via `<input type="file">`, you can shrink it client-side with the Canvas API and write the result back into the same file input — no server round-trip, no extra dependency. This keeps oversized user-selected images from ever hitting the network.

## how
Convert the selected `File` to an `ImageBitmap`, draw it to a canvas, then re-encode it as a compressed blob and wrap it back into a `File`:

```js
const compressImage = async (file, { quality = 1, type = file.type }) => {
    const imageBitmap = await createImageBitmap(file);

    const canvas = document.createElement('canvas');
    canvas.width = imageBitmap.width;
    canvas.height = imageBitmap.height;
    canvas.getContext('2d').drawImage(imageBitmap, 0, 0);

    const blob = await new Promise((resolve) => canvas.toBlob(resolve, type, quality));
    return new File([blob], file.name, { type: blob.type });
};

// per selected file:
const compressedFile = await compressImage(file, { quality: 0.5, type: 'image/jpeg' });
```

Then rebuild the input's file list with a `DataTransfer` (adding compressed images and passing through non-images unchanged) and assign it back to `input.files`.

## gotchas
- `DataTransfer` only accepts `File` objects, so the compressed `Blob` from `canvas.toBlob()` must be wrapped back into a `File` before adding it.
- WEBP output wasn't supported on Safari at the time of writing — stick to JPEG/PNG for broad compatibility unless you've verified WEBP support.
- This only compresses; resizing to a bounding box, cropping, and Safari memory handling on large images are left as further improvements.
