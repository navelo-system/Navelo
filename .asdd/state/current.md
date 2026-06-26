# Current State

## Última atualização
Ciclo #066 — Refactor: Criação do componente CircularIcon e refatoração geral do sistema — 2026-06-26

## Status do ciclo ativo
BUILDING

## Ciclo em andamento
#067

## Estado do artefato
COMPLETO — Truth estabelecido

## Implementado
- Criado o novo componente intermediário CircularIcon.tsx na camada intermediary, encapsulando o layout circular Box + Icon com suporte a variantes (primary, secondary, neutral, brand-light, success, danger) e tamanhos parametrizados.
- Refatorados 9 componentes (RegistrySection, Sidebar, ChangeCalculator, PeripheralStatusList, ProductScanner, FiscalStatusIndicator, CashSessionManager, BranchSwitcher, BillSplitter) para utilizar o novo CircularIcon, removendo lógica repetitiva de Box circular e erradicando classNames inválidos em ícones do Lucide.
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

