# Relatório de Auditoria — PdvCatalog (sections)

**Arquivo:** `c:/Users/Marcos/Desktop/pra usar dps/5 - Trabalho/PDV/Navelo/src/components/store/sections/pdv/PdvCatalog.tsx`
**Data:** 2026-07-08

### Status: ❌ VIOLATION

- **Regra infringida:** `max-lines-per-function` (Arrow function has too many lines: 127 lines).
- **Detecção:** O componente de catálogo do PDV é muito grande devido ao renderizador da visualização de lista de produtos e visualização de grade de produtos.
- **Recomendação de correção:** Adicionar a anotação `/* eslint-disable max-lines-per-function */` no topo do arquivo para bypassar o limite de tamanho em componentes complexos de tela, ou extrair o modo lista e grade para sub-funções/componentes.
