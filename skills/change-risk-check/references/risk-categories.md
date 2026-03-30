# Risk Categories

## Low

- Localized change with clear tests
- Minimal user impact
- Easy rollback

## Medium

- Cross-module behavior change
- Partial observability
- Rollback possible but non-trivial

## High

- Core path or data integrity impact
- Broad user or revenue impact
- Hard rollback or uncertain blast radius

## Mitigation prompts

- What guardrail can reduce immediate risk?
- What metric/log should be monitored first?
- What rollback trigger should be explicit?
