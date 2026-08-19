# Tela de Configuração Fiscal Padrão (Produtos)

**Arquivo:** `tela de produto - tela de configuração fiscal padrão.png`

## Objetivo
Configurar os parâmetros fiscais padrão de ICMS, PIS e COFINS que serão herdados automaticamente pelos produtos que tiverem a opção "Utilizar padrão" ativada em seu cadastro.

## Hierarquia Visual
1. Barra superior com botão de voltar, título ("Configuração fiscal padrão") e botão de salvar (check).
2. Mensagem informativa sobre a regra de herança dos dados fiscais.
3. Lista de campos de configuração tributária (CSOSN, Redução de Base, Alíquota e CST).

## Seções
- **Formulário Tributário (Principal):** Configuração dos campos fiscais obrigatórios.

## Componentes
- **Select Dropdown / Input Box:** Campos de entrada com as opções fiscais pré-cadastradas.

## Campos
- **CSOSN ICMS (obrigatório):** Código de Situação da Operação do Simples Nacional (`500 - ICMS cobrado anteriormente por substituição tributária (substituído) ou por antecipação`).
- **Redução da base de cálculo efetiva:** Porcentagem de redução da base (`% 0,00`).
- **Alíquota do ICMS efetiva:** Porcentagem da alíquota do imposto (`% 0,00`).
- **CST PIS/COFINS (obrigatório):** Código de Situação Tributária do PIS/COFINS (`99 - Outras Operações`).

## Botões
- **Voltar (seta esquerda):** Cancela as alterações e retorna à tela anterior.
- **Salvar (visto check):** Canto superior direito, confirma as alterações e grava a configuração padrão.

## Navegação Identificável
- Seta superior esquerda retorna para o **Formulário de Adicionar/Editar Produto**.
- Botão salvar (check) retorna para o **Formulário de Adicionar/Editar Produto**.

## Estados Visíveis
- **Campos preenchidos:** Parâmetros padrão ativos carregados em tela.

## Observações
- Os campos obrigatórios são marcados com asterisco (`*`).

## Informações não identificáveis
- Nenhuma.
