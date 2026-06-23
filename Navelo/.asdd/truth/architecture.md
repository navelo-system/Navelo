# Architecture Decisions
<!-- Preenchido pelo Bootstrap Wizard e atualizado por ciclos
     do tipo truth-revision. Não editar manualmente. -->

## Stack detectada
TypeScript, Next.js (React), TailwindCSS, configurado com npm

## Decisões registradas
<!-- Formato obrigatório para cada decisão:
     ### ADR-NNN: Título
     - Data:
     - Contexto:
     - Decisão:
     - Alternativas rejeitadas:
     - Consequências:
-->

### ADR-000: Adoção da metodologia ASDD
- Data: 2026-06-23
- Contexto: Projeto adotou ASDD como metodologia de desenvolvimento
            orientada a agentes.
- Decisão: Implementar o ASDD Runtime via autoimplementação por
           Master Prompt executado no Antigravity.
- Alternativas rejeitadas: Desenvolvimento linear sem metodologia
                            formal de governança.
- Consequências: Todo desenvolvimento futuro segue o ciclo ASDD.
                 Nenhum código é escrito sem passar pelo Harness.
