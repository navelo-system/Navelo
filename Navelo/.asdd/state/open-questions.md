# Open Questions

## OQ-001
- Identificada no ciclo: #001
- Pergunta: O tipo Plan/Subscription deve ser criado em domain.ts com quais campos exatamente? (id, name, price, features[], status?)
- Implicação se não respondida: PlansCrudSection não pode ser corrigido sem o tipo oficial.
- Status: ABERTA

## OQ-002
- Identificada no ciclo: #001
- Pergunta: O campo severity (info/warning/error) dos logs deve ser incluído no AuditLog do domain.ts como enum, ou deve ser removido da UI?
- Implicação se não respondida: LogsSection e RecentLogsTable ficam com dados fictícios.
- Status: ABERTA
