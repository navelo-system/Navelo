# Glossary

## Termos do ASDD Runtime

### Ciclo
Uma iteração completa do fluxo ASDD, iniciada por um prompt do desenvolvedor e encerrada após APPROVING. Identificado por número sequencial no cycle-log.

### Artefato
O diretório `.asdd/` e todos os seus arquivos. É a memória externalizada do projeto.

### Truth
Os arquivos em `.asdd/truth/`. Representam o contrato imutável do projeto. Alterações requerem ciclo do tipo truth-revision.

### Handoff
A transferência de output de um agente para o input do próximo, mediada pelo Harness.

### Whitelist
Lista de arquivos que o Builder está autorizado a modificar em um ciclo específico. Definida pelo Planner.

### Blacklist
Lista de arquivos explicitamente proibidos de modificação em um ciclo específico. Definida pelo Planner.

## Termos do projeto (Navelo)

### Tenant
Empresa assinante do SaaS Navelo. Entidade definida em domain.ts como interface Tenant.

### Customer
Consumidor final que compra produtos no PDV do Tenant. NÃO é o mesmo que Tenant.

### Design System
Conjunto de componentes em camadas (base/intermediary/advanced/sections) que governa toda a UI.

### AuditLog
Registro de auditoria de ações críticas. Definido em domain.ts como interface AuditLog.
