# Identity

## O que este projeto é
Plataforma SaaS ERP e PDV multiplataforma (Web, Desktop, Mobile, Totem, SmartPOS) e multiempresa, voltada para food service, varejo e eventos. O sistema atua como Single App, renderizando interfaces baseadas no perfil e permissões do usuário, suportando operações whitelabel e offline-first.

## O que este projeto não é
Não é um conjunto de aplicativos separados para cada função. Não é um sistema engessado esteticamente (deve suportar whitelabel por cliente). Não é um sistema unicamente cloud-dependent (deve suportar operações de PDV offline de forma resiliente).

## Por que existe
Para centralizar toda a operação comercial, fiscal, de delivery, salão e pagamentos de um estabelecimento em um único ecossistema soberano, ágil e customizável.

## Usuários primários
- Administradores (Painel Master / SaaS)
- Gerentes de loja
- Caixas (Operação de PDV)
- Atendentes / Garçons (Mobile/Comandas)
- Clientes Finais (Autoatendimento / Delivery / Totem)

## Critérios de sucesso
- Construção do esqueleto navegável (Fase 1 do Método FED) com Design System 100% aderente às regras de atomicidade e tokens.
- Operação offline-first no PDV demonstrável e funcional.
- Capacidade whitelabel totalmente funcional (troca de variáveis CSS modificando a interface sem hardcodes).
- Integração de todas as plataformas em um Single App de base única (Next.js/React).

## Fluxogramas do Sistema

### Fluxo de Acesso e Carregamento (Main Flow)
```mermaid
flowchart TD
A[Usuário abre sistema] --> B{Possui sessão ativa?}
B -->|Sim| DASH[Dashboard]
B -->|Não| LOGIN[Tela de Login]
LOGIN --> C[Informar usuário e senha]
C --> D{Credenciais válidas?}
D -->|Não| E[Exibir erro]
E --> LOGIN
D -->|Sim| F[Carregar permissões]
F --> G{Multiempresa?}
G -->|Não| H[Carregar empresa padrão]
G -->|Sim| I[Selecionar empresa]
H --> J[Carregar configurações]
I --> J
J --> K[Sincronizar dados]
K --> L{Modo Offline?}
L -->|Não| M[Conectar servidor]
L -->|Sim| N[Carregar banco local]
M --> O[Dashboard]
N --> O
O --> P[Menu Principal]
P --> CAIXA[Caixa]
P --> COMANDAS[Comandas]
P --> DELIVERY[Delivery]
P --> PRODUTOS[Produtos]
P --> CLIENTES[Clientes]
P --> ESTOQUE[Estoque]
P --> RELATORIOS[Relatórios]
P --> CONFIG[Configurações]
```

### Gestão ERP
```mermaid
flowchart TD
A[Dashboard] --> B[Gestão ERP]
B --> PROD[Produtos]
B --> CAT[Categorias]
B --> FORN[Fornecedores]
B --> EST[Estoque]
B --> FIN[Financeiro]
B --> CLI[Clientes]
B --> REL[Relatórios]
%% PRODUTOS
PROD --> CADPROD[Cadastrar Produto]
CADPROD --> SIMPLES[Produto Simples]
CADPROD --> COMPOSTO[Produto Composto]
CADPROD --> FICHA[Ficha Técnica]
CADPROD --> COMBO[Combo]
CADPROD --> VAR[Variações]
SIMPLES --> SAVE[Salvar Produto]
COMPOSTO --> SAVE
FICHA --> SAVE
COMBO --> SAVE
VAR --> SAVE
%% ESTOQUE
EST --> ENTRADA[Entrada Estoque]
EST --> SAIDA[Saída Estoque]
EST --> INVENT[Inventário]
EST --> TRANSF[Transferência]
%% FINANCEIRO
FIN --> RECEBER[Contas Receber]
FIN --> PAGAR[Contas Pagar]
FIN --> FLUXO[Fluxo Caixa]
FIN --> DRE[DRE]
%% CLIENTES
CLI --> CADCLI[Cadastro Cliente]
CADCLI --> FID[Fidelidade]
CADCLI --> CASH[Cashback]
CADCLI --> CRED[Crediário]
%% RELATÓRIOS
REL --> RV[Relatórios Vendas]
REL --> RE[Relatórios Estoque]
REL --> RD[Relatórios Delivery]
REL --> RR[Relatórios Restaurante]
REL --> RF[Relatórios Financeiros]
```

### Módulo Restaurante (Mesas/Comandas)
```mermaid
flowchart TD
A[Dashboard] --> B[Módulo Restaurante]
B --> C{Mesa ou Comanda?}
C -->|Mesa| D[Abrir Mesa]
C -->|Comanda| E[Abrir Comanda]
D --> F[Adicionar Produtos]
E --> F
F --> G[Enviar Produção]
G --> COZ[Cozinha]
G --> BAR[Bar]
G --> CHUR[Churrasqueira]
G --> COPA[Copa]
COZ --> H[Pedido em andamento]
BAR --> H
CHUR --> H
COPA --> H
H --> I[Pedido entregue]
I --> J{Necessita operação especial?}
J --> TM[Transferir Mesa]
J --> TP[Transferir Produtos]
J --> UC[Unir Comandas]
J --> SC[Separar Comandas]
J --> DC[Dividir Conta]
J --> DI[Dividir Item]
J --> ATS[Aplicar Taxa Serviço]
TM --> CONT[Continuar Consumo]
TP --> CONT
UC --> CONT
SC --> CONT
DC --> CONT
DI --> CONT
ATS --> CONT
CONT --> FECH{Solicitar Fechamento?}
FECH -->|Não| F
FECH -->|Sim| RES[Resumo da Conta]
RES --> PAG[Pagamento]
PAG --> IND{Pagamento Individual?}
IND -->|Sim| DIVP[Dividir por pessoas]
IND -->|Não| PAGUNI[Pagamento único]
DIVP --> REC[Receber Pagamentos]
PAGUNI --> REC
REC --> NFCE[Emitir NFC-e]
NFCE --> ENC[Encerrar Mesa/Comanda]
ENC --> DASH[Dashboard]
```

