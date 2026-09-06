---
name: Accounts
description: A company ledger that only shows figures it can prove.
colors:
  brand: '#007FA8'
  brand-hover: '#007AA3'
  brand-text: '#006884'
  brand-soft: '#E3F2F8'
  on-brand: '#FFFFFF'
  canvas: '#F6F9FC'
  surface: '#FFFFFF'
  raised: '#F6F9FC'
  sunken: '#EFF3F8'
  line: '#E3E8EE'
  line-strong: '#CFD7E0'
  ink: '#161616'
  ink-2: '#4A4F57'
  ink-3: '#66707C'
  pos: '#127A4E'
  pos-soft: '#E4F1EA'
  warn: '#8A5A0B'
  warn-soft: '#FDF3DC'
  danger: '#B4231D'
  scrim: '#0C121F'
typography:
  money:
    fontFamily: "'Public Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', helvetica, arial, sans-serif"
    fontSize: '26px'
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: '-0.018em'
    fontFeature: 'tabular-nums'
  heading:
    fontFamily: "'Public Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', helvetica, arial, sans-serif"
    fontSize: '22px'
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: '-0.012em'
  title:
    fontFamily: "'Public Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', helvetica, arial, sans-serif"
    fontSize: '15px'
    fontWeight: 600
    lineHeight: 1.45
    letterSpacing: 'normal'
  body:
    fontFamily: "'Public Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', helvetica, arial, sans-serif"
    fontSize: '13px'
    fontWeight: 400
    lineHeight: 1.45
    letterSpacing: 'normal'
  label:
    fontFamily: "'Public Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', helvetica, arial, sans-serif"
    fontSize: '12px'
    fontWeight: 500
    lineHeight: 1.45
    letterSpacing: 'normal'
  micro:
    fontFamily: "'Public Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', helvetica, arial, sans-serif"
    fontSize: '11px'
    fontWeight: 700
    lineHeight: 1.45
    letterSpacing: '0.06em'
rounded:
  xs: '2px'
  chip: '3px'
  sm: '4px'
  ctl: '6px'
  panel: '8px'
  full: '9999px'
spacing:
  chip: '34px'
  control: '38px'
  tap: '44px'
  control-lg: '52px'
  doc: '64px'
  card: '400px'
  sheet: '610px'
components:
  button-primary:
    backgroundColor: '{colors.brand}'
    textColor: '{colors.on-brand}'
    typography: '{typography.body}'
    rounded: '{rounded.ctl}'
    height: '36px'
    padding: '0 14px'
  button-primary-hover:
    backgroundColor: '{colors.brand-hover}'
    textColor: '{colors.on-brand}'
  button-secondary:
    backgroundColor: '{colors.surface}'
    textColor: '{colors.ink}'
    typography: '{typography.body}'
    rounded: '{rounded.ctl}'
    height: '36px'
    padding: '0 12px'
  button-secondary-hover:
    backgroundColor: '{colors.sunken}'
  button-danger:
    backgroundColor: '{colors.danger}'
    textColor: '{colors.on-brand}'
    rounded: '{rounded.ctl}'
    height: '36px'
  button-text:
    backgroundColor: 'transparent'
    textColor: '{colors.brand-text}'
    typography: '{typography.body}'
    padding: '0 4px'
  input:
    backgroundColor: '{colors.surface}'
    textColor: '{colors.ink}'
    typography: '{typography.body}'
    rounded: '{rounded.ctl}'
    height: '{spacing.control}'
    padding: '0 12px'
  input-amount:
    backgroundColor: '{colors.surface}'
    textColor: '{colors.ink}'
    typography: '{typography.money}'
    rounded: '{rounded.ctl}'
    height: '{spacing.control-lg}'
  chip:
    backgroundColor: '{colors.surface}'
    textColor: '{colors.ink}'
    typography: '{typography.label}'
    rounded: '{rounded.full}'
    height: '{spacing.chip}'
    padding: '0 12px'
  chip-selected:
    backgroundColor: '{colors.brand-soft}'
    textColor: '{colors.brand-text}'
  panel:
    backgroundColor: '{colors.surface}'
    textColor: '{colors.ink}'
    rounded: '{rounded.panel}'
  sheet:
    backgroundColor: '{colors.surface}'
    textColor: '{colors.ink}'
    width: '{spacing.sheet}'
  tag:
    backgroundColor: '{colors.sunken}'
    textColor: '{colors.ink-2}'
    typography: '{typography.micro}'
    rounded: '{rounded.chip}'
    padding: '1px 6px'
  tag-warn:
    backgroundColor: '{colors.warn-soft}'
    textColor: '{colors.warn}'
  attachment-row:
    backgroundColor: '{colors.raised}'
    rounded: '{rounded.panel}'
    height: '{spacing.doc}'
    padding: '0 12px'
---

# Design System: Accounts

## Overview

**Creative North Star: "The Honest Ledger"**

