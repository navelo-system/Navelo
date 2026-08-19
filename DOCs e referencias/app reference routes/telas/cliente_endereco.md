# Modal de Adicionar Endereço (Clientes)

**Arquivo:** `tela clientes - popup de adicionar endereço.png`

## Objetivo
Inserir um novo endereço completo (ou editar um já cadastrado) associando dados postais, geográficos e pontos de referência ao perfil do cliente.

## Hierarquia Visual
1. Título principal ("Dados do endereço").
2. Grupo de campos estruturados de endereço dispostos de forma linear e em colunas.
3. Botões de ação dispostos no rodapé inferior direito ("CANCELAR" e "ADICIONAR").

## Seções
- **Formulário de Endereço:** Área contendo todos os campos para preenchimento.
- **Barra de Ações:** Rodapé com botões de confirmação e cancelamento.

## Componentes
- **Modal Box:** Painel sobreposto com cantos arredondados.
- **Form Input Text:** Inputs de texto com identificadores embutidos na borda (outline label).

## Campos
- **Nome do Endereço (obrigatório):** Identificador ou apelido do endereço (ex: `Casa do Dev`).
- **CEP:** Código de Endereçamento Postal (`83040-030`).
- **Logradouro:** Nome da rua/avenida (`Rua Acre`).
- **Número:** Número predial/residencial (`288`).
- **Complemento:** Bloco, apartamento ou detalhes extras (`Ap 210 bloco 4`).
- **Bairro:** Divisão geográfica do município (`Boneca do Iguaçu`).
- **Cidade (obrigatório):** Nome da cidade acompanhada da sigla do Estado (`São José dos Pinhais-PR`).
- **Ponto de referência:** Informação adicional para guiar a entrega (campo vazio com placeholder `Ponto de referência`).

## Botões
- **CANCELAR:** Fecha a modal descartando as alterações de endereço.
- **ADICIONAR:** Valida os campos preenchidos, vincula o endereço ao cliente e fecha a modal.

## Navegação Identificável
- Ambas as ações ("CANCELAR" e "ADICIONAR") fecham a modal e retornam para o **Formulário de Adicionar/Editar Cliente**.

## Estados Visíveis
- **Campos obrigatórios:** Identificados com asterisco (`*`).

## Observações
- O campo de CEP pode autocompletar os campos de Logradouro, Bairro e Cidade via integração de CEP.

## Informações não identificáveis
- Nenhuma.
