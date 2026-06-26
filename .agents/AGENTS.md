# ASDD Protocol Enforcement

> **IMPORTANTE:** Esta é uma regra mandatória de comportamento do agente neste repositório.

Sempre que o usuário solicitar uma alteração de código, adição de feature ou correção de bug, você DEVE **automaticamente** acionar o protocolo ASDD.
Não faça propostas de solução diretas, nem modifique o código de produção por conta própria.

O seu primeiro passo para qualquer tarefa de código deve ser ler e executar a skill `asdd-governor`.
Se a intenção for aprovada pelo Governor, você deve assumir o papel de orquestrador (seguindo a skill `asdd-harness`) e passar a requisição pelo pipeline completo do ASDD:

1. `asdd-governor` (Validação de entrada)
2. `asdd-analyzer` (Análise de impacto)
3. `asdd-planner` (Criação do plano de execução) -> Requerer aprovação explícita do usuário.
4. `asdd-builder` (Implementação do plano aprovado, obrigatoriamente lendo a skill de construção aplicável, como `build-component`)
5. `asdd-reviewer` (Revisão estrita da execução, com verificação OBRIGATÓRIA de erros no contexto `[current_problems]`)
6. `asdd-corrector` (Acionado se houver reprovação do Reviewer ou se existirem erros no `[current_problems]`. Seguir em loop até que não haja mais erros antes da entrega)
7. `asdd-updating-memory` (Finalização e atualização do estado do ASDD)

Nenhuma linha de código de produção deve ser alterada fora deste fluxo orquestrado. Se o usuário pedir algo de código fora desse fluxo, inicie o fluxo do ASDD de qualquer maneira e guie o usuário por ele.
