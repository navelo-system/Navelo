# Tela de Clientes (Principal)

**Arquivo:** `tela de clientes.png`

## Objetivo
Listar os clientes cadastrados na base de dados, exibir informações resumidas (nome e CPF) e disponibilizar atalhos para busca rápida e inserção de novos clientes.

## Hierarquia Visual
1. Barra superior com botão de voltar, título ("Clientes") e botão de busca rápida.
2. Lista vertical cobrindo o restante da tela contendo as linhas com dados dos clientes.
3. Botão flutuante (FAB) de adição no canto inferior direito.

## Seções
- **Lista de Clientes (Principal):** Relação corrida de todos os clientes registrados.

## Componentes
- **Client List Item (Linha):**
  - **Esquerda:** Avatar circular cinza contendo a letra inicial do nome do cliente em maiúsculo.
  - **Centro:** Nome do cliente em destaque e CPF (caso cadastrado) como legenda cinza abaixo.
- **Floating Action Button (FAB):** Botão circular azul escuro com ícone de soma laranja.

## Campos
- **Nome do Cliente:** Exibe o nome do cadastro (ex: `Teste`, `Teste 2`).
- **Documento (CPF):** Legenda descritiva abaixo do nome (ex: `101.389.219-46`).

## Botões
- **Voltar (seta esquerda):** Retorna ao Dashboard principal.
- **Buscar (lupa):** Abre campo de busca de texto para filtrar clientes por nome ou CPF.
- **Adicionar Cliente (FAB +):** Abre o formulário de cadastro de novo cliente.
- **Linha de Cliente (Linha clicável):** Redireciona para o formulário de edição do cliente selecionado.

## Navegação Identificável
- Seta superior esquerda retorna para o **Dashboard**.
- Botão flutuante (+) direciona para a **Tela de Adicionar Cliente**.
- Clicar em uma linha de cliente direciona para a **Tela de Editar Cliente** (mesmo formulário de adicionar).

## Estados Visíveis
- **Cliente com CPF:** Exibe o nome e o número do documento na linha.
- **Cliente sem CPF:** Exibe apenas o nome do cliente centralizado verticalmente na linha.

## Observações
- Nenhuma.

## Informações não identificáveis
- Nenhuma.
