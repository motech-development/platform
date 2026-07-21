---
name: Accounts Redesign
description: Task-focused design system for the current Accounts redesign prototype.
colors:
  shell: '#151c2b'
  shell-soft: '#222c40'
  canvas: '#eef1f5'
  surface: '#ffffff'
  surface-subtle: '#f5f7fa'
  border: '#d8dde6'
  border-strong: '#bdc5d2'
  ink: '#182033'
  ink-soft: '#596274'
  muted: '#6b7485'
  inverse: '#f7f8fb'
  inverse-muted: '#cad0dc'
  primary: '#2258d6'
  primary-hover: '#1948b5'
  primary-soft: '#e8efff'
  primary-selected: '#2d5bc5'
  brand-mark: '#4f82f3'
  focus: '#4f86ff'
  success: '#137a4a'
  success-soft: '#e6f4ec'
  danger: '#ba2e39'
  danger-hover: '#98242e'
  danger-soft: '#fbeaec'
  notification: '#e5484d'
  warning: '#925400'
  warning-soft: '#fff2dc'
  overlay: '#0c121fad'
typography:
  display:
    fontFamily: 'Cabin, sans-serif'
    fontSize: '2.5rem'
    fontWeight: 700
    lineHeight: 1.12
    letterSpacing: '-0.025em'
  metric:
    fontFamily: 'Cabin, sans-serif'
    fontSize: '2rem'
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: '0'
  title:
    fontFamily: 'Cabin, sans-serif'
    fontSize: '1.5rem'
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: '0'
  section:
    fontFamily: 'Cabin, sans-serif'
    fontSize: '1.25rem'
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: '0'
  body:
    fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif'
    fontSize: '1rem'
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: '0'
  label:
    fontFamily: 'Cabin, sans-serif'
    fontSize: '1rem'
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: '0'
rounded:
  none: '0'
  avatar: '999px'
spacing:
  xs: '4px'
  sm: '8px'
  control-gap: '10px'
  compact: '12px'
  md: '16px'
  lg: '20px'
  xl: '24px'
  xxl: '32px'
  page: '48px'
components:
  desktop-sidebar:
    backgroundColor: '{colors.shell}'
    textColor: '{colors.inverse}'
    width: '264px'
    rounded: '{rounded.none}'
  mobile-header:
    backgroundColor: '{colors.shell}'
    textColor: '{colors.inverse}'
    height: '64px'
    rounded: '{rounded.none}'
  button-primary:
    backgroundColor: '{colors.primary}'
    textColor: '{colors.inverse}'
    typography: '{typography.label}'
    height: '46px'
    padding: '0 16px'
    rounded: '{rounded.none}'
  button-primary-hover:
    backgroundColor: '{colors.primary-hover}'
    textColor: '{colors.inverse}'
    typography: '{typography.label}'
    height: '46px'
    padding: '0 16px'
    rounded: '{rounded.none}'
  button-secondary:
    backgroundColor: '{colors.surface}'
    textColor: '{colors.ink}'
    typography: '{typography.label}'
    height: '46px'
    padding: '0 16px'
    rounded: '{rounded.none}'
  button-danger:
    backgroundColor: '{colors.danger}'
    textColor: '{colors.inverse}'
    typography: '{typography.label}'
    height: '46px'
    padding: '0 16px'
    rounded: '{rounded.none}'
  panel:
    backgroundColor: '{colors.surface}'
    textColor: '{colors.ink}'
    rounded: '{rounded.none}'
  form-control:
    backgroundColor: '{colors.surface}'
    textColor: '{colors.ink}'
    typography: '{typography.body}'
    height: '46px'
    padding: '0 12px'
    rounded: '{rounded.none}'
  drawer:
    backgroundColor: '{colors.surface}'
    textColor: '{colors.ink}'
    width: '610px'
    rounded: '{rounded.none}'
  state-icon:
    backgroundColor: '{colors.primary-soft}'
    textColor: '{colors.primary}'
    width: '54px'
    height: '54px'
    rounded: '{rounded.none}'
---

# Design System: Accounts Redesign

## Overview

**Creative North Star: "The Working Ledger"**

Accounts is a practical financial workspace for small-business owners. It should feel modern, professional, and direct: a durable product shell that helps users understand their position, record activity, and move between account tasks without unnecessary accounting complexity.

