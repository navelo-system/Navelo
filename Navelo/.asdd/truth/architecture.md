# Architecture Decisions
<!-- Preenchido pelo Bootstrap Wizard e atualizado por ciclos
     do tipo truth-revision. Não editar manualmente. -->

## Stack detectada
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- React
- ESLint (custom Design System rules)

## Decisões registradas

### ADR-000: Adoção da metodologia ASDD
- Data: 2026-07-06
- Contexto: Projeto adotou ASDD como metodologia de desenvolvimento orientada a agentes.
- Decisão: Implementar o ASDD Runtime via autoimplementação por Master Prompt executado no Antigravity.
- Alternativas rejeitadas: Desenvolvimento linear sem metodologia formal de governança.
- Consequências: Todo desenvolvimento futuro segue o ciclo ASDD. Nenhum código é escrito sem passar pelo Harness.

### ADR-001: Design System Atomic — Camadas base/intermediary/advanced/sections
- Data: 2026-07-06
- Contexto: Projeto Navelo usa arquitetura de componentes em camadas.
- Decisão: Tags primitivas HTML apenas na camada base/. Fora disso, somente componentes do Design System.
- Consequências: ESLint enforça violações automaticamente.

### ADR-002: Zero Margins — Gap exclusivo para espaçamento
- Data: 2026-07-06
- Contexto: Design system proíbe uso de margin em qualquer componente.
- Decisão: Todo espaçamento entre elementos via gap em Stack ou Grid.
