---
name: extract-project-contributions
description: Extract source-grounded project contribution data from repositories or document artifacts for career workflows. Use this whenever the user wants factual contribution evidence for a resume update, interview prep, or experience source notes and can provide a repo, git scope, files, or folders. Require explicit role selection and use this before any rewriting step.
---

## Purpose

Extract traceable project contribution evidence for career workflows without rewriting it into polished resume bullets.

This skill augments the host workflow with grounding rules, role routing, and output-format guidance. It does not replace the host agent's planning or execution loop.

## Use when

- The user wants source-grounded contribution data rather than memory-based drafting.
- The user needs evidence to update a resume, career profile, interview notes, or a later writing workflow.
- The user can provide a repository, git scope hints, files, or folders.
- The user wants to extract what they actually did in a project before any rewriting step.

## Do not use when

- The user wants polished resume bullets or platform-ready experience text.
- The user wants JD-specific tailoring.
- The user wants a portfolio narrative or interview answer draft.
- The user has no evidence source and only wants a memory-based brainstorm.

## Inputs

- Explicit role selection: `developer`, `planner`, or `designer`
- For developer mode: repository path plus optional git scope hints
- For planner or designer mode: one or more files, local file paths, or folder paths

## Outputs

- Exactly one role-specific extraction output per run
- A structured evidence view
- Excluded or ambiguous items that should not be promoted
- Explicit gaps that block stronger claims

## Interoperability

- Overlay-only: preserve host workflow ownership.
- Use this skill before downstream rewriting skills.
- Keep outputs factual and traceable.

## Procedure

1. Confirm the user wants grounded contribution extraction rather than polished writing.
2. Require explicit role selection: `developer`, `planner`, or `designer`.
3. For `developer`, read `references/developer-extraction-rules.md` and `templates/developer-project-contributions.md`.
4. For `planner`, read `references/planner-extraction-rules.md` and `templates/nondeveloper-project-contributions.md`.
5. For `designer`, read `references/designer-extraction-rules.md` and `templates/nondeveloper-project-contributions.md`.
6. Collect evidence only from the sources appropriate for the chosen role.
7. Extract direct work and explicitly supported outcomes without strengthening claims.
8. Put weak or ambiguous items into the excluded section instead of the main table.
9. Write exactly one output file:
   - `experience_output.md` for `developer`
   - `experience_output_nondeveloper.md` for `planner` or `designer`

## References

- `references/developer-extraction-rules.md`
- `references/planner-extraction-rules.md`
- `references/designer-extraction-rules.md`
- `templates/developer-project-contributions.md`
- `templates/nondeveloper-project-contributions.md`
