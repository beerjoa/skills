# PR Self-Review Checklist

## Scope correctness

- Does the change match the stated goal?
- Are unrelated edits removed or explicitly explained?

## Behavior and risk

- What user-visible behavior changed?
- What can fail in production?
- Are rollback or fallback notes clear?

## Tests and verification

- Which checks were run?
- What was intentionally not tested and why?

## Readability

- Are names and docs consistent with behavior?
- Are comments focused on non-obvious logic?

## Reviewer enablement

- Is there enough context for a reviewer to validate quickly?
- Is the "what changed" vs "why" distinction clear?
