---
source: https://jslegenddev.substack.com/p/the-struggle-of-wrapping-a-javascript
fetched: 2026-09-14
published: 2025-08-27
status: fresh
---
JSLegendDev built web games in JavaScript (using the KAPLAY library) and needed to ship an offline, installable desktop build — for reliable save data and a Steam release — without abandoning JS or starting over in a native engine. The post walks through 5 JS-to-desktop wrappers tried in order, what worked and broke on each, and ends on a pick. Reach for this comparison when deciding how to package a browser game (or any web app) for desktop, especially if Steam distribution or building all 3 platforms from one machine matters.

## how
### Popular but Bloated — Electron
- Bundles a full Chromium + Node.js runtime with your app, so every install also installs a Chromium browser; heavy on memory, but games get more slack on resource usage than other app categories
- Worked: huge npm ecosystem to build fast; access to `steamworks.js` for Steam SDK integration; because it ships its own Chromium, rendering is identical across every user's OS, cutting cross-platform testing
- Broke: the app is split into a "frontend" (browser JS/HTML, no Node access) and a "backend" (Node.js, no UI access) that must talk over an IPC bridge — even a simple "write save file, read it back" needed IPC wiring instead of a direct call; Electron Forge (the tool linked from Electron's own tutorial) could only build for the OS it ran on, and cross-building the Windows target from a Mac required installing WINE and hit "all kinds of issues"

### Interesting but I Don't Want to Write Rust — Tauri
- Uses the OS's native webview instead of bundling a browser, so apps are smaller and were easy to read/write files with via Tauri's JS API
- Broke: anything past that JS API — including Steam SDK integration — required writing Rust, a language the author had no other use for and didn't want to learn; the native-webview approach also means rendering differs per OS (Edge/Chromium on Windows, WebKit on Mac, WebKitGTK on Linux), forcing testing on all three; and at the time, Tauri could only build for the platform you were currently developing on, so Windows/Mac/Linux builds each needed their own machine

### A Similar Approach to Tauri — Neutralinojs and Wails
- Neutralinojs: "like Tauri but without Rust" — a JS API for simple file operations; anything more complex needs a separate backend in any language, wired up over WebSockets. Not adopted, mentioned only as an alternative
- Wails: "like Tauri but with Golang instead of Rust" — Go's portability made setup and building executables easy, but there's no JS API at all; the author could only build Windows/macOS (not Linux) when they tried it, and Steam SDK integration is an open question since Go isn't common in game dev

### The Solution — NW.js
- Checked SteamDB's list of engines/tools used by released Steam games: NW.js had 5700+ games (mostly RPG Maker and Construct exports), versus 55000+ Unity, 16900+ Unreal, 2600+ Godot — read as evidence NW.js is battle-tested despite JS being a niche game-dev language
- Worked: no frontend/backend split and no IPC bridge — reading and writing a save file is a direct call; building for all 3 platforms is: download the pre-built NW.js binary for each target platform from the NW.js site, create a `package.nw` folder next to the executable, put your source code in it, then merge the folder into the executable with NW.js's own merge command and rename/re-icon the result
- The author's own follow-up tutorial pairs Vite (for dev-time hot reload) with NW.js by gating disk-access code behind Vite environment variables, and uses NW-Builder to script the build instead of manually downloading binaries each time
- Broke: nothing noted in the piece — no caveats recorded for NW.js

### Conclusion
NW.js is the author's pick, described as "the easiest technology by far for wrapping a JavaScript based game for desktop."

## gotchas
- NW.js ships your game's source code directly inside the executable, making it trivial to unpack and pirate; the author calls this out but says it didn't matter in practice — Balatro (Love2D, a similarly source-exposed framework) still made millions
- Tauri's reliance on the OS's own webview (not a bundled browser) means visual differences must be verified on Windows, Mac, and Linux separately, unlike Electron's single bundled Chromium
