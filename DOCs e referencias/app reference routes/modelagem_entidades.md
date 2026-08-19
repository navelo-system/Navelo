# Modelagem de Entidades do Sistema (Domain Models)

Este documento centraliza a modelagem de domínio do sistema Navelo. Ele serve como "Fonte Única de Verdade" para a criação de tipagens TypeScript (`interfaces`) e para a padronização de como os dados são trafegados entre o Banco de Dados e os Componentes de UI.

---

## 📦 1. Catálogo e Estoque

### 1.1. Produto (`Product`)
Entidade central de venda. Pode ser Simples, Composto (possui Ficha Técnica) ou Combo.
**Atributos:**
- `id` (UUID)
- `tenantId` (UUID) - Referência à Empresa
- `name` (String)
- `type` (Enum: SIMPLE, COMPOSITE, COMBO)
- `mainImage` (URL)
- `gallery` (Array de URLs)
- `description` (String - Curta)
- `detailedDescription` (String/HTML - Delivery)
- `unitType` (Enum: UN, KG, L, etc.)
- `categoryId` (UUID)
- `subcategoryId` (UUID - Opcional)
- `barcode` (String)
- `stock` (Float)
- `minStock` (Float)
- `costPrice` (Float)
- `otherCosts` (Float)
- `marginPercentage` (Float)
- `sellingPrice` (Float)
- `isActive` (Boolean)
- `taxRuleId` (UUID) - Regra fiscal global vinculada
- `fiscalOverrides` (JSON) - Exceções locais (ICMS padrão, CSOSN, Redução Base, CST PIS/COFINS)

**Exposto nos Componentes:**
- `ProductCard` (Caixa/PDV): Exibe `mainImage`, `name`, `sellingPrice`. Componente otimizado para clique rápido (adicionar ao carrinho).
- `ProductListItem` (Painel Admin - Tabela): Exibe `name`, `category`, `stock` (alerta de cor se < `minStock`), `sellingPrice` e ações de Editar/Excluir.
- `ProductForm` (Painel Admin): Todos os campos acima divididos em abas (Básico, Preços, Estoque, Fiscal).

### 1.2. Categoria (`Category`)
Agrupador de produtos para exibição no cardápio e relatórios.
**Atributos:**
- `id` (UUID)
- `name` (String)
- `color` (String - HEX)
- `icon` (String)
- `order` (Int)
- `isActive` (Boolean)

**Exposto nos Componentes:**
- `CategoryFilterBar` (Caixa/PDV): Pílulas coloridas para filtrar o grid de `ProductCard`.
- `CategorySelect` (Formulários): Dropdown para atrelar a um Produto.

### 1.3. Ficha Técnica / Insumo (`RecipeItem`)
Relação entre um Produto Composto e seus ingredientes.
**Atributos:**
- `id` (UUID)
- `parentProductId` (UUID - Produto sendo preparado)
- `ingredientProductId` (UUID - Produto usado como ingrediente)
- `quantityUsed` (Float)
- `unitType` (Enum)

**Exposto nos Componentes:**
- `RecipeBuilderTable` (Produto): Tabela listando ingredientes, quantidade e custo de produção somado.

### 1.4. Movimentação de Estoque (`StockMovement`)
Registro de qualquer entrada, saída ou ajuste.
**Atributos:**
- `id` (UUID)
- `productId` (UUID)
- `type` (Enum: IN, OUT, ADJUSTMENT)
- `quantity` (Float)
- `reason` (String)
- `userId` (UUID - Quem fez)
- `createdAt` (Timestamp)
- `invoiceId` (UUID - Opcional, se veio de Nota Fiscal)

**Exposto nos Componentes:**
- `ManualStockEntryForm` (Painel Estoque): Modal para adicionar entrada/saída com quantidade e justificativa.
- `StockBalanceTable` (Painel Estoque): Tabela listando `Product`, `currentStock`, `minStock` e botão de Ação.

---

## 👥 2. Pessoas e Acessos

### 2.1. Cliente (`Customer`)
Pessoa física ou jurídica que compra no estabelecimento.
**Atributos:**
- `id` (UUID)
- `name` (String)
- `document` (String - CPF/CNPJ)
- `email` (String)
- `phone` (String)
- `loyaltyPoints` (Int)
- `cashbackBalance` (Float)
- `creditLimit` (Float) - Para compras fiado/crediário
- `usedCredit` (Float)
- `isActive` (Boolean)

