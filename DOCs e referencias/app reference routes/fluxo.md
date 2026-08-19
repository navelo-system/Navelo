# Mapa de Fluxo — Navelo PDV

> **Escopo deste mapa:** Rota completa do perfil **Administrador**.
> Todos os outros perfis (Operador, Caixa, etc.) serão derivados deste fluxo por limitação de acesso — removendo telas e funcionalidades conforme o nível de permissão.

---

## Visão Geral da Estrutura

```
[LOGIN]
   └──▶ [DASHBOARD / HOME]
           ├──▶ [CAIXA]
           │       └──▶ [PAGAMENTO]
           │                 ├── Modal: Pagamento em Dinheiro
           │                 ├── Modal: Pagamento em Cartão
           │                 └── Menu de Seleção de Método
           │
           ├──▶ [COMANDAS]
           │       └── (ao abrir comanda) ──▶ [CAIXA vinculado à comanda]
           │                                       └──▶ [PAGAMENTO]
           │
           ├──▶ [DELIVERY]
           │
           ├──▶ [ESTOQUE]
           │       ├──▶ Balanço de Estoque
           │       ├──▶ Notas Fiscais
           │       └──▶ Entrada Manual
           │
           ├──▶ [PRODUTOS]
           │       ├──▶ Adicionar Produto (formulário)
           │       │       └──▶ Configuração Fiscal Padrão
           │       └──▶ Editar Produto (mesmo formulário de adicionar)
           │               └──▶ Configuração Fiscal Padrão
           │
           ├──▶ [CLIENTES]
           │       ├──▶ Adicionar Cliente (formulário)
           │       │       └── Modal: Adicionar Endereço
           │       └──▶ Editar Cliente (mesmo formulário de adicionar)
           │               └── Modal: Adicionar Endereço
           │
           ├──▶ [RELATÓRIOS]  ⟨pendente — será detalhado futuramente⟩
           └──▶ [CONFIGURAÇÕES]  ⟨pendente — será detalhado futuramente⟩
```

---

## Telas Mapeadas

