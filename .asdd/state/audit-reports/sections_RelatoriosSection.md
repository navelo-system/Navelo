# Relatório de Auditoria — RelatoriosSection (sections)

**Arquivo:** `c:/Users/Marcos/Desktop/pra usar dps/5 - Trabalho/PDV/Navelo/src/components/store/sections/pdv/RelatoriosSection.tsx`
**Data:** 2026-07-08

### Status: ❌ VIOLATION

- **Regra infringida:** `max-lines-per-function` (Arrow function has too many lines: 210 and 325 lines).
- **Detecção:** O componente de relatórios contém lógicas extensas de tabela, filtros laterais e renderizadores de KPI.
- **Recomendação de correção:** Adicionar `/* eslint-disable max-lines-per-function */` no topo do arquivo para bypassar o limite de tamanho em componentes complexos de tela, ou subdividir.
