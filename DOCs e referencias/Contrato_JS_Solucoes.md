# CONTRATO DE PRESTAÇÃO DE SERVIÇOS DE DESENVOLVIMENTO DE SOFTWARE

**CONTRATANTE:**
**Razão Social:** JS Soluções Tecnológicas
**CNPJ:** 36.383.365.0001-90
**Endereço:** Rua Concordia, N 403, Bairro Concordia, Teófilo Otoni - MG
Neste ato, doravante denominada simplesmente **CONTRATANTE**.

**CONTRATADO:**
**Nome:** Marcos Vinicius da Rosa Gomes
**CPF:** 101.389.219-46
**Endereço:** Rua Acre 288, Boneca do Iguaçu, São José dos Pinhais - PR
Neste ato, doravante denominado simplesmente **CONTRATADO**.

As partes acima qualificadas celebram entre si o presente Contrato de Prestação de Serviços de Desenvolvimento de Software, que se regerá pelas cláusulas e condições a seguir:

---

### CLÁUSULA PRIMEIRA - DO OBJETO
O objeto deste contrato é a prestação de serviços de arquitetura e desenvolvimento de uma **Plataforma SaaS ERP e PDV Multiplataforma** para a CONTRATANTE, englobando operações web, desktop, mobile, totens de autoatendimento e maquininhas SmartPOS.

**1.1. Escopo Abrangente do Projeto:**
O desenvolvimento contemplará, de forma completa, os seguintes módulos de negócio aprovados na proposta técnica:
- **Painel Master Whitelabel:** Sistema de administração superior para venda do software como serviço (SaaS), gerenciamento global das contas (restaurantes/empresas) e personalização da plataforma.
- **Sistema de Cobrança (Faturamento):** Módulo automatizado para cobrança das assinaturas dos clientes finais, controle de inadimplência e emissão de cobranças recorrentes.
- **Gerenciamento de Clientes (CRM B2B):** Gestão completa da carteira de clientes, acompanhamento de status de licenças e histórico financeiro das contas.
- **Core e Cadastros Locais:** Gestão de Múltiplas Empresas e Filiais, Controle de Usuários e Permissões (RBAC).
- **Caixa e PDV (Offline-First):** Operação de vendas com resiliência offline, garantindo a continuidade da operação mesmo sem acesso à internet externa.
- **Gestão de Atendimento:** Controle de Mesas, Comandas e integração de produção (Cozinha).
- **Módulo Fiscal:** Emissão de NFC-e e NF-e, incluindo contingência offline e integração automática SEFAZ.
- **Módulo de Delivery:** Recepção de pedidos, gestão de entregadores (motoboys) e taxa de entrega.
- **Módulo de Eventos e Ingressos:** Criação de eventos, gestão de lotes, setores e validação de tickets via QR Code.
- **Módulo Cashless (RFID):** Gestão de cartões/pulseiras RFID para consumo pré e pós-pago, incluindo recargas e estornos.
- **Integração de Hardwares:** Módulo ponte para comunicação com balanças, impressoras térmicas e catracas de acesso.
- **Totens e SmartPOS:** Adaptação da interface para operação em totens de autoatendimento (Kiosk Mode) e maquininhas inteligentes.

**1.2. Especificações Técnicas e Integrações:**
O sistema será construído utilizando tecnologias modernas de alta performance:
- **Frontend/Mobile:** Next.js (React), TypeScript, TailwindCSS e Shadcn/UI, empacotado via WebToNative (Mobile) e Electron (Desktop).
- **Backend:** NestJS (Node.js/TypeScript) com Prisma ORM.
- **Banco de Dados e Nuvem:** PostgreSQL (via Supabase), utilizando recursos de sincronização offline via IndexedDB/DexieJS.
- **Filas e Cache:** Redis e BullMQ.
- **Integrações de APIs:** iFood Merchant API (Delivery), Evolution API (WhatsApp), Asaas (Pagamentos e Assinaturas), PlugNotas (Fiscal), APIs de Localização (Google Maps/ViaCEP) e APIs de SmartPOS (Terminais de Pagamento).

**1.3. Fornecimento de Equipamentos para Testes:**
Para garantir a correta integração e homologação do módulo de SmartPOS (Terminais de Pagamento), a CONTRATANTE compromete-se a fornecer ao CONTRATADO, em caráter de empréstimo, uma maquininha física de testes devidamente habilitada para desenvolvimento, caso se faça necessário.

---

### CLÁUSULA SEGUNDA - DA METODOLOGIA DE TRABALHO (MÉTODO FED)
O projeto será executado seguindo o **Método FED (Framework de Execução Determinística)**, garantindo previsibilidade, escalabilidade e soberania da CONTRATANTE. 

