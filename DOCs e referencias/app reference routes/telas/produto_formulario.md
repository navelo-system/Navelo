# Formulário de Adicionar / Editar Produto

**Arquivos:** `tela do produto - pt 1.png`, `tela de produto - pt 2.png`, `tela de produto - pt 3.png`, `tela de produto - pt 4.png`

## Objetivo
Cadastrar novos produtos ou editar as especificações de produtos existentes, incluindo dados básicos, estoque, custos, recursos adicionais (sabores, complementos, códigos de barra), pontos de impressão, modo de preparo e parâmetros tributários/fiscais.

## Hierarquia Visual
1. Barra superior com botão de voltar, título ("Produto") e botões de ação do formulário (Excluir, Salvar e Importar/Barcode).
2. Carregamento de imagem do produto (destaque circular central com miniatura e botão de upload).
3. Grupo de campos básicos de texto e seleção (Descrição, Unidade, Grupo e Subgrupo).
4. Grid de valores e estoque (Estoque físico, mínimo, custo, margem e venda).
5. Seções expansíveis estilo acordeão para recursos avançados:
   - **Multissabor**
   - **Complementos do subgrupo**
   - **Plataformas de venda**
   - **Códigos de barras**
   - **Ponto de impressão**
   - **Produção**
   - **Fiscal**
6. Link no final da página para parametrização fiscal padrão.

## Seções
- **Dados Gerais:** Título, imagens e campos descritivos básicos do produto.
- **Valores e Estoque:** Informações de custo, precificação e saldo físico de mercadoria.
- **Acordeão "Multissabor":** Configuração para produtos combinados (ex: pizzas meio a meio).
- **Acordeão "Complementos":** Vinculação de adicionais e opcionais associados ao subgrupo do produto.
- **Acordeão "Plataformas de Venda":** Parametrização para exibição em catálogo online/e-commerce.
- **Acordeão "Códigos de Barras":** Registro de códigos GTIN/EAN para leitura rápida.
- **Acordeão "Ponto de Impressão":** Definição de para qual impressora enviar o pedido de preparo.
- **Acordeão "Produção":** Cadastro de ficha técnica (ingredientes) e modo de preparo para o KDS.
- **Acordeão "Fiscal":** Definição tributária de NCM, CEST, Origem, ICMS, CSOSN, PIS e COFINS.

## Componentes
- **Image Input Box:** Bloco quadrado contendo a foto ativa do produto e botões circulares abaixo para adicionar/excluir arquivos.
- **Form Input Text / Textarea:** Caixas de entrada retangulares para texto livre ou detalhado.
- **Select Dropdown:** Campos de seleção com seta indicadora e botão "X" para limpar o valor selecionado.
- **Accordion:** Painéis retráteis identificados por títulos, ícones específicos à esquerda e setas de expansão à direita.
- **Switch Toggle:** Botões deslizantes para ligar/desligar recursos (ex: Habilitar, Catálogo Online, Fiscal Padrão).
- **Radio Buttons / Checkbox:** Controles de seleção de opções (ex: Proporcional/Maior preço, Produção Própria).

## Campos
- **Descrição (obrigatório):** Nome do produto (`BADEN BADEN GOLDEN 600ML`).
- **Descrição detalhada:** Texto detalhado para catálogo.
- **Unidade (obrigatório):** Tipo de medida (`UN`).
- **Grupo (obrigatório):** Categoria principal (`CERVEJAS ARTESANAIS`).
- **Subgrupo (obrigatório):** Subcategoria (`UNICO`).
- **Estoque (obrigatório):** Saldo atual (`0`).
- **Estoque mínimo:** Limite de alerta de reposição (`0`).
- **Preço de custo:** Valor pago na compra (`R$ 0,00`).
- **Outros custos:** Porcentagem de taxas extras (`% 0,00`).
- **Margem:** Lucratividade desejada (`% 0,00`).
- **Preço de venda (obrigatório):** Valor final cobrado (`R$ 18,00`).
- **Limite máximo (Multissabor):** Quantidade limite de sabores (`2`).
- **Preço diferente (Plataformas):** Valor alternativo para vendas online (`R$ 18,00`).
- **Ingredientes / Modo de preparo:** Campos de texto longo para KDS.
- **Código NCM:** Código de Nomenclatura Comum do Mercosul.
- **EX TIPI:** Exceção da Tabela de Incidência do IPI.
- **Código CEST:** Código Especificador da Substituição Tributária.
- **Origem da mercadoria (obrigatório):** Código de origem nacional/importada (`0 - Nacional, exceto as indicadas nos códigos 3, 4, 5 e 8`).
- **CSOSN ICMS:** Código de Situação da Operação do Simples Nacional (`500 - ICMS cobrado anteriormente por substituição tributária...`).
- **Redução base cálculo / Alíquota efetiva:** Porcentagens de tributação.
- **CST PIS/COFINS:** Código de Situação Tributária do PIS/COFINS (`99 - Outras Operações`).

## Botões
- **Voltar (seta esquerda):** Cancela a operação e retorna à lista de produtos.
- **Importar / Barcode (ícone de nuvem com código de barras):** Importação automática de dados do produto.
- **Excluir (lixeira):** Exclui o produto (exibido apenas no modo de edição).
- **Salvar (visto check):** Grava os dados do produto no banco.
- **Adicionar Sabor / Adicionar Complemento / Adicionar Código de barras:** Botões de inserção de itens secundários.
- **ACESSAR CONFIGURAÇÃO FISCAL PADRÃO:** Link no rodapé para acessar a parametrização geral.

## Navegação Identificável
- Seta superior esquerda retorna para a **Tela de Produtos (Principal)**.
- Botão salvar (check) retorna para a **Tela de Produtos (Principal)** após registrar os dados.
- Link inferior "ACESSAR CONFIGURAÇÃO FISCAL PADRÃO" direciona para a **Tela de Configuração Fiscal Padrão**.

## Estados Visíveis
- **Utilizar ICMS Padrão ativo:** Os campos de CSOSN e alíquotas de ICMS ficam travados/cinzas.
- **Utilizar PIS/COFINS Padrão ativo:** O campo CST PIS/COFINS fica travado/cinza.
- **Multissabor desativado:** Campos relacionados ficam ocultos ou travados.

## Observações
- Os campos obrigatórios são marcados com asterisco (`*`).

## Informações não identificáveis
- Nenhuma.
