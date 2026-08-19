# Tela de Comandas

**Arquivo:** `tela de comandas.png`

## Objetivo
Consultar comandas ativas, pesquisar pelo identificador de comanda e iniciar/vincular novas comandas de atendimento.

## Hierarquia Visual
1. Barra superior com botão de voltar, título ("Comandas") e botão de menu lateral.
2. Campo de busca e criação de comandas ("Identificador").
3. Bento Grid exibindo cartões de comandas ativas no sistema.

## Seções
- **Barra de Pesquisa e Lançamento:** Campo horizontal para digitação do código/nome da comanda.
- **Grade de Comandas Ativas:** Área de exibição dos cards de comandas ativas.

## Componentes
- **Search Input:** Campo de texto com o botão de ação "Buscar" alinhado à direita de forma integrada.
- **Comanda Card:** Card retangular com bordas arredondadas e contorno laranja, contendo identificação superior e tempo decorrido centralizado.
- **Active Badge (Fita):** Triângulo no canto superior esquerdo do card com círculo branco, indicando comanda ativa.

## Campos
- **Identificador (Input):** Espaço para digitar o número ou nome da comanda (com legenda abaixo explicando a ação: `[Identificador] + [Enter]`).
- **Nome da Comanda (#filipe):** Exibe o nome ou ID atribuído à comanda.
- **Tempo de Permanência (452:42):** Cronômetro exibindo o tempo decorrido desde a abertura da comanda.

## Botões
- **Voltar (seta esquerda):** Retorna à tela inicial do Dashboard.
- **Menu (hambúrguer):** Abre opções adicionais da tela de comandas.
- **Buscar:** Executa a pesquisa ou inicia a comanda se o identificador digitado for novo.
- **Comanda Card:** Funciona como botão clicável para abrir a comanda correspondente.

## Navegação Identificável
- Seta superior esquerda retorna para o **Dashboard**.
- Clicar em um card de comanda (ex: `#filipe`) direciona para a **Tela de Caixa (Negociação)** vinculada àquela comanda.

## Estados Visíveis
- **Comanda em aberto:** Indicada pelo card destacado com borda laranja e Badge de fita laranja com dot branco no canto superior esquerdo.

## Observações
- A legenda `[Identificador] + [Enter]` sinaliza suporte a leitor de código de barras para comandas físicas numeradas.

## Informações não identificáveis
- Nenhuma.