**2.1. A Regra de Linearidade:** 
O projeto é dividido em Fases de entrega. Uma fase posterior só é iniciada após a validação, aprovação e pagamento referente à fase anterior.
- **Fase 01 (Esqueleto e Arquitetura):** Desenvolvimento do esqueleto navegável visualmente (telas e rotas construídas) e infraestrutura em nuvem configurada sob posse da CONTRATANTE.
- **Fase 02 (Integrações Web e Backend):** Conexão do sistema com o banco de dados e APIs web externas (iFood, WhatsApp, meios de pagamento web).
- **Fase 03 (Integração de Hardware):** Implementação e comunicação direta com as maquininhas de pagamento e totens (SmartPOS).
- **Fase 04 (Entrega e Handover):** Testes finais, homologação e passagem de bastão oficial do sistema em produção.

**2.2. Soberania de Infraestrutura:** 
O CONTRATADO não reterá servidores em seu nome. Toda a infraestrutura em nuvem será registrada no CNPJ da CONTRATANTE, atuando o CONTRATADO apenas como administrador técnico autorizado.

**2.3. Custos de Infraestrutura e Terceiros:**
Todos os custos recorrentes referentes a hospedagem de servidores, banco de dados, domínios, contas de desenvolvedor (Apple Developer, Google Play Console) e quaisquer gastos atrelados ao consumo de APIs externas (WhatsApp, PlugNotas, Google Maps, etc.) são de **inteira responsabilidade da CONTRATANTE**.

**2.4. Aprovações e Limite de Revisões:**
Para cada fase entregue, a CONTRATANTE terá direito a até 2 (duas) rodadas de revisões pontuais, desde que dentro do escopo previamente aprovado. Revisões excedentes serão cobradas à parte sob o valor fixo de **R$ 60,00 (sessenta reais) por hora técnica**. Adicionalmente, caso a CONTRATANTE receba a entrega de uma fase e não se manifeste em até 5 (cinco) dias úteis aprovando ou solicitando ajustes, a fase será considerada **tacitamente aprovada**.

---

### CLÁUSULA TERCEIRA - DOS PRAZOS E CRONOGRAMA
O prazo estimado para a entrega integral do escopo definido na Cláusula Primeira é de **100 a 120 dias úteis**, contados a partir da data de compensação da primeira parcela financeira e entrega de todos os acessos necessários pela CONTRATANTE.

---

### CLÁUSULA QUARTA - DO VALOR E CONDIÇÕES DE PAGAMENTO
Pela prestação dos serviços objeto deste contrato, a CONTRATANTE pagará ao CONTRATADO o valor total, fechado e intransferível de **R$ 15.000,00 (quinze mil reais)**, dividido em 4 (quatro) etapas de execução e pagamentos:

- **1ª Etapa (25% - R$ 3.750,00):** Entrada (Sinal), cobrindo o desenvolvimento inicial e a entrega do esqueleto navegável do aplicativo (Fase 01).
- **2ª Etapa (25% - R$ 3.750,00):** A ser paga após a entrega da primeira etapa, para cobrir a integração do sistema com o Backend e as APIs Web (exemplo: integração com iFood e WhatsApp) (Fase 02).
- **3ª Etapa (25% - R$ 3.750,00):** A ser paga após a entrega da segunda etapa, para cobrir a integração complexa com as maquininhas de pagamento e SmartPOS (Fase 03).
- **4ª Etapa (25% - R$ 3.750,00):** A ser paga na conclusão, homologação e entrega final do aplicativo em produção, com o código-fonte integralmente transferido (Fase 04).

**4.1. Forma de Pagamento e Taxas:**
Os pagamentos deverão ser realizados exclusivamente via **PIX**, através da chave: **101.389.219-46**. Caso a CONTRATANTE necessite ou opte por realizar o pagamento através de outro meio (plataformas de cobrança, cartão, boleto), **todas as taxas de operação ou intermediação geradas por esse método de pagamento serão de responsabilidade da CONTRATANTE**, devendo o valor líquido recebido pelo CONTRATADO ser exatamente o estipulado nas parcelas acima.

*Parágrafo Primeiro:* Atrasos no pagamento de qualquer parcela acarretarão a suspensão imediata do desenvolvimento até a devida regularização, postergando o cronograma final na mesma proporção dos dias de atraso.

*Parágrafo Segundo:* Em caso de atraso superior a 3 (três) dias corridos no pagamento de qualquer parcela, incidirá multa moratória de 2% (dois por cento) sobre o valor da parcela em atraso, acrescida de juros de 1% (um por cento) ao mês, calculados proporcionalmente aos dias de atraso, até a efetiva quitação.

---

### CLÁUSULA QUINTA - DA PROPRIEDADE INTELECTUAL E DIREITOS AUTORAIS
O CONTRATADO declara que todo o código-fonte, arquitetura de banco de dados, design de interface e lógicas de negócio desenvolvidas exclusivamente para a consecução deste contrato passarão a ser de **PROPRIEDADE INTELECTUAL EXCLUSIVA DA CONTRATANTE**, livres de quaisquer royalties ou taxas de licenciamento posteriores.

