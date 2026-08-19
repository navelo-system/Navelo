# Tela de Notas Fiscais

**Arquivo:** `tela de estoque - Notas fiscais.png`

## Objetivo
Exibir notas fiscais de entrada de produtos importadas e fornecer opções de importação (carregando arquivo XML ou conectando diretamente à Sefaz).

## Hierarquia Visual
1. Barra superior com botão de voltar, título ("Notas fiscais") e botão de filtragem.
2. Centro com ilustração de Empty State e mensagem explicativa ("Nenhuma nota encontrada.").
3. Rodapé com dois botões de ação proeminentes de importação.

## Seções
- **Lista de Notas (Principal):** Atualmente vazia, exibindo a ilustração de ausência de registros.
- **Ações de Importação (Rodapé):** Área inferior que reúne as ações para entrada de novas notas fiscais.

## Componentes
- **Empty State:** Ilustração centralizada de um funcionário segurando uma caixa de papelão, associada ao texto explicativo.
- **Outline Button:** Botão "Importar XML" com borda fina azul e fundo claro.
- **Solid Button:** Botão "Importar da Sefaz" com fundo azul escuro preenchido e texto em laranja.

## Campos
- Nenhuns.

## Botões
- **Voltar (seta esquerda):** Retorna para a tela de Estoque principal.
- **Filtros (ícone de funil):** Canto superior direito, abre opções de filtragem das notas fiscais.
- **Importar XML:** Abre o seletor de arquivos do sistema operacional para carregar arquivos `.xml`.
- **Importar da Sefaz:** Abre fluxo para consulta e download automático de notas fiscais emitidas para o CNPJ do estabelecimento direto da Sefaz.

## Navegação Identificável
- Seta superior esquerda retorna para a **Tela de Estoque (Principal)**.

## Estados Visíveis
- **Lista Vazia:** Sem registros cadastrados, ativando a ilustração e a legenda correspondente.

## Observações
- Nenhuma.

## Informações não identificáveis
- Nenhuma.
