# Tela de Produtos (Principal)

**Arquivo:** `tela de produto.png`

## Objetivo
Listar todos os produtos cadastrados no sistema, exibir informações básicas (grupo/categoria, preço de venda e saldo de estoque) e fornecer atalhos para busca e inserção de novos itens.

## Hierarquia Visual
1. Barra superior com botão de voltar, título ("Produtos") e botão de busca rápida.
2. Lista vertical (tabela/lista) estendendo-se por toda a tela contendo as linhas de produtos.
3. Botão flutuante (FAB) de adição posicionado no canto inferior direito.

## Seções
- **Lista de Produtos (Principal):** Listagem corrida exibindo os itens cadastrados no sistema.

## Componentes
- **Product List Item (Linha):**
  - **Esquerda:** Thumbnail (miniatura da imagem do produto).
  - **Centro:** Título em caixa alta e legenda cinza da categoria/grupo (ex: `BEBIDAS - ÁGUA`).
  - **Direita:** Preço de venda destacado em cima e quantidade em estoque abaixo (ex: `2 UN`).
- **Floating Action Button (FAB):** Botão circular de cor azul escura e ícone de adição laranja.

## Campos
- **Nome do Produto:** Nome em destaque (ex: `ÁGUA COM GÁS`).
- **Grupo/Subgrupo:** Legenda descritiva abaixo do nome (ex: `BEBIDAS - ÁGUA`, `CERVEJAS ARTESANAIS - UNICO`).
- **Preço:** Preço final praticado (`R$ 6,00`).
- **Quantidade em Estoque:** Saldo atual físico (`2 UN`).

## Botões
- **Voltar (seta esquerda):** Retorna ao Dashboard principal.
- **Buscar (lupa):** No canto superior direito, ativa o campo de pesquisa rápida sobre a lista.
- **Adicionar Produto (FAB +):** Abre o formulário de cadastro de novo produto.
- **Linha de Produto (Linha clicável):** Cada item funciona como um botão para editar o produto.

## Navegação Identificável
- Seta superior esquerda retorna para o **Dashboard**.
- Botão flutuante (+) direciona para a **Tela de Adicionar Produto**.
- Clicar em qualquer linha de produto direciona para a **Tela de Editar Produto** (mesmo formulário de adicionar).

## Estados Visíveis
- **Estoque Negativo:** Suporte a saldo negativo exibindo valor negativo (ex: `-1 UN`).
- **Estoque Zerado:** Exibe `0 UN` em fonte cinza de menor contraste.

## Observações
- Nenhuma.

## Informações não identificáveis
- Nenhuma.
