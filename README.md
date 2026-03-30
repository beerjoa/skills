# beerjoa/skills

A lightweight personal overlay pack distributed through `npx skills add`.

This repository is designed for direct installation with the official `skills` CLI:

```bash
npx skills add beerjoa/skills
```

It augments host agent workflows with policy/context/checklist/output-format overlays.
It does not replace planning, coding, review, or execution loops of your host agent tooling.

## Quick Start

### 1) List available skills

```bash
npx skills add beerjoa/skills --list
```

### 2) Install all skills

```bash
npx skills add beerjoa/skills
```

### 3) Install one skill

```bash
npx skills add beerjoa/skills --skill pr-self-review
```

### 4) Install to a specific agent

```bash
npx skills add beerjoa/skills --skill pr-self-review -a codex
```

### 5) Install globally

```bash
npx skills add beerjoa/skills --skill pr-self-review -a codex -g
```

## Profile Installs

`profiles/*.txt` is the source of truth for grouped installs.

### Core profile (`profiles/core.txt`)

Contains:
- `pr-self-review`
- `change-risk-check`
- `implementation-summary`

Install command:

```bash
npx skills add beerjoa/skills \
  --skill pr-self-review \
  --skill change-risk-check \
  --skill implementation-summary
```

### Review profile (`profiles/review.txt`)

Contains:
- `pr-self-review`
- `change-risk-check`
- `requirement-gap-check`

Install command:

```bash
npx skills add beerjoa/skills \
  --skill pr-self-review \
  --skill change-risk-check \
  --skill requirement-gap-check
```

### Career profile (`profiles/career.txt`)

This is currently a placeholder profile for future skills.
No install command is provided yet.

## Skill Catalog

- `pr-self-review`: pre-PR self-check and PR body refinement overlay
- `change-risk-check`: risk categorization and mitigation framing overlay
- `implementation-summary`: implementation handoff summary overlay
- `repo-readme`: practical README structure and quality overlay
- `requirement-gap-check`: requirement coverage and gap scan overlay

## Skill Contract

For compatibility with `npx skills add`, each skill follows:

- Location: `skills/<skill-id>/SKILL.md`
- Frontmatter required: `name`, `description`
- Convention: frontmatter `name` matches `<skill-id>`

## What This Repository Is Not

- Not a framework
- Not a plugin platform
- Not a workflow orchestrator
- Not a build/test loop controller

## Troubleshooting

### `npx skills add` cannot find skills

Check:

```bash
npx skills add beerjoa/skills --list
```

If this fails, verify repository visibility, branch state, and network access.

### Manual copy fallback (last resort)

Use manual copy only when `npx skills add` is unavailable in your environment.

1. Copy `skills/<skill-id>/` into your agent skills directory.
2. Keep `SKILL.md` frontmatter intact.
3. Re-run your agent so it reloads installed skills.

## Related Docs

- [INTEROP.md](./INTEROP.md)
- [COMPATIBILITY.md](./COMPATIBILITY.md)
- [CHANGELOG.md](./CHANGELOG.md)

## 한국어 요약

- 이 저장소의 공식 배포 방식은 `npx skills add beerjoa/skills`입니다.
- `core`/`review` 프로필은 README의 `--skill` 조합 명령으로 설치합니다.
- `career` 프로필은 아직 placeholder입니다.
- 수동 복사는 문제 해결용 보조 경로이며 기본 방식이 아닙니다.