Accounts is a set of books for a small business, and the design's governing idea is that it never shows a figure it cannot prove. Every number on screen traces to something the GraphQL API actually returns; anything that would require an aggregation, a total, or a filter the API cannot perform is cut rather than approximated. A number that changes when you scroll is worse than no number.

Visually it is quiet and dense. The interface is greyscale on a pale blue-grey canvas, and Motech's cyan appears only as a fill behind white text or as a small selected state. Money is the loudest thing on any screen — tabular figures at 26px, everything else at 13px or below. Nothing is decorated.

**Key characteristics:**

- Top bar with company context and horizontal section tabs; bottom tab bar with a centre action button below 901px.
- 1500px maximum page width, centred.
- Panels are white on a `#F6F9FC` canvas with a 1px hairline border and a barely-there shadow.
- Financial figures use tabular numerals and negative tracking; UI text does not.
- A single accent. Green and red carry direction and destruction only.
- Dark mode inverts the greys but keeps the brand fill unchanged.

**The Provable Figure Rule.** Every displayed number must be traceable to an API field or to values visibly present on screen. Where scope is derived rather than authoritative, show the scope next to the number instead of adding a disclaimer beneath it.

## Colors

The palette is one brand hue and a long neutral ramp. Saturation is reserved for meaning.

### Primary

- **Motech Cyan** (`#007FA8`): the canonical mark colour from `assets/logo.svg`. Primary button fills, the focus ring, selected chip borders, and progress fills.
- **Cyan Hover** (`#007AA3`): hover for filled brand controls.
- **Cyan Text** (`#006884` light / `#33AACF` dark): any brand-coloured _text_ or icon.
- **Cyan Wash** (`#E3F2F8` light / `#12313B` dark): selected chip backgrounds, avatar tiles, informational badges.

`#007FA8` is 4.56:1 on white, which passes AA as a fill behind white text but **fails as text**: 4.32:1 on the `#F6F9FC` canvas and 3.96:1 on `#161616`. That is why the fill and the text colour are separate tokens. Do not lighten the fill to fix text contrast — white on a lighter cyan drops to 3.71:1 and breaks every button label.

Measured on the `#F6F9FC` canvas: ink 17.13:1, secondary 7.80:1, muted 4.76:1, brand text 6.00:1, green 5.07:1, red 6.21:1. On the `#161616` dark ground: ink 16.2:1, secondary 8.7:1, muted 6.0:1, brand text 6.71:1, green 7.8:1, amber 9.2:1, red 6.4:1. `#161616` is Motech's own value — already the PWA `theme_color`.

### Secondary

- **Positive Green** (`#127A4E` light / `#3FBF8B` dark) and **Green Wash** (`#E4F1EA` / `#16291F`): money in, positive balances, incoming direction icons.
- **Warning Amber** (`#8A5A0B` / `#E0B341`) and **Amber Wash** (`#FDF3DC` / `#2A2314`): attention that is neither success nor destruction — a missing invoice, a pending count.
- **Danger Red** (`#B4231D` / `#F1736A`): destructive actions and validation errors.

**The Money Out Is Ink Rule.** Outgoing amounts are `ink`, not red. Red means destruction or failure, never the direction of a transaction. Only incoming amounts take a colour, and that colour is green.

### Neutral

- **Canvas** (`#F6F9FC` / `#161616`): the page ground.
- **Surface** (`#FFFFFF` / `#1F1F1F`): panels, sheets, menus, fields.
- **Raised** (`#F6F9FC` / `#262626`): rows nested inside a surface, the attachment row, hover.
- **Sunken** (`#EFF3F8` / `#262626`): segmented-control fills, tag backgrounds, skeletons.
- **Line** (`#E3E8EE` / `#303030`) and **Line Strong** (`#CFD7E0` / `#3D3D3D`): dividers, and control outlines respectively.
- **Ink** (`#161616` / `#F2F2F2`), **Ink 2** (`#4A4F57` / `#B4B4B4`), **Ink 3** (`#66707C` / `#949494`): primary text, secondary text, labels and metadata.
- **Scrim** (`#0C121F` at 45%): the sheet backdrop.

**The Constant Fill Rule.** `--color-brand` is identical in both themes. Dark mode redefines the neutral ramp and `--color-brand-text`; it never restates the fill. Anything brand-coloured that carries text uses `--color-brand-text`.

## Typography

**Typeface:** Public Sans, with the system stack as fallback. One family throughout; hierarchy comes from size, weight and tracking rather than from mixing faces.

### Scale

Eleven steps, 11px to 32px: `2xs` 11, `xs` 12, `sm` 13, `base` 14, `md` 15, `lg` 17, `xl` 20, `2xl` 22, `3xl` 24, `4xl` 26, `5xl` 32.

### Roles

