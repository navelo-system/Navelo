# Tela de Balanço de Estoque

**Arquivo:** `tela de estoque - balanço de estoque.png`

## Objetivo
Auditar o estoque físico comparando os dados do sistema com a contagem real, exibindo históricos de balanços e oferecendo filtros de busca de períodos e status.

## Hierarquia Visual
1. Barra superior com botão de voltar e título ("Balanços de estoque").
2. Divisão de tela em duas colunas principais:
   - **Esquerda (70%):** Histórico de balanços cadastrados e botão de criação rápida (FAB).
   - **Direita (30%):** Painel de filtros de pesquisa ("Filtros").

## Seções
- **Lista de Auditoria (Esquerda):** Cards contendo a data, hora, descrição dos grupos e o selo de status de conclusão dos balanços.
- **Painel Lateral de Filtros (Direita):** Parâmetros para refinar a busca dos balanços (Período, datas e status).

## Componentes
- **Status Badge:** Etiqueta colorida (verde "Finalizado" ou vermelha/laranja "Pendente").
- **Floating Action Button (FAB):** Botão circular com ícone de adição ("+") para iniciar um novo balanço.
- **Filter Pills (Período):** Botões rápidos de intervalo de tempo (Hoje, 7D, 1M, 3M, 6M, 1A).
- **Date-time Inputs:** Campos de data e hora com botão de limpeza integrada ("X").
- **Checkbox Toggle:** Botões largos estilo chip ativo para seleção múltipla de status.
- **Button:** Botão de submissão "Filtrar" no rodapé lateral.

## Campos
- **Data/Hora do Balanço:** Exibe quando a auditoria foi iniciada/finalizada (`01/06/26 14:49`).
- **Grupos do Balanço:** Descrição das categorias de produtos inclusas (`Grupos: Todos os grupos selecionados`).
- **Data Inicial (Filtro):** Campo de limite de início da pesquisa (`06/04/2026 00:00`).
- **Data Final (Filtro):** Campo de limite de fim da pesquisa (`05/07/2026 23:59`).

## Botões
- **Voltar (seta esquerda):** Retorna para a tela de Estoque principal.
- **Novo Balanço (FAB +):** Inicia o processo de lançamento de um novo balanço físico.
- **Filtros de Período (Chips):** Seleção rápida de intervalos de tempo.
- **Filtrar:** Aplica os parâmetros selecionados sobre a lista de balanços.
- **Status Pendente / Finalizado (Chips):** Filtra a listagem conforme o status da auditoria.

## Navegação Identificável
- Seta superior esquerda retorna para a **Tela de Estoque (Principal)**.
- Botão flutuante (+) abre o formulário de novo balanço.

## Estados Visíveis
- **Balanço Finalizado:** Indicado pela badge verde descrita como `Finalizado`.
- **Filtro de período ativo:** Botão `3M` selecionado (fundo escuro).
- **Filtros de status ativos:** Ambos (`Pendente` e `Finalizado`) marcados com check e fundo escuro.

## Observações
- Nenhuma.

## Informações não identificáveis
- Nenhuma.
