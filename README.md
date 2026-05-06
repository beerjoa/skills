# beerjoa/skills

English | [한국어](./README.ko.md)

A lightweight personal overlay pack distributed through `npx skills add`.

It augments host agent workflows with policy/context/checklist/output-format overlays.
It does not replace planning, coding, review, or execution loops of your host agent tooling.

> Canonical document: `README.md` (English)

## Installation

### Via npx skills add

```bash
npx skills add beerjoa/skills
```

For detailed CLI usage, see [vercel-labs/skills](https://github.com/vercel-labs/skills).

### Manual Installation

1. Copy `skills/<skill-id>/` into your agent skills directory.
2. Keep `SKILL.md` frontmatter intact.
3. Restart your agent so it reloads installed skills.

## Skills

| Skill | Description |
|-------|-------------|
| `pr-self-review` | Reviews diff scope, flags unresolved risks, and drafts a clean PR body before you open or update a PR. |
| `change-risk-check` | Classifies change risk level, identifies likely failure modes, and suggests mitigations before merge or release. |
| `implementation-summary` | Produces a concrete handoff summary of what was built, verified, and left as follow-up after completing a change. |
| `repo-readme` | Improves README structure and clarity for practical onboarding — keeps command examples accurate and removes abstract filler. |
| `requirement-gap-check` | Maps each requirement to implementation evidence and surfaces unmet or ambiguous items before review or handoff. |
| `extract-project-contributions` | Extracts source-grounded project contribution evidence from repositories or document artifacts for career workflows before any rewriting step. |
| `bruno-api` | Generates or updates Bruno collections from backend source code for environment-level API validation. |
| `git-commit-from-instructions` | Generates a compliant commit message from repository-specific instructions and commits only staged or agent-authored changes. |

## Related Docs

- [README (Korean)](./README.ko.md)
- [INTEROP.md](./INTEROP.md)
- [COMPATIBILITY.md](./COMPATIBILITY.md)
- [CHANGELOG.md](./CHANGELOG.md)
