---
alwaysApply: true
---

# Code Style Ruleset

## Applies to

`**/*`

## Description

Mandatory code style, testing, documentation, and workflow standards for this project.

---

### 🧩 Non-Negotiable Coding Styles

- Ensure all code **passes linting** and contains **no TypeScript errors**.
- **Never disable lint rules** to bypass issues — fix the underlying problem instead.
- Prefer **functional array methods** (`map`, `filter`, `reduce`) instead of loops or `Array.push()`.
- **Infer types automatically** where possible rather than explicitly annotating simple cases.
- Use **type declarations** (`type` or `interface`) instead of inline object types.
- The **`any` type is forbidden** under all circumstances.
- Always insert a **newline before `return` statements**.
- Format **object literals across multiple lines** for readability.
- Choose **descriptive and meaningful variable names**.
- **Do not import `React`** unless it is strictly required.
- **Import React types explicitly** — use `import type { ReactNode } from 'react'` instead of `React.ReactNode`.
- Avoid bare `return;` — use **explicit control flow**.
- Separate **variable declarations with blank lines**.
- Do not leave behind **unused code**, dead code, or commented-out logic.
- Keep changes **surgical** — avoid modifying unrelated code.
- When editing existing files, **match the existing code style and conventions**.
- **Respect `.editorconfig`** — indentation, line endings, and whitespace must match project configuration.
- Use **ES Modules syntax** (`import` / `export`), not CommonJS (`require`).
- **Destructure imports** whenever possible (e.g. `import { foo } from 'bar'`).
- Code must be **documented with JSDoc** where appropriate.
- Run the **`deslop`** command to remove AI-generated slop before finalizing changes.
- When new conventions, patterns, or implicit project rules are discovered,  
  the AI must **record them in `PROJECT_RULES.md`** and **consult that file for all future work**.

---

### 🧪 Testing & Quality

- Write tests that **validate behavior and functionality**, not implementation details.
- **Every new or modified code path must include unit tests.**
- **Minimum code coverage is 80%.**
- Prefer running **targeted tests** instead of the full test suite for performance.
- Always **run type-checking and linting** after completing a set of changes.

---

### 🧰 Tooling & Workflow

- When adding packages, ensure you are using the **latest stable versions**.
- **Never skip git hooks.**
- Check which **package manager is in use** before running any commands.
- **Disabling ESLint rules or adding new ones is a last resort** and must be justified by necessity, not convenience.
