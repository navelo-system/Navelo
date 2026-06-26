# Constraints

## Proibições absolutas do ASDD Runtime
- Nunca modificar truth/ durante ciclos do tipo feature, fix ou refactor. Apenas ciclos truth-revision alteram truth/.
- Nunca executar o Builder sem Plano de Execução aprovado pelo desenvolvedor.
- Nunca pular a fase de Reviewing.
- Nunca permitir mais de 2 tentativas de Corrector sem escalar ao desenvolvedor.
- Nunca iniciar um novo ciclo sem finalizar o ciclo anterior (state/current.md deve estar com status IDLE).

## Proibições do projeto (Design System & Arquitetura)

### 1. Proibições Absolutas de Estilização e Classes
- **Proibição de className fora de base:** É terminantemente proibido o uso de `className` ou estilos manuais fora da camada `base` (`src/components/store/base`). Componentes `intermediary`, `advanced`, `sections` e `page.tsx` não podem conter `className`.
- **Proibição de CSS Inline:** Uso de `style={{ ... }}` é terminantemente proibido.
- **Proibição de Margens:** Uso de qualquer classe de margem (`mt`, `mb`, `ml`, `mr`, `mx`, `my`) é estritamente proibido. Espaçamento entre componentes deve ser feito via `gap` no container pai.
- **Proibição de Padding Direcional:** Uso de padding direcional (`pt`, `pb`, `pl`, `pr`, `px`, `py`) é proibido, exceto as exceções oficiais documentadas (ex: `px-5` no input padding).
- **Proibição de Alinhamento Absoluto:** Uso de `self-align`, `absolute offsets` manuais para corrigir falhas de layout do pai é estritamente proibido.

### 2. Proibições de Border Radius (Core Tokens)
- **Radius não autorizados:** Uso de qualquer radius que não seja `rounded-[5px]` (padrão universal) ou `rounded-full` (exclusivo para pills/botões circulares) é terminantemente proibido (ex: proibido `rounded-sm`, `rounded`, `rounded-md`, `rounded-lg`, etc.).
- **Proibição de rounded-full em Badges:** Badges **sempre** usam `rounded-[5px]` e nunca `rounded-full`.

### 3. Proibições Dimensionais (Largura e Altura)
- **Larguras fixas proibidas:** Proibido o uso de larguras fixas em pixels ou tokens numéricos (ex: `width="72"`, `w-64`, `width="320px"`). Obrigatório usar larguras proporcionais/dinâmicas (`full`, `screen`, `auto`, `fit-content`, `1/2`, `2/3`, etc.) ou unidades fluídas (`%`, `vw`). Exceção única para ícones/avatares pequenos da camada `base`.
- **Alturas fixas proibidas:** Proibido o uso de alturas fixas (ex: `height="14"`, `height="50px"`). A altura deve ser implícita/natural pelo padding interno ou resultante de `flex-1`. Permitido apenas `height="full"` ou `height="screen"` para containers de layout.

### 4. Governança de Bordas e Separadores
- **Bordas direcionais e espessuras:** Somente a espessura de `2px` (e.g. `border-2`, `border-t-2`, etc.) é permitida em qualquer componente ou linha divisória. Nenhuma outra espessura de borda é permitida.
- **Separadores:** Linhas divisórias devem ser feitas via `Box` fino com `h-[2px]` (horizontal) ou `w-[2px]` (vertical) usando a stack pai com `gap={0}`. Outras espessuras são proibidas.

### 5. Governança de Layout e Aninhamento (Nesting Matrix)
- **Nesting Matrix obrigatória:** A hierarquia visual de toda página deve seguir: `page.tsx` -> `RegistryMain` -> `RegistrySection[]` -> `Advanced | Intermediary | Base` -> `Intermediary | Base` -> `Base` (único lugar com `className`). Qualquer aninhamento diferente é um **HARD FAIL**.
- **Regras de RegistryMain:** Toda `page.tsx` do catálogo ou views principais deve ser envolta por um único `RegistryMain` com props obrigatórias `title`, `subtitle`, `icon`. Seus filhos diretos devem ser apenas `RegistrySection`.
- **Regras de RegistrySection:** Todo conteúdo visível deve estar dentro de uma `RegistrySection` com prop obrigatória `title`. É proibido renderizar outro `RegistryMain` ou `RegistrySection` dentro de si.

### 6. Core Tokens Obrigatórios
Qualquer valor de token de padding ou gap não listado abaixo é **inválido** e proibido de ser usado:
- **Gaps válidos:** `gap="section" | "title-content"` ou numéricos `{12.5 | 12 | 5 | 2.5 | 1 | 0}`.
- **Paddings válidos:** `{5 | 12 | 2.5 | 1 | 0}`.

### 7. Tipografia e Outras Regras
- **Uso estrito de Font:** Proibida tipografia arbitrária fora das variantes do componente `Font` (`heading`, `body`, `description`, `auxiliary`, `sub-tiny`).
- **Catalogação prévia:** Todo novo componente ou variante de UI precisa ser implementado e documentado em `/design-system` antes de ser usado no restante do codebase.
- **Proibição de Caixa Alta em Botões:** Proibido o uso de textos inteiramente em letras maiúsculas (uppercase) nos labels de botões.

## Dependências proibidas
- Componentes e bibliotecas visuais que conflitam ou sobrepõem as regras de estilização da `store` (ex: uso livre de shadcn/ui ou tailwind arbitrário fora do design system).
- Cores em Hex code nos componentes. Todas as cores atreladas a temas devem vir via tokens de variáveis do CSS (`var(...)`) restritos à camada `base` para conformidade com a arquitetura Whitelabel.

## Metadados
- Status: ATIVO