### 🔐 Login
- **Especificação:** [login.md](file:///c:/Users/Marcos/Desktop/pra%20usar%20dps/5%20-%20Trabalho/PDV/DOCs%20e%20referencias/app%20reference%20routes/telas/login.md)
- **Print:** `tela de login.png`
- **Acesso:** Pública (sem autenticação)
- **Saída:** Redireciona para o Dashboard com o nível de acesso correspondente ao usuário autenticado.

---

### 🏠 Dashboard / Home
- **Especificação:** [dashboard.md](file:///c:/Users/Marcos/Desktop/pra%20usar%20dps/5%20-%20Trabalho/PDV/DOCs%20e%20referencias/app%20reference%20routes/telas/dashboard.md)
- **Print:** `Dashboard inicial com o bento grid pra acesso de todas as telas.png`
- **Saída (links no bento grid):**
  - Caixa
  - Comandas
  - Delivery
  - Estoque
  - Produtos
  - Clientes
  - Relatórios *(pendente)*
  - Configurações *(pendente)*
- **Cards informativos:** Total de vendas, Total em caixa, Total a receber.

---

### 🛒 Caixa
- **Especificação:** [caixa.md](file:///c:/Users/Marcos/Desktop/pra%20usar%20dps/5%20-%20Trabalho/PDV/DOCs%20e%20referencias/app%20reference%20routes/telas/caixa.md)
- **Menu da Caixa:** [caixa_menu.md](file:///c:/Users/Marcos/Desktop/pra%20usar%20dps/5%20-%20Trabalho/PDV/DOCs%20e%20referencias/app%20reference%20routes/telas/caixa_menu.md)
- **Print:** `tela de caixa.png`
- **Contexto:** Pode ser acessado diretamente do Dashboard ou vinculado a uma comanda.
- **Funcionalidades:**
  - Lista de produtos disponíveis
  - Alternância entre visualização em lista e em grade
  - Seleção de produtos
- **Saída:** Tela de Pagamento (com os itens selecionados)

---

### 💳 Pagamento
- **Especificação:** [pagamento.md](file:///c:/Users/Marcos/Desktop/pra%20usar%20dps/5%20-%20Trabalho/PDV/DOCs%20e%20referencias/app%20reference%20routes/telas/pagamento.md)
- **Prints:** `tela de pagamento.png`, `tela de pagamento - Menu.png`, `tela de pagamento - popup dinheiro.png`, `tela de pagamento - popup cartão.png`
- **Funcionalidades:**
  - Exibe os produtos na conta
  - Seleção de método de pagamento: Dinheiro, Cartão, Crediário, Pix
  - Múltiplos métodos podem ser selecionados para dividir o valor
- **Modais / Popups:**
  - Modal de Pagamento em Dinheiro (troco): [pagamento_dinheiro.md](file:///c:/Users/Marcos/Desktop/pra%20usar%20dps/5%20-%20Trabalho/PDV/DOCs%20e%20referencias/app%20reference%20routes/telas/pagamento_dinheiro.md)
  - Modal de Pagamento em Cartão: [pagamento_cartao.md](file:///c:/Users/Marcos/Desktop/pra%20usar%20dps/5%20-%20Trabalho/PDV/DOCs%20e%20referencias/app%20reference%20routes/telas/pagamento_cartao.md)
  - Menu de transação / Cupom: [caixa_menu.md](file:///c:/Users/Marcos/Desktop/pra%20usar%20dps/5%20-%20Trabalho/PDV/DOCs%20e%20referencias/app%20reference%20routes/telas/caixa_menu.md) (referente ao print `tela de pagamento - Menu.png`)

---

### 📋 Comandas
- **Especificação:** [comandas.md](file:///c:/Users/Marcos/Desktop/pra%20usar%20dps/5%20-%20Trabalho/PDV/DOCs%20e%20referencias/app%20reference%20routes/telas/comandas.md)
- **Menu de Comandas:** [comandas_menu.md](file:///c:/Users/Marcos/Desktop/pra%20usar%20dps/5%20-%20Trabalho/PDV/DOCs%20e%20referencias/app%20reference%20routes/telas/comandas_menu.md)
- **Prints:** `tela de comandas.png`, `tela de comandas - Menu.png`
- **Funcionalidades:**
  - Botão para adicionar nova comanda
  - Barra de pesquisa de comandas
  - Bento grid exibindo as comandas ativas
- **Ao clicar em uma comanda:**
  - Abre o fluxo do Caixa, já vinculado à comanda selecionada
  - Segue o mesmo fluxo de Caixa → Pagamento

---

### 🚚 Delivery
- **Funcionalidades:**
  - Lista de pedidos em aberto
  - Histórico de pedidos
  - Botão para registrar novo pedido

> ⚠️ *Prints pendentes — tela a detalhar futuramente.*

---

### 📦 Estoque
- **Especificação Geral:** [estoque.md](file:///c:/Users/Marcos/Desktop/pra%20usar%20dps/5%20-%20Trabalho/PDV/DOCs%20e%20referencias/app%20reference%20routes/telas/estoque.md)
- **Print:** `tela de estoque.png`
- **Ponto de entrada:** Exibe 3 opções de navegação
  1. **Balanço de Estoque** (Especificação: [estoque_balanco.md](file:///c:/Users/Marcos/Desktop/pra%20usar%20dps/5%20-%20Trabalho/PDV/DOCs%20e%20referencias/app%20reference%20routes/telas/estoque_balanco.md)) — Print: `tela de estoque - balanço de estoque.png`
  2. **Notas Fiscais** (Especificação: [estoque_notas.md](file:///c:/Users/Marcos/Desktop/pra%20usar%20dps/5%20-%20Trabalho/PDV/DOCs%20e%20referencias/app%20reference%20routes/telas/estoque_notas.md)) — Print: `tela de estoque - Notas fiscais.png`
  3. **Entrada Manual** (Especificação: [estoque_entrada.md](file:///c:/Users/Marcos/Desktop/pra%20usar%20dps/5%20-%20Trabalho/PDV/DOCs%20e%20referencias/app%20reference%20routes/telas/estoque_entrada.md)) — Print: `tela de estoque - entrada manual.png`

---

### 📦 Produtos
- **Especificação Geral:** [produtos.md](file:///c:/Users/Marcos/Desktop/pra%20usar%20dps/5%20-%20Trabalho/PDV/DOCs%20e%20referencias/app%20reference%20routes/telas/produtos.md)
- **Print:** `tela de produto.png`
- **Funcionalidades:**
  - Lista de produtos cadastrados
  - Campo de busca (search)
  - Botão para adicionar produto
- **Ao clicar em um produto:**
  - Abre tela de **Editar Produto** (idêntica à tela de **Adicionar Produto**)
- **Tela de Adicionar / Editar Produto:**
  - **Especificação:** [produto_formulario.md](file:///c:/Users/Marcos/Desktop/pra%20usar%20dps/5%20-%20Trabalho/PDV/DOCs%20e%20referencias/app%20reference%20routes/telas/produto_formulario.md)
  - **Prints:** `tela do produto - pt 1.png`, `tela de produto - pt 2.png`, `tela de produto - pt 3.png`, `tela de produto - pt 4.png`
  - Botão: Importar pelo código de barras
  - Botão: Salvar produto
  - Botão: Apagar produto *(apenas no modo edição)*
  - Link no rodapé → **Configuração Fiscal Padrão**
    - **Especificação:** [produto_fiscal.md](file:///c:/Users/Marcos/Desktop/pra%20usar%20dps/5%20-%20Trabalho/PDV/DOCs%20e%20referencias/app%20reference%20routes/telas/produto_fiscal.md)
    - **Print:** `tela de produto - tela de configuração fiscal padrão.png`

---

### 👤 Clientes
- **Especificação Geral:** [clientes.md](file:///c:/Users/Marcos/Desktop/pra%20usar%20dps/5%20-%20Trabalho/PDV/DOCs%20e%20referencias/app%20reference%20routes/telas/clientes.md)
- **Print:** `tela de clientes.png`
- **Funcionalidades:**
  - Lista de clientes cadastrados
  - Botão para adicionar novo cliente
- **Ao clicar em um cliente:**
  - Abre tela de **Editar Cliente** (idêntica à tela de **Adicionar Cliente**)
- **Tela de Adicionar / Editar Cliente:**
  - **Especificação:** [cliente_formulario.md](file:///c:/Users/Marcos/Desktop/pra%20usar%20dps/5%20-%20Trabalho/PDV/DOCs%20e%20referencias/app%20reference%20routes/telas/cliente_formulario.md)
  - **Print:** `tela de adicionar cliente.png`
  - Modal: Adicionar Endereço — **Especificação:** [cliente_endereco.md](file:///c:/Users/Marcos/Desktop/pra%20usar%20dps/5%20-%20Trabalho/PDV/DOCs%20e%20referencias/app%20reference%20routes/telas/cliente_endereco.md) | **Print:** `tela clientes - popup de adicionar endereço.png`

---

### 📊 Relatórios
> ⏳ *Pendente — será detalhado e implementado em ciclo futuro.*
> Acessível pelo Bento Grid do Dashboard.

---

### ⚙️ Configurações
> ⏳ *Pendente — será detalhado e implementado em ciclo futuro.*
> Acessível pelo Bento Grid do Dashboard.

---

## Princípio de Derivação por Perfil

Todos os perfis de usuário são derivados do fluxo do **Administrador**.
Cada perfil é definido pela **remoção** de telas e funcionalidades específicas:

| Perfil       | Telas / Funcionalidades Removidas (exemplos)           |
|--------------|--------------------------------------------------------|
| Operador     | Estoque, Produtos, Clientes, Configurações, Relatórios |
| Caixa        | Comandas, Delivery, Estoque, Produtos, Relatórios      |
| Gerente      | Configurações (parcial)                                |
| Administrador | Acesso total                                          |

> O mapeamento exato por perfil será definido durante a implementação do sistema de permissões.