**Exposto nos Componentes:**
- `CustomerSelectDropdown` (Caixa/PDV): Input de busca que exibe Nome e Documento.
- `CustomerListItem` (Painel Admin - Tabela): Exibe Nome, Documento, Limite de Crédito, e Status de Fidelidade.
- `CustomerForm` (Modal): Formulário com abas de Dados Pessoais e Endereços.

### 2.2. Endereço do Cliente (`CustomerAddress`)
**Atributos:**
- `id` (UUID)
- `customerId` (UUID)
- `zipCode` (String)
- `street` (String)
- `number` (String)
- `complement` (String)
- `neighborhood` (String)
- `city` (String)
- `state` (String)
- `isDefault` (Boolean)

**Exposto nos Componentes:**
- `AddressList` (CustomerForm): Grid de endereços salvos com botão de "Tornar Padrão".

### 2.3. Usuário / Colaborador (`User`)
Quem opera o sistema.
**Atributos:**
- `id` (UUID)
- `name` (String)
- `email` (String)
- `passwordHash` (String)
- `role` (Enum: ADMIN, MANAGER, CASHIER, ATTENDANT)
- `tenantId` (UUID)
- `pinCode` (String - 4 dígitos para PDV rápido)

**Exposto nos Componentes:**
- `UserListItem` (Painel de Usuários): Tabela com `name`, `email`, `role` (como Badge colorido) e `status`.
- `PinPadAuth` (App Mobile/PDV): Teclado numérico para login rápido na comanda/caixa usando `pinCode`.

### 2.4. Empresa / Filial (`Tenant`)
Os dados do assinante do SaaS.
**Atributos:**
- `id` (UUID)
- `corporateName` (String)
- `tradingName` (String)
- `cnpj` (String)
- `digitalCertificate` (File/Blob)
- `primaryColor` (String HEX)
- `secondaryColor` (String HEX)
- `logoUrl` (String)
- `subscriptionId` (UUID)

---

## 🏪 3. Operação de Venda (Frente de Loja)

### 3.1. Sessão de Caixa (`CashRegisterSession`)
O turno de um operador.
**Atributos:**
- `id` (UUID)
- `userId` (UUID)
- `openedAt` (Timestamp)
- `closedAt` (Timestamp - Nullable)
- `openingBalance` (Float) - Fundo de troco
- `closingBalance` (Float)
- `status` (Enum: OPEN, CLOSED)

**Exposto nos Componentes:**
- `CashierMenu` (PDV): Exibe quem está logado, horário de abertura e atalhos de Fechamento/Sangria.

### 3.2. Comanda / Mesa (`Tab`)
Agrupador temporário de consumo em restaurante.
**Atributos:**
- `id` (UUID)
- `identifier` (String - "Mesa 04", "Comanda 102")
- `status` (Enum: FREE, OCCUPIED, BILL_REQUESTED, PAYING)
- `openedAt` (Timestamp)
- `customerCount` (Int)

**Exposto nos Componentes:**
- `TabGridItem` (Painel de Comandas): Card quadrado exibindo o identificador gigante, tempo decorrido, valor atual, com a borda colorida baseada no `status`.

### 3.3. Pedido / Venda (`Order`)
A transação de venda finalizada ou em andamento.
**Atributos:**
- `id` (UUID)
- `orderNumber` (Int - Sequencial)
- `sessionId` (UUID - Vinculado ao Caixa)
- `tabId` (UUID - Opcional, se veio de mesa)
- `customerId` (UUID - Opcional)
- `source` (Enum: POS, DELIVERY, MOBILE, TOTEM)
- `subtotal` (Float)
- `discountAmount` (Float)
- `serviceFee` (Float)
- `total` (Float)
- `status` (Enum: DRAFT, COMPLETED, CANCELLED, REFUNDED)
- `createdAt` (Timestamp)

**Exposto nos Componentes:**
- `CartReceipt` (PDV Lateral): Componente visual similar a um cupom, exibe lista de itens, subtotais e botões de desconto/pagamento.
- `OrderHistoryTable` (Admin): Linha da tabela mostrando Data, Número, Valor, Cliente e Badge de Status.

