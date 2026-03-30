# Conventional Commits 가이드라인 (한국어)

## 목적

커밋 메시지를 일관되게 작성해 변경 의도를 명확히 전달하고, 자동화 도구와의 호환성을 유지합니다.

이 문서는 [Conventional Commits](https://www.conventionalcommits.org/) 명세를 기반으로 합니다.

## 언어 규칙

- `type`, `scope`, footer 토큰은 Conventional Commits 형식을 유지합니다.
- 설명문(본문)은 기본적으로 한국어로 작성합니다.
- 사용자가 영어를 명시적으로 요청한 경우에는 영어 instruction을 사용합니다.

## 기본 구조

```text
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

## Type

- `feat`: 새로운 기능 추가
- `fix`: 버그 수정
- `docs`: 문서 변경
- `style`: 포맷팅 변경
- `refactor`: 기능 변경 없는 리팩토링
- `test`: 테스트 코드 추가 또는 수정
- `chore`: 빌드/도구/운영성 변경
- `perf`: 성능 개선
- `ci`: CI/CD 변경
- `build`: 빌드 시스템/의존성 변경
- `revert`: 이전 커밋 되돌리기

## Scope

영향 범위를 괄호로 감쌉니다. 모듈/컴포넌트/기능 중 가장 설명력이 높은 최소 범위를 선택합니다.

## Description

- 50자 이내를 권장합니다.
- 소문자로 시작합니다.
- 마침표 없이 끝냅니다.
- 명령형 또는 간결한 서술형으로 작성합니다.
- staged diff에 근거한 사실만 작성합니다.

## Body

- 각 줄은 72자 이내를 권장합니다.
- 무엇을 왜 바꿨는지 간결히 설명합니다.
- 구현 세부사항 나열은 피합니다.
- 여러 항목이면 `-` 목록으로 정리합니다.

## Footer

필요한 경우에만 사용합니다.

- `BREAKING CHANGE: <description>`
- `Closes #123`, `Fixes #456`, `Resolves #789`
- `Co-authored-by: name <email>`
