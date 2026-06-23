# Constraints

## Proibições absolutas do ASDD Runtime
- Nunca modificar truth/ durante ciclos do tipo feature, fix ou
  refactor. Apenas ciclos truth-revision alteram truth/.
- Nunca executar o Builder sem Plano de Execução aprovado pelo
  desenvolvedor.
- Nunca pular a fase de Reviewing.
- Nunca permitir mais de 2 tentativas de Corrector sem escalar
  ao desenvolvedor.
- Nunca iniciar um novo ciclo sem finalizar o ciclo anterior
  (state/current.md deve estar com status IDLE).

## Proibições do projeto
[PENDENTE — Bootstrap Wizard]

## Dependências proibidas
[PENDENTE — Bootstrap Wizard]

## Metadados
- Status: PARCIAL — restrições do ASDD Runtime definidas,
                    restrições do projeto pendentes de Bootstrap
