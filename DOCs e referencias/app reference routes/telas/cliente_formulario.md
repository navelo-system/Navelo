# Formulário de Adicionar / Editar Cliente

**Arquivo:** `tela de adicionar cliente.png`

## Objetivo
Cadastrar novos clientes no sistema ou editar dados cadastrais de clientes existentes, registrando informações de contato, identificação e múltiplos endereços.

## Hierarquia Visual
1. Barra superior com botão de fechar ("X"), título ("Cliente") e botões de ação (Lupa/Busca e Salvar/Check).
2. Bloco centralizado em container branco com cantos arredondados contendo os campos de entrada.
3. Switch de gravação de cadastro ("Salvar cliente") e botão "PULAR" na parte superior do bloco.
4. Campos de dados cadastrais dispostos em coluna (Telefone, Nome, CPF/CNPJ, IE).
5. Seção de Endereços ("Endereço") contendo botão de adição (+) e listagem dos endereços cadastrados em boxes individuais.

## Seções
- **Cabeçalho:** Ações globais do formulário.
- **Identificação e Contato:** Formulado com dados básicos do cliente.
- **Endereços:** Lista com os locais de entrega/faturamento vinculados ao cadastro do cliente.

## Componentes
- **Form Input Text:** Caixas de texto simples para inserção de dados.
- **Switch Toggle:** Botão deslizante laranja indicando se o cliente será salvo de forma permanente.
- **Round Icon Button (+):** Botão azul escuro com ícone de adição para cadastrar novos endereços.
- **Address Card:** Bloco com borda cinza contendo título, etiqueta, descrição do endereço em duas linhas e ações de controle na direita.
- **Badge:** Tag de identificação cinza arredondada (ex: `Principal`).

## Campos
- **Telefone:** Telefone de contato (`(41) 998364028`).
- **Nome (obrigatório):** Nome ou Razão Social do cliente (`Teste`).
- **CPF/CNPJ:** Documento de identificação nacional (`101.389.219-46`).
- **IE:** Inscrição Estadual (campo opcional com placeholder `IE`).
- **Título do Endereço:** Identificador do endereço (ex: `Casa do Dev`).
- **Linha de Endereço 1:** Logradouro, número e complemento (`Rua Acre, 288, Ap 210 bloco 4`).
- **Linha de Endereço 2:** Bairro, cidade, estado e CEP (`Boneca do Iguaçu, São José dos Pinhais, PR, - CEP: 83040-030`).

## Botões
- **Fechar (X):** Cancela a edição/cadastro e retorna para a lista.
- **Buscar (lupa):** Executa consultas rápidas ou pesquisas adicionais.
- **Salvar (visto check):** No topo direito, grava as informações e fecha a tela.
- **PULAR:** Atalho para prosseguir com a venda sem salvar o cliente de forma definitiva (útil no checkout rápido).
- **Adicionar Endereço (+):** Abre a modal de cadastro de endereço.
- **Endereço Principal (check circle):** Ícone indicando/ativando o endereço como o principal do cliente.
- **Mais Ações (três pontos verticais):** Menu de opções individuais do endereço (Editar/Remover).

## Navegação Identificável
- Clicar em "Fechar (X)" retorna à **Tela de Clientes (Principal)**.
- Botão salvar (check) retorna à **Tela de Clientes (Principal)**.
- Botão "Adicionar Endereço (+)" abre a **Modal de Adicionar Endereço**.

## Estados Visíveis
- **Salvar cliente ativo:** Switch ligado com cor laranja indicando persistência de dados.
- **Endereço Principal:** Destacado com a badge `Principal` e o ícone check verde ativo.

## Observações
- Campos obrigatórios são marcados com asterisco (`*`).

## Informações não identificáveis
- Nenhuma.
