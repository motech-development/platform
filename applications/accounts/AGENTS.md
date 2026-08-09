# Accounts UI implementation

This file supplements the repository-level `AGENTS.md` for work inside the
Accounts application.

## Design authority

- Read the root `DESIGN.md` before adding or materially changing an Accounts
  screen. Treat the linked prototype as the temporary visual and interaction
  authority described there.
- Reference the exact prototype screen, state, and viewport relevant to the
  work. A prototype is a whole-screen composition, not a collection of
  individually reusable elements.
- If the required prototype state cannot be reached or its intended composition
  is unclear, stop and ask for clarification. Do not infer a new composition
  from unrelated prototype fragments.
- Identify the closest existing production screen archetype before editing:
  collection, dashboard, editor, settings, drawer task, or another established
  pattern. Inspect that screen in the same state and responsive mode.
- If the prototype and the closest established production pattern conflict,
  stop and ask which one governs the change.

## Prototype navigation

The hosted prototype exposes its screen and product-state controls through the
`Preview: <state>` button in the bottom-right corner.

- Open the preview controls before using the prototype as implementation
  evidence.
- Use the `Screen` selector to choose `Overview`, `Transactions`,
  `Pending transactions`, `Clients`, `Reports`, `Companies`,
  `Company details`, `Settings`, `Authentication`, or `Page not found`.
- Use the `Screen state` controls to choose `Ready`, `Loading`, `Empty`, or
  `Error`.
- The selected state is addressable directly with this URL structure:

  ```text
  https://accounts-v2-prototype.mo-gusbi896031.chatgpt.site/?state=<state>#<screen>
  ```

- Supported screen fragments are `overview`, `transactions`, `pending`,
  `clients`, `reports`, `companies`, `company`, `settings`, `authentication`,
  and `not-found`. Supported state values are `ready`, `loading`, `empty`, and
  `error`.
- Verify that the URL and visible `Preview: <state>` label match the intended
  screen state before recording prototype evidence.
- Inspect every affected state through these controls before concluding that a
  prototype state is unavailable. Only then stop and ask for clarification.

## Screen-state composition

Before editing a new screen or changing how a screen is composed, record these
items in the working commentary or plan:

- the screen archetype;
- the exact prototype reference;
- the closest production reference;
- each reachable state affected by the work; and
- which region owns each domain action in each state.

Evaluate complete rendered states. Relevant states commonly include initial
loading, background refresh, error, empty, populated, mutation progress,
success, and recovery, but include only states reachable by the screen being
changed.

- A domain action has one visible owner within a rendered state unless the
  exact prototype intentionally repeats it.
- When a contextual empty state owns the primary domain action, do not also
  render that action in the page header.
- Recovery actions such as retry may coexist with a distinct domain action when
  the prototype and established product pattern support both.
- Loading skeletons replace the complete layout of their state, including the
  correct action placement. Do not create loading, empty, error, header, and
  content regions independently without checking how they compose.
- Define shared domain actions once and let the screen-state composition place
  them. Do not duplicate labels and handlers across regions that may render
  together.

## Reuse and implementation

- Reuse the closest Accounts-owned presentation or screen-state abstraction
  when it matches the prototype. Do not rebuild an established composition from
  lower-level primitives on each screen.
- When the same composition is already repeated across Accounts and another
  screen needs it, prefer the smallest Accounts-owned abstraction that makes
  invalid state combinations difficult to express. Do not introduce a generic
  abstraction for a single speculative use.
- Preserve the incumbent information hierarchy, responsive action placement,
  focus order, and accessible names unless the prototype or requirements
  explicitly change them.

## Visual completion gate

- Inspect the complete rendered result for every affected state at the
  applicable compact and wide structural modes from `DESIGN.md`.
- Compare the screen as a whole with the exact prototype state and the closest
  production reference. Check action ownership, hierarchy, content order,
  responsive placement, empty/error composition, and interactive reachability.
- Static JSX inspection, design detectors, and automated tests support this
  gate but do not replace rendered-state inspection.
- Do not report the UI complete when a required state could not be rendered and
  inspected. Report the missing evidence and ask for direction instead.

## Review

- Review new screens state-by-state before reviewing individual component
  details. Confirm that independently valid regions do not conflict when they
  render together.
- Treat a mismatch in whole-screen composition, action ownership, or prototype
  state as a functional finding, not cosmetic feedback.
