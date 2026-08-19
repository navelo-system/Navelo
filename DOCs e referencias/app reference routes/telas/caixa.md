# Tela de Caixa (Negociação)

**Arquivo:** `tela de caixa.png`

## Objetivo
Permitir a seleção de produtos em uma interface rápida (grade ou lista) organizada por categorias, montando a venda atual e fornecendo acesso à finalização do pagamento.

## Hierarquia Visual
1. Barra superior com título ("Negociação"), botão de voltar e botão de menu.
2. Controles de pesquisa rápida, quantidade multiplicadora ("1x") e alternância de visualização.
3. Carrossel/abas horizontais de categorias de produtos.
4. Seção dividida em duas colunas principais:
   - **Esquerda (70%):** Grade de produtos com fotos, descrição e preços.
   - **Direita (30%):** Painel do cupom fiscal / carrinho de compras e botão de finalização.

## Seções
- **Barra de Ferramentas e Filtros:** Área de pesquisa e controle de exibição.
- **Categorias:** Linha de chips horizontais roláveis para filtros rápidos de categoria.
- **Catálogo de Produtos:** Espaço onde são exibidos os produtos cadastrados da categoria selecionada.
- **Cupom Fiscal (Carrinho):** Painel à direita contendo os itens selecionados na venda, os totalizadores de valores e a ação de checkout.

## Componentes
- **Product Card:** Cards com imagem do produto centralizada, título em caixa alta e preço unitário com identificador de unidade ("UN").
- **Tabs/Pills:** Botões em pílula com cantos arredondados (ex: "Todos" ativo com fundo escuro e check).
- **View Toggle:** Interruptor de modo de visualização entre ícone de Grade (quadrados) e ícone de Lista (linhas).
- **Disabled Button:** Botão "F9 - Pagamento" desabilitado quando o carrinho está vazio.

## Campos
- **Pesquisa:** Campo de busca rápida (ícone de lupa).
- **Quantidade Multiplicadora:** Botão de quantidade rápida (exibe `1x`).
- **Subtotal:** Exibição do valor parcial (`R$ 0,00`).
- **Desconto na venda:** Exibição de deduções aplicadas (`- R$ 0,00`).
- **Total:** Destaque em negrito do valor final da venda (`R$ 0,00`).

## Botões
- **Voltar (seta esquerda):** Canto superior esquerdo para retornar ao Dashboard.
- **Menu (hambúrguer):** Três barras no canto superior direito para opções da venda.
- **F9 - Pagamento:** Botão largo no rodapé direito para avançar para a finalização.
- **Cards de Produto:** Cada produto funciona como um botão de adição rápida ao carrinho.

## Navegação Identificável
- Seta superior esquerda retorna para o **Dashboard**.
- Botão "F9 - Pagamento" direciona para a **Tela de Pagamento**.

## Estados Visíveis
- **Visualização em Grade:** Ativa (ícone de quatro blocos marcado com check).
- **Carrinho Vazio:** Exibe o texto "Nenhum item adicionado" centralizado na coluna direita.
- **Categoria Selecionada:** Aba "Todos" marcada com check e fundo escuro.

## Observações
- A interface é otimizada para uso em telas touch (PDV físico).

## Informações não identificáveis
- Nenhuma.
