---
name: change-risk-check
description: Overlay for quick risk categorization and mitigation notes before merge or release.
---

## Purpose

Classify change risk clearly so teams can decide review depth, rollout caution, and follow-up actions.

This skill augments existing workflows with policy/context/checklist/output-format guidance. It does not replace the host planning/coding/review loop.

## Use when

- A change is ready for review or merge.
- A release decision needs a quick risk summary.
- A reviewer requests explicit risk framing.

## Do not use when

- You need to run deployment automation.
- You need to replace incident response processes.
- You want to orchestrate a full release workflow.

## Inputs

- Diff or change summary
- Affected modules/systems
- User impact assumptions
- Existing risk notes, if available

## Outputs

- Risk category with short rationale
- Potential failure modes
- Mitigation and monitoring suggestions

## Interoperability

- Overlay-only: keep host workflow ownership intact.
- If another tool already wrote risk notes, adapt and tighten them instead of rewriting.
- Use this as policy/context/checklist/output-format guidance.

## Procedure

1. Read scope and impacted components.
2. Map the change to categories in `references/risk-categories.md`.
3. Identify top failure modes and triggers.
4. Write practical mitigations and monitoring notes.
5. Produce a short risk summary for PR/release notes.

## References

- `references/risk-categories.md`
