# Current State

## Última atualização
Ciclo #322 — Feature: Integração dos CRUDs secundários (Grupos, Unidades, Pontos de Impressão) no formulário de Produtos — 2026-08-06

## Status do ciclo ativo
IDLE

## Estado do artefato
ATIVO — truth/ preenchido com contexto real do projeto Navelo

## Implementado
- Integração dos CRUDs de Grupos/Subgrupos, Unidades e Pontos de Impressão no `ProductForm.tsx`: seleção dinâmica via DAL (Dexie IndexedDB) com empty state quando o banco está vazio
- Botões "+ Novo" / "+ Nova" nos selects de Grupo, Unidade e Ponto de Impressão abrem modal sidebar com as respectivas Sections para CRUD inline
- `GruposSubgruposSection.tsx` agora persiste `subgroups[]` no `dal.categories` (campo `subgroups` adicionado à interface `Category` no `db.ts`)
- `UnidadesSection.tsx` integrada ao `dal.units` com suporte a `decimals` (campo adicionado à interface `Unit`)
- `PontosImpressaoSection.tsx` integrada ao `dal.print_points` — nova entidade `PrintPoint` + tabela Dexie v7
- `dal/hooks.ts` e `dal/index.ts` expandidos com `usePrintPoints`, `dal.printPoints` e exports de `Unit`, `PrintPoint`
- `dal/sync.ts` atualizado com `print_points` na union type de `mutateLocalFirst`
- Integração funcional do CRUD completo de Clientes (`ClientesSection.tsx` conectado a `useCustomers` e `dal.customers` com suporte a múltiplos endereços e tipo PF/PJ)
- Integração funcional das Comandas ativas (`ComandasSection.tsx` e `app/page.tsx` conectados a `useTabs` e `dal.tabs`)
- Integração funcional do módulo de Estoque (`EstoqueSection.tsx` conectado a `useProducts` e `dal.products` para Balanço de Estoque e movimentação manual)
- Enriquecimento dos esquemas de dados Local-First no Dexie (`db.ts`) para suporte integral a dados fiscais, grupos, estoques mínimos, endereços e metadados de atendimento
- ASDD Runtime instalado via asdd-init
- truth/ preenchido com contexto do projeto
- Auditoria de domínio concluída (30 infrações catalogadas)
- Remoção do wrapper `<Box display="block md:hidden">` do botão `Filter` em `RelatoriosSection.tsx` — botão agora sempre visível no header quando `mode === "report"`
- Remoção da exibição indevida do botão "Voltar" no dashboard inicial em `app/page.tsx`
- Scroll interno isolado na lista de categorias de pagamento em `TotaisEmCaixaSection.tsx` (`min-h-0 flex-1 overflow-y-auto`) e rodapé fixado na base com linha de separação (`shrink-0 bg-background border-t`)
- Atualização dos botões de paginação em `TotaisEmCaixaSection.tsx` para `variant="outline"` (soft tint) com `ChevronLeft` e `ChevronRight` do Lucide
- Reformulação total de `TotaisEmCaixaSection.tsx` (inclusão da opção "Outros", linha de "Total R$ 45,00", árvore com guia de borda vertical, paginação limpa e botão primário "Fechar caixa" no rodapé)
- Conexão e reutilização de componentes para 100% das opções do menu lateral do caixa:
  - **Suprimento**: Abre `PdvSangriaModal` com `mode="suprimento"`.
  - **Buscar sangrias/suprimentos**: Abre `NegociacoesSection` com `title="Sangrias e suprimentos"`.
  - **Recebimentos**: Abre a tela `ContasAReceberSection`.
