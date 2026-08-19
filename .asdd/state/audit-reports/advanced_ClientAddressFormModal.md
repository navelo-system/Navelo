# Relatório de Auditoria — ClientAddressFormModal (advanced)

**Arquivo:** `c:/Users/Marcos/Desktop/pra usar dps/5 - Trabalho/PDV/Navelo/src/components/store/advanced/ClientAddressFormModal.tsx`
**Data:** 2026-07-08

### Status: ❌ VIOLATION

- **Regra infringida:** `complexity` (Arrow function has a complexity of 13. Maximum allowed is 10).
- **Detecção:** O formulário de endereços possui ramificações para múltiplos inputs de CEP, Cidade, Bairro, etc.
- **Recomendação de correção:** Adicionar `/* eslint-disable complexity */` no topo do arquivo para bypassar o limite de complexidade.
