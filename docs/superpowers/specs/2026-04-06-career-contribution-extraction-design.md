# Career Contribution Extraction Skill Design

Date: 2026-04-06
Status: Approved for planning

## Summary

Add the first new skill under the `career` profile to extract source-grounded project contribution data for resume workflows.

This skill does not generate resume bullets, platform-ready narratives, or polished experience statements. Its only job is to extract traceable contribution evidence from user-provided sources so downstream skills can transform that data later.

The skill will support a single entry point with explicit role selection:

- `developer`
- `planner`
- `designer`

Each run produces exactly one role-specific output file. Automatic role detection is out of scope for v1.

## Problem

The existing extraction workflow is effective for developers because it is grounded in `git log`, commit messages, and revision identifiers. That design does not transfer cleanly to non-developer roles, where evidence often comes from documents such as PRDs, meeting notes, PDFs, slide decks, and design artifacts.

We need a reusable skill that:

- preserves the strong grounding discipline of the current developer workflow
- extends extraction to planners and designers
- keeps traceability explicit
- separates raw evidence extraction from later rewriting steps

## Goals

- Create a `career` profile skill for extracting source-grounded project contribution data.
- Reuse the existing developer extraction model as much as possible.
- Add a separate non-developer output format for planners and designers.
- Support file inputs and folder-path inputs for non-developer evidence.
- Preserve traceability from every extracted item back to a concrete source location.
- Keep ambiguous or weak evidence out of the main extraction table.

## Non-Goals

- Resume bullet writing
- Job-description tailoring
- Hiring-platform field rewriting
- Portfolio storytelling
- Automatic role inference
- Broad support for all non-developer job families in v1
- External system export support such as Notion, Figma, or Jira exports in v1

## Approved Scope

### Roles

Supported in v1:

- `developer`
- `planner`
- `designer`

Not supported in v1:

- generic non-developer extraction beyond planner/designer
- mixed-role extraction in a single run

### Inputs

Developer mode:

- repository path
- optional scope hints such as author, branch, date range, path, or service area

Planner and designer modes:

- one or more attached files
- one or more local file paths
- one or more folder paths

Supported evidence formats for non-developer mode are file-based only. Folder support is included so the skill can process a set of related files in one run.

### Output behavior

- The user must explicitly choose a role or mode.
- The skill generates one output per run.
- The output is raw, source-grounded extraction data only.
- Any narrative rewriting is delegated to a different skill.

## Design Decisions

### 1. Single skill entry point with role-based routing

The skill should be implemented as one skill, not multiple sibling skills.

Reasoning:

- the user intent is stable across roles: extract grounded contribution evidence for career materials
- common guardrails should live in one place
- the trigger surface is simpler if the user learns one skill name
- role-specific rules can be separated into references and templates without forcing separate installations

### 2. Separate output templates for developer and non-developer modes

Developer and non-developer outputs should not be forced into one unified table.

Reasoning:

- the output is intended to be a source-of-truth artifact, not a presentation layer
- developer traceability depends on git-native identifiers
- non-developer traceability depends on file-native location markers
- keeping outputs separate preserves clarity and prevents awkward lowest-common-denominator fields

### 3. Preserve the existing developer output unless improvement is clearly justified

The developer output should remain largely intact.

Allowed changes:

- only small changes to clearly common fields
- only when the change improves developer traceability or downstream reuse on its own merits

Disallowed changes:

- broad schema redesign merely to make it look more like the non-developer output
- weakening git-based grounding

### 4. Evidence Source + Locator is the non-developer traceability model

Non-developer output replaces git-native identifiers with a file-native traceability pair:

- `Evidence Source`
- `Locator`

Examples:

- `Evidence Source: prd_v3.pdf`, `Locator: p.12`
- `Evidence Source: checkout-flow.pptx`, `Locator: slide 8`
- `Evidence Source: weekly-sync.md`, `Locator: heading: Launch Risks`

This pair is the minimum requirement for an extracted non-developer row.

## Proposed File Layout

```text
skills/extract-project-contributions/
├── SKILL.md
├── templates/
│   ├── developer-project-contributions.md
│   └── nondeveloper-project-contributions.md
└── references/
    ├── developer-extraction-rules.md
    ├── planner-extraction-rules.md
    └── designer-extraction-rules.md
```

The skill will also be registered under:

```text
profiles/career.txt
```

## Skill Responsibilities

`SKILL.md` should do only the following:

- explain when the skill should trigger
- require explicit role or mode selection
- identify the relevant input type for the chosen role
- route the agent to the correct reference and template
- enforce grounding, ambiguity handling, and non-rewriting rules

Role-specific evidence interpretation should live in the reference files, not in the top-level skill body.

## Output Contracts

### Developer output

The current developer-oriented structure remains the default baseline:

- `Target`
- `Bullet Summary`
- `Structured View`
- `Excluded Or Ambiguous Items`
- `Gaps`

`Bullet Summary` is retained for backward compatibility with the existing workflow. It must remain tightly grounded in the same evidence and should not drift into resume-style rewriting. The structured view remains the primary source-of-truth section.

The current git-grounded row model stays intact unless a field change is clearly warranted:

| Commit or Group | Contribution Type | What I Did | Result or Outcome | Service or Tech Context | Confidence Notes |
| --- | --- | --- | --- | --- | --- |

Developer traceability continues to rely on:

- commit hash
- commit title or grouped topic
- git filters such as author, date range, branch, or path

### Non-developer output

Non-developer mode uses a separate template with file-based traceability.

Suggested structure:

- `Target`
- `Evidence Scope`
- `Structured View`
- `Excluded Or Ambiguous Items`
- `Gaps`

Suggested row model:

