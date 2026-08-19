# Tela de Pagamento

**Arquivo:** `tela de pagamento.png`

## Objetivo
Visualizar o resumo dos itens vendidos, selecionar formas de pagamento, gerenciar pagamentos parciais (divisão de contas) e finalizar a transação fiscal.

## Hierarquia Visual
1. Barra superior com botão de voltar, título ("Pagamento") e atalho de desconto rápido ("F6 - Desconto na venda").
2. Divisão de tela em dois painéis simétricos:
   - **Esquerda:** Detalhamento do pedido (itens, quantidades, subtotal, total).
   - **Direita:** Métodos de pagamento selecionados, totalizadores de quitação e botões de atalho das formas de pagamento disponíveis.
3. Botão destacado de finalização da venda no rodapé direito.

## Seções
- **Resumo do Pedido (Painel Esquerdo):** Lista de itens adicionados com multiplicadores de preço e totalizadores financeiros.
- **Painel de Quitação (Painel Direito):** Lista com os valores lançados por forma de pagamento (ex: "Dinheiro R$ 9,00").
- **Seletor de Métodos de Pagamento:** Fileira de botões rápidos para ativação dos métodos de pagamento.

## Componentes
- **Item List:** Exibição detalhada de item unitário no formato `[Nome do Produto] [Valor Total do Item]` e `[Quantidade] UN x [Valor Unitário]`.
- **Payment Method Item:** Linha indicando o método e valor creditado (ex: "Dinheiro R$ 9,00") com um botão de exclusão rápida (círculo com sinal de menos).
- **Payment Method Buttons:** Quatro cards de atalho rápido com ícone centralizado e atalhos de teclado indicados no rótulo.
- **Button:** Botão largo "Enter ou F9 - Finalizar" habilitado para a conclusão.

## Campos
- **Subtotal:** Exibição do valor total dos produtos (`R$ 9,00`).
- **Desconto na venda (Painel Esquerdo):** Destaque das reduções globais (`- R$ 0,00`).
- **Total (Painel Esquerdo):** Valor total final a ser cobrado (`R$ 9,00`).
- **Total pago (Painel Direito):** Somatório de todos os pagamentos já lançados (`R$ 9,00`).
- **Falta pagar (Painel Direito):** Saldo restante a ser quitado (`R$ 0,00`).

## Botões
- **Voltar (seta esquerda):** Retorna para o Caixa (Negociação).
- **F6 - Desconto na venda:** Abre a modal de aplicação de desconto na venda.
- **Remover Pagamento (círculo com menos):** Exclui o lançamento do método associado.
- **D - Dinheiro:** Lança valor em dinheiro.
- **C - Cartão:** Lança valor em cartão (crédito/débito).
- **N - Crediário:** Lança valor em conta de cliente (fiado/crediário).
- **P - Pix:** Lança valor via chave Pix.
- **Enter ou F9 - Finalizar:** Botão largo no rodapé para encerrar a operação.

## Navegação Identificável
- Seta superior esquerda retorna para o **Caixa (Negociação)**.
- Botão "Enter ou F9 - Finalizar" encerra a transação e redireciona de volta para a tela inicial do Caixa.

## Estados Visíveis
- **Pagamento Concluído (Falta Pagar = R$ 0,00):** O botão de finalizar fica ativo para encerramento.
- **Método Adicionado:** Linha de "Dinheiro R$ 9,00" adicionada à lista de pagamentos.

## Observações
- Os atalhos de teclado (F6, D, C, N, P, F9/Enter) são indicados explicitamente para facilitar o uso sem mouse.

## Informações não identificáveis
- Nenhuma.
