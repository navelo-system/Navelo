# Dashboard Inicial

**Arquivo:** `Dashboard inicial com o bento grid pra acesso de todas as telas.png`

## Objetivo
Apresentar uma visão geral dos dados de vendas e do caixa da empresa, fornecendo acesso rápido a todos os módulos do sistema.

## Hierarquia Visual
1. Cabeçalho de contexto com marca, status e identificador de perfil logado.
2. Grid de KPIs (Vendas, Totais em caixa, Total a receber).
3. Bento Grid contendo os atalhos visuais para os módulos do sistema.
4. Banner de alerta de pendências fiscais na parte inferior.

## Seções
- **Cabeçalho Principal:** Área de identificação com o título "Navelo - sistema PDV", ícones de status de conexão e visualização, além do link de logout com o usuário atual ("Administrador").
- **Grid de Indicadores (KPIs):** Três blocos com informações financeiras e status diários.
- **Atalhos do Sistema (Bento Grid):** Oito botões circulares ou quadrados arredondados com ícone e rótulo.
- **Área de Notificações / Pendências:** Card inferior com alertas do sistema.

## Componentes
- **KPI Card:** Três blocos brancos arredondados para métricas.
- **Bento Grid Button:** Botões com cantos arredondados contendo ícones lineares e rótulos pretos.
- **Alert Card:** Bloco horizontal com título, descrição, botão de ação e botão para fechar ("X").

## Campos
- **Vendas:** Valor monetário (`R$ 0,00`) e legenda descritiva (`Hoje - 0 vendas realizadas`).
- **Totais em caixa:** Valor monetário (`R$ 45,00`) e data/hora do último fechamento (`16/06/26 16:00`).
- **Total a receber:** Valor monetário (`R$ 0,00`) e legenda descritiva (`0 parcelas em aberto`).

## Botões
- **Ícones do Bento Grid:**
  - **Caixa:** Ícone de cesta de compras.
  - **Comandas:** Ícone de folha de recibo.
  - **Delivery:** Ícone de motocicleta.
  - **Estoque:** Ícone de caixa de papelão.
  - **Produtos:** Ícone de quatro quadrados agrupados.
  - **Clientes:** Ícone de dois usuários.
  - **Relatórios:** Ícone de gráfico de barras.
  - **Config:** Ícone de engrenagem.
- **Logout (Administrador):** Botão de saída com ícone de porta/seta.
- **Configurar:** Link de ação no card de pendências de NFC-e.
- **Fechar Alerta (X):** Botão de fechamento no canto superior direito do banner de NFC-e.

## Navegação Identificável
- Todos os botões do Bento Grid direcionam para suas respectivas telas (ex: Caixa, Estoque, Produtos, Clientes, etc.).
- Botão "Administrador" desconecta o usuário.
- Botão "Configurar" no rodapé redireciona para a tela de parametrização fiscal.

## Estados Visíveis
- **Indicadores ativos:** Valores preenchidos em tempo real.
- **Sincronização em nuvem:** Ícone de nuvem com check no cabeçalho sinalizando status ativo/online.

## Observações
- O layout utiliza fonte sem serifa.

## Informações não identificáveis
- Nenhuma.
