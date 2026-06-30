# Prompt Library

## Document Metadata
- Project: IBMiHub AI
- Purpose: Reusable prompts for future AI assistants
- Version: 0.1
- Status: Draft
- Last Updated: 2026-06-30
- Owner: Both

---

## 1. Engineering Review Prompt

Use this when reviewing the product vision from an engineering perspective.

```text
You are the Lead Software Engineer and Technical Architect for this project.
Review the attached product vision and provide an engineering assessment.
Focus on:
- architecture recommendations
- risks
- missing technical decisions
- scalability concerns
- security concerns
- repository organization
- implementation readiness

Do not invent features.
Do not write application code.
Do not change product requirements.
```

---

## 2. Documentation Roadmap Prompt

Use this when preparing planning documents for Sprint 0.

```text
You are helping prepare the engineering and documentation foundation for a long-term SaaS product.
Create a documentation roadmap for the project before implementation begins.
Include:
- required documents
- purpose of each document
- audience
- dependencies
- priority
- owner
- open questions and risks

Do not create application code.
Do not make assumptions when requirements are unclear.
```

---

## 3. Create SDD Spec Prompt

Use this when drafting a feature specification.

```text
Create a Spec-Driven Development document for the requested feature.
The document must include:
- feature summary
- user stories
- business context
- functional requirements
- non-functional requirements
- success criteria
- dependencies
- open questions

Do not invent features beyond the approved scope.
Do not write implementation code.
```

---

## 4. Create Implementation Plan Prompt

Use this when turning a spec into an implementation plan.

```text
Create an implementation plan for the approved feature based on the SDD spec.
Include:
- scope boundaries
- implementation phases
- dependencies
- risks
- testing strategy
- rollout considerations

Do not change the product requirements.
Do not write code.
```

---

## 5. Create Task List Prompt

Use this when breaking a plan into execution tasks.

```text
Create a task list for the approved implementation plan.
Organize tasks by:
- preparation
- architecture
- implementation
- testing
- deployment

Keep tasks clear, actionable, and sequenced.
Do not add unapproved features.
```

---

## 6. Review Code Prompt

Use this when reviewing implementation work.

```text
Review the provided code for:
- correctness
- readability
- maintainability
- security risks
- testability
- alignment with the approved spec

Do not approve code that introduces unrequested scope or weak engineering practices.
```

---

## 7. Create ADR Prompt

Use this when documenting a major architectural decision.

```text
Create an Architecture Decision Record for the requested topic.
Include:
- context
- decision
- options considered
- reasoning
- consequences
- status

Keep the decision concise and explicit.
```

---

## 8. Update PROJECT_STATE.md Prompt

Use this when refreshing the current status of the project.

```text
Update PROJECT_STATE.md to reflect the current status of the project.
Include:
- project overview
- current phase and sprint
- progress made
- blockers
- risks
- open questions
- next actions
- last updated date

Keep the document concise and easy to update.
```

---

## 9. General AI Assistant Prompt

Use this as a fallback prompt for general project support.

```text
You are supporting a long-term SaaS product in Sprint 0 planning.
Work within the approved scope.
Do not invent requirements or features.
Ask questions when unclear.
Prioritize maintainability, security, and clear documentation.
Do not generate application code unless explicitly approved.
```
