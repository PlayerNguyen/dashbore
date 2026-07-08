---
name: propose-plan
description: Propose a structured implementation plan for the user to review before execution
license: MIT
compatibility: opencode
metadata:
  phase: planning
  output: .opencode/plans/
---

## Purpose

Guide the user through a structured planning phase before implementing changes. This skill ensures clear understanding, proper analysis, and user approval before any code modifications.

## When to Use

- Before implementing new features
- Before refactoring existing code
- Before infrastructure changes (Docker, CI/CD, databases)
- Before any non-trivial modification that affects multiple files
- When user start prompting with keyword "propose".

## Workflow

### Phase 1: Understand the Request

1. Read and understand the user's request
2. Identify the scope and impact of changes
3. Ask clarifying questions if the request is ambiguous

### Phase 2: Explore the Codebase

1. Use the `explore` agent or search tools to understand:
   - Current implementation patterns
   - Related files and dependencies
   - Existing conventions and standards
2. Identify all files that need modification
3. Understand the impact on other components

### Phase 3: Propose the Plan

Present the plan in this structure:

```
## Context
<Why this change is needed>

## Current State
<How things work now>

## Target State
<How things will work after>

## Implementation Steps
<Numbered, actionable steps with specific file references>

## Key Considerations
<Risks, tradeoffs, alternatives>

## Verification Checklist
<How to verify the changes work>
```

### Phase 4: Wait for Approval

**Do not proceed with implementation until the user explicitly approves.**

Present the plan and ask:
> "Does this plan look good? Should I proceed with implementation, or would you like any changes?"

### Phase 5: Save the Plan (if requested)

If the user approves and asks to save the plan:

1. Get current timestamp: `date +"%d-%m-%Y-%H-%M"`
2. Create the plan file at `.opencode/plans/<dd-mm-yyyy-hh-mm>_<plan_name>.md`
3. Use the plan content from Phase 3 as the file content
4. Confirm the file was created

## Rules

1. **Never skip the planning phase** for non-trivial changes
2. **Always wait for user approval** before implementing
3. **Be specific** - reference exact file paths and line numbers
4. **Be honest** about risks and tradeoffs
5. **Ask questions** when the request is unclear
6. **Keep plans concise** but comprehensive
7. **Use existing patterns** - don't reinvent conventions

## Project Config

The root `opencode.jsonc` enables LSP for code intelligence:

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  "lsp": true
}
```

This provides type-aware suggestions and error checking during plan exploration.

## Example Interaction

```
User: Migrate from MySQL to PostgreSQL

Agent: I'll explore the codebase to understand the current database setup...

[Explores codebase]

Here's my migration plan:

## Context
The app uses MySQL 8. We need to migrate to PostgreSQL.

## Current State
- MySQL 8 in docker-compose.yml
- Prisma with @prisma/adapter-mariadb
- Connection: mysql://...

## Target State
- PostgreSQL 17 in docker-compose.yml
- Prisma with @prisma/adapter-pg
- Connection: postgresql://...

## Implementation Steps
1. Update docker-compose.yml (file:line)
2. Update prisma schema (file:line)
...

## Verification Checklist
- [ ] PostgreSQL starts
- [ ] Migrations run
...

Does this plan look good? Should I proceed, or would you like any changes?

User: Looks good, save the plan

Agent: [Creates .opencode/plans/08-07-2026-15-30_mysql-to-postgresql-migration.md]
Plan saved. Ready to implement when you are.
```
