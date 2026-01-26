# Rule: Generating a Task List from User Requirements

## Goal

To guide an AI assistant in creating a detailed, step-by-step task list in Markdown format based on user requirements, feature requests, or existing documentation. The task list should guide a developer through implementation.

## Output

- **Format:** Markdown (`.md`)
- **Location:** `/tasks/`
- **Filename:** `tasks-[feature-name].md` (e.g., `tasks-user-profile-editing.md`)

## Process

1.  **Receive Requirements:** The user provides a feature request, task description, or points to existing documentation
2.  **Analyze Requirements:** The AI analyzes the functional requirements, user needs, and implementation scope from the provided information
3.  **Phase 1: Generate Parent Tasks:** Based on the requirements analysis, create the file and generate the main, high-level tasks required to implement the feature. **IMPORTANT: Always include task 0.0 "Create feature branch" as the first task, unless the user specifically requests not to create a branch.** Use your judgement on how many additional high-level tasks to use. It's likely to be about 5. Present these tasks to the user in the specified format (without sub-tasks yet). Inform the user: "I have generated the high-level tasks based on your requirements. Ready to generate the sub-tasks? Respond with 'Go' to proceed."
4.  **Wait for Confirmation:** Pause and wait for the user to respond with "Go".
5.  **Phase 2: Generate Sub-Tasks:** Once the user confirms, break down each parent task into smaller, actionable sub-tasks necessary to complete the parent task. Ensure sub-tasks logically follow from the parent task and cover the implementation details implied by the requirements.
6.  **Identify Relevant Files:** Based on the tasks and requirements, identify potential files that will need to be created or modified. List these under the `Relevant Files` section, including corresponding test files if applicable.
7.  **Generate Final Output:** Combine the parent tasks, sub-tasks, relevant files, and notes into the final Markdown structure.
8.  **Save Task List:** Save the generated document in the `/tasks/` directory with the filename `tasks-[feature-name].md`, where `[feature-name]` describes the main feature or task being implemented (e.g., if the request was about user profile editing, the output is `tasks-user-profile-editing.md`).

## Output Format

The generated task list _must_ follow this structure:

```markdown
## Relevant Files

- `apps/web/app/components/MyComponent.tsx` - Brief description of why this file is relevant (e.g., Contains the main component for this feature).
- `apps/web/app/components/__tests__/MyComponent.test.tsx` - Unit tests for `MyComponent.tsx`.
- `apps/web/app/routes/api/data.ts` - Brief description (e.g., API route handler for data submission).
- `apps/web/app/routes/__tests__/api/data.test.ts` - Unit tests for `api/data.ts`.
- `packages/shared/src/utils/helpers.ts` - Brief description (e.g., Utility functions needed for calculations).
- `packages/shared/src/__tests__/utils/helpers.test.ts` - Unit tests for `helpers.ts`.
- `packages/convex/convex/myFunction.ts` - Brief description (e.g., Convex function for backend logic).
- `packages/convex/convex/__tests__/myFunction.test.ts` - Unit tests for `myFunction.ts`.

### Notes

- This is a **pnpm monorepo** with the following structure:
  - `apps/` - Contains application packages:
    - `web/` - Remix/React web application
    - `crawler/` - Node.js/TypeScript crawler application
  - `packages/` - Contains shared packages:
    - `convex/` - Convex backend functions and schema
    - `report-generator/` - Report generation utilities
    - `shared/` - Shared types and utilities
- Unit tests should be placed in `__tests__/` directories alongside the code files they are testing (e.g., `MyComponent.tsx` and `__tests__/MyComponent.test.tsx` in the same directory).
- To run tests, navigate to the relevant package directory and run `pnpm test`. For example:
  - `cd apps/web && pnpm test` - Run all tests for the web app
  - `cd packages/shared && pnpm test` - Run all tests for the shared package
  - `cd packages/convex && pnpm test` - Run all tests for the convex package
  - Alternatively, from the root: `pnpm --filter @website-scanner/web test` to run tests for a specific package
  - To run a specific test file: `cd [package-dir] && pnpm test [path/to/test/file]`
- When referencing workspace packages, use the workspace protocol (e.g., `@website-scanner/shared`, `@website-scanner/convex`).

## Instructions for Completing Tasks

**IMPORTANT:** As you complete each task, you must check it off in this markdown file by changing `- [ ]` to `- [x]`. This helps track progress and ensures you don't skip any steps.

Example:

- `- [ ] 1.1 Read file` → `- [x] 1.1 Read file` (after completing)

Update the file after completing each sub-task, not just after completing an entire parent task.

**Starting Task Implementation:** Before beginning to implement any task, clear any previous context and start fresh. Read the task file, relevant code files, and `PROJECT_RULES.md` to establish the current state. Do not carry over assumptions or context from previous work sessions.

**Documentation of Learnings:** When you discover new conventions, patterns, or implicit project rules during implementation, you must:

1. Record them in `PROJECT_RULES.md` with a clear description
2. Consult `PROJECT_RULES.md` at the start of each task to ensure consistency with established patterns
3. Update `PROJECT_RULES.md` immediately when new patterns are discovered, not at the end of the task

**Git Operations:** Never include sub-tasks for committing or pushing code. Task lists should focus on implementation work only, not version control operations.

## Tasks

- [ ] 0.0 Create feature branch
  - [ ] 0.1 Create and checkout a new branch for this feature (e.g., `git checkout -b feature/[feature-name]`)
  - [ ] 0.2 Read `PROJECT_RULES.md` to understand established patterns and conventions
- [ ] 1.0 Parent Task Title
  - [ ] 1.1 [Sub-task description 1.1]
  - [ ] 1.2 [Sub-task description 1.2]
- [ ] 2.0 Parent Task Title
  - [ ] 2.1 [Sub-task description 2.1]
- [ ] 3.0 Parent Task Title (may not require sub-tasks if purely structural or configuration)
- [ ] N.0 Final review
  - [ ] N.1 Review `PROJECT_RULES.md` and update with any new patterns or conventions discovered during implementation
```

## Interaction Model

The process explicitly requires a pause after generating parent tasks to get user confirmation ("Go") before proceeding to generate the detailed sub-tasks. This ensures the high-level plan aligns with user expectations before diving into details.

## Target Audience

Assume the primary reader of the task list is a **junior developer** who will implement the feature.
