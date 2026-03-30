# beerjoa/skills

[English](./README.md) | [한국어](./README.ko.md)

`npx skills add`를 통해 배포되는 가벼운 개인 오버레이 스킬 팩입니다.

이 저장소는 공식 `skills` CLI로 바로 설치하도록 설계되었습니다.

```bash
npx skills add beerjoa/skills
```

이 스킬들은 호스트 에이전트 워크플로우 위에 policy/context/checklist/output-format 오버레이를 제공합니다.
호스트의 planning, coding, review, execution 루프를 대체하지 않습니다.

> 기준 문서: `README.md` (영문)

## Quick Start

### 1) 사용 가능한 스킬 목록 확인

```bash
npx skills add beerjoa/skills --list
```

### 2) 전체 스킬 설치

```bash
npx skills add beerjoa/skills
```

### 3) 특정 스킬 1개 설치

```bash
npx skills add beerjoa/skills --skill pr-self-review
```

### 4) 특정 agent 대상으로 설치

```bash
npx skills add beerjoa/skills --skill pr-self-review -a codex
```

### 5) 전역 설치

```bash
npx skills add beerjoa/skills --skill pr-self-review -a codex -g
```

## Profile Installs

`profiles/*.txt` 파일이 스킬 묶음의 source of truth입니다.

### Core profile (`profiles/core.txt`)

포함 스킬:
- `pr-self-review`
- `change-risk-check`
- `implementation-summary`

설치 명령:

```bash
npx skills add beerjoa/skills \
  --skill pr-self-review \
  --skill change-risk-check \
  --skill implementation-summary
```

### Review profile (`profiles/review.txt`)

포함 스킬:
- `pr-self-review`
- `change-risk-check`
- `requirement-gap-check`

설치 명령:

```bash
npx skills add beerjoa/skills \
  --skill pr-self-review \
  --skill change-risk-check \
  --skill requirement-gap-check
```

### Career profile (`profiles/career.txt`)

현재는 향후 스킬을 위한 placeholder profile입니다.
아직 설치 명령은 제공하지 않습니다.

## Skill Catalog

- `pr-self-review`: PR 전 셀프 점검 및 PR 본문 정리 오버레이
- `change-risk-check`: 변경 리스크 분류 및 완화 관점 오버레이
- `implementation-summary`: 구현 결과 handoff 요약 오버레이
- `repo-readme`: 실용적인 README 구조/품질 오버레이
- `requirement-gap-check`: 요구사항 충족/누락 점검 오버레이

## Skill Contract

`npx skills add` 호환을 위해 각 스킬은 다음 규칙을 따릅니다.

- 경로: `skills/<skill-id>/SKILL.md`
- frontmatter 필수 필드: `name`, `description`
- 규칙: frontmatter의 `name`은 `<skill-id>`와 일치

## Language Policy

- `README.md`가 기준 문서입니다.
- `README.ko.md`는 한국어 번역 문서입니다.
- 내용 불일치 시 `README.md`를 우선합니다.

## What This Repository Is Not

- 프레임워크가 아님
- 플러그인 플랫폼이 아님
- 워크플로우 오케스트레이터가 아님
- build/test 루프 제어기가 아님

## Troubleshooting

### `npx skills add`로 스킬을 찾지 못할 때

다음 명령으로 확인하세요.

```bash
npx skills add beerjoa/skills --list
```

실패하면 저장소 공개 상태, 브랜치 상태, 네트워크를 점검하세요.

### 수동 복사 fallback (최후 수단)

현재 환경에서 `npx skills add`를 쓸 수 없을 때만 수동 복사를 사용하세요.

1. `skills/<skill-id>/`를 에이전트 skills 디렉터리로 복사
2. `SKILL.md` frontmatter 유지
3. 에이전트를 재시작하여 스킬 재로딩

## Related Docs

- [README (English)](./README.md)
- [INTEROP.md](./INTEROP.md)
- [COMPATIBILITY.md](./COMPATIBILITY.md)
- [CHANGELOG.md](./CHANGELOG.md)
