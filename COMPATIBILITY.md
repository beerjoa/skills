# Compatibility Notes

This repository targets compatibility with the official `skills` CLI ecosystem.

## Official Distribution Contract

Primary install interface:

```bash
npx skills add beerjoa/skills
```

Supported patterns include:

- `npx skills add beerjoa/skills --skill <skill-id>`
- `npx skills add beerjoa/skills -a <agent>`
- `npx skills add beerjoa/skills -a <agent> -g`

## Skill Discovery Contract

A skill is considered discoverable when it follows all rules below:

- Path shape: `skills/<skill-id>/SKILL.md`
- `SKILL.md` frontmatter includes string fields `name` and `description`
- `name` is aligned with `<skill-id>` for predictable installation and filtering

## Agent Variability

Different agents may vary in:

- Installed directory path
- Whether support resources are loaded automatically
- How templates/references are surfaced during runtime

Design consequence:

- `SKILL.md` remains the minimum guaranteed behavior layer
- `references/`, `templates/`, and `scripts/` stay optional enhancement layers

## Graceful Degradation Rule

If an environment ignores support files, the skill should still remain usable from:

- purpose
- inputs
- outputs
- procedure

all documented in `SKILL.md`.

## Practical Verification

Recommended checks before release:

```bash
npx skills add beerjoa/skills --list
```

```bash
npx skills add beerjoa/skills --skill pr-self-review -a codex
```

## 한국어 요약

- 공식 호환 기준은 `skills` CLI (`npx skills add`)입니다.
- 스킬 인식 기본 조건은 `skills/<id>/SKILL.md` + frontmatter(`name`,`description`)입니다.
- 에이전트별 차이가 있어도 `SKILL.md`만으로 기본 사용이 가능해야 합니다.