- **Money** (26px, 600, `-0.018em`, tabular): balances, transaction amounts, the amount field.
- **Heading** (22px, 600, `-0.012em`): page titles and panel metrics.
- **Title** (15px, 600): panel headings, sheet titles, empty-state headings.
- **Body** (13px, 400): the default. Row names, field values, descriptions.
- **Label** (12px, 500, Ink 3): form labels and metadata.
- **Micro** (11px, 700, uppercase, `0.06em`): column headings, tags, count badges.

**The Currency Comes From The Field Rule.** Never write a currency symbol into markup or copy. `Balance.currency` is the authority; format through `Intl.NumberFormat` keyed on it, and render the sign separately so a real minus (−) is used rather than a hyphen. Amount _inputs_ stay unformatted — they hold what the user typed.

**The Tabular Money Rule.** Any figure that appears in a column or is compared to another figure uses tabular numerals and right alignment. Prose numbers do not.

**The Negative Tracking Rule.** Tighten tracking only at 20px and above. Body and label text sit at normal tracking.

## Layout

Breakpoints are Breeze's own: **sm 42.5625rem (681px)**, **md 56.3125rem (901px)**, **lg 73.8125rem (1181px)**. The structural switch is `md`.

- Page content is capped at 1500px and centred, with 28px horizontal padding above `md` and 16px below.
- Spacing is Tailwind's 4px grid. Every gap, padding and margin snaps to it; there are no arbitrary pixel values in markup.
- Structural measures that are not spacing are named tokens: control 38px, large control 52px, chip 34px, touch target 44px, attachment row 64px, sheet 610px, auth card 400px.
- Above `md`: top bar, horizontal tabs, and a right-aligned primary action beside the page heading.
- Below `md`: tabs are replaced by a fixed bottom tab bar with a centre action button. Routes without a primary action show no button rather than a fallback. Sheets become full-width bottom sheets. Multi-column grids collapse to one column. Touch targets grow to 44px under `pointer: coarse`.
- Lists paginate. Every list query returns a `nextToken` and no total, so list footers say what is loaded — never "N of M".

## Elevation & Depth

Two shadows, both reserved for surfaces that genuinely float.

- **Panel** (`0 1px 1px rgb(22 22 22/3%), 0 2px 5px rgb(22 22 22/4%)`): panels and cards. Almost invisible; it separates white from the canvas without implying lift.
- **Overlay** (`0 1px 2px rgb(22 22 22/6%), 0 8px 24px -10px rgb(22 22 22/25%)`): sheets, menus, popovers, toasts.

Dark mode replaces both with black-based values (`rgb(0 0 0/40%)` and `rgb(0 0 0/50%)` + `rgb(0 0 0/70%)`), because grey-on-grey shadows are invisible on a near-black ground.

**The Theme-Reactive Shadow Rule.** Tailwind bakes an `@theme` shadow value into the generated utility, so `@apply shadow-panel` will not follow a dark-mode override. Define these as `@utility` wrappers around the custom property instead. This was a live bug: every panel wore its light shadow in dark mode until it was fixed.

## Shapes

Corners are small and consistent. Nothing is fully rounded except things that are meant to read as pills or circles.

- **2px** (`xs`): skeleton bars.
- **3px** (`chip`): tags, count badges, the focus ring.
- **4px** (`sm`): avatars, segmented-control thumbs, document thumbnails.
- **6px** (`ctl`): buttons, inputs, selects, segmented controls, icon buttons.
- **8px** (`panel`): panels, sheets, menus, the attachment row, drop zones.
- **Full**: filter chips, direction icons, the profile avatar, the bottom-bar action button.

Borders are 1px `line-strong` on controls and 1px `line` on panels and dividers. Dashed 2px marks an empty drop target. There are no gradients except one on the photo-thumbnail placeholder.

## Components

### Application shell

Top bar carries the Motech mark, the company selector and the account avatar. The avatar is the only control on that side: it holds the unread dot and opens one menu — notifications first, then Company details, Settings and Log out. A separate bell was tried and removed; two controls opening the same menu is the thing to avoid. Section tabs sit beneath the bar and are hidden below `md`. Company context appears once, in the top bar — never repeated above a page heading, and never inside the account menu.

### Transaction rows

Rows are buttons: a 28px direction circle (green wash for money in, sunken for money out), name and detail stacked, then category, VAT and amount columns. Amount is right-aligned and tabular.

**The Header Matches The Row Rule.** A table heading is a separate flex row from the rows beneath it, so it only lines up if it is built the same way: the _same_ `gap`, and the same fixed columns marked `grow-0 shrink-0`. Because the rightmost column is pinned to the padding edge, any gap difference accumulates leftwards — one gap out puts the second-from-right column out by the difference, two gaps out doubles it. This drifted on all four tables in this design; a header that merely looks close is wrong.

Tags on a row — "No receipt", a scheduled date — never shrink or wrap; the transaction name truncates instead.

### The record form

The form mirrors `TransactionInput` exactly:

