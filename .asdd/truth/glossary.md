# Glossary

## Termos do ASDD Runtime

### Ciclo
Uma iteração completa do fluxo ASDD, iniciada por um prompt do
desenvolvedor e encerrada após APPROVING. Identificado por número
sequencial no cycle-log.

### Artefato
O diretório `.asdd/` e todos os seus arquivos. É a memória
externalizada do projeto.

### Truth
Os arquivos em `.asdd/truth/`. Representam o contrato imutável
do projeto. Alterações requerem ciclo do tipo truth-revision.

### Handoff
A transferência de output de um agente para o input do próximo,
mediada pelo Harness.

### Whitelist
Lista de arquivos que o Builder está autorizado a modificar em
um ciclo específico. Definida pelo Planner.

### Blacklist
Lista de arquivos explicitamente proibidos de modificação em
um ciclo específico. Definida pelo Planner.

## Termos do projeto
- **Single App:** Conceito onde a mesma base de código resolve todas as interfaces do ecossistema.
- **Whitelabel:** Capacidade da aplicação de mudar de cores e identidade visual sem mudança de código (baseado na empresa locatária).
- **Store Layer:** Pasta `src/components/store` que abriga o design system restrito do Navelo, baseado em atomic design (base, intermediary, advanced, sections).
- **FED (Framework de Execução Determinística):** Metodologia contratual que exige que o projeto seja entregue em fases (ex: Fase 1 = Esqueleto).
- **Offline-First:** Sistema resiliente do PDV, capaz de rodar integralmente sem internet e sincronizar com o Supabase de forma assíncrona.
