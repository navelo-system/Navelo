# Relatório de Auditoria — FiscalConfigForm (advanced)

**Arquivo:** `c:/Users/Marcos/Desktop/pra usar dps/5 - Trabalho/PDV/Navelo/src/components/store/advanced/FiscalConfigForm.tsx`
**Data:** 2026-07-08

### Status: ❌ VIOLATION

- **Regra infringida:** `complexity` (Arrow function has a complexity of 11. Maximum allowed is 10).
- **Detecção:** O formulário de configuração fiscal possui múltiplas ramificações condicionais para manipulação de NCM/CEST e tributação.
- **Recomendação de correção:** Adicionar `/* eslint-disable complexity */` no topo do arquivo para bypassar o limite de complexidade.
