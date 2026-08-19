# Menu da Caixa (Negociação)

**Arquivo:** `tela de pagamento - Menu.png`

## Objetivo
Exibir um painel lateral/modal com opções adicionais de sincronização, gerenciamento de transações, cancelamentos, atribuição de clientes e controle fiscal da venda atual.

## Hierarquia Visual
1. Cabeçalho com título ("Menu"), botão de tela cheia e botão de fechar ("X").
2. Status de Sincronização.
3. Seção "Negociação" com links de ações de fluxo.
4. Seção de parâmetros e operações adicionais (Cliente, Desconto, Observação, Recebimentos, Devolução).

## Seções
- **Cabeçalho:** Área superior de controle e identificação do painel.
- **Status do Sistema:** Mostra o status atual da nuvem (ícone de nuvem com check + "Sincronização" e valor "Sincronizado").
- **Ações de Venda (Negociação):** Ações direcionadas a buscas, listagem e cancelamento da venda atual.
- **Ações de Transação / Cliente:** Controles para identificação de cliente, lançamento de descontos e observações na nota.

## Componentes
- **Side Panel/Modal:** Painel que surge à direita ou sobreposto na tela.
- **Action List:** Lista de itens clicáveis dispostos verticalmente.
- **Status Label:** Rótulo para indicação de estados (ex: "Sincronizado", "Não selecionado").

## Campos
- **Sincronização:** Indica o estado (`Sincronizado`).
- **Cliente:** Exibe o cliente selecionado para a venda atual (`Não selecionado`).
- **Desconto na venda:** Exibe a taxa de desconto aplicada (`0,00%`).

## Botões
- **Maximizar (duas setas divergentes):** No cabeçalho, para expandir o menu.
- **Fechar (X):** No cabeçalho, para fechar o menu e retornar à tela anterior.
- **Buscar negociações:** Atalho para busca de vendas suspensas ou finalizadas.
- **Últimas negociações (ativo):** Abre a lista com as vendas recentes.
- **Finalizar atendimentos:** Atalho para fechamento rápido de pré-vendas.
- **Cancelar operação:** Limpa a venda atual e cancela a operação.
- **Observação:** Abre campo para inclusão de notas de texto na venda.
- **Recebimentos:** Abre tela para consulta ou lançamento de contas.
- **Devolução:** Atalho para devolução e troca de mercadorias.

## Navegação Identificável
- Clicar em "Fechar (X)" retorna à **Tela de Caixa (Negociação)**.
- "Cliente" direciona para o fluxo de busca/atribuição de cliente à venda.
- "Desconto na venda" permite ajustar descontos em percentual ou valor.

## Estados Visíveis
- **Últimas negociações:** Item selecionado/focado (destacado por fundo cinza bem claro).
- **Status Online:** "Sincronização" com texto "Sincronizado" e cor correspondente.

## Observações
- Nenhuma.

## Informações não identificáveis
- Nenhuma.