- **Transaction type** (Purchase | Sale) and **"This is a refund"** are separate controls. Direction is _derived_ from the pair and shown as a read-only badge; there is no money-in/money-out field. Both are locked once a transaction exists.
- **Category** is a filterable picker listing every entry in `Settings.categories` with its VAT rate. It appears for purchases only — a sale writes the literal category `"Sales"`. Amount and VAT are disabled until a category is chosen.
- **VAT** is editable and computed two ways: a purchase _extracts_ it from the gross at the category's rate; a sale is `Settings.vat.pay` per cent _of_ the gross, which is what goes to HMRC and differs from the rate charged to the client.
- **Name** is a select of saved clients on a sale, and a supplier typeahead on a purchase.
- **When it counts** maps to `status` and `scheduled`: Now (confirmed), On its date (pending + scheduled), Hold as pending (pending).

### The attachment

The document has **one home**: a 64px row directly under the transaction type, in the same position and at the same height whether or not a file is attached. Empty it is a dashed row with Take photo and Choose file; filled it shows a thumbnail, filename, size, Open, and an overflow menu. Reading the document is a separate full-screen act, not a permanent pane. The viewer branches on the extension carried by `Transaction.attachment`, so both PDFs and photographs are supported.

### Motion

Every animation names a relationship. If you cannot say what a transition tells the user, it is decoration and does not belong.

The prototype drives these with `document.startViewTransition` because it is not React. The **CSS is the same either way** — the pseudo-element rules, the names and the timings all carry over. Only the trigger changes: in React each row below is a `<ViewTransition>` boundary, and the `kind` column is `addTransitionType` inside `startTransition`.

| What                                | Boundary                          | Type    | What it tells the user                     |
| ----------------------------------- | --------------------------------- | ------- | ------------------------------------------ |
| Attachment row → full-screen viewer | `name="doc"`, `share`             | `doc`   | "The same file, seen larger"               |
| Current-tab mark                    | `name="navmark"`                  | any     | "You are here now, and it came from there" |
| Ledger row across a filter          | per-row `key` / `name={'tx-'+id}` | `list`  | "The same rows, rearranged"                |
| Skeleton → content                  | `enter` on the content            | `mode`  | "The data arrived"                         |
| Sheet and scrim                     | `enter`/`exit`                    | `sheet` | "This opened over what you were doing"     |
| Menus, category picker              | `enter`/`exit`                    | `menu`  | "This belongs to the thing you pressed"    |
| Confirmation card                   | `enter`/`exit`                    | `toast` | "That went through"                        |
| Tab to tab                          | page-level                        | `nav`   | "A different part of the same app"         |

**The root stays live.** `::view-transition-new(root)` is a live capture, so disabling the root animation keeps unnamed regions rendering and hoverable instead of freezing behind a stale snapshot; `::view-transition { pointer-events: none }` lets clicks through while named groups are still moving. Only a change of place (`nav`) or content replacing its own skeleton (`mode`) redraws the page itself.

**Chrome is pinned, not animated.** The topbar, the desktop nav, the phone's bottom bar and the prototype's own control bar each get a name with `animation: none` and `z-index: 100`, so they hold still while everything else moves. The confirmation sits at `200` because it must beat all of it.

**Deliberately not animated**, each for a reason:

- **Route direction.** No route is a child of another — every one is a sibling reached from a tab or the account menu. Directional slides would assert a depth the app does not have. Reserve them for a genuine list → detail, if one ever appears.
- **Theme changes.** A theme is not a place or a thing; cross-fading the page tells the user nothing they did not just ask for.
- **Segmented controls** (Confirmed/Pending, the direction chips, Light/Auto/Dark). A control reporting its own state should look instant; animating it only reads as lag.
- **Typing and the VAT recalculation.** These mutate in place without a render, and must stay that way — the caret has to survive.
- **Form steps inside a sheet.** The sheet frame does not move, so animating only its contents needs a second boundary nested inside the sheet's own — which would then be lifted out of the sheet's snapshot and snap while the frame slid. The step indicator already says where you are.

**A name may only exist during the transition it belongs to.** This is the rule that makes or breaks the whole scheme, and it bites in two directions.

A named element is **lifted out of its ancestor's snapshot** and animates as its own group. So an always-named attachment row held still while the sheet slid past it, and always-named ledger rows paired across a route change — the same transaction ids appear on Overview and on Money — and flew across the page.

An element that **survives** a transition has both an old and a new snapshot, so an unconditional animation on it replays on every unrelated transition. The sheet was named permanently with `vt-sheet-out`/`vt-sheet-in` attached, so every time the attachment opened over it, the sheet obediently slid out and back in underneath. Nothing about the document transition asked for that; the sheet was simply still eligible.

Under a live root the second problem has a clean answer: **name nothing permanently.** Anything unnamed just swaps, with no animation and no frozen snapshot, so an element needs a name only for the transition where it must move — and static chrome needs one only on `nav` and `mode`, the two types where the root itself is redrawn.

Grant the name in **CSS, keyed on the transition type**, not from the code that paints:

