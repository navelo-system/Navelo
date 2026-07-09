# Technical Debt

<!-- Débitos catalogados no Ciclo #001. -->

## DEBT-001
- Identificado no ciclo: #001
- Arquivo: src/components/store/sections/admin/AdminOverviewSection.tsx
- Descrição: Tabela de tenants duplicada hardcoded. Mesmos dados de ClientesSection copiados manualmente.
- Impacto: Alto — dois locais de verdade para o mesmo dado.
- Resolução prevista: Extrair componente TenantListTable reutilizável.