| Evidence Source | Locator | Contribution Type | What I Did | Result or Outcome | Artifact or Context | Confidence Notes |
| --- | --- | --- | --- | --- | --- | --- |

Field intent:

- `Evidence Source`: file name or stable source label
- `Locator`: page, slide, section, heading, or other concrete in-file position
- `Contribution Type`: common enum or role-specific extension enum
- `What I Did`: direct, source-grounded work performed by the user
- `Result or Outcome`: only explicitly stated results or produced artifacts
- `Artifact or Context`: feature, initiative, document, screen, or project context needed for interpretation
- `Confidence Notes`: `explicit`, `partial`, or a short weakening note

## Contribution Type Model

Use a shared base enum with role-specific extension values.

### Shared base enum

- `research`
- `planning`
- `specification`
- `iteration`
- `handoff`
- `operations`

### Planner extension enum

- `requirements-definition`
- `policy-or-process-design`
- `roadmap-or-priority`
- `stakeholder-alignment`
- `metric-or-kpi-definition`

### Designer extension enum

- `ux-flow-design`
- `information-architecture`
- `wireframing`
- `visual-design`
- `design-system`
- `prototype`
- `asset-production`

### Type selection rules

- Prefer a shared base enum when it is sufficient.
- Use a role-specific extension only when it adds meaningful precision.
- Avoid attaching many types to a single row.
- When evidence is ambiguous, choose the weaker broader type.

## Role-Specific Extraction Rules

### Developer mode

Developer mode should preserve the current workflow philosophy:

- search `git log` first
- use commit messages and revision identifiers as the primary evidence
- use touched paths and repository structure only for grouping and interpretation
- do not inspect diffs unless the user explicitly asks for diff-based analysis
- do not strengthen claims beyond what the commit messages support

### Planner mode

Planner mode should prioritize:

- PRDs
- requirement documents
- policy or process documents
- prioritization or roadmap artifacts
- meeting notes when they contain concrete authored decisions

Extraction rules:

- ground rows in explicit acts such as defining requirements, aligning stakeholders, setting priorities, documenting policies, or specifying metrics
- weaken ownership when a document shows discussion but not clear authorship
- keep intended deliverables or stated decisions, but do not invent execution outcomes

### Designer mode

Designer mode should prioritize:

- wireframes
- UX flow documents
- slide decks describing screens or flows
- visual specifications
- design review notes
- prototype descriptions

Extraction rules:

- ground rows in explicit acts such as designing flows, restructuring IA, producing visual directions, defining components, or iterating on screens
- retain file and locator evidence for every row
- keep outcome wording weak unless the evidence explicitly states a validated result

## Shared Guardrails

- Do not infer contribution ownership from a file name alone.
- Do not infer impact from artifact volume.
- Do not infer leadership, final ownership, or business results unless stated.
- Do not upgrade weak evidence into the main structured table.
- Put ambiguous or excluded items into `Excluded Or Ambiguous Items`.
- Preserve gaps when stronger wording would require missing facts.
- Keep the output as extraction data, not resume prose.

## Execution Flow

1. Confirm the user wants grounded contribution extraction rather than rewritten career bullets.
2. Require explicit role selection: `developer`, `planner`, or `designer`.
3. Confirm input scope:
   - repo path and git filters for developer mode
   - files or folders for planner/designer mode
4. Load only the matching role reference and output template.
5. Collect evidence from the permitted sources.
6. Remove obvious noise or weak artifacts.
7. Extract only traceable direct contributions and explicitly supported outcomes.
8. Write one role-specific output artifact.
9. Record excluded items and gaps separately.

## Triggering Guidance

The skill should trigger aggressively when the user wants source-grounded contribution extraction for career materials and can provide evidence sources such as:

- a repository
- `git log` scope hints
- PDFs
- slide decks
- meeting notes
- PRDs
- folders of design or planning artifacts

Representative trigger situations:

- “Extract what I actually did in this project for my resume.”
- “Use git history to pull out my contributions from this repo.”
- “I have PRDs and meeting notes for this project. Extract only the work I did.”
- “Read this design folder and organize my contribution evidence before I update my experience section.”

The skill should not be the final step when the user wants:

- polished resume bullets
- hiring-platform rewrite
- interview answer drafting
- JD-specific tailoring

Those should be handled by downstream skills using this output as input.

## Test Strategy

Start with three eval tracks:

1. Developer eval
   - existing repo input
   - explicit git scope hints
   - confirm the current developer output quality is preserved

2. Planner eval
   - folder containing PRD, meeting notes, and prioritization artifacts
   - confirm locator-based non-developer extraction works

3. Designer eval
   - folder containing mixed `pptx`, `pdf`, and `md` artifacts
   - confirm file-based traceability remains explicit for every extracted row

Suggested qualitative checks:

- the correct template is chosen for the explicit role
- every non-developer row contains both `Evidence Source` and `Locator`
- weak evidence is kept out of the main structured table
- developer output remains git-grounded and materially unchanged
- output stays factual and pre-rewriting

Suggested quantitative checks:

- template sections are present
- non-developer rows have non-empty source and locator fields
- excluded items are captured separately when evidence is insufficient

## Risks And Mitigations

### Risk: non-developer evidence is too weak to support strong claims

Mitigation:

- require explicit locators
- weaken wording by default
- record ambiguity instead of inventing certainty

### Risk: trying to unify all roles forces a bad schema

Mitigation:

- keep a single skill entry point
- keep separate developer and non-developer output templates

### Risk: users expect polished resume language from this skill

Mitigation:

- state clearly in description and body that this skill produces source-of-truth extraction data only
- explicitly route rewriting tasks to downstream skills

## Deferred Work

- support for additional non-developer roles
- support for exported external systems
- optional shared normalization layer if later downstream skills benefit from it
- description optimization after the skill behavior is stable