### 3.4. Item do Pedido (`OrderItem`)
Os produtos dentro de uma venda.
**Atributos:**
- `id` (UUID)
- `orderId` (UUID)
- `productId` (UUID)
- `productNameSnapshot` (String - Para histórico inalterável)
- `unitPrice` (Float)
- `quantity` (Float)
- `totalPrice` (Float)
- `notes` (String - Ex: "Sem cebola")

**Exposto nos Componentes:**
- `CartItemRow` (PDV): Linha com controle de +/-, nome do item, valor e botão para adicionar anotações (`notes`).

---

## 💳 4. Financeiro e Fiscal

### 4.1. Transação Financeira (`PaymentTransaction`)
O pagamento recebido por uma Venda ou uma Conta a Pagar.
**Atributos:**
- `id` (UUID)
- `orderId` (UUID - Se for recebimento de venda)
- `type` (Enum: INCOME, EXPENSE, TRANSFER)
- `method` (Enum: CASH, CREDIT_CARD, DEBIT_CARD, PIX, VOUCHER, STORE_CREDIT)
- `amount` (Float)
- `installments` (Int)
- `status` (Enum: PENDING, APPROVED, REJECTED)

**Exposto nos Componentes:**
- `PaymentMethodModal` (PDV): Botões grandes (Dinheiro, Cartão, PIX). Se for Dinheiro, aciona popup com input de troco. Mostra cálculo de restante a pagar se dividido.

### 4.2. Nota Fiscal (`Invoice`)
Registro legal da SEFAZ.
**Atributos:**
- `id` (UUID)
- `orderId` (UUID)
- `type` (Enum: NFCE, NFE)
- `accessKey` (String)
- `xmlUrl` (String)
- `status` (Enum: ISSUED, CONTINGENCY, CANCELLED, REJECTED)

**Exposto nos Componentes:**
- `InvoiceListTable` (Painel Estoque/Fiscal): Exibe Número da Nota, Valor, Status SEFAZ (Verde/Vermelho), e botões de Download de XML/DANFE.

### 4.3. Regra Fiscal (`TaxRule`)
Tributação aplicável aos produtos.
**Atributos:**
- `id` (UUID)
- `name` (String)
- `ncm` (String)
- `cest` (String)
- `cfop` (String)
- `icmsCst` (String)
- `icmsAliquota` (Float)

**Exposto nos Componentes:**
- `TaxRuleForm` (Configuração Fiscal Padrão): Inputs atrelados aos códigos governamentais (CST, CSOSN).

---

## 🚚 5. Delivery e Produção

### 5.1. Entrega / Despacho (`DeliveryDispatch`)
Extensão de um Pedido originado no Delivery.
**Atributos:**
- `id` (UUID)
- `orderId` (UUID)
- `deliveryAddressId` (UUID)
- `deliveryFee` (Float)
- `driverId` (UUID - Opcional)
- `estimatedTime` (Timestamp)
- `status` (Enum: PENDING, DISPATCHED, DELIVERED, FAILED)

### 5.2. Ticket de Produção / KDS (`KitchenTicket`)
Comando para preparo.
**Atributos:**
- `id` (UUID)
- `orderId` (UUID)
- `destination` (Enum: KITCHEN, BAR)
- `status` (Enum: WAITING, PREPARING, DONE, DELIVERED)
- `items` (Array de referências aos OrderItems)
- `startedAt` (Timestamp)
- `finishedAt` (Timestamp)

**Exposto nos Componentes:**
- `KdsCard` (Tela da Cozinha): Card Kanban, exibindo Número da Venda/Comanda, Tempo decorrido (Piscando vermelho se estourado), Lista de Itens com fonte grande, e as `notes` em destaque amarelo.

---

## 📝 6. Auditoria

### 6.1. Log de Sistema (`AuditLog`)
Para rastreabilidade de ações críticas (Ex: cancelamento de item, sangria, alteração de preço).
**Atributos:**
- `id` (UUID)
- `userId` (UUID)
- `action` (String - Ex: "CANCEL_ORDER", "UPDATE_PRICE")
- `entityId` (UUID)
- `entityType` (String)
- `oldValue` (JSON)
- `newValue` (JSON)
- `createdAt` (Timestamp)
- `ipAddress` (String)

**Exposto nos Componentes:**
- `AuditLogTable` (Admin): Tabela restrita com linha do tempo de operações.
