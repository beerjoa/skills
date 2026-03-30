---
name: pr-self-review
description: Lightweight overlay for personal pre-PR self review, risk clarity, and clean PR output formatting.
---

## Purpose

Provide a concise self-review overlay before opening or updating a PR.

This skill augments existing workflows with policy/context/checklist/output-format guidance. It does not replace the host plugin or agent planning/coding/review loop.

## Use when

- You are about to open a PR.
- You updated a branch and need a structured self-review refresh.
- You need a consistent PR summary format.

## Do not use when

- You need to run or control build/test pipelines.
- You want to replace formal code review.
- You need end-to-end workflow orchestration.

## Inputs

- Current diff or commit range
- Intended scope and non-goals
- Test and validation notes
- Existing PR draft, if available

## Outputs

- A prioritized self-review checklist result
- A concise risk note section
- A PR body draft adapted to current changes

## Interoperability

- Overlay-only: preserve host workflow ownership.
- If another tool already created a PR draft, adapt it instead of restarting.
- Treat this as policy/context/checklist/output-format guidance, not loop control.

## Procedure

1. Read the current change scope and existing PR draft (if present).
2. Apply the checklist in `references/review-checklist.md`.
3. Mark unresolved risks and unclear assumptions.
4. Draft or refine the PR body using `templates/pr-body.md`.
5. Keep wording factual, short, and reviewer-oriented.

## References

- `references/review-checklist.md`
- `templates/pr-body.md`
