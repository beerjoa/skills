# Planner Extraction Rules

Use document-based evidence with explicit locators.

## Preferred sources

- PRDs
- requirement documents
- policy or process docs
- roadmap or prioritization docs
- meeting notes with authored decisions

## Shared base contribution types

- `research`
- `planning`
- `specification`
- `iteration`
- `handoff`
- `operations`

## Planner extension contribution types

- `requirements-definition`
- `policy-or-process-design`
- `roadmap-or-priority`
- `stakeholder-alignment`
- `metric-or-kpi-definition`

## Extraction rules

- Every structured row must include both `Evidence Source` and `Locator`.
- Ground rows in explicit acts such as defining requirements, aligning stakeholders, setting priorities, documenting policy, or specifying metrics.
- Keep intended deliverables or decisions only when they are stated in the evidence.
- Weaken authorship when a meeting note shows discussion but not clear ownership.
- Do not infer product impact or delivery success without explicit support.

## Output rules

- Default output path: `experience_output_nondeveloper.md`
- Use the non-developer template.
- Put weak items into `Excluded Or Ambiguous Items`.
