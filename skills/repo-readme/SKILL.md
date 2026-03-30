---
name: repo-readme
description: Overlay for producing practical, readable, and interoperable repository README files.
---

## Purpose

Improve README quality using a consistent structure focused on onboarding and maintenance clarity.

This skill augments existing workflows with policy/context/checklist/output-format guidance. It does not replace the host planning/coding/review loop.

## Use when

- Creating a new README.
- Refactoring an outdated README.
- Aligning README sections across repositories.

## Do not use when

- You need a full documentation platform design.
- You need to generate architecture specs.
- You want to run documentation automation pipelines.

## Inputs

- Repository purpose and constraints
- Setup and usage commands
- Existing README draft, if available
- Audience (maintainers, contributors, users)

## Outputs

- A clean README section set
- Explicit non-goals and operating assumptions
- A practical quick-start path

## Interoperability

- Overlay-only: keep host workflow in control.
- If a README draft already exists, adapt it instead of replacing everything.
- Use this as policy/context/checklist/output-format guidance.

## Procedure

1. Capture repo goal and non-goals.
2. Apply section guidance from `references/readme-sections.md`.
3. Keep command examples minimal and accurate.
4. Prioritize practical usage over abstract architecture language.
5. Verify naming and terminology consistency.

## References

- `references/readme-sections.md`
