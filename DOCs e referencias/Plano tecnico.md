# PLANO TÉCNICO — SISTEMA PDV ERP SAAS MULTIPLATAFORMA

## Visão Geral

Plataforma SaaS de gestão empresarial voltada para restaurantes, bares, lanchonetes, delivery, varejo e operações de eventos.

O sistema deverá operar em:

* Web
* Desktop
* Mobile
* SmartPOS
* Totens de Autoatendimento

Arquitetura Multiempresa, Multiusuário e Multicanal.

---

# Stack Tecnológica

## Frontend

* Next.js
* React
* Typescript
* TailwindCSS
* Shadcn/UI
* TanStack Query
* Zustand
* React Hook Form
* Zod

## Backend

* NestJS
* Typescript
* Prisma ORM

## Banco de Dados

* PostgreSQL (Supabase)

## Armazenamento

* Supabase Storage

## Tempo Real

* Supabase Realtime

## Filas

* Redis
* BullMQ

## Aplicativo Mobile

* WebToNative

## Aplicativo Desktop

* Electron

## Infraestrutura

Frontend:

* Vercel

Backend:

* VPS Linux
* Docker
* Nginx

Banco:

* Supabase

---

# Integrações Externas

## Fiscal

### PlugNotas

Responsável por:

* NFC-e
* NF-e
* Cancelamentos
* Carta de Correção
* Inutilizações
* Contingência

---

## Pagamentos

### Asaas

Responsável por:

* PIX
* Cartão
* Boleto
* Split de Pagamentos
* Cobranças
* Assinaturas

---

## Delivery

### iFood Merchant API

Responsável por:

* Recebimento de Pedidos
* Atualização de Status
* Confirmação de Produção
* Controle de Entrega

---

## WhatsApp

### Evolution API

Responsável por:

* Notificações
* Chat Integrado (WhatsApp embutido dentro do próprio App)
* Atendimento
* Mensagens Automáticas
* Sistema de Cobrança Automática (para clientes que assinarem via WhatsApp)

---

## Geolocalização

### Google Maps API

Responsável por:

* Endereços
* Distâncias
* Taxas de Entrega
* Rotas

---

## CEP

### ViaCEP

Responsável por:

* Consulta de Endereço

---

## SmartPOS

Integração inicial:

* Stone

Integrações futuras:

* PagBank
* Cielo LIO

---

# Arquitetura Geral

```text
Frontend (Next.js)
        |
        |
     NestJS
        |
        |
 PostgreSQL
   Supabase
        |
        |
    Redis
        |
        |
     BullMQ
        |
        |
 Integrações Externas
```

---

# Controle de Acesso

**Importante:** O sistema é um **aplicativo único (Single App)**. Não existirão aplicativos separados. Todos os usuários (administradores, gerentes, caixas, atendentes, etc.) acessarão o mesmo sistema, porém com **níveis de acesso e dashboards (painéis) completamente diferentes**, específicos para a função de cada um.

Login único para todos os usuários.

A interface será montada dinamicamente conforme:

* Perfil
* Permissões
* Empresa
* Filial

Fluxo:

```text
Login
↓
Autenticação
↓
Carregamento do Perfil
↓
Carregamento das Permissões
↓
Montagem Dinâmica da Interface
↓
Acesso aos Módulos Permitidos
```

---

# Perfis Padrão

## Administrador

Acesso total.

## Gerente

Acesso operacional e gerencial.

## Caixa

Operação de caixa e vendas.

## Atendente

Operação de pedidos e atendimento.

---

# Permissões Granulares

Controle por módulo.

Exemplos:

```text
produtos.create
produtos.update
produtos.delete

estoque.view
estoque.edit

caixa.open
caixa.close

financeiro.view

delivery.manage

usuarios.manage
```

---

# Estrutura do Banco de Dados

## Empresas

### companies

```sql
id uuid primary key

name varchar

document varchar

email varchar

phone varchar

created_at timestamp
```

---

## Filiais

### branches