```css
:root[data-vt='doc'] .vt-doc {
  view-transition-name: doc;
}
:root[data-vt='list'] .vt-row {
  view-transition-name: var(--vt);
}
```

CSS is evaluated when the snapshot is taken, and the type is set before the transition starts, so this governs the **old** state too. Naming from JS at paint time cannot: by then the old snapshot is already captured from a DOM the previous render produced. In React this is what the type-keyed props express — `share={{ doc: 'morph', default: 'none' }}` rather than a name that is always present.

**Two traps worth knowing.**

A name may be mounted **once**. The attachment row and the viewer share `doc`, and the sheet stays mounted underneath the full-screen overlay — so the row gives the name up while the overlay holds it. Two live elements with one name aborts the whole transition silently.

Starting a transition while one is running **skips the first**, and its rejection must not clear the type the second just set. Guard the cleanup with a sequence number, or a fast second click strips `data-vt` mid-animation and the first transition's CSS vanishes.

### Appearance

Light, Auto and Dark, as three chips in the account menu beside Log out — not on the Settings page. Settings is **company** data, `Settings` has no field for a theme, and appearance is a per-person, per-device choice; storing it there would be wrong even if the schema allowed it. In the real client it belongs in `localStorage`.

**Only the resolved theme reaches the DOM.** Auto is a preference, not a third theme: it reads `prefers-color-scheme` and writes `light` or `dark` to `data-theme` like any explicit choice. Every `dark:` variant therefore keeps matching one attribute, and no rule needs a media query of its own — which is what keeps the token table in this document the whole story.

Subscribe to the media query **once**, not per render, and re-render on change only while the preference is Auto, so the app follows the device as it changes without overriding an explicit choice.

Set `color-scheme` alongside the tokens (`:root` light, `[data-theme="dark"]` dark) so selects, scrollbars and text carets follow the theme. Tokens alone do not reach native controls.

**Apply the stored choice before first paint.** The preference lives in `localStorage`, and reading it after the app boots is too late: the page paints light, then flips, and every single load of a dark-mode account starts with a white flash. Set `data-theme` from a small synchronous script in `<head>`, above the stylesheet — not in the app's own start-up. Wrap the read in `try`/`catch` and fall back to `prefers-color-scheme`, because a private window or blocked site data makes `localStorage` throw rather than return empty.

The prototype cannot show this. Its markup is injected into the body of a host page whose `<head>` it does not control, so the pre-paint script has nowhere to live — which is why the rule is written here instead of demonstrated there. The prototype holds the preference in memory only, and resets to Auto on reload, in common with every other piece of its state.

### Confirmations

Actions confirm through one `role="status"` card in the positive wash, fixed to the **top right, directly under the topbar**. That is where people look for a confirmation, and it clears the page's action row, which begins about 54px lower. The colour carries "this went through" so the message never has to; it is a card rather than a dark pill so longer copy fits on one line.

It is **one width on every screen** — 288px, its right edge on the content gutter. The longest message in the app is 27 characters, so nothing needs more room, and a card that stretches to the full width of a phone stops reading as a transient and starts reading as a banner that replaced the header.

On a phone that band does contain the page title, so the tail of a long title is covered for the 2.6s the card is up. That is the better trade: dropping the card below the header would clear the title but land on the filter controls instead, and covering a static label costs less than covering something the user can press. No control is covered on any route at either width.

It is a confirmation, not a decision. No action, no dismiss, no undo — `updateTransaction` and the delete mutations have no inverse to offer.

### The date picker

Hand-built, never `input[type="date"]`. The native control cannot be themed, ignores the token table entirely, places its own glyph wherever the engine likes — in Chrome, immediately after the text rather than at the field's edge — and looks like a different product on every platform.

The field is a button: the date in the app's own long form ("3 September 2026"), and the calendar glyph pinned to the **far right**, on the field's own padding.

The panel follows the popover pattern the category picker already established. Monday-first, six fixed rows so the panel never changes height as you move between months, leading and trailing days in `ink-3`, the selection as a brand fill and today as a brand outline — selection wins when they are the same day. Reopening lands on the month of the chosen date, not wherever you last browsed.

**The value stays ISO.** `TransactionInput.date` is an `AWSDateTime`, so the field carries `YYYY-MM-DD` and the client appends a time on submit; only the label is localised. Formatting the stored value would mean parsing prose back on the way out.

**No "Clear".** `date` is non-null, so an empty date is not a state worth offering — a control that can only produce an invalid form is the same mistake as the error panel's "Check connection". The field is required in validation instead.

A popover inside a scrolling sheet has to be scrolled into view after it opens (`block: "nearest"`), or a field near the foot of the form opens its calendar below the fold.

### Sheets and menus

Create and edit flows open in a 610px right-hand sheet over a 45% scrim; below `md` they become full-width bottom sheets. Only a click on the backdrop itself dismisses a sheet — clicks that merely bubble out of it must not.

### The attention panel

Two items, and they are not equally knowable — the panel must not present them as if they were.

