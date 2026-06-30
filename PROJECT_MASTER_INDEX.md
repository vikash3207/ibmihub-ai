# Project Master Index

## Document Metadata
- Project: IBMiHub AI
- Document Purpose: Master navigation document for the repository
- Version: 0.1
- Status: Draft
- Last Updated: 2026-06-30
- Owner: Both

---

## 1. Vision Documents

| Document | Purpose | Owner | Status | Location | Dependencies |
|---|---|---|---|---|---|
| Product Vision | Captures the long-term vision and product direction | Product | Draft | [IBMiHub_AI_Project_Journal_v0.1.md](IBMiHub_AI_Project_Journal_v0.1.md) | None |
| Product Strategy | To be defined | Product | NOT STARTED | docs/product-strategy.md | Product Vision |

---

## 2. Business Documents

| Document | Purpose | Owner | Status | Location | Dependencies |
|---|---|---|---|---|---|
| Business Model | To be defined | Product | NOT STARTED | docs/business-model.md | Product Vision |
| Market Positioning | To be defined | Product | NOT STARTED | docs/market-positioning.md | Product Vision |
| Pricing Strategy | To be defined | Product | NOT STARTED | docs/pricing-strategy.md | Business Model |

---

## 3. Product Documents

| Document | Purpose | Owner | Status | Location | Dependencies |
|---|---|---|---|---|---|
| MVP Scope | Defines the initial release scope | Both | NOT STARTED | docs/mvp-scope.md | Product Vision |
| PRD | Master Product Requirements Document — single source of truth for all product decisions | Product | Draft (Structure Only) | [PRD.md](PRD.md) | Product Vision |
| User Personas | To be defined | Product | NOT STARTED | docs/personas.md | PRD |
| User Journeys | To be defined | Product | NOT STARTED | docs/user-journeys.md | PRD |

---

## 4. Architecture Documents

| Document | Purpose | Owner | Status | Location | Dependencies |
|---|---|---|---|---|---|
| Engineering Review | Engineering analysis and architecture guidance | Engineering | Draft | [docs/engineering-review.md](docs/engineering-review.md) | Product Vision |
| Architecture Overview | To be defined | Engineering | NOT STARTED | docs/architecture-overview.md | Engineering Review |
| ADR Log | Architecture decision records | Engineering | NOT STARTED | docs/adr/ | Engineering Review |
| Non-Functional Requirements | To be defined | Engineering | NOT STARTED | docs/non-functional-requirements.md | Architecture Overview |

---

## 5. Engineering Documents

| Document | Purpose | Owner | Status | Location | Dependencies |
|---|---|---|---|---|---|
| Sprint 0 Documentation Roadmap | Master checklist for pre-Sprint 1 planning | Engineering | Draft | [docs/sprint0-documentation-roadmap.md](docs/sprint0-documentation-roadmap.md) | Product Vision |
| Project State | Current status snapshot | Both | Draft | [PROJECT_STATE.md](PROJECT_STATE.md) | Sprint 0 Roadmap |
| Repository Structure Guide | To be defined | Engineering | NOT STARTED | docs/repository-structure.md | Architecture Overview |
| Development Standards | To be defined | Engineering | NOT STARTED | docs/development-standards.md | Repository Structure Guide |

---

## 6. Specifications

| Document | Purpose | Owner | Status | Location | Dependencies |
|---|---|---|---|---|---|
| Product Vision Spec | Initial product spec | Both | Draft | specs/000-product-vision.md | Product Vision |
| Authentication Spec | To be defined | Both | NOT STARTED | specs/001-authentication.md | PRD |
| AI Tutor Spec | To be defined | Both | NOT STARTED | specs/002-ai-tutor.md | PRD |
| Learning Center Spec | To be defined | Both | NOT STARTED | specs/003-learning-center.md | PRD |
| RPG Playground Spec | To be defined | Both | NOT STARTED | specs/004-rpg-playground.md | PRD |
| 5250 Lab Spec | To be defined | Both | NOT STARTED | specs/005-5250-lab.md | PRD |

