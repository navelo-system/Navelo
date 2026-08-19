# Relatório de Auditoria — PdvCheckoutPayment (sections)

**Arquivo:** `c:/Users/Marcos/Desktop/pra usar dps/5 - Trabalho/PDV/Navelo/src/components/store/sections/pdv/PdvCheckoutPayment.tsx`
**Data:** 2026-07-08

### Status: ❌ VIOLATION

- **Regra infringida:** `max-lines-per-function` (Arrow function has too many lines: 173 lines).
- **Detecção:** O componente de finalização de pagamento é muito grande por agrupar formulários de troco, descontos e listagem de pagamentos.
- **Recomendação de correção:** Adicionar `/* eslint-disable max-lines-per-function */` no topo do arquivo para bypassar o limite de tamanho em componentes complexos de tela, ou subdividir.