```sql
id uuid primary key

company_id uuid

name varchar

address text

phone varchar

active boolean
```

---

## Usuários

### users

```sql
id uuid primary key

company_id uuid

branch_id uuid

role_id uuid

name varchar

email varchar

password_hash text

active boolean

created_at timestamp
```

---

## Perfis

### roles

```sql
id uuid primary key

name varchar
```

---

## Permissões

### permissions

```sql
id uuid primary key

module varchar

action varchar
```

---

## Relação Perfil x Permissões

### role_permissions

```sql
id uuid primary key

role_id uuid

permission_id uuid
```

---

# Cadastro de Produtos

## Categorias

### categories

```sql
id uuid primary key

company_id uuid

name varchar

active boolean
```

---

## Produtos

### products

```sql
id uuid primary key

company_id uuid

category_id uuid

name varchar

description text

sku varchar

barcode varchar

ncm varchar

cest varchar

cfop varchar

price numeric

cost numeric

minimum_stock numeric

stock_control boolean

active boolean
```

---

## Variações

### product_variations

```sql
id uuid primary key

product_id uuid

name varchar

price numeric
```

---

## Imagens

### product_images

```sql
id uuid primary key

product_id uuid

url text
```

---

## Combos

### product_compositions

```sql
id uuid primary key

product_id uuid

child_product_id uuid

quantity numeric
```

---

# Estoque

## Locais de Estoque

### stock_locations

```sql
id uuid primary key

company_id uuid

name varchar
```

---

## Movimentações

### stock_movements

```sql
id uuid primary key

product_id uuid

location_id uuid

type varchar

quantity numeric

cost numeric

user_id uuid

created_at timestamp
```

---

## Transferências

### stock_transfers

```sql
id uuid primary key

origin_location_id uuid

destination_location_id uuid

created_by uuid

created_at timestamp
```

---

# Caixa

## Caixas

### cash_registers

```sql
id uuid primary key

company_id uuid

name varchar
```

---

## Sessões de Caixa

### cash_sessions

```sql
id uuid primary key

cash_register_id uuid

opened_by uuid

opened_at timestamp

closed_at timestamp

opening_amount numeric

closing_amount numeric
```

---

# Vendas

## Vendas

### sales

```sql
id uuid primary key

company_id uuid

branch_id uuid

customer_id uuid

cash_session_id uuid

subtotal numeric

discount numeric

service_fee numeric

total numeric

status varchar

created_at timestamp
```

---

## Itens da Venda

### sale_items

```sql
id uuid primary key

sale_id uuid

product_id uuid

quantity numeric

unit_price numeric

total numeric
```

---

## Pagamentos

### payments

```sql
id uuid primary key

sale_id uuid

payment_method_id uuid

amount numeric

external_transaction_id varchar
```

---

## Métodos de Pagamento

### payment_methods

```sql
id uuid primary key

name varchar

active boolean
```

---

# Clientes

## Clientes

### customers

```sql
id uuid primary key

company_id uuid

name varchar

document varchar

email varchar

phone varchar

birth_date date

credit_limit numeric

active boolean
```

---

## Endereços

### customer_addresses

```sql
id uuid primary key

customer_id uuid

zip_code varchar

street varchar

number varchar

district varchar

city varchar

state varchar
```

---

# Fornecedores

### suppliers

```sql
id uuid primary key

company_id uuid

name varchar

document varchar

email varchar

phone varchar
```

---

# Restaurante

## Mesas

### tables

```sql
id uuid primary key

company_id uuid

number varchar

status varchar
```

---

## Comandas

### tabs

```sql
id uuid primary key

company_id uuid

customer_id uuid

status varchar

opened_at timestamp
```

---

## Itens da Comanda

### tab_items

```sql
id uuid primary key

tab_id uuid

product_id uuid

quantity numeric

unit_price numeric
```

---

## Pedidos de Mesa

### table_orders

```sql
id uuid primary key

table_id uuid

sale_id uuid
```

---

# Delivery

