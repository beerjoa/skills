# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Added `extract-project-contributions`, the first `career` profile skill for source-grounded developer, planner, and designer project contribution extraction.
- Added `bruno-api`, a root-cataloged skill that generates or updates Bruno collections from backend source code for environment-level API validation.
- Added `bruno-api` guidance for `collection.bru`-aware output structure, final validation, and conservative update behavior for existing Bruno files.

## [0.1.2] - 2026-04-04

### Changed

- Shifted distribution model to official `npx skills add beerjoa/skills` usage.
- Reworked root docs around install-first flow with profile install commands.
- Moved manual copy guidance to troubleshooting-only fallback.
- Split README into English base (`README.md`) and Korean translation (`README.ko.md`).
- Removed Korean summary sections from non-README root docs for English-only base docs.

## [0.1.1] - 2026-03-30

### Added

- Added new `git-commit-from-instructions` overlay skill with `staged-only` and `agent-only` modes.
- Added language-specific commit instruction references:
  - `skills/git-commit-from-instructions/references/git-commit-instructions.ko.md`
  - `skills/git-commit-from-instructions/references/git-commit-instructions.md`

## [0.1.0] - 2026-03-30

### Added

- Initial overlay-skill catalog structure for `beerjoa/skills`.
- Root interoperability and compatibility documentation.
- Profile bundles for core, review, and future career overlays.
- Initial five overlay skills:
  - `pr-self-review`
  - `change-risk-check`
  - `implementation-summary`
  - `repo-readme`
  - `requirement-gap-check`
