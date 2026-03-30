---
name: requirement-gap-check
description: Overlay for checking requirement-to-implementation gaps before review or handoff.
---

## Purpose

Find missing, partially met, or ambiguous requirements before final review.

This skill augments existing workflows with policy/context/checklist/output-format guidance. It does not replace the host planning/coding/review loop.

## Use when

- You completed implementation and need requirement coverage validation.
- A reviewer asks whether all requirements are addressed.
- Scope drift is likely.

## Do not use when

- Requirements are not available at all.
- You need to build a full test framework.
- You want to orchestrate end-to-end project management.

## Inputs

- Requirement list (ticket, spec, plan, or checklist)
- Implemented changes summary
- Known deferrals or follow-up items
- Existing gap analysis draft, if available

## Outputs

- Requirement coverage matrix (met/partial/missing)
- Explicit gap list with impact notes
- Recommended next actions for unresolved items

## Interoperability

- Overlay-only: preserve host workflow ownership.
- If another tool already generated a requirement check, adapt and sharpen it instead of restarting.
- Apply this as policy/context/checklist/output-format guidance.

## Procedure

1. Normalize requirements into discrete, testable statements.
2. Map each statement to implementation evidence.
3. Mark each item as met, partial, or missing.
4. Record ambiguity and risk for partial/missing items.
5. Provide concrete next actions and ownership hints.

## References

- No external reference required.
