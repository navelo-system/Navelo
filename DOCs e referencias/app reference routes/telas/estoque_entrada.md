# Tela de Entrada Manual de Estoque

**Arquivo:** `tela de estoque - entrada manual.png`

## Objetivo
Visualizar o histórico de entradas de estoque realizadas manualmente, pesquisar lançamentos por período e fornecedor, e criar novas movimentações.

## Hierarquia Visual
1. Barra superior com botão de voltar e título ("Entradas manuais").
2. Divisão de tela em duas colunas principais:
   - **Esquerda (70%):** Histórico de entradas manuais (exibindo Empty State se vazio) e o botão flutuante (FAB) de inserção.
   - **Direita (30%):** Painel lateral de filtros ("Filtros").

## Seções
- **Lista de Movimentações (Esquerda):** Lista de registros de entradas manuais efetuadas.
- **Painel de Filtros (Direita):** Área com formulário de busca por período, datas específicas e fornecedor.

## Componentes
- **Empty State:** Ilustração centralizada de ausência de registros com texto explicativo.
- **Floating Action Button (FAB):** Botão circular azul escuro com símbolo de adição em laranja.
- **Filter Pills (Período):** Abas rápidas (Hoje, 7D, 1M, 3M, 6M, 1A).
- **Date-time Inputs:** Inputs com data e hora padrão e botão de limpeza ("X").
- **TextInput (Fornecedor):** Campo de entrada para digitação livre do nome do fornecedor.
- **Button:** Botão de submissão "Filtrar".

## Campos
- **Data Inicial (Filtro):** Início do período (`06/04/2026 00:00`).
- **Data Final (Filtro):** Término do período (`05/07/2026 23:59`).
- **Fornecedor (Filtro):** Campo de texto com o placeholder/rótulo `Fornecedor`.

## Botões
- **Voltar (seta esquerda):** Retorna para a tela de Estoque principal.
- **Nova Entrada (FAB +):** Abre o formulário de cadastro de entrada manual de mercadorias.
- **Filtros de Período (Chips):** Seleção rápida de intervalos de tempo.
- **Filtrar:** Executa a consulta com os parâmetros do painel.

## Navegação Identificável
- Seta superior esquerda retorna para a **Tela de Estoque (Principal)**.
- Botão flutuante (+) direciona para o formulário de lançamento de entrada manual de estoque.

## Estados Visíveis
- **Lista Vazia:** Sem registros cadastrados, ativando a ilustração e o texto `Nenhum registro encontrado.`.
- **Filtro de período ativo:** Botão `3M` selecionado (fundo escuro).

## Observações
- Nenhuma.

## Informações não identificáveis
- Nenhuma.
