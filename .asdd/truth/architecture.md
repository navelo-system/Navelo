# Architecture Decisions

## Stack detectada
- Frontend: Next.js (React), TypeScript, TailwindCSS, Shadcn/UI, TanStack Query, Zustand, Zod
- Backend: NestJS, Prisma ORM
- Cloud/DB: Supabase (PostgreSQL), Redis, BullMQ
- Empacotadores: WebToNative (Mobile), Electron (Desktop)

## Decisões registradas

### ADR-000: Adoção da metodologia ASDD
- Data: 2026-06-23
- Contexto: Projeto adotou ASDD como metodologia de desenvolvimento orientada a agentes.
- Decisão: Implementar o ASDD Runtime via autoimplementação por Master Prompt executado no Antigravity.
- Alternativas rejeitadas: Desenvolvimento linear sem metodologia formal de governança.
- Consequências: Todo desenvolvimento futuro segue o ciclo ASDD. Nenhum código é escrito sem passar pelo Harness.

### ADR-001: Arquitetura Frontend em Camadas (Atomic Design Estrito)
- Data: 2026-06-23
- Contexto: O sistema precisa de consistência visual extrema, facilitando o modo Whitelabel e a criação de componentes padronizados em larga escala.
- Decisão: Adoção do padrão `store` com quatro camadas: `base`, `intermediary`, `advanced` e `sections`. O uso de Tailwind (`className`) é estritamente restrito à camada `base`.
- Alternativas rejeitadas: Uso de classes utilitárias dispersas e componentes fracamente acoplados.
- Consequências: Criação de um gargalo inicial de refatoração de componentes legados para o formato estrito, mas garantindo governança total no longo prazo.

### ADR-002: Single App Multi-Interface
- Data: 2026-06-23
- Contexto: Necessidade de suportar múltiplos papéis (Caixa, Admin, Totem, Mobile, SmartPOS).
- Decisão: Criação de uma aplicação única que resolve dinamicamente as permissões e exibe a interface correta baseada no token do usuário.
- Alternativas rejeitadas: Criar e dar deploy em múltiplos apps separados (App do Garçom, App do Gestor).
- Consequências: Centralização de lógicas e tipagens, reduzindo complexidade de manutenção.

### ADR-003: Motor de Whitelabel via Variáveis CSS
- Data: 2026-06-23
- Contexto: Necessidade de customização de marca (cores) em runtime por empresa cliente.
- Decisão: Usar tokens CSS em vez de tokens build-time do Tailwind para injetar dinamicamente as cores de `brand-primary` e `brand-secondary`.
- Alternativas rejeitadas: Compilar temas diferentes ou usar inline styles para cores dinâmicas.
- Consequências: O uso de hardcoded colors no Tailwind (ex: `bg-red-500`) é proibido; deve-se usar as abstrações de variáveis do sistema.
