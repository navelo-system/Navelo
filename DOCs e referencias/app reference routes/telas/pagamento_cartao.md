# Modal de Seleção de Tipo de Cartão

**Arquivo:** `tela de pagamento - popup cartão.png`

## Objetivo
Selecionar a modalidade do cartão utilizado para o pagamento (Crédito, Débito ou Vales/Bandeiras).

## Hierarquia Visual
1. Título principal ("Selecione o tipo do cartão").
2. Lista vertical de opções de cartão com ícone e texto correspondente.
3. Botão "CANCELAR" posicionado no canto inferior direito.

## Seções
- **Menu de Seleção:** Lista de botões/opções dispostas em coluna para escolha.
- **Barra de Ações:** Rodapé com o botão de fechamento da modal.

## Componentes
- **Modal Box:** Janela sobreposta (popup) de largura menor com cantos arredondados.
- **Select Option Line:** Linhas compostas por ícone e texto com atalhos de teclado.

## Campos
- Nenhuns.

## Botões
- **C - Cartão de crédito:** Seleciona o fluxo de crédito (ícone de cartão).
- **D - Cartão de débito:** Seleciona o fluxo de débito (ícone de cartão).
- **A - Vale Alimentação:** Seleciona o fluxo de alimentação (ícone de hambúrguer).
- **R - Vale Refeição:** Seleciona o fluxo de refeição (ícone de garfo e faca).
- **CANCELAR:** Fecha a modal e retorna à tela de pagamento anterior.

## Navegação Identificável
- Selecionar qualquer tipo de cartão registra a forma de pagamento correspondente e retorna para a **Tela de Pagamento**.
- Clicar em "CANCELAR" retorna para a **Tela de Pagamento**.

## Estados Visíveis
- Nenhuns.

## Observações
- Os atalhos de teclado (C, D, A, R) permitem a seleção instantânea da opção sem o uso do mouse.

## Informações não identificáveis
- Nenhuma.