## Pedidos

### delivery_orders

```sql
id uuid primary key

customer_id uuid

driver_id uuid

sale_id uuid

status varchar

delivery_fee numeric

address_id uuid

created_at timestamp
```

---

## Motoboys

### delivery_drivers

```sql
id uuid primary key

name varchar

phone varchar

active boolean
```

---

## Integração iFood

### ifood_orders

```sql
id uuid primary key

external_id varchar

payload jsonb

status varchar
```

---

# Financeiro

## Contas a Receber

### accounts_receivable

```sql
id uuid primary key

customer_id uuid

amount numeric

due_date date

status varchar
```

---

## Contas a Pagar

### accounts_payable

```sql
id uuid primary key

supplier_id uuid

amount numeric

due_date date

status varchar
```

---

# Fiscal

## Notas Fiscais

### invoices

```sql
id uuid primary key

sale_id uuid

invoice_number varchar

access_key varchar

status varchar

xml_url text

pdf_url text
```

---

# Notificações

### notifications

```sql
id uuid primary key

user_id uuid

title varchar

message text

read boolean

created_at timestamp
```

---

# Auditoria

### audit_logs

```sql
id uuid primary key

user_id uuid

action varchar

table_name varchar

record_id uuid

payload jsonb

created_at timestamp
```

---

# Operação Offline

Tecnologia:

* IndexedDB
* DexieJS

Fluxo:

```text
Servidor
↓
Sincronização
↓
Banco Local
↓
Operação Offline
↓
Fila de Eventos
↓
Reconciliação Automática
↓
Servidor
```

---

# Eventos e Ingressos

## Eventos

### events

```sql
id uuid primary key

company_id uuid

name varchar

description text

start_date timestamp

end_date timestamp

location varchar

status varchar
```

---

## Lotes e Setores

### event_sectors

```sql
id uuid primary key

event_id uuid

name varchar

capacity integer
```

### ticket_batches

```sql
id uuid primary key

sector_id uuid

name varchar

price numeric

quantity integer

available integer

start_date timestamp

end_date timestamp
```

---

## Ingressos (Tickets)

### tickets

```sql
id uuid primary key

batch_id uuid

customer_id uuid

sale_id uuid

qr_code varchar

status varchar

validated_at timestamp
```

---

# Cashless (Cartões e Pulseiras RFID)

## Dispositivos RFID

### rfid_devices

```sql
id uuid primary key

company_id uuid

uid varchar unique

type varchar

status varchar

customer_id uuid

balance numeric
```

---

## Recargas e Transações Cashless

### cashless_transactions

```sql
id uuid primary key

device_id uuid

sale_id uuid

type varchar

amount numeric

created_at timestamp
```

---

# Hardware e Integrações Físicas

## Equipamentos

### hardware_devices

```sql
id uuid primary key

company_id uuid

branch_id uuid

type varchar

name varchar

ip_address varchar

port varchar

status varchar
```

---

## Configuração de Totens

### totems

```sql
id uuid primary key

company_id uuid

branch_id uuid

name varchar

status varchar

last_ping timestamp
```

---

# Módulos do Sistema

* Dashboard
* Caixa
* PDV
* Produtos
* Categorias
* Clientes
* Fornecedores
* Estoque
* Financeiro
* Relatórios
* Delivery
* Mesas
* Comandas
* Produção
* Fiscal
* Configurações
* Usuários
* Permissões
* WhatsApp
* SmartPOS
* Totem de Autoatendimento
* Eventos e Ingressos
* Gestão Cashless (RFID)
* Gestão de Hardwares
* Multiempresa
* Multi Filiais

---

# Roadmap Futuro

* Aplicativo Cliente
* Aplicativo Garçom
* Fidelidade
* Cashback
* Clube de Assinaturas
* Marketplace Próprio
* Business Intelligence
* Inteligência Artificial para Previsão de Estoque
* Inteligência Artificial para Previsão de Vendas
* Integração Marketplace Externo
* Integração ERP Contábil

```