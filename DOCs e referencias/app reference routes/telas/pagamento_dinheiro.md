# Modal de Pagamento em Dinheiro

**Arquivo:** `tela de pagamento - popup dinheiro.png`

## Objetivo
Inserir o valor recebido em dinheiro para a quitação da venda, fornecendo botões de acréscimo rápido (cédulas comuns) e um teclado numérico para digitação direta do valor.

## Hierarquia Visual
1. Indicador do valor restante ("Falta pagar: R$ 0,00").
2. Destaque do valor digitado em fonte grande e negrito ("R$ 9,00").
3. Fileira horizontal com botões de acréscimo rápido de cédulas.
4. Teclado numérico centralizado de layout 3x4.
5. Botões de controle no rodapé inferior direito ("CANCELAR" e "CONFIRMAR").

## Seções
- **Totalizador de Entrada:** Cabeçalho com o status do débito e o display do valor digitado.
- **Teclado e Atalhos Rápidos:** Bloco central composto pelos atalhos monetários e teclado virtual de inserção.
- **Barra de Ações:** Rodapé com botões textuais para confirmação ou cancelamento da modal.

## Componentes
- **Modal Box:** Janela sobreposta (popup) com cantos arredondados.
- **Display:** Área que renderiza o valor digitado formatado em Real.
- **Keypad:** Grade de inserção numérica e controle de apagar.
- **Quick Cash Buttons:** Linha de links/botões discretos para adição direta.

## Campos
- **Falta pagar:** Exibe o saldo devedor (`R$ 0,00`).
- **Display de Lançamento:** Exibe o montante de dinheiro inserido (`R$ 9,00`).

## Botões
- **Acréscimo Rápido:**
  - `+ 2,00`
  - `+ 5,00`
  - `+ 10,00`
  - `+ 20,00`
  - `+ 50,00`
  - `+ 100,00`
- **Teclado Numérico:** Teclas de `1` a `9`, além de `0`, `00` e a tecla de apagar (ícone de seta/tag com 'X').
- **CANCELAR:** Fecha a modal sem lançar o pagamento.
- **CONFIRMAR:** Registra o valor de dinheiro lançado e fecha a modal.

## Navegação Identificável
- Clicar em "CANCELAR" retorna à **Tela de Pagamento**.
- Clicar em "CONFIRMAR" aplica o pagamento e retorna à **Tela de Pagamento**.

## Estados Visíveis
- Teclado ativo com valor atual definido em `R$ 9,00`.

## Observações
- Os botões rápidos facilitam o cálculo de troco ao clicar no valor exato da cédula entregue pelo cliente.

## Informações não identificáveis
- Nenhuma.
