# Constraints

## Proibições absolutas do ASDD Runtime
- Nunca modificar truth/ durante ciclos do tipo feature, fix ou refactor. Apenas ciclos truth-revision alteram truth/.
- Nunca executar o Builder sem Plano de Execução aprovado pelo desenvolvedor.
- Nunca pular a fase de Reviewing.
- Nunca permitir mais de 2 tentativas de Corrector sem escalar ao desenvolvedor.
- Nunca iniciar um novo ciclo sem finalizar o ciclo anterior (state/current.md deve estar com status IDLE).

## Proibições do projeto (Navelo)
- Proibido usar tags primitivas HTML (div, span, p, etc.) fora da pasta src/components/store/base/
- Proibido usar margin (m, mx, my, mt, mb, ml, mr) em qualquer componente. Use gap.
- Proibido usar style prop (inline styles) fora da pasta base/
- Proibido usar className arbitrário fora da pasta base/ (exceto exceções listadas no ESLint config)
- Proibido redefinir interfaces de entidades de domínio localmente — importar de src/types/domain.ts
- Proibido usar tipos any fora da pasta base/

## Dependências proibidas
- Tailwind arbitrário além do permitido pelo ESLint
- Margem via qualquer mecanismo CSS

## Metadados
- Status: ATIVO
