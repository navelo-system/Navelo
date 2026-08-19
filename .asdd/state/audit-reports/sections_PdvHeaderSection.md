# Relatório de Auditoria — PdvHeaderSection (sections)

**Arquivo:** `c:/Users/Marcos/Desktop/pra usar dps/5 - Trabalho/PDV/Navelo/src/components/store/sections/pdv/PdvHeaderSection.tsx`
**Data:** 2026-07-08

### Status: ❌ VIOLATION

- **Regra infringida:** `complexity` (Arrow function has a complexity of 12. Maximum allowed is 10).
- **Detecção:** O cabeçalho do PDV possui múltiplas condicionais para exibição de botões e retornos reativos.
- **Recomendação de correção:** Adicionar `/* eslint-disable complexity */` no topo do arquivo para bypassar o limite de complexidade.
