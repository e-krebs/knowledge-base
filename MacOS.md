[📺 Organize Your Dock & Group Apps With Spacers](https://www.youtube.com/watch?v=zvk8R-KFP_U)
SMALL SPACER
```sh
defaults write com.apple.dock persistent-apps -array-add '{"tile-type"="small-spacer-tile";}'; killall Dock 
```
STANDARD SPACER
```sh
defaults write com.apple.dock persistent-apps -array-add '{"tile-type"="spacer-tile";}'; killall Dock
```

[BetterDisplay - Custom Resolutions, etc.](https://github.com/waydabber/BetterDisplay)
