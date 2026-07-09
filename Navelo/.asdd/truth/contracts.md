# Contracts

## Módulos principais
- src/types/domain.ts — Fonte única de verdade para todas as entidades de domínio
- src/components/store/base/ — Componentes primitivos do Design System
- src/components/store/intermediary/ — Composições intermediárias
- src/components/store/advanced/ — Componentes avançados com lógica
- src/components/store/sections/ — Seções de página completas

## Interfaces críticas
- Toda entidade de domínio DEVE ser importada de src/types/domain.ts
- Nenhum componente fora de base/ pode definir interfaces locais para entidades de domínio

## Regras de comunicação entre módulos
- sections/ consomem advanced/ e intermediary/ apenas
- advanced/ consomem intermediary/ e base/ apenas
- intermediary/ consomem base/ apenas
- base/ não importa nada de fora de si mesmo

## Invariantes
- domain.ts é a lei — nenhum campo pode ser inventado fora dele

## Metadados
- Status: ATIVO
