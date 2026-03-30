# Conventional Commits Guide (English)

## Goal

Keep commit messages consistent, readable, and automation-friendly.

This guide is based on the [Conventional Commits](https://www.conventionalcommits.org/) specification.

## Language Rule

- Keep `type`, `scope`, and footer tokens in Conventional Commits format.
- Write message text in English when this instruction is selected.
- If the user explicitly requests Korean, use the Korean instruction file instead.

## Basic Structure

```text
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

## Type

- `feat`: new feature
- `fix`: bug fix
- `docs`: documentation-only change
- `style`: formatting/style change without logic change
- `refactor`: code restructuring without behavior change
- `test`: test add/update
- `chore`: tooling, maintenance, operational updates
- `perf`: performance improvement
- `ci`: CI/CD pipeline change
- `build`: build system or dependency change
- `revert`: revert previous commit

## Scope

Use an optional scope in parentheses. Choose the narrowest useful module/component/feature boundary.

## Description

- Keep within 50 characters when possible.
- Start with lowercase.
- Do not end with a period.
- Prefer imperative or concise factual style.
- Reflect only what is verifiable from the staged diff.

## Body

- Wrap lines at 72 characters when possible.
- Explain what changed and why.
- Avoid line-by-line implementation narration.
- Use `-` bullets when listing multiple points.

## Footer

Use only when needed:

- `BREAKING CHANGE: <description>`
- `Closes #123`, `Fixes #456`, `Resolves #789`
- `Co-authored-by: name <email>`
