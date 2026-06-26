---
name: navelo-build-component
description: >
  Constrói componentes React/TypeScript seguindo rigorosamente o Design System
  do Navelo. Garante zero uso de className fora da camada base e o uso de 
  props semânticas estritas para composição.
---

# Navelo Build Component Skill

## Contexto e Responsabilidade
Esta skill orienta a construção ou refatoração de qualquer componente visual na arquitetura do Navelo (em `src/components/store/`). 

O foco absoluto desta skill é evitar o **HARD FAIL** definido nas regras do projeto:
> **"className é permitido EXCLUSIVAMENTE dentro da camada base."**

## Passo 1 — Identificação da Camada
Antes de escrever código, determine a camada do componente baseando-se em sua funcionalidade, e não em sua localização atual:

- **base:** O componente é um wrapper puro de tag HTML, define primitivas de layout ou tipografia, e aplica variáveis CSS Tailwind nativas?
- **intermediary:** O componente apenas combina dois ou mais `base` components em uma molécula reutilizável?
- **advanced:** O componente contém regras de negócio ou é uma composição complexa?
- **sections:** É um container primário na estrutura de layout de uma página?

## Passo 2 — Regras de Escrita (Construção)

### Se for camada `base`
- **Pode** usar `className` e classes utilitárias do Tailwind, integradas usando `cn` (clsx/tailwind-merge).
- **DEVE** expor props semânticas tipadas (ex: `padding`, `gap`, `w`, `h`, `bg`, `radius`, `border`) que abstraiam o acesso ao Tailwind para os consumidores.
- As props tipadas devem usar *Map Objects* estritos com tokens literais (ex: `padding={5}`, `gap={12.5}`).

### Se for camada `intermediary`, `advanced` ou `sections`
- **NUNCA** escreva a prop `className` no JSX.
- **NUNCA** use `style={{...}}`.
- O layout e aparência devem ser ditados **inteiramente** pelas props dos componentes `base` importados.
  - Para bordas: Use `Box` com props de borda ou construa um separador visual com `Box`.
  - Para espaçamentos: Use `Stack` ou `Grid` com prop `gap`. NUNCA use margens.
  - Para responsividade (ex: `hidden lg:flex`): Use props semânticas do `base` projetadas para isso (ex: `display="hidden lg:flex"` no `Box`).
  - Para hover states: Use props específicas de interação expostas no `base` (ex: `hoverEffect="sunken"` ou use o componente `Button`).
  
## Passo 3 — Code Review Interno antes do Salvamento
Você deve auditar mentalmente o código antes de usar a ferramenta de criação de arquivo:
1. Tem a palavra `className` no arquivo? Se sim, a camada é **base**? Se não for, falhe intencionalmente e reescreva.
2. Está passando `gap`, `padding` ou `rounded` usando números literais permitidos? (ex: 5, 12, 2.5). 

## Output Esperado
O arquivo final TypeScript (`.tsx`) salvo no diretório correspondente da sua camada sem violar nenhuma regra da constituição do Navelo.
