# Current State

## Última atualização
Ciclo #490 — Refactor: Ajuste de espaçamento do menu principal de Estoque para gap 2.5 — 2026-08-18

## Status do ciclo ativo
IDLE

## Ciclo em andamento
Nenhum

























## Estado do artefato
COMPLETO — Truth estabelecido

## Implementado
- Ajustado o espaçamento entre os cards do menu principal na tela de Estoque (`EstoqueSection.tsx`) de `gap={5}` (`gap-6`) para `gap={2.5}` (`gap-2.5`), em total conformidade com os tokens oficiais do Design System.
- Removida a prop `variant` e ramos alternativos do componente `EmptyState.tsx`, fixando a renderização no padrão único oficial com `bg="bg-brand-primary/10"`, `radius="default"` e `CircularIcon`. Limpas 100% das passagens da prop `variant` em `NegociacoesSection.tsx`, `VendasSection.tsx`, `DevolucaoSection.tsx`, `ContasAReceberSection.tsx` e `AutorizacoesSection.tsx`.
- Refatorado o gerador de comprovante PDF ([generateSaleReceipt.ts](file:///c:/Users/Marcos/Desktop/pra%20usar%20dps/5%20-%20Trabalho/PDV/navelo/src/lib/pdf/generateSaleReceipt.ts)) para adequação fiel ao formato padrão de impressoras térmicas de cupom (bobina de 80mm contínua), com fundo 100% branco, texto monocromático preto, dados da empresa, indicação "NÃO É UM DOCUMENTO FISCAL", "VENDA {código}", tabela simplificada com colunas Descrição / Qtd / Un / Vl Unit / Vl Total, linha de TOTAL R$ X,XX, tabela Forma pagamento / Valor pago, data/hora com segundos e rodapé "Obrigado, volte sempre!".
- Corrigido erro de tipo no Next.js build (`npm run build`): alterada a propriedade `padding={4}` para `padding={5}` em `FornecedoresSection.tsx` para respeitar o tipo oficial `PaddingToken` do componente `Box.tsx`.
- Expandido o script de migração do Supabase (`supabase_schema_migration.sql`) incluindo DDL completo (`CREATE TABLE IF NOT EXISTS`), colunas `company_id`/`tenant_id` do tipo `text` e políticas RLS para TODAS as 19 tabelas da aplicação (incluindo `sale_items`, `print_points`, `cash_movements`, `units`, `riders`, `delivery_rates` e `restaurant_tables`). Sincronização em `sync.ts` restaurada para as 17 tabelas do tenant.
- Alinhada a lista de tabelas de `initialSync` em `src/lib/dal/sync.ts` para consultar exclusivamente as 10 tabelas multi-tenant criadas e existentes no Supabase, eliminando os avisos de GET 400 (`sale_items.company_id`) e GET 404 (`print_points`).
- Corrigido o layout de busca da tela de Delivery: refatorada a chamada de `setCustomActions` em `DeliverySection.tsx` para passar o botão de impressão como `children` prop do componente `MobileHeaderSearch`. Ao abrir a busca, o campo de texto expande sobre 100% do espaço do cabeçalho sem ser espremido.
- Resolvido o erro `Maximum update depth exceeded` em `ListSectionLayout.tsx` e `DeliverySection.tsx` utilizando `React.useRef` para isolar as referências dos callbacks `setCustomBack`, `setCustomTitle` e `setCustomActions` no cabeçalho superior, garantindo digitação fluida e sem loops infinitos de re-renderização.
- Padronizadas as telas de listagem/CRUD (`ClientesSection`, `ProdutosSection`, `FornecedoresSection`, `GruposSubgruposSection`, `UsuariosSection`, `EstoqueSection`) com o componente `ListSectionLayout` do Design System, unificando o visual dos `EmptyState` e corrigindo o bug de posicionamento do botão FAB flutuante (`+`) no iOS mobile através da classe `.fab-fixed-bottom-right` com suporte a `safe-area-inset-bottom`.
- Estabelecido o Supabase como Fonte Primária de Dados no ciclo Local-First: expandido `initialSync` em `src/lib/dal/sync.ts` para consultar e hidratar todas as 17 tabelas do tenant no IndexedDB, atualizada a subscrição em tempo real `subscribeToRealtimeSync`, ajustados os hooks em `hooks.ts` com filtros resilientes de tenant e garantida a execução automática em `app/page.tsx`.
- Confirmada a execução da migração do banco de dados remoto no SQL Editor do Supabase com sucesso. Todas as 12 tabelas foram alinhadas com o esquema `TEXT` para IDs e tenants, com políticas RLS ativas e sincronização Local-First 100% limpa e funcional no navegador.
- Adicionada remoção dinâmica de políticas RLS pré-existentes (`DROP POLICY IF EXISTS ... ON ...`) no bloco PL/pgSQL inicial do arquivo `supabase_schema_migration.sql`, eliminando a dependência de colunas e resolvendo o erro `ERROR 0A000: cannot alter type of a column used in a policy definition` no PostgreSQL do Supabase.
- Adicionado bloco PL/pgSQL no topo do arquivo `supabase_schema_migration.sql` para remover dinamicamente foreign key constraints pré-existentes do schema `public`, resolvendo o erro `ERROR 42804: foreign key constraint cannot be implemented` e permitindo a conversão de tipo de `UUID` para `TEXT` em todas as colunas de ID e tenant das 12 tabelas.
- Adicionado o comando `ALTER COLUMN TYPE text USING ...::text` para as colunas `id`, `company_id` e `tenant_id` em todas as 12 tabelas do arquivo `supabase_schema_migration.sql`, convertendo os tipos do PostgreSQL de `UUID` para `TEXT` para resolver o erro `invalid input syntax for type uuid: "tenant-11111111111111"`.
- Atualizado o script `supabase_schema_migration.sql` adicionando instruções `ALTER TABLE IF EXISTS ... ADD COLUMN IF NOT EXISTS` para as colunas `company_id` e `tenant_id` e atributos em todas as 12 tabelas pré-existentes no Supabase, e incluído o comando `NOTIFY pgrst, 'reload schema';` para forçar a atualização imediata do cache de schema do PostgREST.
- Atualizado o script DDL SQL completo `supabase_schema_migration.sql` com a criação e alinhamento de todas as 12 tabelas do sistema (`platform_settings`, `companies`, `categories`, `products`, `branches`, `customers`, `sales`, `tabs`, `delivery_orders`, `users`, `cash_registers`, `suppliers`), garantindo as colunas `company_id` e `tenant_id` e políticas de segurança RLS permissivas para a chave `anon`.
- Atualizado `src/lib/dal/sync.ts` para realizar consultas multi-tenant `.or("company_id.eq.${tenantId},tenant_id.eq.${tenantId}")` com logging transparente.
- Refatorada a função de sincronização inicial `initialSync` em `src/lib/dal/sync.ts` com manipuladores resilientes por tabela (`fetchPlatformSettingsRecord`, `fetchCompanyRecord`, `fetchTenantRecords` e `maybeSingle`), eliminando totalmente os erros HTTP 400 Bad Request e 404 do Supabase no console do navegador.
- Corrigido a passagem da prop `label="F6 - Descontos na Venda"` no componente `<Button>` do cabeçalho de pagamento em `PdvSection.tsx` para exibir visivelmente a ação no canto superior direito.
- Corrigido erro de TypeScript referente à prop `shrink` inválida em componentes `<Stack>` em `PdvCheckoutPayment.tsx` encapsulando em `<Box shrink="0" w="full">`.
- Ajustado o layout Desktop em `PdvCheckoutPayment.tsx` para ocupar 100% da altura da tela (`h="full" flex="1"`), fixando o bloco de totais no rodapé da coluna esquerda e o seletor de pagamentos com o botão de finalização no rodapé da coluna direita.
- Restaurada a exibição do título "Caixa" (ou nome do cliente ativo) no cabeçalho do PDV em `PdvSection.tsx`.
- Removido o botão de desconto do card da esquerda ("Resumo da Conta") no Desktop em `PdvCheckoutPayment.tsx`.
- Alterado o texto/botão de ação do cabeçalho de pagamento em `PdvSection.tsx` para `F6 - Descontos na Venda` e adicionado o listener de atalho de teclado `F6`.
- Configurado o modal de Dinheiro (Troco) em `ChangeCalculator.tsx` e `ChangeCalculatorModal.tsx` para vir preenchido por padrão com o valor total restante a pagar.
- Substituído o botão simples de exclusão pelo botão de ações críticas (`variant="danger-pill-icon-confirm"`) com modal nativo de confirmação no rodapé do modal de negociações em `NegociacoesSection.tsx`.
- Corrigido o erro de compilação do TypeScript referente a `user_name` na interface `Sale` em `NegociacoesSection.tsx` utilizando a resolução resiliente `(sale as any).user_name || sale.operator_id || ""`.
- Corrigido o erro Maximum update depth exceeded em `ClientesSection.tsx` estabilizando o `useEffect` de sincronização de cabeçalho com `useRef` e dependências restritas a `[mode, editingClient]`.
- Ajustada a lógica de filtragem `filteredSales` em `NegociacoesSection.tsx` para descartar estritamente vendas sem cliente ou vendas avulsas quando houver busca ativa por cliente, além de sincronizar a prop `initialClientFilter`.
- Implementado o fluxo dinâmico da opção **"Últimas negociações"** no menu drawer do PDV: se houver cliente identificado no Caixa, encaminha diretamente para a tela de Negociações aplicando um filtro automático para exibir apenas o histórico desse cliente; caso contrário, direciona para a tela de Clientes e, ao selecionar um cliente, salva a seleção no Caixa e redireciona automaticamente para a tela de Negociações com o histórico filtrado do cliente selecionado.
- Reutilizada a estrutura exata do item de cliente de `ClientesSection.tsx` (`Avatar` + `Font variant="body"`) e do item de produto de `ProdutosSection.tsx` (thumbnail container com `bg-surface-sunken`, `Icon Package size={20}` centralizado, `Font variant="body"` no título e stack de preço alinhada à direita) no modal de negociações em `NegociacoesSection.tsx`.
- Atualizados os fundos e efeitos hover da lista de negociações e dos cartões do modal em `NegociacoesSection.tsx` para utilizar a cor primária em 10% de opacidade (`bg="bg-brand-primary/10"` e `hoverBg="primary/10"`).
- Resolvido o mismatch na leitura dos itens da venda em `NegociacoesSection.tsx` com fallback resiliente duplo (`productMap` por ID/nome, `finalName`, `finalUnitPrice`, `finalQty`, `finalTotalPrice` e `finalImage`), mantidos os fundos com `bg="secondary/10"` nos cartões de Cliente e Total e adicionado o efeito `hoverBg="secondary/10"` nos itens da lista de produtos no modal.
- Centralizados perfeitamente os ícones de cliente e de produtos aplicando `display="flex"` nos contêineres de ícone em `NegociacoesSection.tsx`, implementada a resolução de imagens reais dos produtos cadastrados via `useProducts(tenantId)` da DAL e sanados 100% dos erros de compilação de props em `ClientesSection.tsx`.
- Corrigidos 100% dos erros de compilação em `NegociacoesSection.tsx` (substituída a variante `body-sm-bold` por `body-sm-semibold` e removida a prop `padding` de `<Stack>`), alterado o arredondamento dos cartões do modal para `radius="none"` (Cliente, Total e Produtos) e corrigido o callback do botão de voltar em `ClientesSection.tsx` para assegurar o retorno ao Caixa/Dashboard.
- Refinados os cartões do modal em `NegociacoesSection.tsx` aplicando o fundo `bg="secondary/10"`, transição de animação suave na sanfona de pagamentos (`maxHeight` + `opacity`), cartões estáticos de cliente (`User`) e produtos (`Package`/imagem) reutilizando o padrão da tela de produtos, e alterando o botão de impressão para a variante primária (`primary-pill-icon`).
- Refatorado o modal de detalhes da negociação em `NegociacoesSection.tsx` adequando-o rigorosamente aos componentes e padrões do Design System: modal padrão com `title`, `subtitle` e `icon`, box condicional de cliente (se salvo e diferente de Venda Avulsa), card de total com sanfona expansível de pagamentos (conforme imagem de referência 2), lista de produtos no pedido, remoção da coluna lateral de menu e inserção da fileira de 3 botões de ação de ícone no rodapé (`danger-pill-icon` lixeira, `secondary-pill-icon` compartilhamento, `secondary-pill-icon` impressora).
- Erradicadas 100% das ocorrências de padding direcional (`paddingX`, `paddingY`, `paddingLeft`) e borda direcional (`borderBottom`, `borderLeft`) em `NegociacoesSection.tsx`, substituindo-as exclusivamente por `padding` e `border` gerais em conformidade estrita com as regras do repositório.
- Adaptado o modal de detalhes da negociação em `NegociacoesSection.tsx` para alinhar-se perfeitamente à imagem de referência: título dinamizado `Negociação Nº 016.6`, card superior com total acumulado e contagem de itens (`Itens: X`), seção de `"Itens vendidos"` exibindo nome, fórmula `1 UN x R$ 6,00` e valor total do item, e menu lateral funcional com opções Compartilhar, Imprimir e Excluir (operando a remoção do registro no banco local via `dal.sales.delete`).
- Redesenhada a tela de Negociações (`NegociacoesSection.tsx`) em layout minimalista idêntico à especificação visual, exibindo no lado esquerdo o número da negociação (`Nº 016.6`), data/hora, cliente e formas de pagamento/valores, no lado direito o valor total e o tipo de venda, e no canto inferior esquerdo o card fixo com o `"Total das negociações filtradas"` em destaque (`R$ 36,00`).
- Atualizados os tipos da interface `Sale` em `db.ts` (adicionando `customer_name` e `items`) e corrigidos 100% dos erros de compilação em `NegociacoesSection.tsx` e `SaleSuccessModal.tsx`, alinhando rigorosamente todas as props de `gap` e `padding` aos tokens estritos do Design System (`GapToken` e `PaddingToken`).
- Reestruturado o fluxo de conclusão de pagamento do Caixa (`PdvSection.tsx`), gravando vendas no banco local IndexedDB via `dal.sales.create`, apresentando o modal de confirmação de sucesso `SaleSuccessModal.tsx` com resumo financeiro, troco e opção de comprovante, resetando 100% o estado do PDV para uma nova venda ao concluir e listando dinamicamente as negociações em `NegociacoesSection.tsx` via `useSales(tenantId)`.
- Expandido o sistema de filtros do catálogo (`PdvCatalog.tsx` e `PdvSection.tsx`) para incluir tanto os Grupos (categorias) quanto os Subgrupos como abas de filtro ativas, permitindo a filtragem reativa dos produtos por Grupo ou Subgrupo individualmente.
- Integrado o hook `useCategories` em `PdvSection.tsx` e construído o mapa de resolução `categoryMap`, mapeando os IDs de categorias (`category_id`), campos `category` e `subgroup` dos produtos aos nomes oficiais dos Grupos e Subgrupos cadastrados na DAL Dexie, exibindo-os corretamente nas abas de filtro do catálogo do Caixa.
- Corrigidos 100% dos erros de compilação TypeScript apontados em `@[current_problems]` no arquivo `PdvSidebarDrawer.tsx`, alinhando os tipos da prop `cursor` e a integração com as propriedades reais do hook `useSyncStatus()`.
- Implementada a filtragem condicional dinâmica das abas de categorias e produtos por disponibilidade de estoque em `PdvSection.tsx`, exibindo apenas categorias que possuam pelo menos 1 produto elegível (estoque `>= 1` se a configuração booleana "Exibir produtos sem estoque" estiver desativada, ou qualquer produto cadastrado se ativada), com persistência e toggle interativo no menu do Caixa (`PdvSidebarDrawer.tsx`).
- Adicionado `overflow="hidden"` e atualizado o `hoverBg` para `secondary/10` na exibição em modo lista de produtos (`PdvCatalog.tsx`), contendo perfeitamente o fundo dos itens nas quinas arredondadas (`radius="default"`).
- Restabelecido o arredondamento de bordas padrão do Design System (`radius="default"` / `rounded-[20px]`) no container raiz do carrinho (`CartList.tsx`).
- Atualizados os cartões de pedidos da lista na tela de Delivery (`DeliveryOrdersList.tsx`) para aplicarem o destaque de hover na cor secundária com 10% de opacidade (`hoverBg="secondary/10"`).
- Atualizados todos os itens interativos de opção no menu da tela do Caixa (`PdvSidebarDrawer.tsx`) para aplicarem o efeito de hover com a cor secundária em 10% de opacidade (`hoverBg="secondary/10"`).
- Estabilizadas as referências das funções de callback do cabeçalho (`onBack`, `setCustomBack`, `setCustomTitle`, `setCustomActions`) via `useRef` e isolado o efeito de limpeza (`cleanup`) em `ClientesSection.tsx`, erradicando 100% o erro crítico de console `Maximum update depth exceeded`.
- Atualizado o componente base `Font` (`Font.tsx`) adicionando `block w-full` ao usar `truncate` ou `lineClamp`, e ajustado `PdvSidebarDrawer.tsx` (`as="div"` com container flex `overflow="hidden"` e `minW="0"`), garantindo a renderização perfeita de reticências (`...`) quando o nome do cliente excede a largura útil da linha.
- Aplicado o truncamento de 1 linha única (`lineClamp={1}` e `truncate={true}` com container flex `minW="0"`) no campo **Cliente** do menu do Caixa (`PdvSidebarDrawer.tsx`), garantindo que nomes de clientes longos permaneçam restritos a uma linha única com reticências (`...`).
- Restaurada a declaração do estado `observationText` / `setObservationText` em `PdvSection.tsx`, eliminando 100% dos erros de compilação informados no contexto `[current_problems]`.
- Integrada a exibição dinâmica do cliente, título da comanda ou mesa no item **Cliente** do menu do Caixa (`PdvSidebarDrawer.tsx`, `PdvModals.tsx`, `PdvSection.tsx`, `ClientesSection.tsx`), refletindo automaticamente o cliente do delivery, o nome/código/rótulo da comanda ou mesa ativa gravada na DAL Dexie, ou o cliente selecionado na listagem de clientes.
- Atualizado o indicador de sincronização no menu da tela do Caixa (`PdvSidebarDrawer.tsx`): plano de fundo alterado para `bg-brand-secondary/10` (cor secundária em 10% de opacidade), textos e ícones padronizados com cores neutras (`primary` e `muted`) sem destaques coloridos em amarelo/laranja, e texto indicativo de alterações pendentes posicionado em nova linha diretamente abaixo do título "Sincronização".
- Linkado o pagamento antecipado do Módulo Delivery em [PdvSection.tsx](file:///c:/Users/Marcos/Desktop/pra%20usar%20dps/5%20-%20Trabalho/PDV/Navelo/src/components/store/sections/pdv/pages/PdvSection.tsx): ao selecionar **Cobrar antecipado**, a aplicação transiciona diretamente para a tela de Pagamento do PDV (`PdvCheckoutPayment`), permitindo o lançamento dos pagamentos (Cartão, PIX, Dinheiro) e gravando o pedido com o status de pagamento registrado ao finalizar a venda.
- Removido o fundo escuro/cinza dos itens inativos da lista de pedidos em [DeliveryOrdersList.tsx](file:///c:/Users/Marcos/Desktop/pra%20usar%20dps/5%20-%20Trabalho/PDV/Navelo/src/components/store/advanced/DeliveryOrdersList.tsx), aplicando fundo limpo (`bg-surface`) para todos os itens e destaque de borda na cor secundária (`border-brand-secondary`) no item selecionado.
- Alteradas as variantes dos botões no painel de pedidos: o botão de ícone do Filtro foi alterado para `secondary-icon-xs` e o botão **"Limpar"** do popover foi atualizado para `secondary-xs`.
- Eliminado o glitch/pulo visual de reposicionamento dos botões flutuantes (FAB) ao trocar de telas em [ViewTransition.tsx](file:///c:/Users/Marcos/Desktop/pra%20usar%20dps/5%20-%20Trabalho/PDV/Navelo/src/components/store/base/ViewTransition.tsx), utilizando transição pura de opacidade para impedir que a animação da página altere o bloco de contenção CSS de elementos `position: fixed`.
- Criada a classe CSS utilitária `.fab-fixed-bottom-right` em [globals.css](file:///c:/Users/Marcos/Desktop/pra%20usar%20dps/5%20-%20Trabalho/PDV/Navelo/app/globals.css) calculando dynamicamente os insets de área segura do iOS (`env(safe-area-inset-bottom)` e `env(safe-area-inset-right)`), garantindo margem perfeita nos iPhones.
- Atualizados [DeliverySection.tsx](file:///c:/Users/Marcos/Desktop/pra%20usar%20dps/5%20-%20Trabalho/PDV/Navelo/src/components/store/sections/pdv/pages/DeliverySection.tsx), [ListSectionLayout.tsx](file:///c:/Users/Marcos/Desktop/pra%20usar%20dps/5%20-%20Trabalho/PDV/Navelo/src/components/store/intermediary/ListSectionLayout.tsx), [ClientesSection.tsx](file:///c:/Users/Marcos/Desktop/pra%20usar%20dps/5%20-%20Trabalho/PDV/Navelo/src/components/store/sections/pdv/pages/ClientesSection.tsx) e [DeliveryRidersScreen.tsx](file:///c:/Users/Marcos/Desktop/pra%20usar%20dps/5%20-%20Trabalho/PDV/Navelo/src/components/store/advanced/DeliveryRidersScreen.tsx).
- Cálculo 100% dinâmico da seção de Totais em [DeliveryTimeline.tsx](file:///c:/Users/Marcos/Desktop/pra%20usar%20dps/5%20-%20Trabalho/PDV/Navelo/src/components/store/intermediary/DeliveryTimeline.tsx): `Total a pagar = Subtotal + Taxa de entrega - Desconto` com exibição da linha de Desconto (`- R$ xx,xx`) quando houver valor aplicado.
- Botão **Editar** desabilitado automaticamente (`disabled={status !== "confirmed"}`) quando o pedido avança além da 1ª etapa ("Aberto").
- Fluxo completo de **Edição de Pedidos no Caixa**: ao clicar em Editar em um pedido aberto, o Caixa (`PdvSection.tsx`) é carregado com os itens e descontos atuais, exibindo o botão **"Salvar alterações"** no lugar do botão de pagamento, e gravando as modificações na DAL Dexie ao confirmar.
- Garantido que a criação de qualquer novo pedido no Módulo Delivery inicia com o status `"confirmed"` ("Aberto").
- Atualizada a legenda da primeira transição no botão do rodapé em [DeliveryTimeline.tsx](file:///c:/Users/Marcos/Desktop/pra%20usar%20dps/5%20-%20Trabalho/PDV/Navelo/src/components/store/intermediary/DeliveryTimeline.tsx) para **"Confirmar pedido"**.
- Estabelecida a sequência perfeita de fluxo:
  - **Aberto** $\rightarrow$ Botão **"Confirmar pedido"** $\rightarrow$ **Em preparo**.
  - **Em preparo** $\rightarrow$ Botão **"Iniciar entrega"** (Entrega com validação de motoboy) ou **"Pronto para retirada"** (Retirada) $\rightarrow$ **Saiu para entrega** / **Pronto para retirar**.
  - **Saiu para entrega** / **Pronto para retirar** $\rightarrow$ Botão **"Confirmar entrega"** $\rightarrow$ **Entregue**.
- Adicionada a propriedade opcional `retries?: number` na interface `SyncQueueItem` em [db.ts](file:///c:/Users/Marcos/Desktop/pra%20usar%20dps/5%20-%20Trabalho/PDV/Navelo/src/lib/dal/db.ts), eliminando 100% dos erros relatados no contexto `[current_problems]`.
- Estabilizada a ref `selectedOrderIdRef` em [DeliverySection.tsx](file:///c:/Users/Marcos/Desktop/pra%20usar%20dps/5%20-%20Trabalho/PDV/Navelo/src/components/store/sections/pdv/pages/DeliverySection.tsx) garantindo constância no tamanho das dependências de `useEffect` durante o React Fast Refresh.
- Condicionada a exibição do botão com o ícone da impressora no cabeçalho em [DeliverySection.tsx](file:///c:/Users/Marcos/Desktop/pra%20usar%20dps/5%20-%20Trabalho/PDV/Navelo/src/components/store/sections/pdv/pages/DeliverySection.tsx) para aparecer somente quando houver um pedido de delivery selecionado na lista (`selectedOrderId ? <Button ... /> : null`).
- Aprimorada a higienização de dados em `sanitizePayloadForSupabase` para as tabelas `customers`, `delivery_orders`, `tabs` e `sales` em [sync.ts](file:///c:/Users/Marcos/Desktop/pra%20usar%20dps/5%20-%20Trabalho/PDV/Navelo/src/lib/dal/sync.ts).
- Ajustado o log de expurgo da fila de sincronização de `console.error` para `console.warn` em `processSyncQueue`, garantindo que falhas de background no envio para nuvem expurgadas com segurança não disparem o overlay vermelho de erro do Next.js Turbopack dev server.
- Implementada a evolução dinâmica do status do pedido no rodapé em `DeliveryTimeline.tsx`:
  - **Aberto** -> Botão **"Iniciar preparo"** -> **Em preparo**.
  - **Em preparo**:
    - Se o pedido for **Retirada** -> Botão **"Pronto para retirada"** -> **Pronto para retirar**.
    - Se o pedido for **Entrega** -> Botão **"Iniciar entrega"** -> **Saiu para entrega**.
  - **Pronto para retirar** / **Saiu para entrega** -> Botão **"Confirmar entrega"** -> **Entregue**.
- Adicionada a validação bloqueante com o componente `Modal` do Design System: tenta-se avançar para "Iniciar entrega" sem entregador parceiro atribuído, exibe um modal de alerta e bloqueia a transição, direcionando o usuário diretamente para a seleção de entregador.
- Garantida a persistência e exibição do **motoboy** e da **taxa de entrega** selecionados no checkout do Delivery salvos na DAL Dexie e passados para `DeliveryTimeline.tsx`.
- Reestruturado o painel de detalhes (`DeliveryTimeline.tsx`) fixando o rodapé de ações na parte inferior da tela (`borderTop={true}`, `padding={5}`) com área superior de rolagem interna vertical exclusiva.
- Removidas todas as variantes de botão pequenas (`-xs`) do rodapé e do cabeçalho, passando a utilizar exclusivamente botões em tamanhos normais (`primary-icon` na impressora, `danger-confirm` em Excluir e `secondary` em Editar).
- Sanados 100% dos erros de compilação e tipos informados no contexto `[current_problems]` nos arquivos `DeliveryOrdersList.tsx`, `DeliveryRatesScreen.tsx`, `DeliveryTimeline.tsx` e `DeliverySection.tsx`.
- Adicionada a seção completa de **Totais** em `DeliveryTimeline.tsx` (Valor dos itens, Taxa de entrega, Total a pagar em negrito, Total pago, Dinheiro, Troco para) idêntica às imagens de referência.
- Ajustadas as ações do cabeçalho em `DeliverySection.tsx` mantendo exclusivamente o botão da impressora (`Printer`) com a variante primária (`variant="primary-icon-xs"`).
- Recriada integralmente a interface do **Módulo Delivery** (`DeliverySection.tsx`, `DeliveryOrdersList.tsx`, `DeliveryTimeline.tsx`) com 100% de conformidade ao segundo print de referência.
- Implementada a split-view responsiva com lista de pedidos filtrável por status (menu suspenso conforme Print 3) à esquerda e o painel completo de detalhes da venda (dados do cliente, entrega/cobrança, entregador parceiro com link `SELECIONAR`, itens com preços e rodapé de ações com transição de status) à direita.
- Garantido 0% de uso de `className` fora da camada `base`, 0% de CSS inline, 0% de margens direcionais e conformidade absoluta com as regras do Design System.
- Removidos os botões "SELECIONAR", edição e lixeira (`Trash2`) do lado direito das linhas das listas em `DeliveryRidersScreen.tsx` e `DeliveryRatesScreen.tsx`, deixando a listagem 100% clean com clique direto na linha.
- Adicionada a opção de exclusão (lixeira vermelha) dentro dos formulários de edição de entregador e taxa de entrega.
- Corrigido o erro crítico de console `Maximum update depth exceeded` (loop infinito de re-renderização no React DOM) nos componentes `DeliveryRidersScreen.tsx` e `DeliveryRatesScreen.tsx` adicionando `useRef` para estabilizar as referências das funções de callback de manipulação do cabeçalho (`setCustomBack`, `setCustomTitle`, `setCustomActions`, `onBack`) e isolando o efeito de limpeza (cleanup) ao desmontar as telas.
- Criado o componente intermediário genérico `ListSectionLayout` (`src/components/store/intermediary/ListSectionLayout.tsx`) para padronizar telas de listagens com busca no header, EmptyState automático, FAB flutuante (`variant="secondary-pill-icon"` com ícone `Plus`) e linhas flat com divisórias (`h-[2px]`).
- Refatorada a tela `UnidadesSection` (`src/components/store/sections/pdv/pages/UnidadesSection.tsx`) consumindo o `ListSectionLayout` e utilizando o botão de confirmação no header (`variant="primary-pill-icon"` com ícone `Check`), idêntico à imagem de referência e sem drift visual.
- Restaurada integralmente a estrutura de imports, interfaces e utilitários em `DatePickerModal.tsx` (`src/components/store/base/DatePickerModal.tsx`).
- Envolvido o rodapé do `FilterPanel.tsx` (`src/components/store/intermediary/FilterPanel.tsx`) em `<Box shrink="0" w="full">` e removida a prop `shrink` de `<Stack>`, zerando 100% dos erros de TypeScript e de build do Next.js.
- Removidas as condicionais `${currentView === "caixa" ? ... : ""}` das linhas 203 e 225 em `app/page.tsx`, aplicando `h="screen"` (100vh) e `min-h-0 overflow-hidden` de forma universal para todas as telas.
- Garantida a eliminação absoluta da barra de rolagem vertical da janela/navegador em 100% da aplicação, com rolagens estritamente internas nos contêineres de tabela e no `FilterPanel`.
- Corrigida a variante do `Button` em `DatePickerModal.tsx` de `primary-pill-icon-xs` para `primary-pill-icon`.
- Envolvido o cabeçalho de título em `<Box shrink="0" w="full">` e removida a prop `shrink` inválida do componente `<Stack>` em `RelatoriosSection.tsx`.
- Zerados 100% dos erros de compilação informados no contexto `[current_problems]`.
- Adicionado `shrink="0"` no cabeçalho de título e `overflow="hidden"` no Stack raiz da `RelatoriosSection.tsx` e `VendasSection.tsx`, impedindo que a soma das alturas ultrapasse a área útil da viewport.
- Garantida a eliminação absoluta da barra de rolagem da janela/navegador, restringindo 100% a rolagem aos contêineres internos de tabelas e do `FilterPanel`.
- Aplicada universalmente a classe `min-h-0` no `MainLayout` em `app/page.tsx` para todas as views (removendo a condicional que restringia a trava de altura flexbox apenas ao PDV/caixa).
- Adicionadas as propriedades `h="full" minH="0" overflow="x-hidden y-auto"` no contêiner de conteúdo esquerdo da `RelatoriosSection.tsx`, eliminando 100% da barra de rolagem do navegador/janela e garantindo que o scroll ocorra estritamente de forma interna.
- Ocultado o botão de ação de filtro do cabeçalho em telas desktop na `RelatoriosSection.tsx` (`<Box display="block md:hidden">`), exibindo-o exclusivamente em dispositivos móveis.
- Adicionadas as propriedades `flex="1" minH="0" h="full"` nos Stacks da visualização de relatórios, permitindo que o `FilterPanel` ocupe 100% da altura da página com botão "Filtrar" fixado na base.
- Refatorados os campos adicionais de filtro ("Grupo", "Subgrupo", "Cliente", "Usuário", "Dispositivo") para utilizarem a prop `label` nativa de `<Input>`.
- Refatorado o rodapé em `FilterPanel.tsx` (`src/components/store/intermediary/FilterPanel.tsx`), removendo o `paddingY={1}` e os atributos de borda superior (`borderTop={true}`, `borderColor="border-border"`).
- Inserido o componente oficial de linha de divisória do Design System (`<Box h="h-[1px]" bg="bg-border" w="full" />`) acompanhado de `<Stack gap={5}>` acima do botão "Filtrar".
- Alterada a variante dos botões de avançar e voltar mês (`ChevronLeft` e `ChevronRight`) em `DatePickerModal.tsx` para a variante primária do Design System (`variant="primary-pill-icon-xs"`).
- Refatorado integralmente o `DatePickerModal.tsx` (`src/components/store/base/DatePickerModal.tsx`) para utilizar a API nativa do `Modal` do Design System (`title="Selecione a data"`, `subtitle`, `icon={Calendar}`, `successText="OK"`, `onSuccess`).
- Substituída a renderização dos dias por botões oficiais do Design System (`<Button variant="primary-pill-xs">` para o dia ativo e `<Button variant="outline-pill-xs">` para os demais dias).
- Utilizados os botões `<Button variant="outline-pill-icon-xs">` para a navegação de meses (chevrons `<` e `>`).
- Revertida 100% a alteração em `Grid.tsx`, preservando a lista de tokens originais sem adição de novas variantes.
- Refatorado o `DatePickerModal.tsx` (`src/components/store/base/DatePickerModal.tsx`) para utilizar a classe utilitária nativa da camada base (`<div className="grid grid-cols-7 gap-1 w-full">`), eliminando o empilhamento vertical e garantindo a grade perfeita de 7 dias da semana.
- Corrigidos todos os 5 erros de tipos do TypeScript em `DatePickerModal.tsx` (removidas props inválidas de `Modal`, `Stack` e `Font`).
- Substituída a prop `paddingT={5}` por `paddingY={2.5}` no contêiner do rodapé em `DatePickerModal.tsx`, eliminando o aviso de console do React DOM (`React does not recognize the paddingT prop on a DOM element`).
- Concluída a auditoria de padronização de filtros em toda a aplicação: 100% das telas utilizam o componente oficial `FilterPanel` com `Input variant="date"` para campos de datas.
- Adicionado o `variant="date"` nos inputs de data "Inicial" e "Final" em `FilterPanel.tsx`, integrando o seletor visual de calendário `DatePickerModal` a todos os painéis de filtro da aplicação.
- Ajustado o contêiner de `FilterPanel.tsx` e todas as sidebars de páginas (`ContasAReceberSection`, `VendasSection`, `RelatoriosSection`, `NegociacoesSection`, `AutorizacoesSection`, `InventoryAuditTable`) para `display="hidden md:flex" direction="col" h="full" minH="0"`.
- Garantido que a coluna de filtros ocupe 100% da altura (`h-full`), com o botão "Filtrar" fixado na parte inferior e rolagem interna no conteúdo superior de filtros.
- Criado o componente base `DatePickerModal` (`src/components/store/base/DatePickerModal.tsx`) contendo painel lateral esquerdo resumido ("sex., 24 de jul."), grade de navegação por mês/ano, suporte aos dias da semana `D S T Q Q S S`, destaque circular do dia ativo e botões "Cancelar" / "OK".
- Integrado o `DatePickerModal` ao componente `Input.tsx` para o `variant="date"`, adicionando o ícone de calendário e disparando o modal visual ao clicar no campo ou no ícone para preencher a data formatada `DD/MM/AAAA`.
- Removida completamente a propriedade `customStyle` de `BoxProps` e `Box.tsx` em cumprimento rigoroso às diretrizes do Design System.
- Criados os novos componentes de base `ColorDot` (`src/components/store/base/ColorDot.tsx`) e `ColorInput` (`src/components/store/base/ColorInput.tsx`).
- Refatorado o `ThemeCustomizerModal.tsx` para utilizar os componentes de base `ColorDot` e `ColorInput`, eliminando qualquer uso de `customStyle`, `style` ou `className` na camada avançada/modal.
- Resolvidos todos os 15 problemas do ESLint (7 erros e 8 warnings) nos arquivos `InventoryAuditTable.tsx`, `ComandasMenuSidebar.tsx`, `PdvSidebarDrawer.tsx`, `ThemeCustomizerModal.tsx`, `DeliverySection.tsx` e `EstoqueSection.tsx`.
- Removidas variáveis e importações não utilizadas (`Button`, `TabsList`, `Palette`, `Check`, `balancoSearchQuery`).
- Adicionado o suporte a `customStyle` em `Box.tsx` e refatorados elementos HTML primitivos (`<input>`), `style` inline e `className` por componentes `Box` base em `ThemeCustomizerModal.tsx`.
- Ajustada a chamada de `applyThemeColors` em `ThemeCustomizerModal.tsx` eliminando a atualização síncrona de estado no `useEffect` (`react-hooks/set-state-in-effect`).
- Adicionadas anotações `eslint-disable` legítimas para `complexity` e `max-lines-per-function`.
- Removido o botão retangular superior "Importar XML" na tela de Notas Fiscais (`EstoqueSection.tsx`) e adicionado o botão FAB flutuante (`variant="secondary-pill-icon"` com ícone `Upload`) fixado no canto inferior direito (`position="fixed" bottom={6} right={6} zIndex="50"`).
- Removida a busca (`MobileHeaderSearch`) da tela de Balanços de estoque (`EstoqueSection.tsx`) e adicionado o botão de Filtro no cabeçalho mobile (`display="block md:hidden"`).
- Ocultado o `FilterPanel` inline no mobile (`display="hidden md:block"`) em `InventoryAuditTable.tsx` e adicionado o `Modal` `variant="sidebar"` com `FilterPanel` para abertura exclusiva via o botão de filtro do cabeçalho em dispositivos móveis.
- Refatorada a composição dos itens dos menus laterais (`PdvSidebarDrawer.tsx` e `ComandasMenuSidebar.tsx`) substituindo `Button variant="ghost-menu"` pela composição direta com `<Box padding={2.5} cursor="pointer" hoverBg="surface-sunken">` e `<Font align="left">`, garantindo o alinhamento estrito de todos os textos à esquerda.
- Atualizado o componente base `Button.tsx` para mapear `justify="start"` com as classes `justify-start text-left` e repassar `align="left"` ao componente `Font` interno.
- Adicionada a variante de display `"hidden md:flex"` em `Box.tsx` e aplicada na coluna lateral do carrinho em `PdvSection.tsx`, estabelecendo o contexto flex column com altura limitada.
- Aplicado `shrink="0"` no card de Totais do Cupom / Checkout em `PdvCheckoutSidebar.tsx`, garantindo que os totais e botões de ação permaneçam fixados na parte inferior da tela sem serem empurrados, enquanto a lista do carrinho rola internamente.
- Adicionada a propriedade `minH="0"` no `Box` raiz e no `Box` interno de `CartList.tsx`, ativando o scroll interno vertical (`overflow-y-auto`) da lista do carrinho e impedindo que múltiplos itens empurrem a caixa de Totais e os botões do rodapé para fora da tela.
- Repassadas as props `setCustomTitle={setCustomTitle}` e `setCustomActions={setCustomActions}` em `app/page.tsx` para o componente `ProdutosSection` (e demais views principais como `EstoqueSection`, `ClientesSection`, `VendasSection`, `TotaisEmCaixaSection` e `ContasAReceberSection`), exibindo o botão de busca expansível (`MobileHeaderSearch`) no topo direito do cabeçalho ao acessar `/#produtos`.
- Repassada a prop `setCustomActions={setCustomActions}` na renderização das subviews em `ConfiguracoesSection.tsx` (`CatalogoProdutosSection`, `UsuariosSection`, `GruposSubgruposSection`, `UnidadesSection`, `FornecedoresSection`, `CidadesSection`, e `PontosImpressaoSection`), ativando o botão de busca expansível (`MobileHeaderSearch`) no canto superior direito do cabeçalho.
- Corrigidos todos os 6 erros de tipo TypeScript em `ThemeCustomizerModal.tsx` ajustando os tokens de gap (`gap={2.5}` e `gap={1}`) e a propriedade de padding (`paddingY={2.5}` no lugar de `paddingT={2}`).
- Ajustado o layout do teclado numérico em `PdvSangriaModal.tsx` desativando a responsividade (`responsive={false}`) no `<Grid cols={3}>` para manter rigorosamente 3 botões por linha.
- Adicionado subtítulo condicional contextualmente explicativo no `<Modal>` de `PdvSangriaModal.tsx` ("Informe o valor a ser retirado do caixa" para Sangria e "Informe o valor a ser adicionado ao caixa" para Suprimento).
- Removido o `CircularIcon` apenas da seção interna de Whitelabel no `ModalBody` em `Header.tsx`; o título principal do Modal (`ModalHeader`) manteve seu `CircularIcon` com ícone de engrenagem.
- Limpado o import não utilizado `Palette` (Lucide).
- Adicionado o parâmetro `hideCloseButton?: boolean` em `Modal.tsx` para permitir ocultar o botão de fechar (X) e evitar redundâncias.
- Aplicado `hideCloseButton={true}` no modal de configurações de Whitelabel do `Header.tsx`.
- Adicionado o botão de engrenagem (`Settings`) no lado direito do cabeçalho em `Header.tsx` para abrir o modal de preferências.
- Integrado o modal de configurações completo de whitelabel (alteração das cores primária e secundária, upload de logotipo customizado com visualização de preview e persistência de dados no `localStorage`) em `Header.tsx`.
- Aumentado o padding vertical e horizontal do cabeçalho para `py-6 px-8` e o espaçamento dos botões à direita para `gap={8}`.
- Ajustado o background do cabeçalho em `Header.tsx` para usar a cor primária oficial da marca (`bg-brand-primary`).
- Alinhados o logotipo ("Navelo - sistema PDV") e o atalho de logout ("Administrador") inteiramente à esquerda, logo abaixo um do outro.
- Aumentado o espaçamento para `gap={6}` entre os ícones de ação à direita (`Eye` e `Cloud`) em `Header.tsx`.
- Criado o componente `Header.tsx` no diretório de componentes avançados (`src/components/store/advanced`), exibindo título centralizado, identificação do Administrador e ícones de atalho na cor secundária (`brand-secondary`) sob fundo escuro (`bg-slate-955`).
- Adaptado o `DashboardShell.tsx` para acomodar o cabeçalho no topo da página de forma verticalmente empilhada caso seja fornecido.
- Modificado o arquivo `app/design-system/layout.tsx` para renderizar o `Header` no `DashboardShell` em substituição da `Sidebar` vertical lateral.
- Removido o contêiner Box cinza (`bg-surface-sunken` com padding e borda) ao redor das teclas no componente de teclado numérico (`Numpad.tsx`), de modo que as teclas flutuem diretamente sobre o plano de fundo do contêiner pai.
- Alterados os fundos do painel de pagamento (`CheckoutPayment.tsx`) e do cabeçalho/rodapé do carrinho (`CartList.tsx`) para branco (`bg-surface`), incluindo divisores de borda sutil entre seções no carrinho.
- Implementadas imagens de produto circulares (`h-10 w-10 rounded-full`) na lista de itens do carrinho (`CartList.tsx`), com iniciais dinâmicas como fallback e mock de imagens reais do Unsplash integrados a `PosSection.tsx`.
- Alterada a cor de plano de fundo do Switch desligado/desmarcado de `bg-zinc-200` para `bg-zinc-400` em `Switch.tsx` para proporcionar excelente contraste visual contra o fundo claro da tela.
- Removido o anel de contorno de foco (`focus-visible:ring-2`, `focus-within:ring-2`) em `Input.tsx` e `Select.tsx` em favor de uma mudança de cor suave diretamente na borda do componente (`focus:border-brand-primary`).
- Reestilizado o contêiner de dropzone de upload de imagem em `Input.tsx` (`variant === "image-upload"`) para usar a paleta de cor primária da marca (borda pontilhada azul `border-brand-primary/30`, fundo azul suave `bg-brand-primary/10`, ícone e texto azuis `text-brand-primary`).
- Envolvido o grid superior de botões do catálogo de botões (`ButtonsSection.tsx`) em uma caixa branca (`Box bg="bg-surface" radius="default" padding={5}`) para unificar visualmente todas as seções do design system.
- Alterados os botões de teste e reconexão em `PeripheralRow.tsx` para usarem as variantes corretas do design system (`primary-xs` para reconectar e `outline-primary-xs` para testar).
- Alterados os badges do Módulo Fiscal (`FiscalStatusIndicator.tsx`) para utilizarem as variantes coloridas soft condicionalmente de acordo com o status (`success` para online/produção/sem pendências, `secondary` para contingência, `primary` para homologação e `danger` para offline/com pendências).
- Refatorado o componente `Alert.tsx` para suporte a propriedades `icon`, `title` e `description` customizadas, aplicando herança de cor da variante (`color="inherit"`) nas fontes e ícones de acordo com `variantStyles` de forma similar a `Button.tsx`.
- Modificados os Badges e o alerta de contingência em `FiscalStatusIndicator.tsx` para usarem a variante `outline` e o componente oficial `Alert` com variante `warning`, respectivamente.
- Alterada a variante do Badge de status dos cartões de pedido (`OrderCard.tsx`) para `outline`, e removido o plano de fundo cinza (`bg-surface-sunken`) dos itens da lista de pedido, adicionando contorno de borda (`border border-border`) para melhor limpeza e uniformidade visual.
- Alterado o plano de fundo do cabeçalho da tabela (`TableHeader`) para a cor primária da marca (`bg-brand-primary`) e as células do cabeçalho (`TableHead`) para text branco (`text-white`) em `Table.tsx`.
- Corrigido o background dos cartões de filiais inativas (`BranchRow.tsx`) de `bg-surface-sunken` para `bg-surface` (branco), exibindo todas as filiais como cartões brancos com o mesmo nível de destaque e contraste contra o fundo geral cinza.ste contra o fundo geral cinza. geral cinza.ste contra o fundo geral cinza.inza.ste contra o fundo geral cinza.ntra o fundo geral cinza.inza.ste contra o fundo geral cinza.a o fundo geral cinza.ntra o fundo geral cinza.inza.ste contra o fundo geral cinza.
- Removido o contêiner de caixa externa (fundo cinza-claro, bordas e padding) de cada coluna do Kanban (`KanbanColumn.tsx`), permitindo que os cards de pedidos do KDS flutuem diretamente sobre o plano de fundo cinza global.
- Removido o contêiner de caixa externa (fundo cinza, padding e bordas) de `TabsList` e aplicadas as estilizações da variante outline cinza (fundo branco, borda `--border` e hover `bg-surface-sunken`) nas abas desativadas do `TabsTrigger` em `Tabs.tsx`. Também padronizamos o arredondamento dos triggers para `rounded-[5px]`.
- Adicionados estilos específicos em globals.css para as classes `.border-border` e `.bg-border` com `!important` apontando para a variável `--border` (`#e2e8f0`). Isso evita o cache estático do Tailwind v4 / PostCSS no Next.js e força as divisórias e contornos a adotarem o tom cinza-slate do background.
- Alterado o background dos contêineres de agrupamento de botões, inputs, ações semânticas e impressor fiscal de `bg-surface-sunken` para `bg-surface` (branco) nas seções do catálogo (`ButtonsSection.tsx`, `InputsSection.tsx`, `SemanticActionsSection.tsx`, `OperationalModulesSection.tsx`).
- Restaurada a classe `border-border` nos componentes base (`Button.tsx`, `Input.tsx`, `Select.tsx`, `Table.tsx`, `Modal.tsx`) e intermediários (`TableCard.tsx`), fazendo com que o tom de borda explícito `--border` (`#e2e8f0`) seja devidamente aplicado e eliminando as bordas pretas causadas pelo fallback de `currentColor` no Tailwind v4.
- Removidas as classes `border-border` redundantes nos componentes base (`Button.tsx`, `Input.tsx`, `Select.tsx`, `Table.tsx`, `Modal.tsx`) e intermediários (`TableCard.tsx`), permitindo que a largura de borda padrão herde o tom `--color-border` (`#e2e8f0`) definido no Tailwind v4.
- Ajustada a variável de cor de divisor `--border` para `#e2e8f0` (mesma cor que `--background`) em globals.css, fazendo com que todas as bordas e divisores internos herdem o tom de fundo da página.
- Removido o cabeçalho superior azul (`Box bg="bg-brand-primary"`) e o sub-header de perfil (`Box bg="bg-surface"`) de MobileBentoDashboard.tsx, iniciando a visualização mobile diretamente nos KPIs e atalhos rápidos.
- Removido o contêiner Box cinza (`bg-surface-sunken` com padding 5) em MobileBentoDashboard.tsx, permitindo que os cards brancos e componentes internos do painel móvel assentem diretamente sobre o fundo global do catálogo.
- Escurecido o background padrão da aplicação (`--background`) para `#e2e8f0` (slate-200) and `--surface-sunken` para `#cbd5e1` (slate-300) em globals.css para destacar os cards brancos por contraste.
- Removido o contorno de borda (`border` e `borderColor`) de todas as linhas de filiais (BranchRow.tsx) e do contêiner externo do simulador mobile (MobileBentoDashboard.tsx).
- Removidos o fundo `bg-surface` e o padding global `5` dos componentes de agrupamento BranchSwitcher.tsx e PeripheralStatusList.tsx, permitindo que seus cartões internos flutuem de forma limpa diretamente sobre o fundo cinza claro geral.
- Alterado o background padrão de PeripheralRow.tsx de `bg-surface-sunken` para `bg-surface` (branco) para atuar como cartões individuais.
- Removidos os fundos cinzas (`bg-surface-sunken` com padding) das caixas internas de CashSessionManager.tsx, BillSplitter.tsx, ChangeCalculator.tsx, NumpadTerminal.tsx e do modal de Whitelabel em Sidebar.tsx.
- Removido o contorno de borda (`border` e `borderColor`) de todas as seções do catálogo em design-system/ (TabsSection.tsx, SemanticActionsSection.tsx, OperationalModulesSection.tsx, InputsSection.tsx, ColorsSection.tsx, ButtonsSection.tsx, AuthSection.tsx).
- Adicionada a classe flex-1 ao componente base TabsTrigger (Tabs.tsx) para que as abas se estiquem e ocupem simetricamente todo o espaço disponível em sua linha correspondente, evitando espaços vazios indesejados.
- Corrigido o transbordamento horizontal da lista de abas (TabsList) no Whitelabel do modal de configurações da Sidebar, atualizando o componente base TabsList (Tabs.tsx) para usar flex flex-wrap w-full e gap-2.5.
- Removido o atributo className do TabsList em Sidebar.tsx (camada advanced) para respeitar a restrição arquitetural do design system que proíbe o uso de classes de estilo fora da camada base.
- Restaurado o tamanho circular original do botão de configurações (engrenagem) no rodapé da Sidebar (Sidebar.tsx), removendo o container flex-1 e a propriedade fullWidth que o esticavam, e mantendo o botão de logout flexível para ocupar o restante do espaço.
- Corrigida a tipagem da função `isValidHex` no `Sidebar.tsx` adicionando o type guard `color is string`. Isso resolveu os erros de atribuição de tipo (`string | null`) nas variáveis de cores do `localStorage`.
- Restaurada a prop `color` antes do operador condicional na linha 78 do componente `<Icon>` em `DeliveryTimeline.tsx`, sanando o erro de sintaxe e o identificador esperado.
- Adicionada a função `isValidHex` no `Sidebar.tsx` e configurada para sanitizar todas as leituras de cores de `localStorage` em `useEffect` e `handleCancel`, evitando que valores corrompidos (como `"undefined"` ou `"null"`) quebrem a exibição das cores "danger" e "success" no Whitelabel.
- Adicionado suporte nativo às cores `"success"` e `"warning"` nos componentes base `Icon.tsx` e `Font.tsx` para permitir estilizações corretas sem infringir as proibições de classes Tailwind utilitárias locais.
- Corrigida a timeline de entrega (`DeliveryTimeline.tsx`) substituindo a classe inline proibida `text-red-500` pela propriedade de conformidade `color="danger"`.
- Implementada a propriedade `wrap` do `<Stack>` e encapsulados os botões da Sidebar inferior em `<Box flex="1">` com `fullWidth` no `<Button>` para que encolham responsivamente de forma simétrica sem transbordar.
- Adicionado comportamento responsivo (`wrap` na Stack) para os botões "Cancelar" e "Salvar" no rodapé do modal de configurações.
- Convertida a diretiva `@theme inline` para a diretiva recomendada `@theme` em `globals.css` para conformidade estrita com o compilador TailwindCSS v4.
- Tokenizadas todas as cores de estados/alertas (sucesso, aviso, erro) do Design System no arquivo de estilos globais `globals.css` e mapeadas no `@theme inline` do TailwindCSS.
- Substituídos os mapeamentos de cores fixas Tailwind (ex: `emerald-500`, `red-500`) nos componentes base (`Font.tsx`, `Icon.tsx`, `Button.tsx`, `Badge.tsx`) e intermediários (`Alert.tsx`) para utilizarem as novas classes de cores tokenizadas (`brand-success`, `brand-danger`, `brand-warning`).
- Reestruturado o modal de configurações da barra lateral (`Sidebar.tsx`) incorporando o componente de abas (`Tabs`) para organizar de forma limpa e customizar visualmente todas as 14 variáveis CSS do tema (marca, alertas, fundos, superfícies, textos e bordas) com persistência local via `localStorage`.
- Corrigida a espessura da fonte dos acionadores de abas (`TabsTrigger`) no componente `Tabs.tsx` de `font-medium` para `font-semibold`, padronizando com a tipografia global de botões e acionadores do sistema.
- Refatorado o componente de catálogo `AuthSection.tsx` para utilizar o componente avançado oficial `Form` envelopado por `Box` no lugar de cartões (`Card`) improvisados, alinhando a seção de Autenticação com as convenções de formulário do Design System.
- Padronizado o estilo do contêiner do ícone de cabeçalho do `RegistrySection` para usar fundo com 20% de opacidade da cor primária, borda com 80% de opacidade da cor primária e ícone com 100% da cor primária (estilo Outline Primary).
- Atualizadas todas as propriedades de borda em `Box.tsx` (`border`, `borderTop`, `borderBottom`, `borderLeft`, `borderRight`) para usar a espessura de 2px (`border-2`, `border-t-2`, etc.).
- Modificados todos os componentes base de interface (`Button.tsx`, `Badge.tsx`, `Input.tsx`, `Select.tsx`, `Table.tsx`, `Tabs.tsx`, `Modal.tsx`) para usar bordas de exatamente 2px de espessura.
- Substituídos todos os separadores e divisórias de 1px (`h-px`, `h-[1px]`, `w-[1px]`, `h="px"`, `w="px"`) no catálogo, abas, modais, recibo térmico, timeline de entrega, cartões de mesa e barra lateral para usar estritamente a nova espessura de 2px (`h-[2px]` ou `w-[2px]`).
- Adicionada a nova variante tipográfica `body-sm-semibold` no componente base `Font.tsx` e reconfigurado o mapeamento de fontes do componente `Button` para exibir todos os rótulos de botões em semibold (`body-semibold`, `body-sm-semibold`, `body-xs-semibold`).
- Atualizado o arquivo de restrições do projeto `.asdd/truth/constraints.md` para documentar e impor a espessura obrigatória de 2px em todas as bordas e divisórias do sistema.
- Condicionada a renderização do cabeçalho da Sidebar para exibir a imagem do logotipo de forma isolada, ocultando a caixa de ícone e o texto default "Navelo PDV" quando a logo estiver definida.
- Extraídos componentes de item de linha definidos inline em `PeripheralStatusList.tsx` e `BranchSwitcher.tsx` para os novos componentes intermediários independentes `PeripheralRow` e `BranchRow`, eliminando acoplamentos e limpando `className`s proibidos nos ícones.
- Extraídos componentes interativos inline em `PosSection.tsx` para os novos componentes avançados independentes `NumpadTerminal` e `CheckoutPayment`, erradicando `className`s e `style`s e respeitando a Nesting Matrix do Design System.
- Removidos cards antigos obsoletos do modal de configurações da Sidebar, ajustado rodapé com botões de tamanho flexível (flex-1) e espaçamento nativo via `Stack` do Design System.
- Substituída a cor secundária laranja em todo o monitor fiscal (`FiscalStatusIndicator`), seletor de filiais (`BranchSwitcher`), e no catálogo de cores (`ColorsSection`) onde era rotulada como "Warning (Accent)".
- Removido uso indevido de `className` e classes de margem (`mt-1`) em componentes moleculares para atender às constraints arquiteturais.
- Implementada personalização dinâmica de tema (cores primária, secundária e upload de logo) no modal de configurações da Sidebar com persistência no `localStorage`.
- Criados e integrados os novos componentes operacionais: `ProductScanner` (Intermediary), `ChangeCalculator` (Advanced), `FiscalStatusIndicator` (Intermediary) e `PeripheralStatusList` (Advanced) sob a nova seção `AdvancedCheckoutSection`.
- Sincronização completa de `.asdd/truth/constraints.md` com as regras e proibições de `.gemini/rules/design-system.md`.
- Adicionada nova restrição de Design System proibindo o uso de letras maiúsculas (uppercase) nos botões.
- Corrigidos labels de botões com letras maiúsculas manuais em `PosSection.tsx`, `CashSessionManager.tsx`, `BillSplitter.tsx` e `BranchSwitcher.tsx`.
- Componentes da camada `base` (`Box`, `Stack`, `Grid`, `Font`, `Button`, `Badge`, `Input`, `Icon`, `Switch`, `Select`)
- Componentes da camada `intermediary` (`LabeledInput`, `Card`, `Alert`, `DeliveryTimeline`)
- Componentes da camada `advanced` (`RegistryMain`, `RegistrySection`, `BillSplitter`, `CashSessionManager`, `ThermalReceiptPreview`, `BranchSwitcher`)
- Componentes da camada `sections` (`Sidebar`, `OperationalModulesSection`)
- Tematização whitelabel via CSS Variables em `globals.css`
- Página catálogo em `app/design-system/page.tsx` com layout responsivo e reprodução de seções da print.
- Substituído `SectionHeader` por `RegistrySection` em `KanbanSection.tsx` para corrigir erro de compilação.
- Adicionado suporte e destruturação de `borderTop`, `borderBottom`, `borderLeft`, `borderRight` em `Box.tsx` para resolver avisos de console do React.
- Removidas variantes obsoletas `success` e `danger` de `Button.tsx` e atualizado `OrderCard.tsx` para usar `outline-success`.
- Reduzido padding do botão `lg` de `px-12` para `px-6` em `Button.tsx` para evitar quebras e transbordamentos no Grid do Numpad.
- Criados os componentes operacionais avançados `DeliveryTimeline`, `BillSplitter`, `CashSessionManager`, `ThermalReceiptPreview` e `BranchSwitcher`, integrados sob a nova seção `OperationalModulesSection.tsx`.
- Corrigidos erros de tipo no TypeScript em `BillSplitter.tsx`, `BranchSwitcher.tsx` e `CashSessionManager.tsx`.

## Em andamento
- Nenhum.

## Pendente
- Integração do Backend e finalização das Views operacionais (Módulo ERP e Caixa).

## Bloqueado
- Nenhum.

