# Conventions

## Convenções de código
- **React Components (ASDD Binding):** Sempre que o ASDD (Planner/Builder) for criar ou modificar componentes visuais, é **OBRIGATÓRIO** invocar e obedecer à skill `build-component` (disponível no plugin do RepTrail que governa este projeto). O `asdd-builder` NUNCA deve iniciar a codificação de um componente sem antes absorver as regras da skill `build-component`.
- **Atomic Design:** Devem ser construídos exclusivamente dentro do atomic design da `store`. Nenhuma estilização utilitária dispersa nas páginas é aceita.
- **Props:** Componentes avançados só recebem props semânticas e dados de negócio. A injeção de tokens de design ocorre apenas na camada `base`.
- **Gestão de Estado:** Zustand para estado síncrono e UI, TanStack Query para dados assíncronos puxados do Supabase.

## Convenções de arquitetura
- O código em `Navelo/src/components/store` é a **Single Source of Truth** visual e arquitetural para frontend. 
- O modo offline deve ser resolvido e sincronizado antes da confirmação final do componente online. O app não pode quebrar ao perder a rede.

## Metadados
- Status: ATIVO
