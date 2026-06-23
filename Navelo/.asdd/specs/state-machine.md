# ASDD State Machine

## Estados e Transições

BOOTSTRAP
  Condição de entrada: .asdd/ inválido ou inexistente, ou re-bootstrap
  Agente: Bootstrap Wizard
  Saída possível: ANALYZING (artefato válido gerado)
  Saída de bloqueio: permanece em BOOTSTRAP (dev não aprovou)

ANALYZING
  Condição de entrada: início de ciclo (pós NEXT_CYCLE ou BOOTSTRAP)
  Agentes: Governor + Analyzer
  Saídas possíveis:
    → PLANNING (governor authorized + analyzer completo)
    → QUESTIONING (governor ambiguous)
    → BLOCKED (governor blocked — fora do fluxo normal)

QUESTIONING
  Condição de entrada: ambiguidade detectada pelo Governor
  Ação: perguntas apresentadas ao desenvolvedor
  Saída: ANALYZING (com contexto atualizado)

PLANNING
  Condição de entrada: Documento de Intenção do Analyzer aprovado
  Agente: Planner
  Saídas possíveis:
    → BUILDING (dev aprovou o plano)
    → ANALYZING (dev rejeitou — volta com feedback)
    → BLOCKED (conflito arquitetural detectado)

BUILDING
  Condição de entrada: Plano aprovado pelo desenvolvedor
  Agente: Builder
  Saídas possíveis:
    → REVIEWING (relatório de execução completo)
    → PAUSED (step bloqueado — aguarda dev)

REVIEWING
  Condição de entrada: Relatório de Execução do Builder
  Agente: Reviewer
  Saídas possíveis:
    → UPDATING_MEMORY (approved ou approved_with_warnings)
    → CORRECTING (rejected + tentativas < 2)
    → ESCALATED (rejected + tentativas >= 2)

CORRECTING
  Condição de entrada: Relatório de Revisão com REJECTED
  Agente: Corrector
  Saídas possíveis:
    → REVIEWING (relatório de correção gerado)

UPDATING_MEMORY
  Condição de entrada: Relatório de Revisão APPROVED
  Agente: Updating Memory
  Saída possível: APPROVING

APPROVING
  Condição de entrada: Memória atualizada
  Ação: Confirmação final do desenvolvedor
  Saída: NEXT_CYCLE

NEXT_CYCLE
  Condição de entrada: Ciclo atualizado e confirmado
  Ação: Limpeza de contexto de curto prazo
  Saída: ANALYZING (quando novo prompt chegar)
