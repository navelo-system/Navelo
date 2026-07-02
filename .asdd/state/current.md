# Current State

## Última atualização
Ciclo #098 — Refactor: Remoção de ícones de seção dentro do Modal de configurações — 2026-07-02

## Status do ciclo ativo
IDLE

## Ciclo em andamento
None

## Estado do artefato
COMPLETO — Truth estabelecido

## Implementado
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