Until the redesign is implemented, the [hosted Accounts v2 prototype](https://accounts-v2-prototype.mo-gusbi896031.chatgpt.site) is the authoritative design and interaction reference. It is implemented with the Breeze UI library. When the production redesign is complete, update this document to reference the production components and tokens before retiring the prototype in the same cleanup.

The system uses a fixed dark desktop rail, a pale workspace, square white work surfaces, restrained blue actions, and typography that separates short UI language from body and financial data. It rejects unrelated brand colours, ornamental interface styling, invented affordances, decorative dashboards, marketing-led composition, and UI that feels clever at the expense of task clarity.

**Key Characteristics:**

- Fixed 264px desktop rail with persistent company and account context.
- 64px mobile header with navigation trigger, centred Accounts name, and profile avatar.
- Maximum 1500px workspace with 48px desktop, 30px tablet, and 16px compact horizontal padding.
- Structural breakpoints at 1180px, 900px, and 680px. Typography remains a fixed `rem` scale.
- Square controls and panels, strong bottom rules, and shadows reserved for floating layers.
- Desktop tables for Companies, Clients, and Reports; compact record cards on mobile.
- A transaction stream grouped by day with confirmed daily totals.

**The Context-Once Rule.** Show company context once in the app rail. Do not repeat the selected company above page headings.

**The Temporary Authority Rule.** The hosted prototype is authoritative only until production implementation replaces it. Never leave this document pointing at a retired prototype.

## Colors

The palette is restrained and functional. Dark navy defines the product shell, cool gray separates the workspace from white work surfaces, and saturated colours are reserved for actions and meaningful state.

### Primary

- **Action Blue** (`#2258d6`): Primary actions, active navigation, links, selected controls, scheduled indicators, and informational emphasis.
- **Action Blue Hover** (`#1948b5`): Hover and active treatment for primary controls.
- **Action Blue Soft** (`#e8efff`): Selected rows, informational notices, company initials, and empty-state icon tiles.
- **Navigation Blue** (`#2d5bc5`): Selected desktop navigation item.
- **Brand Mark Blue** (`#4f82f3`): Geometric Accounts logo mark on the dark shell.
- **Focus Blue** (`#4f86ff`): The visible 2px keyboard focus ring.

### Secondary

- **Success Green** (`#137a4a`): Incoming transaction direction and positive financial values.
- **Success Green Soft** (`#e6f4ec`): Incoming transaction icon backgrounds.
- **Danger Red** (`#ba2e39`): Destructive actions, outgoing direction, missing-attachment warnings, and error indicators.
- **Danger Red Hover** (`#98242e`): Hover state for destructive controls.
- **Danger Red Soft** (`#fbeaec`): Destructive control backgrounds, modal warning tiles, and error-state icon tiles.
- **Notification Red** (`#e5484d`): Unread notification dot on the profile avatar.
- **Warning Amber** (`#925400`): Attention indicators that are neither success nor destructive.
- **Warning Amber Soft** (`#fff2dc`): Attention icon backgrounds.

### Neutral

- **Shell Navy** (`#151c2b`): Desktop rail, mobile header, drawer headers, and attention panel.
- **Shell Navy Soft** (`#222c40`): Shell hover states, open triggers, drawer subheaders, and dark secondary surfaces.
- **Workspace Gray** (`#eef1f5`): The application canvas outside work surfaces.
- **White Surface** (`#ffffff`): Panels, tables, drawers, menus, fields, and dialogs.
- **Subtle Surface** (`#f5f7fa`): Table headings, neutral hover states, and inactive segmented controls.
- **Primary Ink** (`#182033`): Headings, labels, and primary content on light surfaces.
- **Soft Ink** (`#596274`): Supporting descriptions, secondary data, and metadata.
- **Muted Ink** (`#6b7485`): Passive icons and lower-emphasis affordances.
- **Inverse Ink** (`#f7f8fb`): Primary text on shell and saturated surfaces.
- **Muted Inverse Ink** (`#cad0dc`): Secondary navigation and metadata on the shell.
- **Divider Border** (`#d8dde6`): Table, form-section, and panel dividers.
- **Strong Border** (`#bdc5d2`): Form-control outlines, panel bottom rules, and floating-layer boundaries.
- **Overlay** (`#0c121fad`): Full-page drawer and dialog backdrops. The attachment preview uses a lighter overlay limited to the parent drawer area.

**The Saturation Has Meaning Rule.** Blue, green, red, and amber must communicate action or state. Never use them as decoration.

**The Dark Shell Rule.** Keep the shell dark and the workspace light. A light app rail or a dark content canvas is outside the approved direction.

## Typography

**Display Font:** Cabin, with a generic sans-serif fallback.

**Body Font:** Helvetica Neue, with Helvetica and Arial fallbacks.

**Character:** Cabin gives short UI language identity and authority. Helvetica Neue keeps descriptions, form values, records, and financial data neutral and readable. The pairing must create hierarchy, not alternate arbitrarily.

### Hierarchy

- **Page heading** (Cabin, 700, 2.5rem, 1.12): Desktop page titles. Compact screens reduce this role to 2rem.
- **Metric** (Cabin, 700, 2rem, 1.2): Current balance and other primary financial figures.
- **Title** (Cabin, 700, 1.5rem, 1.2): Drawer titles, dialog titles, and strong state headings.
- **Section** (Cabin, 700, 1.25rem, 1.2): Panel headings, mobile app name, VAT heading, and menu headings.
- **Body** (Helvetica Neue, 400, 1rem, 1.4): Descriptions, table records, transaction metadata, categories, form values, dates, tooltips, and longer copy.
- **Label** (Cabin, 700, 1rem, 1.25): Navigation, buttons, form labels, table headings, responsive record labels, and date groups.

All visible UI text is at least 1rem. Use tabular numerals for balances, transaction amounts, daily totals, dates where alignment matters, and receipt values. Body copy should normally stay within 65ch. Do not use fluid `clamp()` sizing in this product UI.

**The Two-Layer Type Rule.** Cabin is for headings and short non-body UI text. Helvetica Neue is for prose, form values, records, metadata, and data. A clickable row is still data and must not inherit the button font.

**The Fixed Scale Rule.** Use only the documented 1rem, 1.25rem, 1.5rem, 2rem, and 2.5rem roles unless a verified component needs a distinct size.

## Elevation

Accounts is flat by default. Panels, tables, fields, and inline forms use tonal contrast, dividers, and a 2px bottom rule instead of ambient shadows. Elevation is reserved for elements that genuinely float over another surface.

### Shadow Vocabulary

- **Popover lift** (`0 8px 0 rgb(6 12 24 / 18%)`): Company menus, profile menus, date pickers, and the prototype state menu.
- **Drawer edge** (`-8px 0 0 rgb(6 12 24 / 20%)`): Desktop drawers and attachment previews.
- **Dialog lift** (`0 8px 0 rgb(6 12 24 / 22%)`): Destructive confirmation dialogs.
- **Compact floating control** (`0 6px 0 rgb(6 12 24 / 20%)`): Toasts and the prototype-only state trigger.

Full-page drawers and dialogs use the Overlay token. The attachment preview must not add a second full-page overlay; it dims only its parent drawer. On desktop the secondary drawer is clipped beside the form drawer so its closing animation passes beneath, not over, the parent.

**The Flat-Until-Floating Rule.** If an element does not overlap another surface, it does not receive a shadow.

**The Single Overlay Rule.** A nested interaction may add hierarchy inside its parent region, but it must never stack multiple full-page backdrops.

## Components

### Application Shell and Navigation

- Desktop uses a fixed 264px rail and a workspace offset by the same amount.
- The rail brand contains the geometric Motech Development mark and the Accounts name. Do not substitute an arbitrary letter icon.
- Navigation has no implementation-language heading such as “Workspace”. Active items use Action Blue; inactive items remain quiet on the shell.
- When no company is selected, hide company-dependent navigation rather than disabling it or redirecting deep links.
- The rail footer keeps company context and profile controls separate. Company selection has no chevron and no selected tick; the selected row background is sufficient.
- The company menu contains available companies and “Manage companies”. It does not contain “Add company”.
- The profile menu contains notifications and sign out. The closed trigger is avatar plus user name on desktop, with a red notification dot over the avatar.
- On mobile, the header shows the navigation trigger, centred Accounts name, and avatar. There is no separate bell. The avatar menu owns notifications and sign out.
- Company and profile popovers close when focus or pointer interaction moves outside them, independently of whether the mobile rail closes.

### Page Headings and Actions

- Page headings sit directly on the Workspace Gray canvas. There is no dark title field, blue title highlight, overlap treatment, or duplicated company name.
- Desktop actions align with the heading when space allows. Between 681px and 1180px they move below the heading without wrapping internally.
- At 680px and below, heading actions stack full width. The primary action is first, followed by secondary actions.
- Button labels use a clear verb and object. Avoid “OK”, “Yes”, or implementation wording.

### Buttons

- All buttons are square and at least 44px high; the canonical control height is 46px.
- Primary buttons use Action Blue with inverse text. Secondary buttons use White Surface, Primary Ink, and a Strong Border.
- Danger buttons use Danger Red with inverse text. Text actions use Action Blue without a filled background.
- Desktop form actions remain in one consistent end-aligned group, with destructive actions separated where required. Mobile actions become full width in this order: primary, back, cancel, danger.
- Use a 2px Focus Blue ring with a 2px offset for keyboard focus.

### Panels, Metrics, and Notices

- Standard panels use White Surface and a 2px Strong Border at the bottom. They do not use card shadows.
- Avoid wrapping whole pages or whole forms in one large card. Use section dividers and grouped content to preserve rhythm.
- On Overview, Current balance and VAT summary share the main column above Recent transactions. Current balance uses a dark surface; VAT summary uses a white surface with a clear heading hierarchy.
- Overview summaries are limited to Current balance, VAT owed, and VAT paid. Do not add money-in, money-out, reporting-deadline, or other summary values.
- The attention panel links to pending transactions. Do not add missing-attachment counts or filing deadlines.
- Informational notices use Action Blue Soft with a clear border and icon.

### Tables and Record Streams

- Companies, Clients, and Reports are tables on desktop. At 680px and below they become compact record cards with generated Cabin labels and Helvetica Neue values.
- Transaction lists are streams grouped by day, not month. Date groups use a neutral gray bar and include confirmed daily totals.
- Transaction rows use left and right arrows for money in and out. Direction icons are 36px circles using Success or Danger soft backgrounds.
- Pending rows are gray only when mixed into other transaction surfaces. Rows on the dedicated Pending transactions screen use the normal surface.
- Do not show a status column or persistent status badges in transaction lists.
- Missing attachments use a Danger warning triangle beside the transaction identity. “No invoice or receipt” appears only in the accessible hover/focus tooltip.
- Scheduled transactions use a filled Action Blue clock with a “Scheduled transaction” tooltip. The pending screen shows the scheduled date without redundant “Yesterday” or “Scheduled” copy.
- Financial values align right and use tabular numerals. Hidden action headings remain visually hidden and must not receive loading placeholders.
- Report download buttons are content-width controls aligned consistently within the Actions column.

### Forms and Fields

- Inputs, selects, date triggers, and segmented controls are square, 46px high, white, and bordered with Strong Border.
- Labels use Cabin; entered values and selectable data use Helvetica Neue.
- Native browser appearance must not leak into styled controls. Select arrows, file upload, and date picking use the approved visual treatment.
- The custom date picker opens from the Date field and uses the same shell, surface, border, and focus vocabulary.
- The upload control presents attachment type guidance and a clear browse action. Never expose storage paths or technical backing values.
- Radio controls use one shared pattern across Transaction and Report forms.
- Refund and Scheduled transaction options put “No” first and default to “No”. New transactions do not default to pending.
- A purchase accepts a supplier name. A sale selects from saved clients, matching the existing workflow.
- Create and edit transaction forms keep field and control parity with the existing TransactionForm.

### Form Placement

- Create and edit transactions, clients, companies, and reports open in drawers. Selecting an existing transaction opens its edit form directly, without an intermediate detail page.
- Company details and Settings are editable inline page forms. Their sections use the same heading, divider, field, and action rhythm.
- Multi-step company creation remains in one drawer. Moving between steps must not replay the drawer entrance animation.
- Do not mix drawer and full-page placement arbitrarily. The inline Company details and Settings pages are the documented exceptions.

### Drawers, Attachments, and Dialogs

- Standard desktop drawers are 610px wide; wide company drawers are 760px. Headers use the dark shell, a description, title, and 44px close button.
- At 900px and below, drawers become full-width bottom sheets and animate vertically like an iOS modal.
- Drawers animate both in and out over 180ms using the approved ease-out curve. Backdrops fade over the same duration.
- Attachment previews open in a secondary drawer beside the parent form on desktop. The overlay covers only the form drawer. On mobile the preview uses the same bottom-sheet model.
- Delete confirmation dialogs open above the drawer without closing it. They have a compact header, filled warning tile, explicit close button, short message, and Cancel plus destructive action.
- Dialog and drawer focus must remain contained while open and return to the initiating control on close.

### Menus and Notifications

- Menus are square White Surfaces with structural shadow, clear headings, and 16px internal padding.
- Notification state is indicated by a red avatar dot. Notifications appear inside the profile menu on both desktop and mobile.
- Vendor names, authentication providers, implementation identifiers, and developer-oriented copy never appear in user-facing UI.
- Selecting or managing a company closes the company menu and also closes the mobile rail.

### Loading, Empty, and Error States

- Loading skeletons must match the layout of the screen they replace: metrics, transaction groups, tables, forms, settings rows, notices, and actions.
- Skeleton circles remain square circles. Hidden action headings do not receive visible skeletons. Mobile action skeletons match the exact full-width button stack.
- Empty and error states are contextual, compact, and left anchored. They name the screen, explain the next step, and provide the correct recovery action.
- Empty states use a 54px Action Blue Soft icon tile. Error states use a 54px Danger Red Soft tile with a warning icon.
- On mobile, the state icon sits beside the heading. Supporting copy and the full-width action span the panel below.

### Motion and Accessibility

- Motion communicates state only. Drawers, sheets, backdrops, menus, and tooltips use short 150–200ms transitions.
- Respect `prefers-reduced-motion` by reducing animation and transition duration to effectively instant.
- All visible text is at least 16px. Interactive targets are at least 44px.
- Body text and placeholders must meet WCAG AA contrast. Focus styles remain visible on shell and surface backgrounds.
- Tooltips must be reachable by hover and keyboard focus. Icon-only buttons require accessible names.

## Do's and Don'ts

### Do:

- **Do** treat the [hosted Accounts v2 prototype](https://accounts-v2-prototype.mo-gusbi896031.chatgpt.site) as the temporary source of truth until production implementation replaces it.
- **Do** update this document to production component paths before retiring the prototype.
- **Do** preserve the dark shell, cool gray canvas, white work surfaces, square geometry, and restrained Action Blue vocabulary.
- **Do** use Cabin for headings and short UI language, and Helvetica Neue for body copy, values, records, and metadata.
- **Do** use familiar product affordances for navigation, notifications, account controls, forms, and destructive confirmation.
- **Do** keep company context visible once, hide company-dependent navigation when no company is selected, and close popovers on outside interaction.
- **Do** use desktop tables and mobile record cards for Companies, Clients, and Reports.
- **Do** use daily transaction groups, confirmed daily totals, left/right direction arrows, and accessible warning or scheduled tooltips.
- **Do** use screen-shaped loading skeletons and contextual empty/error states.
- **Do** enforce WCAG AA contrast, visible focus, 16px minimum text, 44px minimum targets, and reduced-motion behavior.

### Don't:

- **Don't** reference Pencil or `.pen` assets as the current source of truth.
- **Don't** leave this document pointing at the temporary prototype after the production redesign is complete.
- **Don't** make unrelated brand-colour changes or reintroduce the previous teal/light-workshop direction.
- **Don't** use ornamental interface styling, invented affordances, decorative dashboards, marketing-led composition, or UI that feels clever at the expense of task clarity.
- **Don't** expose vendor names such as Auth0, storage paths, API identifiers, or internal terms such as “Workspace”.
- **Don't** repeat the selected company above page headings or add redundant company-state indicators such as a selected tick.
- **Don't** show company-dependent navigation when no company is selected.
- **Don't** add a transaction status column, persistent “No invoice or receipt” text, or redundant scheduled copy.
- **Don't** use month grouping where the product workflow groups transactions by day.
- **Don't** use generic card grids for transaction streams or turn whole forms into one undifferentiated card.
- **Don't** add shadows to static panels, tables, fields, or inline forms.
- **Don't** use Cabin for body copy, transaction data, form values, or record metadata.
- **Don't** allow native file inputs, native date pickers, or unstyled select arrows to leak into the interface.
- **Don't** mix full-page and drawer forms outside the documented Company details and Settings exceptions.
- **Don't** close a parent drawer when opening a file preview or delete confirmation.
- **Don't** stack multiple full-page overlays or let a secondary drawer animate over its parent on exit.