- **Transactions without paperwork** is **scoped**. There is no total for confirmed transactions and no way to filter on a missing attachment, so it can only ever count the page already loaded. The copy says "of the transactions below", and it names them rather than claiming an oldest, because "oldest" would assert knowledge of every transaction.
- **Scheduled transactions coming up** is **complete**. The pending query takes no `count` or `nextToken` and returns everything, so the count is a real count and the items can be named with their dates.

Derive both from the loaded data rather than writing figures into the markup; a hardcoded count survives a data change and quietly becomes a lie.

### The accounting year and the report

`Settings.yearEnd` is a **day and a month only**, and the month is zero-based (January is `0`), matching Luxon's `Info.months()` index that the client's select is built from. The year the accounting year ends, the days remaining and the date the financial year began are all consequences of that pair plus today, so none of them may be written into the markup.

`ReportInput.year` is an **`Int`**, and it is the year the accounting year _begins_, not a `2025-26` label. `reports/get-transactions` builds the DynamoDB sort-key range as `<year>-<month+1>-<day+1>` to `<year+1>-<month+1>-<day>`, so `2026` with a 31 March year end means 1 April 2026 to 31 March 2027. Those bounds are compared as strings, which is why the lower bound's invalid `-32` day is harmless: it sorts past every timestamp on the 31st. Show the span as the label, send the integer as the value, and derive the list from the year end so it cannot go stale.

`Report.ttl` is `createdAt + 1 day` (`reports/add-report.ts`), so "the download stays available for 24 hours" is a fact, not a guess.

### The paperwork queue

"Attach paperwork" works the same scoped set as the attention panel — confirmed transactions on the loaded page with no attachment. Finishing it does not mean the company has no missing paperwork, so the sheet claims nothing wider than the queue it is showing. The scope is carried by the words that are there ("every transaction in this queue") and by the queue being listed underneath, not by a caption explaining it.

Attaching is `requestUpload` followed by **`updateTransaction(input: TransactionInput!)`**. There is no attach-only mutation, and `TransactionInput` is non-null on every field, so the whole transaction goes back. A queued item therefore has to be a complete `Transaction`, not an id and a filename — which matters, since the ledger query does not select `category`, `vat`, `refund`, `scheduled` or `status` by default.

Skipping and attaching are different outcomes: progress counts only what was attached, and the end-of-queue state distinguishes "every transaction in this queue now has an invoice or receipt" from "you reached the end and N are still missing".

### Notifications

The avatar's menu opens on the notification list. Three things constrain it:

- **The list does not paginate.** `type Notifications` has no `nextToken`, so the menu shows one page — the client asks for `count: 5` — and there is no "older" affordance to offer.
- **The message vocabulary is closed.** `Notification.message` is a key resolved client-side, and exactly three exist: `REPORT_READY_TO_DOWNLOAD`, `TRANSACTION_PUBLISHED`, `VIRUS_SCAN_FAIL`. Do not design for notification types that do not exist, and do not treat the message as free prose.
- **The unread count is scoped to that page.** There is no total and no unread field on the collection; it is `items.filter(!read).length`. The dot is honest; a precise count is only ever "of the ones loaded".

`markAsRead` takes a list of ids, so per-item marking is possible, but the interface offers one "Mark all as read" that passes every loaded unread id — matching the current client.

**The Actionable Notification Rule.** A notification gets an action only when its payload gives one a target; otherwise it is text and a date. In practice that means exactly one: `REPORT_READY_TO_DOWNLOAD` carries `downloadUrl` and so carries a Download control in the list. Never add an action to `TRANSACTION_PUBLISHED` or `VIRUS_SCAN_FAIL` — neither writes a payload, so there is no transaction or file to open.

Three services produce notifications, and only `accounts/reports` sets one: `qs.stringify({ createdAt, downloadUrl, id, ttl })` alongside `REPORT_READY_TO_DOWNLOAD`. `TRANSACTION_PUBLISHED` and `VIRUS_SCAN_FAIL` write the row with no payload field at all. So exactly one notification can be actionable — "Your report is ready to download" carries a Download straight from `payload.downloadUrl` — and the other two are informational because there is no target to send anyone to. Note the encoding: it is `qs`, not JSON, so it parses with `qs.parse`.

### Reports

A report carries four fields and no name, so the list shows **when it was requested** as the identity and **when it expires** beside it. `ttl` puts that 24 hours after `createdAt`, which also means the list is never more than a day deep — an empty reports panel is the normal state, not an edge case. Say the 24-hour deletion wherever reports are listed or created; it is the most important thing about them.

### Expense categories

`ExpenseCategory.protect` makes a category **wholly read-only** — name and VAT rate both — not merely undeletable. Render protected rows with read-only fields on a sunken ground and no remove control. Use the `read-only:` variant for that styling rather than a conditional class, so it cannot lose to the base `bg-surface`.