---

## 7. Sprint Planning

| Document | Purpose | Owner | Status | Location | Dependencies |
|---|---|---|---|---|---|
| Sprint 0 Plan | Current planning sprint | Both | Draft | docs/sprint0-documentation-roadmap.md | Project Vision |
| Sprint 1 Plan | To be defined | Both | NOT STARTED | plans/sprint-1-plan.md | Sprint 0 Plan |
| Sprint Backlog | To be defined | Engineering | NOT STARTED | tasks/sprint-1-backlog.md | Sprint 1 Plan |

---

## 8. Meeting Notes

| Document | Purpose | Owner | Status | Location | Dependencies |
|---|---|---|---|---|---|
| Sprint 0 Notes | To be defined | Both | NOT STARTED | meetings/sprint0-notes.md | Sprint 0 Plan |
| Product Review Notes | To be defined | Both | NOT STARTED | meetings/product-review-notes.md | PRD |

---

## 9. Decision Records (ADR)

| Document | Purpose | Owner | Status | Location | Dependencies |
|---|---|---|---|---|---|
| ADR Index | Index of architecture decisions | Engineering | NOT STARTED | docs/adr/README.md | Architecture Overview |
| ADR-001 | To be defined | Engineering | NOT STARTED | docs/adr/001-template.md | ADR Index |

---

## 10. Research

| Document | Purpose | Owner | Status | Location | Dependencies |
|---|---|---|---|---|---|
| AI Provider Research | To be defined | Engineering | NOT STARTED | research/ai-provider-research.md | Architecture Overview |
| 5250 Simulator Research | To be defined | Engineering | NOT STARTED | research/5250-simulator-research.md | Architecture Overview |
| IBM i Content Strategy | To be defined | Product | NOT STARTED | research/ibmi-content-strategy.md | Product Vision |

---

## 11. Marketing

| Document | Purpose | Owner | Status | Location | Dependencies |
|---|---|---|---|---|---|---|
| Messaging Framework | To be defined | Product | NOT STARTED | marketing/messaging-framework.md | Product Vision |
| Launch Plan | To be defined | Product | NOT STARTED | marketing/launch-plan.md | Messaging Framework |

---

## 12. Testing

| Document | Purpose | Owner | Status | Location | Dependencies |
|---|---|---|---|---|---|---|
| Testing Strategy | To be defined | Engineering | NOT STARTED | testing/testing-strategy.md | Architecture Overview |
| QA Checklist | To be defined | Engineering | NOT STARTED | testing/qa-checklist.md | Testing Strategy |

---

## 13. Deployment

| Document | Purpose | Owner | Status | Location | Dependencies |
|---|---|---|---|---|---|---|
| Deployment Plan | To be defined | Engineering | NOT STARTED | deployment/deployment-plan.md | Architecture Overview |
| Environment Strategy | To be defined | Engineering | NOT STARTED | deployment/environment-strategy.md | Deployment Plan |

---

## 14. Release Notes

| Document | Purpose | Owner | Status | Location | Dependencies |
|---|---|---|---|---|---|---|
| Release Notes Template | To be defined | Both | NOT STARTED | release-notes/template.md | Product Release |

---

## 15. Future Roadmap

| Document | Purpose | Owner | Status | Location | Dependencies |
|---|---|---|---|---|---|---|
| Long-Term Roadmap | To be defined | Product | NOT STARTED | docs/roadmap.md | Product Vision |
| Platform Evolution Plan | To be defined | Both | NOT STARTED | docs/platform-evolution-plan.md | Long-Term Roadmap |

---

## 16. Revision History

| Date | Version | Summary |
|---|---|---|
| 2026-06-30 | 0.1 | Initial draft of project master index |
| 2026-06-30 | 0.2 | Registered PRODUCT_REQUIREMENTS.md (PRD) as Draft, structure only; updated User Personas dependency to PRD |
| 2026-06-30 | 0.3 | Updated PRD link to PRD.md following rename from PRODUCT_REQUIREMENTS.md |
