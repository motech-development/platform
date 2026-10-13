# Breeze UI v4 gaps exposed by the Accounts prototype

## Research question

Which parts of the Accounts prototype (`.design/accounts/prototype.html`, `DESIGN.md`) cannot be built from Breeze UI v4's public components without app-built UI? This note resolves [Research: Breeze UI v4 gaps exposed by the Accounts prototype](https://github.com/motech-development/platform/issues/1652), part of [Wayfinder: Revive Accounts web on TanStack Start and Breeze UI v4](https://github.com/motech-development/platform/issues/1649).

It audits the repository at `dbc0296b4`, against the [Breeze UI v4 specification](https://github.com/motech-development/platform/issues/1598) and its two sets of amendments. Every Breeze claim below was checked against component source, not only against the Storybook docs.

## Result

Breeze v4 covers most of the prototype. That includes the application shell and both navigation bars, the page header, the balance strip, the transaction ledger with its day groups, totals, direction tiles and VAT column, and every field type (text, number, select, filterable category picker, free-text supplier, date). It also covers the filter controls, the company switcher, the account and notification panel and its appearance control, the attachment row and drop zone, the document viewer, toasts, and the empty, error and loading states.

The app still has its own compositions to build, as the specification intends. These are the ledger row mapping, the attention panel, the paperwork queue and the record sheet, plus page layout in Tailwind.

There are **14 Breeze gaps**. One affects every sheet: a `Drawer` cannot be opened by anything other than its own trigger button. Six are list capabilities that `RowList` lacks: column headings, rows that hold their own action, initials, extra columns, two badges, and the loaded count. The other seven are smaller: non-currency stat figures, a progress bar, hidden field labels, hover explanations, a chip count, links that look like buttons, and a card header description. Each is filed as its own issue (listed under [Gaps](#gaps)).

The specification's inventory decision ([#1587](https://github.com/motech-development/platform/issues/1587)) says the prototype never renders a progress bar or tooltip, and that the ledger has no column headers. The prototype has not changed since then (`940bc92fd`), yet it does render two progress bars (lines 2406–2415 and 2588–2590), `title` hover text (lines 1591 and 2289) and a heading row above every list (lines 1304, 1328, 1387 and 1426). Three of the gaps come from that mismatch.

## Recommendation key

- **Covered**: Breeze public components and props render it. App code only maps data to props and arranges components with Tailwind layout.
- **App composition**: app-owned assembly of Breeze components, as the specification's seam intends (ledger row, attention panel, paperwork queue, record sheet, and page layouts). Nothing in Breeze is missing.
- **Gap**: building it would need an app-built control or visual, or would lose behaviour or accessibility, because Breeze lacks a component, variant, prop or behaviour. Each gap is filed.
- **Difference**: Breeze renders the element with a cosmetic change and loses no information or behaviour. These are not filed; see [Differences that are not gaps](#differences-that-are-not-gaps).

## Coverage table

Prototype lines refer to `.design/accounts/prototype.html`. Breeze paths are under `packages/breeze-ui/src/`.

### Chrome

| Prototype element | Lines | Breeze components | Verdict |
| --- | --- | --- | --- |
| Top bar: mark, company switcher, account control | 2888–2911 | `ApplicationShell` `brand`, `context`, `account` slots (`patterns/ApplicationShell/ApplicationShell.tsx:73-93`). Pass `null` to `notifications` because DESIGN.md wants one avatar control. The mark is app brand content. | Covered |
| Section tabs with current mark | 2912–2927 | `ApplicationShell` `items`/`getItem`/`currentItem`, with `navmark` transition (`ApplicationShell.tsx:102-136`, `178-195`) | Covered |
| Phone bottom bar and centre action | 2930–2963 | `ApplicationShell` bottom nav and required `action` (`ApplicationShell.tsx:63-71`, `201-241`). Icons: `overview`, `list`, `people`, `calendar`. | Covered |
| Company switcher menu: Companies header, initials, Selected, Manage companies | 2797–2817 | `Menu` with `section`, `initials`, `badge` and an icon item (`primitives/Menu/Menu.tsx:74-102`). The `Sections` story is this menu. | Covered (trigger shows an icon, not initials; see differences) |
| Account avatar with unread dot | 2904–2910 | `Popover` `triggerInitials`, `triggerIndicator`, `variant="panel"`, `placement="bottom end"` (`primitives/Popover/Popover.tsx:21-36`) | Covered |
| Notification list inside the account panel | 2825–2852 | Panel and Mark all as read: `Popover`, quiet `Button`. Rows with an unread marker and an optional Download: no component. Breeze's own `AccountPanel` story builds them with inline `style`. | **Gap** [#1671](https://github.com/motech-development/platform/issues/1671); Download styling [#1681](https://github.com/motech-development/platform/issues/1681) |
| Appearance Light/Auto/Dark | 2853–2873 | `AppearanceControl`; the app persists the choice through `BreezeProvider` | Covered |
| Account links: Company details, Settings, Log out | 2874–2883 | `Link variant="subtle"` inside the panel | Covered |
| Page heading, description, primary action (hidden below `md`) | 3055–3081 | `PageHeader` with a `Button icon="add"`. An app Tailwind wrapper hides the action below `md`. | Covered |
| Confirmation toast | 3373–3383 | `useToast` | Covered |
| Skip link | (none) | `ApplicationShell` renders `SkipLink` | Covered |
| Prototype state bar and attachment-type switch | 2964–2993, 2656–2663 | Prototype-only controls | Not in scope |

### Screens

| Prototype element | Lines | Breeze components | Verdict |
| --- | --- | --- | --- |
| Overview balance strip, with VAT scheme badge | 1137–1149 | `StatStrip` with item `badge` (`patterns/StatStrip/StatStrip.tsx:50-61`) | Covered |
| Overview loading | 1051–1063 | `StatStrip loading`, `Card` with `Skeleton`, `RowList loading`, `Grid columns="mainAside"` | Covered |
| Overview empty and error | 1065–1076, 2783–2794 | `Card` with `StatePanel` | Covered |
| Needs you (attention panel) | 1086–1161 | `Card title count`, `IconTile` (warning/brand, square, `sm`), `Typography`, `Button size="sm" variant="secondary"`, with Tailwind row layout | App composition; "Review" link styling [#1681](https://github.com/motech-development/platform/issues/1681) |
| Recent activity: day groups, totals, rows | 1162–1164, 1005–1027, 958–1004 | `Card title action={<Link>}`, `RowList` with `section.summary`, `direction`, currency `value` tone and sign (`primitives/RowList/RowList.tsx:98-147`) | Covered |
| Year end side card | 1166–1175 | `Card title`, `Typography`, `Button variant="secondary"` in a `Stack` | Covered; navigation styling [#1681](https://github.com/motech-development/platform/issues/1681) |
| Recent reports with Download | 1176–1188 | Rows are not actions; each holds a Download | **Gap** [#1671](https://github.com/motech-development/platform/issues/1671) |
| Money: status and direction controls with Pending count | 1209–1235 | `ToggleGroup` with descriptor `badge`, vertical `Separator`, `Inline wrap` | Covered |
| Money: Scheduled chip with count, No receipt chip | 1236–1245 | `Chip` covers the toggles; it has no count | **Gap** [#1680](https://github.com/motech-development/platform/issues/1680) |
| Money: column headings | 1304 | None; `RowList` has no column headers (`RowList.mdx:13-14`) | **Gap** [#1670](https://github.com/motech-development/platform/issues/1670) |
| Money: ledger rows with category and VAT columns | 1279–1296 | `RowList` `metadata`, `metadataAmount`, `value`, `section`, phone layout | Covered |
| Money: a row tagged both "No receipt" and scheduled | 942–957, 976, 982–986 | `RowList` renders one `badge` | **Gap** [#1674](https://github.com/motech-development/platform/issues/1674) |
| Money: "Showing N transactions" and Load more | 916–927, 1307 | `RowList loadMore` renders only the button | **Gap** [#1675](https://github.com/motech-development/platform/issues/1675) |
| Money: no-match and empty states | 1248–1262, 1292–1296 | `StatePanel` with action | Covered |
| People: column headings | 1328 | None | **Gap** [#1670](https://github.com/motech-development/platform/issues/1670) |
| People rows: initials avatar | 1333–1335 | `RowList` leading content is an icon tile only | **Gap** [#1672](https://github.com/motech-development/platform/issues/1672) |
| People rows: Email and Town columns, folded on phones | 1339–1349 | `RowList` has one text `metadata` column | **Gap** [#1673](https://github.com/motech-development/platform/issues/1673) |
| People: loaded count and Load more | 1352 | As Money | **Gap** [#1675](https://github.com/motech-development/platform/issues/1675) |
| Year end: date, days and scheme strip | 1359–1370 | `StatStrip` is currency-only | **Gap** [#1676](https://github.com/motech-development/platform/issues/1676) |
| Year end: reports list with Expires column and Download | 1387–1404 | Static rows with an action, headings, button-styled download | **Gap** [#1671](https://github.com/motech-development/platform/issues/1671), [#1670](https://github.com/motech-development/platform/issues/1670), [#1681](https://github.com/motech-development/platform/issues/1681) |
| Year end: 24-hour note, loaded count | 1405–1406 | `Typography`; count as above | Covered / **Gap** [#1675](https://github.com/motech-development/platform/issues/1675) |
| My companies: headings, initials tile, Selected badge, number, Details | 1426–1448 | `RowList` covers the badge and the number column; not the headings, initials or Details action | **Gap** [#1670](https://github.com/motech-development/platform/issues/1670), [#1672](https://github.com/motech-development/platform/issues/1672), [#1671](https://github.com/motech-development/platform/issues/1671) |
| Company details: four form panels with title and description | 1503–1550 | `Card title` (no description), `Grid`, `TextField` | **Gap** [#1682](https://github.com/motech-development/platform/issues/1682) for the header description; fields covered |
| Company details: Save, Cancel, Delete company | 1551–1553 | `FormActions`, `Button` primary/secondary/danger | Covered |
| Form-page loading | 1456–1487 | Field `loading` props, `Skeleton` | Covered |
| Settings: VAT scheme choice | 1610–1624 | `ToggleGroup` (controlled; ignore `null`), with a visible `Typography` label | Covered (segmented, not pills; see differences) |
| Settings: VAT rates with help, registration number | 1627–1635 | `NumberField description`, `TextField placeholder` | Covered |
| Settings: Accounting year day and month | 1638–1645 | `NumberField`, `Select` | Covered |
| Settings: expense category rows without visible labels | 1563–1604 | Fields always show their label | **Gap** [#1678](https://github.com/motech-development/platform/issues/1678) |
| Settings: `%` suffix on a rate | 1589 | `NumberField formatOptions` with a percent unit | Covered |
| Settings: lock glyph explained on hover | 1590–1593 | `Icon label`; no hover explanation | **Gap** [#1679](https://github.com/motech-development/platform/issues/1679) |
| Settings: Remove, Add category | 1594–1596, 1648–1650 | `Button size="sm" variant="secondary"`, `Card action` | Covered |
| Log in screen | 2747–2764 | `Card`, `Separator`, `Typography element="h1"`, `Button`; error as `StatePanel variant="error"`; app brand mark | Covered (error callout differs; see differences) |
| Not found screen | 2765–2782 | `Card` with `StatePanel` | Covered; link styling [#1681](https://github.com/motech-development/platform/issues/1681) |

### Sheets

| Prototype element | Lines | Breeze components | Verdict |
| --- | --- | --- | --- |
| Opening any sheet from a row, the header, the bottom-bar action, an empty state or the attention panel | 961–966, 1071, 1107, 1320, 1331, 2952–2960, 3055–3063, 3165–3172 | `Drawer` always renders its own trigger (`overlays/overlay.types.ts:10-11`, `overlays/OverlaySurface.tsx:627-636`) | **Gap** [#1669](https://github.com/motech-development/platform/issues/1669) |
| Sheet frame: title, close, scrolling body, pinned footer, phone bottom sheet | 2141–2164 | `Drawer` `footerStart`, `footerSummary`, `footerActions` (`primitives/Drawer/Drawer.tsx:5-12`) | Covered |
| Record sheet: transaction type | 2199–2218 | `ToggleGroup fullWidth size="md"`, descriptor `icon`, `disabled` when locked | Covered (record sheet is app composition) |
| Record sheet: attachment row, empty and filled | 2300–2363 | `FileDropZone compact camera`, `AttachmentRow` actions with a danger Remove | Covered |
| Record sheet: category picker with rates and filter | 2020–2086 | `ComboBox` with descriptor `badge` and no-match message | Covered (closed-field badge and footer link differ) |
| Record sheet: amount and VAT | 2222–2246 | `NumberField size="lg"`, `disabled` until a category is chosen; help as `Typography` | Covered |
| Record sheet: refund checkbox and derived direction | 2248–2261 | `Checkbox description`, `Badge` | Covered (badge has no arrow icon) |
| Record sheet: client select or supplier typeahead | 2263–2265 | `Select`; `ComboBox allowsCustomValue` | Covered |
| Record sheet: description typeahead and date | 2266–2274, 1921–2019 | `ComboBox allowsCustomValue`; `DatePicker` (required, Today, ISO value) | Covered |
| Record sheet: when it counts | 2275–2297 | `ToggleGroup` with a visible label. The hover text on each option has no equivalent. | Covered; hover text [#1679](https://github.com/motech-development/platform/issues/1679) |
| Record sheet: Delete, balance-effect summary, Cancel, Save | 2364–2379 | `Drawer` footer props | Covered |
| Full-screen document viewer | 2615–2665, 3094–3101 | `DocumentViewer` (controlled, zoom, rotate, download, replace, remove, full screen, `transitionName`) | Covered |
| Attach paperwork: "N of M done" progress | 2402–2415 | None | **Gap** [#1677](https://github.com/motech-development/platform/issues/1677) |
| Attach paperwork: current item, drop target, Skip, Next, Attach and continue | 2438–2468 | `IconTile`, `Typography` (`amount`), `FileDropZone camera`, `Button` | App composition |
| Attach paperwork: end-of-queue states | 2417–2436 | `StatePanel variant="empty" icon` | Covered |
| Attach paperwork: "In this queue" checklist | 2471–2494 | `Stack`/`Inline`, `Typography`, `Icon check` for attached items | App composition (marker differs) |
| Client sheet | 2501–2518 | `TextField` (`type="email"`/`"tel"`), `Grid`, `Drawer` footer | Covered |
| Add a company: step text and progress bar | 2583–2590 | None for the bar | **Gap** [#1677](https://github.com/motech-development/platform/issues/1677) |
| Add a company: three steps, scheme choice, opening position | 2519–2603 | Fields, `ToggleGroup`, `Drawer` footer Back/Cancel/Continue | Covered (760px sheet differs) |
| Create report | 2604–2614 | `ToggleGroup`, `Select`, `Typography`, `Drawer` footer | Covered |

## Gaps

Each gap is filed with the `breeze-ui` label, the prototype reference, the missing v4 capability with its source path, and the minimal need.

1. [Breeze UI: open a drawer or dialog without its own trigger](https://github.com/motech-development/platform/issues/1669). Every sheet opens from controls that are not its trigger: ledger rows, the bottom-bar action, the page header, empty states and the attention panel. `OverlayProps.trigger` is required and always renders a button. `DocumentViewer` is already controlled and triggerless.
2. [Breeze UI: RowList column headings aligned to row columns](https://github.com/motech-development/platform/issues/1670). Four lists have heading rows, and `DESIGN.md` requires them to match the row columns exactly. The `RowList` column widths are private.
3. [Breeze UI: list rows that are not actions, with a trailing action](https://github.com/motech-development/platform/issues/1671). This affects the reports lists, the companies list and the notification list, including its unread marker. Every `RowList` row is itself an action.
4. [Breeze UI: RowList initials tile](https://github.com/motech-development/platform/issues/1672). Needed for the People and My companies rows.
5. [Breeze UI: RowList additional text columns](https://github.com/motech-development/platform/issues/1673). Needed for the People Email and Town columns, which fold into the detail line on phones.
6. [Breeze UI: RowList rows with more than one badge](https://github.com/motech-development/platform/issues/1674). Needed for a row tagged both "No receipt" and scheduled.
7. [Breeze UI: RowList loaded-count status beside Load more](https://github.com/motech-development/platform/issues/1675). `DESIGN.md` requires footers to say what is loaded.
8. [Breeze UI: StatStrip figures that are not currency](https://github.com/motech-development/platform/issues/1676). Needed for the Year end date, days remaining and VAT scheme.
9. [Breeze UI: determinate progress indicator](https://github.com/motech-development/platform/issues/1677). Needed for the paperwork queue and the Add a company steps.
10. [Breeze UI: visually hidden field labels for repeated rows](https://github.com/motech-development/platform/issues/1678). Needed for the expense category editor.
11. [Breeze UI: hover and focus explanation for icons and controls](https://github.com/motech-development/platform/issues/1679). Needed for the built-in category lock and the "When it counts" hover text.
12. [Breeze UI: Chip count badge](https://github.com/motech-development/platform/issues/1680). Needed for the Scheduled filter count.
13. [Breeze UI: links with button treatments](https://github.com/motech-development/platform/issues/1681). Needed for navigation and downloads styled as buttons: Open year end, Review, Details, Back to overview, and report and notification Download.
14. [Breeze UI: Card header description](https://github.com/motech-development/platform/issues/1682). Needed for the seven form panels on Company details and Settings.

None of these was already tracked. The search covered every open and closed issue that mentions Breeze, `RowList`, drawer triggers, column headers, progress bars, tooltips, `StatStrip`, chips, hidden labels, link buttons and card headers. The only matches were the closed v3 audit ([#1539](https://github.com/motech-development/platform/issues/1539)) and the v4 specification tickets.

## Differences that are not gaps

These are cosmetic. Breeze renders the element with no lost information, behaviour or accessibility, so they are recorded here and not filed. A later decision could promote any of them.

- **Company switcher trigger**: `Menu` takes an `IconName` trigger icon, so the trigger shows `building` rather than the company's initials tile (line 2896). The parity work chose this in the `Menu` `Sections` story.
- **Choice pills**: VAT scheme, "When it counts" and "Transactions to include" are separate pills in the prototype (lines 1610–1624, 2275–2297, 2608). `ToggleGroup` renders a connected segmented control. `DESIGN.md` already calls these segmented controls (line 317). Because `ToggleGroup` has only `aria-label`, the app renders the visible label with `Typography`. In controlled mode the app ignores the `null` that comes from pressing the selected option again, so a required choice cannot be cleared.
- **Add a company width**: the sheet is 760px in the prototype (line 2602). `Drawer` has one width, the 610px `--spacing-breeze-sheet` (`styles/overlays.css:176-182`).
- **Category picker**: `ComboBox` shows the chosen category in its input without the "20% VAT" badge (lines 2074–2076). It cannot host the "Manage categories" footer link (lines 2060–2062), so the app places that link next to the field. The VAT help line already states the rate (line 2244).
- **Derived direction badge**: `Badge` has no icon, so "Money in" or "Money out" shows without its arrow (lines 2258–2261).
- **State panels**: the `StatePanel` action has no leading icon (lines 1071–1073). The error tile is danger-toned where the prototype reuses the brand tile (line 930).
- **Log in error**: the amber callout (lines 2754–2758) becomes a `StatePanel variant="error"` inside the card. No `Alert` exists in v4, and none is needed for the message and its retry action.
- **Report row tile**: `RowList` tiles are circular, while the prototype's document tile is square (line 1390). This becomes relevant only once [#1671](https://github.com/motech-development/platform/issues/1671) is resolved.
- **Paperwork checklist marker**: the ring-and-strikethrough marker (lines 2477–2486) becomes a `check` icon and muted text.

## Effect on other tickets

- [Decide which prototype features to cut](https://github.com/motech-development/platform/issues/1663) can treat each gap above as cut, deferred, or kept on condition of a Breeze change. [#1669](https://github.com/motech-development/platform/issues/1669) cannot be deferred without dropping every create and edit flow: sheets cannot open from rows or from the phone's action button without it.
- The map's rule that missing UI is filed and not built in the app means the gap issues are prerequisites of the Accounts build spec. [#1669](https://github.com/motech-development/platform/issues/1669) through [#1671](https://github.com/motech-development/platform/issues/1671) block the core screens. The rest block single screens or details.

## Source index

- Breeze public exports: `packages/breeze-ui/src/index.ts`
- Breeze source cited in the tables: `packages/breeze-ui/src/patterns/*`, `primitives/*`, `overlays/OverlaySurface.tsx`, `overlays/overlay.types.ts`, `collections/item.types.ts`, `fields/field.presentation.tsx`, `styles/overlays.css`
- Breeze docs: `primitives/RowList/RowList.mdx`, `primitives/Popover/Popover.mdx`, `primitives/Drawer/Drawer.mdx`, `patterns/DocumentViewer/DocumentViewer.mdx`, `docs/03-Usage.mdx`; ADRs `packages/breeze-ui/docs/adr/0002`–`0005`
- [Breeze UI v4 specification](https://github.com/motech-development/platform/issues/1598), including the amendments after the audit and after prototype parity
- [Component inventory for first release](https://github.com/motech-development/platform/issues/1587)
- Prototype: `.design/accounts/prototype.html` (unchanged since `940bc92fd`); design language: `DESIGN.md`
