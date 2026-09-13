---
source: https://developer.chrome.com/docs/devtools/settings/locations
fetched: 2026-09-13
published: 2021-03-06
status: fresh
---
Chrome DevTools' Sensors panel overrides a page's reported geolocation, including its timezone and locale, so you can test how a site behaves in another timezone without changing OS settings. Preset cities are built in, and custom presets (with an explicit Timezone ID) live under Settings > Locations.

## how
1. Open the Command Menu — Cmd+Shift+P (macOS) or Ctrl+Shift+P (Windows/Linux/ChromeOS) — type `sensors`, select **Show Sensors**. The Sensors panel opens at the bottom of DevTools.
2. In the Sensors panel's **Geolocation** list, pick one of the preset cities (e.g. Tokyo), or **Custom location** to enter your own latitude/longitude, or **Location unavailable** to test the no-permission case.
3. To spoof a timezone, add a custom preset instead: open **Settings**, go to the **Locations** tab, click **Add location**, and fill in:
   - Location name (e.g. `New York`)
   - Latitude / Longitude (right-click a city on Google Maps to copy these)
   - Timezone ID — e.g. `America/New_York`, per the IANA Time Zone Database
   - Locale — e.g. `en-US`, per BCP47
4. Click **Save**, then select the new preset from the Sensors panel's **Location** drop-down.

## gotchas
- Vault link previously pointed at a 2021 dev.to article whose menu path is outdated — it opened Sensors from the Console drawer's three-dot menu and set the timezone via an inline "Other..." option. The current path is Command Menu > Show Sensors, with a custom Timezone ID entered under Settings > Locations and then selected in the Sensors panel.
