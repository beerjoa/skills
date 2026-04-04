# beerjoa/skills

[English](./README.md) | 한국어

`npx skills add`를 통해 배포되는 가벼운 개인 오버레이 스킬 팩입니다.

이 스킬들은 호스트 에이전트 워크플로우 위에 policy/context/checklist/output-format 오버레이를 제공합니다.
호스트의 planning, coding, review, execution 루프를 대체하지 않습니다.

> 기준 문서: `README.md` (영문)

## 설치

### npx skills add 사용

```bash
npx skills add beerjoa/skills
```

CLI 상세 사용법은 [vercel-labs/skills](https://github.com/vercel-labs/skills)를 참고하세요.

### 수동 설치

1. `skills/<skill-id>/`를 에이전트 skills 디렉터리로 복사합니다.
2. `SKILL.md` frontmatter를 유지합니다.
3. 에이전트를 재시작하여 스킬을 재로딩합니다.

## 스킬 목록

| 스킬 | 설명 |
|------|------|
| `pr-self-review` | PR을 열거나 업데이트하기 전에 변경 범위를 검토하고, 미해결 리스크를 표시하며, 깔끔한 PR 본문을 작성합니다. |
| `change-risk-check` | 머지 또는 릴리스 전에 변경 리스크 수준을 분류하고, 잠재적 장애 원인을 식별하며, 완화 방안을 제시합니다. |
| `implementation-summary` | 변경 완료 후 무엇을 구현했고, 무엇을 검증했으며, 어떤 후속 작업이 남았는지를 구체적으로 요약합니다. |
| `repo-readme` | 실용적인 온보딩을 위해 README 구조와 명확성을 개선합니다. 명령 예시는 정확하게 유지하고 추상적인 내용은 제거합니다. |
| `requirement-gap-check` | 각 요구사항을 구현 근거와 매핑하고, 리뷰 또는 handoff 전에 미충족되거나 모호한 항목을 표면화합니다. |
| `git-commit-from-instructions` | 저장소별 커밋 규칙에 따라 커밋 메시지를 생성하고, staged 또는 에이전트가 작성한 변경사항만 커밋합니다. |

## Related Docs

- [README (English)](./README.md)
- [INTEROP.md](./INTEROP.md)
- [COMPATIBILITY.md](./COMPATIBILITY.md)
- [CHANGELOG.md](./CHANGELOG.md)
