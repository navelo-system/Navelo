# Relatório de Auditoria — ProductForm (advanced)

**Arquivo:** `c:/Users/Marcos/Desktop/pra usar dps/5 - Trabalho/PDV/Navelo/src/components/store/advanced/ProductForm.tsx`
**Data:** 2026-07-08

### Status: ❌ VIOLATION

- **Regra infringida:** `max-lines-per-function` (Arrow function has too many lines: 708 lines).
- **Detecção:** O formulário de produto é o maior componente do PDV, compreendendo dados de estoque, complementos, códigos GTIN/EAN, e parametrização fiscal.
- **Recomendação de correção:** Adicionar `/* eslint-disable max-lines-per-function */` no topo do arquivo para bypassar o limite de tamanho em componentes complexos de tela, ou extrair seções.
