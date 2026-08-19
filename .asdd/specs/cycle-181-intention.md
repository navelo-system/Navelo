# Documento de Intenção — Ciclo #181

**Tipo:** feature  
**Objetivo:** Adaptar o SaaS Admin Panel para navegação baseada em Bento Grid, remover a Sidebar lateral e criar as telas adicionais pendentes no retaguarda.

## Contexto
O SaaS Admin Panel atualmente usa uma Sidebar lateral para navegação linear simples. O usuário solicitou a remoção da Sidebar em favor de uma navegação via Bento Grid localizada na página inicial do admin (`/admin`), além da criação e integração das telas pendentes (Planos, Configurações, Clientes, Logs e Relatórios), e a redução do cabeçalho superior para exibir apenas o botão de logout contendo exclusivamente seu ícone.

## Superfície de Impacto
- **Módulos afetados:** Core (RBAC/Navegação), ERP Backoffice (Cadastros, Logs, Relatórios).
- **Contratos em risco:** Design System Layer (Invariante de UI com RegistryMain/RegistrySection e navegação).
- **Arquivos afetados:**
  - `src/components/store/sections/admin/AdminShellSection.tsx` (Remoção da Sidebar)
  - `src/components/store/sections/admin/AdminHeaderSection.tsx` (Apenas botão de Sair com ícone)
  - `app/admin/page.tsx` (Dashboard Bento Grid)
  - `app/admin/visao-geral/page.tsx` [Novo] (Visualização das métricas gerais)
  - `app/admin/configuracoes/page.tsx` [Novo] (Tela de configurações globais)
  - `app/admin/clientes/page.tsx` [Novo] (Tela de controle de tenants/clientes)
  - `app/admin/logs/page.tsx` [Novo] (Tela de registros e auditoria de logs)
  - `app/admin/relatorios/page.tsx` [Novo] (Tela de relatórios de MRR e churn)

## Dependências do Ciclo
- Componentes base de grid, stack, box, font e button do Design System.

## Riscos Identificados
- **Inconsistência Visual (Baixo):** Garantir que a remoção da Sidebar não cause desalinhamento nos containers de conteúdo de cada página sob `/admin`.
- **Nesting Matrix (Baixo):** Respeitar a estrutura RegistryMain -> RegistrySection em todas as novas rotas.

## Critérios de Conclusão
1. A Sidebar lateral não deve mais ser renderizada em nenhuma página do SaaS Admin.
2. O cabeçalho administrativo (`AdminHeaderSection`) deve exibir apenas o logotipo à esquerda e o botão de logout (apenas o ícone `LogOut`, sem rótulo textual) à direita.
3. A rota `/admin` deve exibir um Bento Grid funcional com cartões/botões para acessar: Visão Geral, Planos, Clientes, Logs, Relatórios e Configurações.
4. As 5 novas páginas do retaguarda (Visão Geral, Configurações, Clientes, Logs, Relatórios) devem ser criadas e possuir botão ou forma de voltar para o Bento Grid principal.
5. `npm run dev` e `npm run build` devem rodar com sucesso sem erros.
