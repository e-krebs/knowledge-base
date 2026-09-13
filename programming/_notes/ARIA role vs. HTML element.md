---
source: https://www.w3.org/TR/html-aria/#docconformance
fetched: 2026-09-13
published: 2026-08-11
status: fresh
---
Lists each HTML element's implicit ARIA role and which role/aria-* values authors may add — consult before adding a role/aria-* attribute or auditing markup for redundant/forbidden ARIA.

## how
NR=not recommended, SN=should not, MN=must not, NP=naming prohibited (MN set aria-label/aria-labelledby unless an allowed role overrides it). No role=MN override native semantics; Any role=MAY set any role (own/generic/deprecated NR).

| HTML element | Implicit role | Roles authors MAY set (rules) |
|---|---|---|
| `a` with href | link | button, checkbox, menuitem, menuitemcheckbox, menuitemradio, option, radio, switch, tab, treeitem (link allowed, NR). aria-disabled NR; drop href to mark disabled |
| `a` without href, `b`, `bdi`, `bdo`, `data`, `i`, `pre`, `q`, `samp`, `small`, `span`, `u` | generic | Any role (generic SN). NP |
| `abbr`, `cite`, `kbd`, `mark`, `rp`, `rt`, `var` | none | Any role. NP |
| `ruby` | none | Any role (naming allowed, no prohibition noted) |
| `address` | group | Any role (group NR) |
| `area` with href | link | only link (NR) |
| `area` without href | generic | button or link (generic allowed, SN). NP |
| `article` | article | application, document, feed, main, none, presentation, region (article NR) |
| `aside` | complementary | feed, none, note, presentation, region, search (complementary NR) |
| `audio`, `video` | none | application only |
| autonomous custom element | ElementInternals role, else generic | if set: no role; else any role (generic SN). NP if generic/prohibited role |
| `base`, `col`, `colgroup`, `head`, `input[hidden]`, `link`, `map`, `meta`, `noscript`, `param`, `script`, `slot`, `source`, `style`, `template`, `title`, `track` | none | no role or aria-* at all |
| `blockquote` | blockquote | Any role (NR) |
| `body` | generic | only generic (SN). NP; MN set aria-hidden=true on body |
| `br`, `wbr` | none | none or presentation; only aria-hidden allowed, no other aria-* |
| `button`, `input[type=button/image/reset/submit]` | button | checkbox, combobox*, gridcell, link, menuitem, menuitemcheckbox, menuitemradio, option, radio, separator, slider, switch, tab, treeitem (all NR). *combobox only for `button`/`input[type=button]`. `button` as first child of `select`: inert, no role/aria-*. image/reset/submit: prefer `button` if possible |
| `canvas` | none | Any role |
| `caption` | caption | only caption (NR). NP |
| `code`, `del`, `em`, `ins`, `p`, `s`, `strong`, `sub`, `sup`, `time` | own named role (e.g. deletion for del/s, emphasis for em) | Any role (own role NR). NP |
| `datalist` | listbox | only listbox (NR). No aria-* at all |
| `dd` | none | No role. Global aria-* + attrs for `definition` role |
| `details` | group | only group (NR) |
| `dfn` | term | Any role (term NR) |
| `dialog` | dialog | alertdialog (dialog allowed, NR) |
| `div` | generic | if direct child of `dl`: only none/presentation; else any role (generic SN). NP |
| `dl` | none | group, list, none, presentation |
| `dt` | none | listitem only |
| `embed`, `iframe` | none | application, document, img, image, none, presentation |
| `fieldset` | group | none, presentation, radiogroup (group NR) |
| `figcaption` | none | group, none, presentation. NP |
| `figure` | figure | if has `figcaption` descendant: only figure (NR); else any role (figure NR) |
| `footer` | contentinfo unless nested in article/aside/main/nav/section → generic | group, none, presentation. NP if generic |
| `form` | form | none, presentation, search (form NR). Not a landmark unless named |
| form-associated custom element | ElementInternals role, else generic | if set: no role; else button, checkbox, combobox, listbox, progressbar, group, radio, radiogroup, searchbox, slider, spinbutton, switch, textbox (generic SN). NP if generic |
| `h1`-`h6` | heading, aria-level=N | none, presentation, tab (heading NR) |
| `header` | banner unless nested in article/aside/main/nav/section → generic | group, none, presentation. NP if generic |
| `hgroup` | group | Any role (group NR) |
| `hr` | separator | none, presentation (separator NR) |
| `html` | generic | only document or generic (both NR). No aria-* at all |
| `img` (has alt/accessible name, or has neither) | img/image | button, checkbox, link, math, menuitem, menuitemcheckbox, menuitemradio, meter, option, progressbar, radio, scrollbar, separator, slider, switch, tab, treeitem (NR). If no alt and no accessible name: only none/presentation |
| `img` with empty alt, no accessible name | none/presentation | only none/presentation (NR). No aria-* except aria-hidden=true |
| `input[type=checkbox]`, `input[type=radio]` | checkbox / radio | checkbox: menuitemcheckbox, option, switch, button w/ aria-pressed (NR); radio: menuitemradio (NR). Both: MN use aria-checked; HTML `checked` attribute substitutes |
| `input[type=color]` | none | No role. Global aria-* + aria-disabled only |
| `input[type=date/datetime-local/month/password/time/week]` | none | No role. Global aria-* + attrs for textbox role |
| `input[type=email/tel/url]` (no list), `textarea` | textbox | only textbox (NR) |
| `input[type=file]` | none | No role. Global aria-*, aria-disabled, aria-invalid, aria-required |
| `input[type=number]` | spinbutton | only spinbutton (NR) |
| `input[type=range]` | slider | only slider (NR). SN use aria-valuemax/valuemin |
| `input[type=search]` (no list) | searchbox | only searchbox (NR) |
| `input[type=text]` (no list) or missing/invalid type | textbox | combobox, searchbox, spinbutton (textbox NR) |
| `input[type=text/search/tel/url/email]` (or missing/invalid), with list | combobox | only combobox (NR). SN use aria-haspopup |
| `label` | none | if associated with a labelable element: no role; else any role (generic SN). NP if generic or naming-prohibited role |
| `legend` | none | No role. NP |
| `li` | listitem if parent exposes list role, else generic | only listitem if parent has list role (NR); else any role. SN use deprecated DPub roles |
| `main` | main | only main (NR) |
| `math` | math | only math (NR) |
| `menu`, `ol`, `ul` | list | group, listbox, menu, menubar, none, presentation, radiogroup, tablist, toolbar, tree (list NR). SN use deprecated directory role |
| `meter` | meter | only meter (NR). SN use aria-valuemax/valuemin |
| `nav` | navigation | menu, menubar, none, presentation, tablist (navigation NR) |
| `object` | none | application, document, img, image |
| `optgroup` | group | only group (NR) |
| `option` | option | only option (NR). SN use aria-selected |
| `output` | status | Any role (status NR) |
| `picture` | none | No role; only aria-hidden allowed |
| `progress` | progressbar | only progressbar (NR). SN use aria-valuemax |
| `search` | search | form, group, none, presentation, region (search NR) |
| `section` | region if it has an accessible name, else generic | alert, alertdialog, application, banner, complementary, contentinfo, dialog, document, feed, group, log, main, marquee, navigation, none, note, presentation, search, status, tabpanel (region NR, generic SN) |
| `select` (dropdown / list box) | combobox / listbox | dropdown: menu (NR); list box: only listbox (NR). Both: SN use aria-multiselectable |
| `selectedcontent` | generic | if valid descendant of `select`: no role; else any role if misused outside `select` (generic NR). NP |
| `summary` | none (UA-dependent) | if summary for parent `details`: no role, but global aria-*/aria-disabled/aria-haspopup allowed; else any role |
| `SVG` | graphics-document | Any role (NR) |
| `table` | table | Any role (NR) |
| `tbody`, `tfoot`, `thead` | rowgroup | Any role (rowgroup NR) |
| `td`, `th` | td: cell/gridcell; th: columnheader/rowheader/cell or columnheader/rowheader/gridcell (per table/grid/treegrid ancestor); none if ancestor untyped | if ancestor has table/grid/treegrid role: only the matching cell/header role(s) (NR); else any role |
| `tr` | row | if ancestor table role=table/grid/treegrid: only row (NR); else any role (row NR) |
