# Contracts

## Módulos principais
1. **Core:** RBAC, Usuários, Permissões, Multiempresa.
2. **PDV / Caixa:** Offline-first, Vendas, Emissão NFC-e.
3. **Restaurante:** Mesas, Comandas, Integração Cozinha (KDS).
4. **Delivery:** Pedidos online, Integração iFood/WhatsApp, Tracking.
5. **ERP Backoffice:** Estoque, Financeiro (DRE/Fluxo), Cadastros, Relatórios.

## Interfaces críticas
- **Supabase Realtime:** Sincronização entre operações offline-first e a nuvem.
- **Integração de Hardware:** Comunicação direta para WebToNative/Electron com impressoras e catracas.
- **Design System Layer:** Interface visual padronizada garantida pelo `RegistryMain` e componentes `store`.

## Regras de comunicação entre módulos
- **Event-Driven UI:** O frontend utiliza TanStack Query para gerir dados assíncronos e Zustand para estados globais (como carrinho/comandas ativas).

## Invariantes
- A árvore de UI **sempre** tem no topo um `RegistryMain`, seguido de `RegistrySection`.
- O banco de dados **sempre** separa dados baseado no `company_id` (Multi-tenant).
- Todos os usuários entram por um portal de login centralizado, sem acessos avulsos.

## Metadados
- Status: ATIVO
