# Menu de Comandas (Atendimento)

**Arquivo:** `tela de comandas - Menu.png`

## Objetivo
Exibir um painel lateral/modal com opções de sincronização e fluxo para novos atendimentos avulsos ou encerramento em lote de comandas/atendimentos.

## Hierarquia Visual
1. Cabeçalho com título ("Menu"), botão de maximizar e botão de fechar ("X").
2. Barra de status com informações de "Sincronização" ("Sincronizado").
3. Seção "Atendimento" com links de ações operacionais.

## Seções
- **Cabeçalho:** Controle superior da janela flutuante.
- **Sincronização:** Indicador de conexão com banco de dados em nuvem.
- **Opções de Atendimento:** Links operacionais para lançamento ou finalização rápida de contas.

## Componentes
- **Side Panel/Modal:** Painel lateral flutuante.
- **Action List:** Lista vertical de ações clicáveis.

## Campos
- **Sincronização:** Mostra o status (`Sincronizado`).

## Botões
- **Maximizar (setas de expansão):** No topo direito.
- **Fechar (X):** No topo direito, fecha a janela lateral.
- **Novo atendimento avulso:** Abre venda rápida no caixa sem vincular a comandas preexistentes.
- **Finalizar atendimentos:** Atalho para liquidação de contas pendentes.

## Navegação Identificável
- Clicar em "Fechar (X)" retorna à **Tela de Comandas**.
- "Novo atendimento avulso" redireciona para a **Tela de Caixa (Negociação)**.
- "Finalizar atendimentos" redireciona para o fluxo de recebimento do caixa.

## Estados Visíveis
- **Sincronização ativa:** Indicador online do banco de dados na cor correta.

## Observações
- Nenhuma.

## Informações não identificáveis
- Nenhuma.
