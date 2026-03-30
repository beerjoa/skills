# Interoperability Guide

`beerjoa/skills` is an overlay pack, not a workflow owner.

## Operational Principle

Install skills through the official flow:

```bash
npx skills add beerjoa/skills
```

Then apply each skill as guidance on top of your host agent workflow.

- Keep host planning/coding/review loops in control.
- Use these skills for policy/context/checklist/output-format support.
- Do not introduce mandatory hooks, custom orchestrators, or loop replacement logic.

## Adapt, Do Not Replace

When an existing tool already generated a draft, plan, review summary, or handoff:

- Adapt and refine the existing artifact.
- Keep strong parts and improve weak parts.
- Regenerate from scratch only when the original artifact is unusable.

## Interop Expectations During Installation

- Installation source is repository-based (`beerjoa/skills`) via `npx skills add`.
- Skill discovery is handled by the `skills` CLI.
- This repository focuses on skill content quality, not custom installer logic.

## Anti-Patterns

Do not turn this repository into:

- A framework for agent lifecycle control
- A central plugin runtime
- A build/deploy/test orchestration layer
- An agent-specific lock-in package

## Quick Interop Checklist

Before publishing updates:

- Does each skill still work from `SKILL.md` alone?
- Does the wording preserve host workflow ownership?
- Are support files optional reinforcement, not hard requirements?
- Is "adapt, do not replace" preserved in practical guidance?