**The set is fixed and knowable.** `createCompany` seeds exactly five protected categories, all at 0%: Corporation tax, Dividend, Mileage, Salary, VAT payment. Nothing else can ever carry the flag, because the settings form writes `protect: false` on every category the user adds. Do not invent protected categories or show one at a non-zero rate — the label is a fact about company setup, not a state a category can drift into.

Show a locked row with a **lock glyph** in the action column, labelled for assistive technology and explained on hover — not with a word. "Protected" is the field name and "built in" is still the system describing its own setup; a lock says the only thing the user needs, which is that this row is not theirs to change. The read-only fields and the absent Remove control carry the rest.

Locked and unlocked rows must occupy the **same three columns**. Give the action slot a fixed width and `shrink-0` in both states: a bare text label shrinks below its content where a bordered button will not, and the rate column slides across on exactly the locked rows.

### States

Loading uses skeletons shaped like the content they replace — and "the content they replace" means this page, not this app. A form page loads as panel headers with labelled field blocks in the same columns; only a list page loads as ledger rows. Reaching for the list skeleton on a form is how Company details and Settings came to load as something they are not.

Empty and error states are left-anchored with a 44px wash tile, a 15px heading, a 13px explanation and the recovery action.

**The state owns the page's action, not the app's.** When a page is empty or failed, its state panel offers the one thing worth doing, so the **header** button stands down. The phone's floating button is app chrome, not this page's call to action, and it stays.

**The bottom bar never changes shape.** The floating button and the 68px gap it sits in are constants on every route and in every state — same position, same size, always there. A button that comes and goes makes the bar jump as you move between pages, and a gap reserved for a button that is not there is a hole. Routes with no action of their own (Company details, Settings) fall back to the app's primary verb rather than dropping the button; the tab positions are then byte-identical everywhere.

**Every control must be able to act.** An error panel offered "Check connection" beside "Try again"; it could only raise a toast telling the user to check their connection. A button that cannot do the thing it names is worse than no button.

## Do's and Don'ts

### Do

- **Do** trace every figure to an API field. `getBalance` returns `balance`, `currency`, `vat.owed` and `vat.paid` — nothing else is authoritative.
- **Do** treat Confirmed and Pending as separate queries. `getTransactions` requires `status`; they cannot be one list filtered client-side.
- **Do** give every list a "Load more" and state what is loaded, since no list query returns a total.
- **Do** use the brand as a fill behind white text, and `brand-text` whenever the brand colour is the text.
- **Do** keep tabular numerals and right alignment on every compared figure.
- **Do** express the design as Tailwind utilities against these tokens.
- **Do** meet WCAG AA: 44px minimum touch targets below `md`, visible focus, and contrast checked against the actual background token.

### Don't

- **Don't** let two utilities fight over one property. The amount field carried `text-sm` and `text-4xl`; `text-sm` won on stylesheet order, so the primary input rendered at 13px beside a 20px derived one. Two fields on one row share a size unless there is a reason they should not.
- **Don't** spend one glyph on two meanings. The out-arrow means money leaving the company, so log out is a **door**; the cog means Settings, so Company details is a **building**. An icon that means two things means neither.
- **Don't** indent a menu item differently from its neighbours. Every row in a menu is either iconned or not; a lone label without one sits 24px left of everything above it.
- **Don't** put a schema word in the interface. `protect` becomes "built in", not "Protected"; `Transaction.attachment` never appears at all. If copy only makes sense to someone holding the schema, it belongs in this document.
- **Don't** reassure the user about internal state. "No account data has been loaded", "your saved accounting data has not changed" — the user did not ask, and it reads as the system talking about itself. Say what failed and what they can do.
- **Don't** write a figure, date, count, name or option list into the markup when the data can produce it. Every one of these drifts: a hardcoded `208` days survived the date it was true for, a literal "Standard 20%" ignored the VAT scheme, an invented protected-category set taught the wrong rule, and a fixed `2` on a badge counted rows that were no longer there. If it can be counted, count it.
- **Don't** explain an API limit to the user. Scope belongs in what a screen claims and shows, never in a caption about pages, loading or what cannot be counted — "From the transactions loaded on Money. There is no way to count the ones further back without paging through them" is a note to the next engineer, and it belongs in this document instead.
- **Don't** show a total, count or aggregate the API cannot produce. There is no aggregation query; an In/Out/Net panel summing the loaded page was removed for exactly this reason.
- **Don't** offer a filter the API cannot perform. `getTransactions` takes no date range, so a date filter is not available.
- **Don't** ask for a value the user does not choose. `ReportInput.currency` is required by the schema but set from a constant, so the report form does not offer it.
- **Don't** show a category picker on a sale, or treat `Settings.categories` as a fixed list — it is user-defined, unbounded, and each entry carries its own VAT rate.
- **Don't** lighten the brand fill to make brand text pass contrast.
- **Don't** use `@apply shadow-*` where the shadow must follow the theme.
- **Don't** introduce arbitrary values (`text-[13.5px]`, `gap-[7px]`). Add a token or snap to the 4px grid.
- **Don't** put a second colour in play. Green, amber and red mean direction, attention and destruction; they are not decoration.
- **Don't** reintroduce the previous generic blue (`#2258d6`) or the dark navy rail — that direction was rejected, and `#007FA8` is the real mark colour.