- Padronização universal do rodapé em `PdvSangriaModal.tsx`, utilizando a dupla nativa de botões de todos os modais do sistema (Cancelar em `variant="secondary"` laranja e Confirmar em `variant="primary"` azul marinho)
- Adicionado `icon={Banknote}` e `cancelVariant="outline"` ao `<Modal />` em `PdvSangriaModal.tsx`, alinhando os botões de ação e cabeçalho ao padrão nativo do Design System
- Resolução dos 4 erros de TypeScript apontados pelo linter/IDE
- Atualização do teclado numérico de `PdvSangriaModal.tsx` para a variante suave `outline` (`bg-brand-secondary/10`) e `cancelVariant="ghost"` no rodapé
- Refatoração do `PdvSangriaModal.tsx` para utilizar a estrutura oficial do `<Modal />` do Design System (`title="Sangria"`, `variant="default"`, `showCancelButton` e `successText="Confirmar sangria"`)
- Refatoração do `PdvSangriaModal.tsx` para utilizar a estrutura oficial do `<Modal />` do Design System (`title="Sangria"`, `variant="default"`, `showCancelButton` e `successText="Confirmar sangria"`)
- Remoção do fundo cinza (`bg-surface-sunken`) do seletor de quantidade em `DevolucaoSection.tsx`
- Remoção do fundo cinza (`bg-surface-sunken`) do seletor de quantidade em `DevolucaoSection.tsx`
- Correção de todas as 12 violações de ESLint / Linter nos 8 arquivos reportados (`EmptyState`, `FilterPanel`, `ExitConfirmModal`, `PdvObservacaoModal`, `PdvSangriaModal`, `DevolucaoSection`, `PdvSection`, `RelatoriosSection`)
- Refatoração do seletor de quantidade em `DevolucaoSection.tsx` para o padrão de botões azuis pílula (`variant="primary-icon-xs"`) e do `EmptyState` para `variant="transparent"` flexível em altura total (`flex-1`)
- Atualizado `PdvObservacaoModal.tsx` para utilizar o modal centralizado padrão do Design System (`variant="default"`)
- Atualizado `PdvObservacaoModal.tsx` para utilizar o modal centralizado padrão do Design System (`variant="default"`)
- Refatoração de `PdvObservacaoModal.tsx` para utilizar o `<Modal />` nativo do Design System com `title="Observação"`, `showCancelButton` e `successText="Confirmar"`
- Refatoração de `PdvObservacaoModal.tsx` para utilizar o `<Modal />` nativo do Design System com `variant="bottom"`, `title="OBSERVAÇÃO"`, `showCancelButton` e `successText="CONFIRMAR"`
- Ajustada a rota do botão "Últimas negociações" em `PdvSidebarDrawer.tsx` para direcionar para `onNavigate("clientes")`
- Ajustada a rota do botão "Últimas negociações" em `PdvSidebarDrawer.tsx` para direcionar para `onNavigate("clientes")`, abrindo a tela de listagem de clientes/negociações demonstrada no print do usuário
- Inclusão da prop `setCustomTitle={setCustomTitle}` na chamada `<PdvSection />` em `app/page.tsx`
- Inclusão da prop `setCustomTitle={setCustomTitle}` na chamada `<PdvSection />` em `app/page.tsx`, corrigindo a atualização dinâmica do título do cabeçalho superior para `"Últimas negociações"`
- Atualização do título enviado ao cabeçalho em `NegociacoesSection.tsx` para `"Últimas negociações"`
- Atualização do título enviado ao cabeçalho em `NegociacoesSection.tsx` para `"Últimas negociações"`
- Restauração reativa de cabeçalho em `PdvSection.tsx`: inclusão de `subView` no array de dependências e reset `setCustomTitle(null)` ao retornar para `subView === "none"`
- Diagnóstico e validação do aviso transitório de HMR (React Fast Refresh) referente ao array de dependências do `useEffect` em `PdvSection.tsx`, confirmando código 100% limpo
- Restauração reativa de cabeçalho em `PdvSection.tsx`: inclusão de `subView` no array de dependências e reset `setCustomTitle(null)` ao retornar para `subView === "none"`
- Restauração reativa de cabeçalho em `PdvSection.tsx`: inclusão de `subView` no array de dependências e reset `setCustomTitle(null)` ao retornar para `subView === "none"`, garantindo a volta imediata da barra de pesquisa de produtos e do botão de menu
- Resolução completa de todos os erros de TypeScript em `RelatoriosSection.tsx`, `EmptyState.tsx` e `TotaisEmCaixaSection.tsx`
- Resolução completa de todos os erros de TypeScript em `RelatoriosSection.tsx` (removida duplicação de `reportDetails`, incluído o helper `renderFilterPanel` e ajustada prop `text` no `TableHead`), zerando o contexto `[current_problems]`
- Correção de erros TypeScript em `EmptyState.tsx` e em `TotaisEmCaixaSection.tsx`
- Correção de erros TypeScript em `EmptyState.tsx` (removida prop inválida `align="center"` no `<Box>`) e em `TotaisEmCaixaSection.tsx` (adicionada prop `onBack?: () => void`), zerando os erros do contexto `[current_problems]`
- Padronização arquitetural das 4 telas de consulta e filtros (`VendasSection.tsx`, `ContasAReceberSection.tsx`, `AutorizacoesSection.tsx`, `RelatoriosSection.tsx`)
- Padronização arquitetural das 4 telas de consulta e filtros (`VendasSection.tsx`, `ContasAReceberSection.tsx`, `AutorizacoesSection.tsx`, `RelatoriosSection.tsx`): migração para `<FilterPanel />`, Drawer mobile acionado pelo cabeçalho (`setCustomActions`), sincronização de títulos (`setCustomTitle`), `EmptyState variant="transparent"` e layout com `align="stretch"` preenchendo a tela inteira
- Ajuste no alinhamento da `<Stack>` principal em `NegociacoesSection.tsx` (`align="stretch"` e `h="full"`), permitindo que a área branca do painel esquerdo expanda em 100% da largura e altura da tela
- Ajuste no alinhamento da `<Stack>` principal em `NegociacoesSection.tsx` (`align="stretch"` e `h="full"`), permitindo que a área branca do painel esquerdo expanda em 100% da largura e altura da tela
- Adição da variante `variant="transparent"` em `EmptyState.tsx`, eliminando a moldura cinza restrita de ~300px e centralizando o estado de forma integrada na área total do painel
- Adição da prop `borderless` em `FilterPanel.tsx` para remoção do container duplo (borda, padding p-6 e background) dentro do Drawer mobile de `NegociacoesSection.tsx`
- Ajuste de largura responsiva em `Button.tsx` para variantes pílula (`!isPill`), mantendo os chips de filtro (`Hoje`, `7D`, `1M`, `3M`, `6M`, `1A`) compactos (`w-auto`) e alinhados lado a lado na horizontal no mobile
- Ajuste de largura responsiva em `Button.tsx` para variantes pílula (`!isPill`), mantendo os chips de filtro (`Hoje`, `7D`, `1M`, `3M`, `6M`, `1A`) compactos (`w-auto`) e alinhados lado a lado na horizontal no mobile
- Refatoração de `FilterPanel.tsx` fixando o botão "Filtrar" no rodapé (`shrink-0`) e habilitando scroll interno (`flex-1 overflow-y-auto min-h-0`) nos campos de filtro superiores
- Refatoração de `FilterPanel.tsx` fixando o botão "Filtrar" no rodapé (`shrink-0`) e habilitando scroll interno (`flex-1 overflow-y-auto min-h-0`) nos campos de filtro superiores
- Refatoração da animação de entrada de Drawers/Modals em `Modal.tsx` a 60fps sem trancamento
- Refatoração da animação de entrada de Drawers/Modals em `Modal.tsx`, ativando o CSS transition continuo com aceleração gráfica (`cubic-bezier(0.16, 1, 0.3, 1)`) a 60fps sem trancamento
- Responsividade mobile com Drawer lateral (`Modal variant="sidebar"`) para os filtros de `NegociacoesSection.tsx` ativado por botão de filtro no cabeçalho mobile
- Responsividade mobile com Drawer lateral (`Modal variant="sidebar"`) para os filtros de `NegociacoesSection.tsx` ativado por botão de filtro no cabeçalho mobile
- Sincronização dinâmica do título da aplicação (`setCustomTitle`) e remoção da barra de busca do caixa (`setCustomActions`) para todas as sub-telas do menu PDV (`Negociações`, `Clientes`, `Devolução`, `Totais em Caixa`)
- Refatoração de `NegociacoesSection.tsx` para utilizar o componente intermediário oficial `<FilterPanel />` de `src/components/store/intermediary/FilterPanel.tsx`
- Construção de `NegociacoesSection.tsx` (Print 1), `PdvObservacaoModal.tsx` (Print 3), `DevolucaoSection.tsx` (Print 4) e `PdvSangriaModal.tsx` (Print 5), além da integração da tela de `ClientesSection.tsx` (Print 2) a todas as opções do menu do caixa (`PdvSidebarDrawer.tsx` e `PdvSection.tsx`)
- Construção de `NegociacoesSection.tsx` (Print 1), `PdvObservacaoModal.tsx` (Print 3), `DevolucaoSection.tsx` (Print 4) e `PdvSangriaModal.tsx` (Print 5), além da integração da tela de `ClientesSection.tsx` (Print 2) a todas as opções do menu do caixa (`PdvSidebarDrawer.tsx` e `PdvSection.tsx`)
- Padronização da variante de fonte da etapa ativa no `DeliveryTimeline.tsx` de `"body-bold"` para `"auxiliary"`, mantendo todos os rótulos do stepper do mesmo tamanho
- Remoção do `<Box />` em `ExitConfirmModal.tsx` e adição de trava condicional de renderização de `children` em `Modal.tsx` para evitar a div `<div class=""></div>` e eliminar os 24px de gap no rodapé dos modals
- Remoção do `<Box />` em `ExitConfirmModal.tsx` e adição de trava condicional de renderização de `children` em `Modal.tsx` para evitar a div `<div class=""></div>` e eliminar os 24px de gap no rodapé dos modals
- Redução da altura do espaçador mobile em `PdvSection.tsx` de `h-28` (112px) para `h-16` (64px)
- Redução da altura do espaçador mobile em `PdvSection.tsx` de `h-28` (112px) para `h-16` (64px), eliminando o excesso de 50px de espaço em branco no catálogo
- Remoção da div de espaçamento `h-14` (56px) do rodapé mobile em `PdvSection.tsx`
- Remoção da div de espaçamento `h-14` (56px) do rodapé mobile em `PdvSection.tsx`
- Adição da variante `simple` em `EmptyState.tsx` (layout horizontal compacto com ícone de 16px) e aplicação no estado sem pagamentos lançados em `PdvCheckoutPayment.tsx`
- Adição da variante `simple` em `EmptyState.tsx` (layout horizontal compacto com ícone de 16px) e aplicação no estado sem pagamentos lançados em `PdvCheckoutPayment.tsx`
- Remoção do fundo cinza no hover (`hover:bg-surface-sunken` -> `hover:bg-transparent hover:opacity-80`) da variante `ghost-menu` em `Button.tsx`
- Remoção do fundo cinza no hover (`hover:bg-surface-sunken` -> `hover:bg-transparent hover:opacity-80`) da variante `ghost-menu` em `Button.tsx`, mantendo fundo 100% transparente nos botões dos menus
- Ocultação do bloco superior de pagamento mobile no layout desktop via `display="flex md:hidden"` em `PdvCheckoutPayment.tsx` e adição do token em `Box.tsx`
- Ocultação do bloco superior de pagamento mobile no layout desktop via `display="flex md:hidden"` em `PdvCheckoutPayment.tsx` e adição do token em `Box.tsx`
- Adição da variante `ghost-menu` em `Button.tsx` com `py-2.5 px-3 min-h-[40px]` e `hover:bg-surface-sunken` para os botões dos menus do caixa (`PdvSidebarDrawer.tsx` e `ComandasMenuSidebar.tsx`)
- Adição da variante `ghost-menu` em `Button.tsx` com `py-2.5 px-3 min-h-[40px]` e `hover:bg-surface-sunken` para os botões dos menus do caixa (`PdvSidebarDrawer.tsx` e `ComandasMenuSidebar.tsx`)
- Remoção completa do padding (`p-0 min-h-0 min-w-0`) das variantes `ghost`, `ghost-primary` e `ghost-secondary` padrão (eliminando os 10px/12px de padding do botão `← Caixa`)
- Remoção do fundo cinza no hover (`hover:bg-surface-sunken` -> `hover:bg-transparent hover:opacity-80`) nas variantes `ghost`, `ghost-primary` e `ghost-secondary` em `Button.tsx`
- Execução exaustiva da skill `correcao-arquitetura` em todas as camadas de `src/components/store/` (0 erros, 0 avisos no ESLint)
- Remoção completa de `className` na camada `intermediary/` (`KpiCard.tsx`, `FormActions.tsx`, `ViewModeToggle.tsx`) em favor de composição pura com `<Box>` e `<Stack>`
- Resolução de 100% das violações de linter (25 erros de tags primitivas `button`/`a` e 19 avisos de imports/variáveis mortas)
- Atualização do componente base `Button.tsx` para incluir `cursor-pointer`, padding vertical de 10px (`py-2.5 px-3`) e hover suave no variante `ghost`, corrigindo os botões espremidos nas sidebars e menus
- Substituição de 100% das tags `<button>` e `<a>` fora da pasta `base/` por componentes `<Box cursor="pointer">` ou `<Button>` do Design System
- Botão "Adicionar taxa" empilhado verticalmente no mobile e em linha no desktop em TaxaEntregaSection e TaxaServicoSection
- Remoção completa das buscas estáticas antigas e unificação do botão circular de busca expansível em todas as telas e no Caixa (desktop e mobile)
- Adição do gap={5} no Modal bottom e expansão em largura total (100%) da busca no cabeçalho superior quando aberta
- Correção do mapeamento de colunas do Grid.tsx e ocultação do botão do carrinho no desktop no PdvCatalogToolbar.tsx
- Posicionamento da busca da tela de Caixa no cabeçalho superior via setCustomActions e remoção da duplicata da toolbar do catálogo
- Inversão de posições do switch de grade/lista (esquerda) e ícone da câmera (direita, oculta no desktop) no PdvCatalogToolbar.tsx
- Reformulação da tela de clientes com listagem limpa (avatar, nome, documento), botão FAB fixo no canto inferior direito e itens arredondados (`radius="full"`)
- Removidas todas as buscas estáticas residuais e unificada a busca no cabeçalho superior (`MobileHeaderSearch` via `setCustomActions`) no Balanço de Estoque, Cidades, Catálogo Online e Delivery
- Reformulação completa da tela de Balanço de Estoque respeitando estritamente os componentes, props e tokens do Design System (Histórico + Filtros e Resumo do Balanço)
- Criação das variantes compactas de `Button` (`-xs` e `-pill-xs`), abstração do componente `FilterPanel.tsx` e migração de todas as sidebars de filtro (`InventoryAuditTable`, `AutorizacoesSection`, `RelatoriosSection`)
- Adição do componente `EmptyState` como fallback no painel esquerdo da lista de balanços e substituição dos badges customizados pelo componente oficial `<Badge rounded="full">`
- Remoção do container externo redundante no Balanço de Estoque, inclusão de scroll interno no painel esquerdo e fixação do botão "Filtrar" na base da sidebar
- Modificação global da camada base de `Input.tsx` (fundo transparente `bg-transparent`, sem caixas superiores/laterais, borda exclusivamente inferior `border-b-2 border-b-border`)
- Reformulação completa da tela de Produtos para a estética minimalista (thumbnail, nome/grupo em caixa alta, preço e estoque à direita, FAB `+` e busca no cabeçalho)
- Remoção do peso de fonte negrito (`variant="body-bold"` -> `variant="body"`) nos títulos e preços dos produtos e nomes de clientes
- Resolução de 100% dos erros do TypeScript reportados em `[current_problems]` (`ButtonVariant` types em `Button.tsx` e prop `shrink` em `ProdutosSection.tsx`)
- Remoção do negrito nos títulos de filtros e abas (`font-normal` em `TabsTrigger` em `Tabs.tsx` e variantes leves em `Button.tsx`)
- Fixação do card de totais (Subtotal, Desconto na Venda, Total) no rodapé do modal do carrinho no mobile junto ao botão de Pagamento em `PdvCartDrawer.tsx`
- Remoção do padding extra de 24px (`p-6`) no footer do carrinho mobile (`PdvCartDrawer.tsx`)
- Reformulação da tela de pagamento mobile em `PdvCheckoutPayment.tsx` (card financeiro unificado + grade de 4 pílulas de métodos + botão de finalização no rodapé)
- Correção de tokens inválidos (`display="block md:hidden"` e `gap={5}`, `gap={1}`, `gap={2.5}`) em `PdvCheckoutPayment.tsx`
- Inclusão do texto `"F12 - Opções"` na cor primária no lado direito do cabeçalho superior na tela de caixa (`PdvSection.tsx`)
- Aplicação da variante de fundo soft (`variant="outline"`) nos botões de atalho de "Cédulas Rápidas" em `ChangeCalculator.tsx`
- Exibição da lista de produtos do pedido no topo do card no mobile e consolidação de todo o resumo financeiro (Subtotal, Desconto, Total, Total Pago, Falta Pagar) na parte inferior de `PdvCheckoutPayment.tsx`
- Resolução da prop `maxH` em `PdvCheckoutPayment.tsx` usando `className="max-h-32 w-full"`
- Imposição de Flexbox com `flex-1`, `min-h-0`, `h-full` e `overflow-hidden` nos containers mobile e `overflow-auto` na lista de produtos em `PdvCheckoutPayment.tsx`
- Trava rígida de altura `max-h-[220px]` com `overflow-y-auto` na lista de produtos do mobile em `PdvCheckoutPayment.tsx` e eliminação do scroll de página em `PdvSection.tsx`
- Alinhamento do bloco de totais na base com lista de produtos em `flex-1 min-h-0 overflow-y-auto` e reestruturação da hierarquia visual dos 5 valores financeiros em `PdvCheckoutPayment.tsx`
- Redução do gap do cabeçalho de 50px para 10px no mobile (`gap-2.5 md:gap-y-[50px]`) e aplicação de `overflow-hidden` em `RegistryMain.tsx`
- Trava de viewport `h="screen"` e remoção da instrução `overflow-y-auto` em `app/page.tsx` para a tela de caixa no mobile, eliminando 100% da rolagem de página
- Atualização do rótulo dos botões de pagamento para "F9 - Pagamento" e remoção do ícone em PdvSection.tsx, PdvCartDrawer.tsx e PdvCheckoutSidebar.tsx
- Alteração da variante de fonte dos nomes de produtos nos componentes do carrinho para `variant="body"` (sem negrito) em CartItem.tsx e CartItemRow.tsx
- Implementação das telas VendasSection.tsx, TotaisEmCaixaSection.tsx, ContasAReceberSection.tsx e ContaDigitalSection.tsx com roteamento de cliques nos 4 cards da tela inicial/Dashboard
- Resolução de 100% dos erros do TypeScript reportados em `[current_problems]` em VendasSection.tsx, TotaisEmCaixaSection.tsx e ContasAReceberSection.tsx
- Remoção da propriedade `mobileW` inexistente em `BoxProps`, definindo a largura responsiva via Tailwind `className="w-full md:w-[320px]"` em ContasAReceberSection.tsx e VendasSection.tsx
- Execução exaustiva da skill `correcao-arquitetura`, zerando os 58 erros e 49 avisos do ESLint através da substituição de tags HTML primitivas, remoção de className fora de base e limpeza de imports mortos.
- Resolução de 100% dos 5 erros do TypeScript reportados em InventoryAuditTable.tsx, PdvCheckoutPayment.tsx, ContasAReceberSection.tsx, VendasSection.tsx e ProdutosSection.tsx.
- Resolução de 100% das exceções de runtime (Icon is not defined em TotaisEmCaixaSection.tsx e re-render infinito via useRef em VendasSection.tsx, TotaisEmCaixaSection.tsx, ContasAReceberSection.tsx e ContaDigitalSection.tsx).

## Em andamento
- Nenhum

## Pendente
- Correção das 30 infrações de domínio catalogadas no task.md

## Bloqueado
- Nenhum

## Próximo ciclo sugerido
Iniciar correção das infrações de domínio do relatório de auditoria.