### Módulo Delivery
```mermaid
flowchart TD
A[Dashboard] --> B[Módulo Delivery]
B --> C{Origem Pedido}
C --> APP[Aplicativo]
C --> SITE[Site]
C --> WPP[WhatsApp]
C --> IFOOD[iFood]
C --> AT[Atendente]
APP --> D[Criar Pedido]
SITE --> D
WPP --> D
IFOOD --> D
AT --> D
D --> E[Validar Endereço]
E --> F[Calcular Taxa Entrega]
F --> G[Selecionar Pagamento]
G --> H{Pagamento Online?}
H -->|Sim| I[Gateway Asaas/Stripe]
H -->|Não| J[Pagar na Entrega]
I --> K[Pedido Confirmado]
J --> K
K --> L[Enviar Produção]
L --> M[Cozinha]
M --> N[Pedido Pronto]
N --> O[Atribuir Motoboy]
O --> P[Pedido Saiu para Entrega]
P --> Q[Rastreamento]
Q --> R[Pedido Entregue]
R --> S[Finalizar Pedido]
S --> T[Atualizar Financeiro]
T --> U[Atualizar Relatórios]
```

### Módulo Caixa / PDV Checkout
```mermaid
flowchart TD
%% ================= DASHBOARD =================
A[Dashboard] --> B[Abrir Caixa]
B --> C{Caixa aberto?}
C -->|Sim| G[Nova Venda]
C -->|Não| D[Informar valor inicial]
D --> E[Abrir caixa]
E --> G
%% ================= VENDA =================
G --> H[Adicionar produtos]
H --> I{Forma de inclusão}
I --> J[Código]
I --> K[Código de Barras]
I --> L[Pesquisa]
I --> M[QR Code]
I --> N[Balança]
J --> O[Carrinho]
K --> O
L --> O
M --> O
N --> O
O --> P[Aplicar desconto]
P --> Q[Selecionar cliente]
Q --> R{Venda finalizada?}
R -->|Não| H
R -->|Sim| S[Pagamento]
%% ================= PAGAMENTO =================
S --> T{Forma de pagamento}
T --> U[PIX]
T --> V[Dinheiro]
T --> W[Débito]
T --> X[Crédito]
T --> Y[Voucher]
T --> Z[Crediário]
T --> AA[Pagamento Misto]
U --> AB[Registrar pagamento]
V --> AB
W --> AB
X --> AB
Y --> AB
Z --> AB
AA --> AB
%% ================= NFC-E =================
AB --> AC[Emitir NFC-e]
AC --> AD{Emissão OK?}
AD -->|Sim| AF[Imprimir comprovante]
AD -->|Não| AE[Entrar em contingência]
AE --> AF
%% ================= FINALIZAÇÃO =================
AF --> AG[Finalizar venda]
AG --> AH[Atualizar estoque]
AH --> AI[Atualizar financeiro]
AI --> AJ[Dashboard]
```

### Configurações do Sistema
```mermaid
flowchart TD
A[Dashboard] --> B[Configurações]
%% ================= USUÁRIOS =================
B --> C[Usuários]
C --> D[Cadastrar Usuário]
D --> E[Administrador]
D --> F[Gerente]
D --> G[Caixa]
D --> H[Atendente]
%% ================= PERMISSÕES =================
B --> I[Permissões]
I --> J[Permissões Granulares]
J --> K[Controle por Tela]
J --> L[Controle por Ação]
%% ================= FISCAL =================
B --> M[Fiscal]
M --> N[Configurar NFC-e]
N --> O[Certificado Digital]
O --> P[SEFAZ]
%% ================= INTEGRAÇÕES =================
B --> Q[Integrações]
Q --> R[iFood]
Q --> S[Gateway de Pagamento]
Q --> T[API Fiscal]
Q --> U[Conta Digital]
%% ================= HARDWARE =================
B --> V[Hardware]
V --> W[Impressoras]
V --> X[SmartPOS]
V --> Y[Balanças]
V --> Z[Leitores]
%% ================= WHATSAPP =================
B --> AA[WhatsApp]
AA --> AB[Conectar WhatsApp]
AB --> AC[Notificações Internas]
AC --> AD[Popup em Tempo Real]
%% ================= BACKUP =================
B --> AE[Backup]
AE --> AF[Backup Automático]
AE --> AG[Backup Nuvem]
%% ================= EMPRESA =================
B --> AH[Empresa]
AH --> AI[Dados Empresa]
AI --> AJ[Filiais]
AJ --> AK[Multiempresa]
AK --> AL[Salvar Configurações]
AL --> AM[Dashboard]
```

## Metadados
- Criado em: 2026-06-23
- Última revisão: 2026-06-25
- Status: ATIVO
