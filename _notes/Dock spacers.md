---
source: https://www.youtube.com/watch?v=zvk8R-KFP_U
fetched: 2026-09-14
status: fresh
---
Spacer tiles group apps in the macOS Dock, added from the terminal. Reach for this when the Dock's default icon strip needs visual grouping (e.g. separating personal apps from work apps) without a third-party tool.

## how
Small spacer:
```sh
defaults write com.apple.dock persistent-apps -array-add '{"tile-type"="small-spacer-tile";}'; killall Dock
```

Standard spacer:
```sh
defaults write com.apple.dock persistent-apps -array-add '{"tile-type"="spacer-tile";}'; killall Dock
```