## API Fit

Recorded when the design was checked element-by-element against `applications/accounts/api/schema`. **Direct** means a field returns it; **Derived** means the client computes it from returned fields; **Scoped** means it is true only of what is currently loaded, and the interface says so.

| Interface element                    | Fed by                                                  | Verdict |
| ------------------------------------ | ------------------------------------------------------- | ------- |
| Balance, VAT owed, VAT paid          | `getBalance { balance currency vat { owed paid } }`     | Direct  |
| Currency symbol and grouping         | `Balance.currency` through `Intl.NumberFormat`          | Direct  |
| Balance less VAT owed                | `balance − vat.owed`, in the client                     | Derived |
| Live balance after a save            | `onTransaction(id, owner)` subscription                 | Direct  |
| Day groups and daily totals          | `getTransactions(status:)` grouped on date              | Derived |
| Money in / out direction             | `Transaction.amount` sign, `Transaction.refund`         | Derived |
| "No receipt" badge                   | `Transaction.attachment` is empty                       | Direct  |
| "N of the transactions below…"       | the confirmed rows the overview loaded                  | Scoped  |
| "N scheduled transactions coming up" | the whole pending query, which does not page            | Direct  |
| Pending and Scheduled chips          | `getTransactions(status: pending)` + `.scheduled`       | Direct  |
| "Publishes 5 Oct"                    | `Transaction.date` where `scheduled`                    | Direct  |
| Category picker and its rates        | `getSettings { categories { name vatRate } }`           | Direct  |
| VAT on a purchase                    | extracted from gross at the category's `vatRate`        | Derived |
| VAT on a sale                        | `amount × vat.pay / 100` — what goes to HMRC            | Derived |
| Year end date and days away          | `getSettings { yearEnd { day month } }`                 | Direct  |
| Reports list                         | `getReports { items { createdAt downloadUrl ttl } }`    | Direct  |
| Report expiry                        | `Report.ttl`, 24 hours after `createdAt`                | Direct  |
| Client picker on a sale              | `getClients { items { id name } }`                      | Direct  |
| Supplier field on a purchase         | `getTypeahead { suppliers }`                            | Direct  |
| Attachment upload                    | `requestUpload { contentType extension }`               | Direct  |
| PDF viewer vs image viewer           | the extension on `Transaction.attachment`               | Derived |
| Notification list                    | `getNotifications(id, count)` — a fixed page, see below | Direct  |
| Notification text                    | `Notification.message` resolved as a key, three exist   | Direct  |
| Unread dot and count                 | `items.filter(!read)` over the loaded page              | Scoped  |
| Live arrival                         | `onNotification(owner)` subscription                    | Direct  |
| Download from a notification         | `payload.downloadUrl`, report notification only         | Direct  |
| Company switcher                     | `getCompanies { items { id name } }`                    | Direct  |

### Cut, and why

- **Global search / ⌘K** — there is no search query. `getTypeahead` returns three flat arrays of names for autocomplete; it cannot back a cross-entity search.
- **"Showing 11 of 26"** — `Transactions` carries `items` and `nextToken` only, no total. Footers say how many are loaded, with Load more.
- **Whole-year transaction counts** — needs a full page-through plus a year filter. Replaced with the year-end date and days remaining.
- **Top clients by revenue** — no aggregation, and `Transaction.name` is free text rather than a reference to a Client, so it cannot be grouped reliably.
- **Any date filter** — `getTransactions` takes only `id`, `status`, `count` and `nextToken`. A "Last 30 days" control was built and then removed rather than paged client-side.
- **"No receipt" filter count** — counting needs every confirmed transaction paged. The chip filters but shows no number.
- **In / Out / Net totals** — no aggregation query exists, so they could only sum the loaded page and would change as you paged.
- **Report names** — `type Report` is `createdAt`, `downloadUrl`, `id`, `ttl`. There is no name, status or year on it, so a report cannot be labelled "Confirmed transactions 2025–26". It is identified by when it was requested.
- **"Older notifications"** — `getNotifications` accepts `count` and `nextToken`, but `type Notifications` returns only `id` and `items`. There is no cursor in the response, so a second page cannot be requested. This is the one list in the schema without `nextToken`; the notification menu is a fixed page and nothing else.

One consequence to plan for: because `status` is non-null on `getTransactions`, Confirmed and Pending are two queries and therefore two views. They are not one list with a filter.

## Reference

The working prototype is the authoritative implementation of this system: `.design/accounts/prototype.html`, published as a private artifact. It covers every route in ready, loading, empty and error states, both themes, desktop and phone. When the production Breeze rewrite lands, update this file to point at the component paths and retire the prototype reference in the same change.
