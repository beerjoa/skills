# Developer Extraction Rules

Use git history as the primary evidence source.

## Required behavior

- Search `git log` first.
- Use commit subjects and bodies as the main extraction source.
- Use touched file paths only for grouping and interpretation.
- Use current repository structure only to understand domains or module boundaries.
- Do not inspect diffs unless the user explicitly asks for diff-based analysis.
- Do not strengthen claims beyond what the commit messages support.

## Preferred evidence order

1. `git log` filtered by author, branch, date range, or path
2. commit subjects and bodies
3. touched file paths for grouping only
4. repository structure for interpretation only

## Keep

- direct implementation work
- fixes
- migrations
- operations or maintenance work
- explicitly stated supported outcomes

## Downgrade or exclude

- generic `chore` commits without contribution detail
- merge commits without reusable user-specific evidence
- formatting-only or rename-only commits
- vague refactors that do not describe user-visible or system-level work

## Output rules

- Default output path: `experience_output.md`
- Keep the `Bullet Summary` tightly grounded in the same evidence as the structured view.
- Treat the structured view as the primary source-of-truth section.
- Put weak items into `Excluded Or Ambiguous Items`.