*Parágrafo Primeiro:* A transferência definitiva dos direitos de propriedade intelectual ocorrerá **apenas após a quitação integral** de todas as parcelas previstas na Cláusula Quarta.
*Parágrafo Segundo:* É resguardado ao CONTRATADO o direito de utilizar blocos de código de domínio público genérico (Design System, utilitários lógicos open-source) que compõem sua base aceleradora, transferindo à CONTRATANTE o direito de uso perpétuo dos mesmos no escopo deste produto.

---

### CLÁUSULA SEXTA - DA RESCISÃO E MULTA
Este contrato poderá ser rescindido por qualquer uma das partes, mediante aviso prévio documentado de 15 (quinze) dias.

**6.1. Rescisão por parte da CONTRATANTE:**
Caso a CONTRATANTE decida cancelar o projeto antes da conclusão, os valores das parcelas já pagas por Fases entregues ou iniciadas **não serão reembolsados**, servindo como remuneração pelo trabalho intelectual já despendido. O código-fonte produzido até o limite financeiro quitado será entregue à CONTRATANTE.

**6.2. Rescisão por parte do CONTRATADO:**
Caso o CONTRATADO desista do projeto de forma imotivada, ele deverá entregar todo o trabalho realizado até o momento e estornar o valor financeiro correspondente exclusivamente à fase que recebeu mas não concluiu, garantindo que a CONTRATANTE não sofra prejuízo por código não entregue.

*Exemplo prático de devolução:* Caso o CONTRATADO entregue a primeira etapa (esqueleto navegável), receba o pagamento para iniciar a execução da próxima etapa (integrações web) e, por algum motivo não consiga concluí-la, ele devolverá à CONTRATANTE **apenas** o valor referente a esta segunda etapa, uma vez que o trabalho da primeira etapa já foi executado, entregue e é de propriedade da CONTRATANTE.

**6.3. Abandono de Projeto:**
Caso a CONTRATANTE deixe de responder às comunicações oficiais do CONTRATADO, ou deixe de fornecer acessos e retornos críticos para o andamento do desenvolvimento por um período ininterrupto de 7 (sete) dias corridos e sem aviso prévio, o projeto será considerado **cancelado unilateralmente por parte da CONTRATANTE**, aplicando-se integralmente a penalidade descrita no item 6.1 (sem devolução de valores das fases já iniciadas ou entregues).

---

### CLÁUSULA SÉTIMA - DAS ALTERAÇÕES DE ESCOPO
O escopo detalhado na Cláusula Primeira blinda as entregas deste projeto. Quaisquer pedidos de novas funcionalidades, módulos extras ou alterações drásticas em requisitos já aprovados (Fase 01) serão avaliados pelo CONTRATADO e exigirão um **Aditivo Contratual**, contendo novos prazos e orçamentos à parte.

---

### CLÁUSULA OITAVA - DA GARANTIA E SUPORTE PÓS-VENDA
Após a conclusão e entrega final do sistema em produção (Fase 04), a CONTRATANTE terá um prazo de **30 (trinta) dias de garantia legal** exclusivo para a correção de eventuais *bugs* ou falhas de funcionamento, sem nenhum custo adicional. Entende-se por "bug" o não funcionamento de uma funcionalidade exatamente como estava no escopo aprovado (alterações de requisitos ou novas melhorias não se enquadram como bugs).

*Parágrafo Único:* Encerrado este período de 30 dias, o CONTRATADO se isenta de realizar manutenções ou correções gratuitas, ficando desde já disponível para a contratação à parte de um plano de **Suporte e Manutenção Mensal**, caso seja do interesse da CONTRATANTE.

---

### CLÁUSULA NONA - DA LIMITAÇÃO DE RESPONSABILIDADE
Considerando a complexidade do desenvolvimento de software e a dependência de integrações e APIs de terceiros, o CONTRATADO não se responsabiliza por lucros cessantes, perdas financeiras, danos comerciais ou indiretos sofridos pela CONTRATANTE decorrentes de eventuais falhas, interrupções ou *bugs* no sistema. Em qualquer hipótese legal ou litígio, a responsabilidade financeira máxima e total do CONTRATADO perante a CONTRATANTE limita-se estritamente ao valor global recebido através deste contrato.

---

### CLÁUSULA DÉCIMA - DO FORO
Para dirimir quaisquer controvérsias oriundas deste Contrato, as partes elegem o foro da Comarca de São José dos Pinhais - PR, renunciando a qualquer outro, por mais privilegiado que seja.

E por estarem justas e contratadas, as partes assinam o presente instrumento em 2 (duas) vias de igual teor.

**Data:** 17/06/2026.


_______________________________________________________
**CONTRATANTE:** JS Soluções Tecnológicas
CNPJ: 36.383.365.0001-90


_______________________________________________________
**CONTRATADO:** Marcos Vinicius da Rosa Gomes
CPF: 101.389.219-46
