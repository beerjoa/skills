---
name: implementation-summary
description: Overlay for clear implementation handoff summaries after completing a change.
---

## Purpose

Produce a concrete summary of what was implemented, verified, and left for follow-up.

This skill augments existing workflows with policy/context/checklist/output-format guidance. It does not replace the host planning/coding/review loop.

## Use when

- Finishing a feature or fix.
- Handing work to a reviewer or another engineer.
- Preparing release notes from implementation details.

## Do not use when

- You need to manage tasks or project timelines.
- You want to replace formal design docs.
- You need orchestration across multiple tools.

## Inputs

- Final diff or commit list
- Verification results
- Known limitations and follow-ups
- Existing summary draft, if available

## Outputs

- Concise implementation summary
- Verification evidence section
- Open items and follow-up notes

## Interoperability

- Overlay-only: preserve host workflow ownership.
- If another tool already generated a summary, adapt and refine it instead of restarting.
- Keep this as policy/context/checklist/output-format guidance.

## Procedure

1. Collect concrete implementation changes.
2. Confirm verification evidence and limitations.
3. Fill `templates/handoff-template.md` with actual project details.
4. Remove vague language and keep outcome-focused wording.
5. Publish summary in the target channel (PR, issue, handoff note).

## References

- `templates/handoff-template.md`
