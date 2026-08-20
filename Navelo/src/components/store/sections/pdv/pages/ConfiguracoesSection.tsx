"use client"

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Icon } from "@/components/store/base/Icon"
import { Badge } from "@/components/store/base/Badge"
import { CompanyDataForm } from "@/components/store/advanced/CompanyDataForm"
import { CompanySyncForm } from "@/components/store/advanced/CompanySyncForm"
import { UsuariosSection } from "@/components/store/sections/pdv/pages/UsuariosSection"
import { RestricoesSection } from "@/components/store/sections/pdv/pages/RestricoesSection"
import { AutorizacoesSection } from "@/components/store/sections/pdv/pages/AutorizacoesSection"
import { NotaFiscalSection } from "@/components/store/sections/pdv/pages/NotaFiscalSection"
import { PagamentoIntegradoSection } from "@/components/store/sections/pdv/pages/PagamentoIntegradoSection"
import { ContaDigitalSection } from "@/components/store/sections/pdv/pages/ContaDigitalSection"
import { PixSection } from "@/components/store/sections/pdv/pages/PixSection"
import { CrediarioSection } from "@/components/store/sections/pdv/pages/CrediarioSection"
import { ConectaEntregadorSection } from "@/components/store/sections/pdv/pages/ConectaEntregadorSection"
import { ConsultaPrecoSection } from "@/components/store/sections/pdv/pages/ConsultaPrecoSection"
import { PesagemAutomaticaSection } from "@/components/store/sections/pdv/pages/PesagemAutomaticaSection"
import { MenuDigitalSection } from "@/components/store/sections/pdv/pages/MenuDigitalSection"
import { IdentificacaoSection } from "@/components/store/sections/pdv/pages/IdentificacaoSection"
import { CatalogoProdutosSection } from "@/components/store/sections/pdv/pages/CatalogoProdutosSection"
import { CatalogoOnlineSection } from "@/components/store/sections/pdv/pages/CatalogoOnlineSection"
import { HorarioAtendimentoSection } from "@/components/store/sections/pdv/pages/HorarioAtendimentoSection"
import { FormasPagamentoSection } from "@/components/store/sections/pdv/pages/FormasPagamentoSection"
import { WhatsAppSection } from "@/components/store/sections/pdv/pages/WhatsAppSection"
import { OpcoesEntregaSection } from "@/components/store/sections/pdv/pages/OpcoesEntregaSection"
import { OpcoesPedidoSection } from "@/components/store/sections/pdv/pages/OpcoesPedidoSection"
import { OpcoesPedidoMenuDigitalSection } from "@/components/store/sections/pdv/pages/OpcoesPedidoMenuDigitalSection"
import { IFoodSection } from "@/components/store/sections/pdv/pages/IFoodSection"
import { TaxaEntregaSection } from "@/components/store/sections/pdv/pages/TaxaEntregaSection"
import { MesasComandasSection } from "@/components/store/sections/pdv/pages/MesasComandasSection"
import { ConfigurarComandasSection } from "@/components/store/sections/pdv/pages/ConfigurarComandasSection"
import { TaxaServicoSection } from "@/components/store/sections/pdv/pages/TaxaServicoSection"
import { AutoatendimentoSection } from "@/components/store/sections/pdv/pages/AutoatendimentoSection"
import { AutoatendimentoCustomizacaoSection } from "@/components/store/sections/pdv/pages/AutoatendimentoCustomizacaoSection"
import { AutoatendimentoNumeroSection } from "@/components/store/sections/pdv/pages/AutoatendimentoNumeroSection"
import { GruposSubgruposSection } from "@/components/store/sections/pdv/pages/GruposSubgruposSection"
import { UnidadesSection } from "@/components/store/sections/pdv/pages/UnidadesSection"
import { FornecedoresSection } from "@/components/store/sections/pdv/pages/FornecedoresSection"
import { CidadesSection } from "@/components/store/sections/pdv/pages/CidadesSection"
import { ImpressoraSection } from "@/components/store/sections/pdv/pages/ImpressoraSection"
import { PontosImpressaoSection } from "@/components/store/sections/pdv/pages/PontosImpressaoSection"
import { ComprovantesSection } from "@/components/store/sections/pdv/pages/ComprovantesSection"
import { BalancaCheckoutSection } from "@/components/store/sections/pdv/pages/BalancaCheckoutSection"
import { BalancaEtiquetadoraSection } from "@/components/store/sections/pdv/pages/BalancaEtiquetadoraSection"
import { BackupSection } from "@/components/store/sections/pdv/pages/BackupSection"
import {
  Building, Cloud, Users, Lock, ClipboardList, ArrowLeftRight, CreditCard, Smartphone,
  Wallet, QrCode, Coins, Globe, Bike, Utensils, Truck, Barcode, Scale, BookOpen, Coffee,
  Layers, Box as BoxIcon, Package, MapPin, Printer, FileText, Tag, Database, Check, LucideIcon,
} from "lucide-react"
import { ViewTransition } from "@/components/store/base/ViewTransition"

interface ConfiguracoesSectionProps {
  onBackToDashboard: () => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
  setCustomActions?: (actions: React.ReactNode | null) => void
}

interface SettingItem {
  id: string
  title: string
  subtitle?: string
  icon: LucideIcon
  badge?: "habilitado"
}

interface SettingGroup {
  id: string
  items: SettingItem[]
}

const SETTINGS_GROUPS: SettingGroup[] = [
  {
    id: "empresa-sincronizacao",
    items: [
      { id: "dados-empresa", title: "Dados da empresa", icon: Building },
      { id: "sincronizacao", title: "Sincronização", subtitle: "Habilitar sincronização entre dispositivos", icon: Cloud, badge: "habilitado" },
    ],
  },
  {
    id: "usuarios-acesso",
    items: [
      { id: "usuarios", title: "Usuários", icon: Users },
      { id: "restricoes", title: "Restrições de acesso", subtitle: "Configurar restrições de acesso a recursos", icon: Lock },
      { id: "autorizacoes", title: "Registro de autorizações", subtitle: "Visualizar registro de autorizações e tentativas de acesso a recursos restritos", icon: ClipboardList },
    ],
  },
  {
    id: "nota-fiscal",
    items: [
      { id: "nota-fiscal-config", title: "Nota fiscal", subtitle: "NFC-e • NF-e • Certificado • Série e número", icon: ArrowLeftRight },
    ],
  },
  {
    id: "pagamentos-crediario",
    items: [
      { id: "pagamento-integrado", title: "Pagamento Integrado", subtitle: "Integração com maquininhas smart POS no caixa", icon: CreditCard },
      { id: "ordem-pagamento", title: "Ordem de Pagamento", subtitle: "Integração com maquininhas smart POS separadas do caixa", icon: Smartphone },
      { id: "conta-digital", title: "Conta Digital", subtitle: "Configuração de conta digital.", icon: Wallet },
      { id: "pix", title: "Pix", subtitle: "Pagamentos via QR Code", icon: QrCode, badge: "habilitado" },
      { id: "crediario", title: "Crediário", subtitle: "Juros • Multa • Carência", icon: Coins },
    ],
  },
  {
    id: "delivery-catalogo",
    items: [
      { id: "catalogo-online", title: "Catálogo Online", subtitle: "Para delivery", icon: Globe, badge: "habilitado" },
      { id: "entregadores", title: "Entregadores", icon: Bike },
      { id: "ifood", title: "iFood", icon: Utensils },
      { id: "taxa-entrega", title: "Taxas de entrega", icon: Truck },
    ],
  },
  {
    id: "consulta-balanca",
    items: [
      { id: "consulta-preco", title: "Consulta Preço", subtitle: "Integração com o aplicativo Consulta Preço.", icon: Barcode },
      { id: "pesagem-automatica", title: "Pesagem Automática", subtitle: "Integração com aplicativo de pesagem de produtos para restaurantes.", icon: Scale },
      { id: "menu-digital", title: "Menu Digital", subtitle: "Para mesas ou comandas", icon: BookOpen },
      { id: "mesas-comandas", title: "Mesas e comandas", subtitle: "Taxas de serviço • Limite de consumo", icon: Coffee, badge: "habilitado" },
      { id: "autoatendimento", title: "Autoatendimento", subtitle: "Configuração de Autoatendimento", icon: Smartphone },
    ],
  },
  {
    id: "cadastros-basicos",
    items: [
      { id: "grupos-subgrupos", title: "Grupos e subgrupos", icon: Layers },
      { id: "unidades", title: "Unidades", icon: BoxIcon },
      { id: "fornecedores", title: "Fornecedores", icon: Package },
      { id: "cidades", title: "Cidades", icon: MapPin },
    ],
  },
  {
    id: "impressora-comprovantes",
    items: [
      { id: "impressora", title: "Impressora", subtitle: "Tamanho da bobina • Aumentar fonte • Gaveta de dinheiro", icon: Printer },
      { id: "pontos-impressao", title: "Pontos de impressão", subtitle: "Monitor de Cozinha • Tamanho da bobina • Aumentar fonte • Produtos do ponto de impressão", icon: Printer },
      { id: "comprovantes", title: "Comprovantes", subtitle: "Habilitar impressão de comprovantes • Carnê • Recibo • Ticket • NFC-e", icon: FileText },
    ],
  },
  {
    id: "balancas",
    items: [
      { id: "balanca-checkout", title: "Balança de checkout", subtitle: "Pesagem de produtos", icon: Scale },
      { id: "balanca-etiquetadora", title: "Balança etiquetadora", subtitle: "Configuração de balança etiquetadora • Exportar produtos para balança etiquetadora", icon: Tag },
    ],
  },
  {
    id: "backup",
    items: [
      { id: "backup-config", title: "Backup", icon: Database },
    ],
  },
]

const TITLES_MAP: Record<string, string> = {
  "dados-empresa": "Dados da Empresa",
  "sincronizacao": "Sincronização",
  "usuarios": "Usuários",
  "pagamento-integrado": "Pagamento Integrado",
  "ordem-pagamento": "Ordem de Pagamento",
  "conta-digital": "Conta Digital",
  "pix": "Pix",
  "crediario": "Crediário",
  "entregadores": "Conecta Entregador",
  "ifood": "iFood",
  "taxa-entrega": "Taxa de entrega",
  "consulta-preco": "Consulta Preço",
  "pesagem-automatica": "Pesagem Automática",
  "menu-digital": "Menu Digital",
  "catalogo-online": "Catálogo Online",
  "identificacao": "Identificação",
  "catalogo-produtos": "Produtos",
  "horario-atendimento": "Horário de atendimento",
  "formas-pagamento": "Formas de pagamento",
  "whatsapp": "WhatsApp",
  "opcao-entrega": "Opções de entrega",
  "opcao-pedido": "Opções de pedido",
  "opcao-pedido-menu-digital": "Opções de Pedido",
  "mesas-comandas": "Mesas e comandas",
  "configurar-comandas": "Configurar comandas",
  "taxas-servico": "Taxas de serviço",
  "autoatendimento": "Autoatendimento",
  "autoatendimento-cartao": "Cartão",
  "autoatendimento-pix": "Pix",
  "autoatendimento-customizacao": "Customização PDV",
  "autoatendimento-numero": "Número de atendimento",
  "grupos-subgrupos": "Grupos e subgrupos",
  "unidades": "Unidades",
  "fornecedores": "Fornecedores",
  "cidades": "Cidades",
  "impressora": "Impressora",
  "pontos-impressao": "Pontos de impressão",
  "comprovantes": "Comprovantes",
  "balanca-checkout": "Balança checkout",
  "balanca-etiquetadora": "Balança etiquetadora",
  "backup": "Backup",
}

interface CommonRouterProps {
  currentSubView: string | null
  popSubView: () => void
  pushSubView: (v: string) => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
  setCustomActions?: (actions: React.ReactNode | null) => void
}

function renderEmpresaAndAuthSubViews(p: CommonRouterProps): React.ReactNode {
  const { currentSubView, popSubView, setCustomBack, setCustomTitle, setCustomActions } = p
  if (currentSubView === "dados-empresa") return <CompanyDataForm onCancel={popSubView} onSave={popSubView} />
  if (currentSubView === "sincronizacao") return <CompanySyncForm onCancel={popSubView} />
  if (currentSubView === "usuarios") return <UsuariosSection onCancel={popSubView} setCustomBack={setCustomBack} setCustomTitle={setCustomTitle} setCustomActions={setCustomActions} />
  if (currentSubView === "restricoes") return <RestricoesSection onCancel={popSubView} setCustomBack={setCustomBack} setCustomTitle={setCustomTitle} setCustomActions={setCustomActions} />
  if (currentSubView === "autorizacoes") return <AutorizacoesSection onCancel={popSubView} setCustomBack={setCustomBack} setCustomTitle={setCustomTitle} />
  if (currentSubView === "nota-fiscal-config") return <NotaFiscalSection onCancel={popSubView} setCustomBack={setCustomBack} setCustomTitle={setCustomTitle} setCustomActions={setCustomActions} />
  return null
}

function renderPagamentosSubViews(p: CommonRouterProps): React.ReactNode {
  const { currentSubView, popSubView, setCustomBack, setCustomTitle } = p
  if (currentSubView === "pagamento-integrado") return <PagamentoIntegradoSection onCancel={popSubView} setCustomBack={setCustomBack} setCustomTitle={setCustomTitle} />
  if (currentSubView === "ordem-pagamento") return <PagamentoIntegradoSection type="order" onCancel={popSubView} setCustomBack={setCustomBack} setCustomTitle={setCustomTitle} />
  if (currentSubView === "conta-digital") return <ContaDigitalSection onCancel={popSubView} setCustomBack={setCustomBack} setCustomTitle={setCustomTitle} />
  if (currentSubView === "pix") return <PixSection onCancel={popSubView} setCustomBack={setCustomBack} setCustomTitle={setCustomTitle} />
  if (currentSubView === "crediario") return <CrediarioSection onCancel={popSubView} setCustomBack={setCustomBack} setCustomTitle={setCustomTitle} />
  return null
}

function renderDeliverySubViews(p: CommonRouterProps): React.ReactNode {
  const { currentSubView, popSubView, setCustomBack, setCustomTitle } = p
  if (currentSubView === "entregadores") return <ConectaEntregadorSection onCancel={popSubView} setCustomBack={setCustomBack} setCustomTitle={setCustomTitle} />
  if (currentSubView === "ifood") return <IFoodSection onCancel={popSubView} setCustomBack={setCustomBack} setCustomTitle={setCustomTitle} />
  if (currentSubView === "taxa-entrega") return <TaxaEntregaSection onCancel={popSubView} setCustomBack={setCustomBack} setCustomTitle={setCustomTitle} />
  if (currentSubView === "consulta-preco") return <ConsultaPrecoSection onCancel={popSubView} setCustomBack={setCustomBack} setCustomTitle={setCustomTitle} />
  if (currentSubView === "pesagem-automatica") return <PesagemAutomaticaSection onCancel={popSubView} setCustomBack={setCustomBack} setCustomTitle={setCustomTitle} />
  return null
}

function renderCatalogoSubViews(p: CommonRouterProps): React.ReactNode {
  const { currentSubView, popSubView, pushSubView, setCustomBack, setCustomTitle, setCustomActions } = p
  if (currentSubView === "menu-digital") return <MenuDigitalSection onCancel={popSubView} setCustomBack={setCustomBack} setCustomTitle={setCustomTitle} onNavigate={pushSubView} />
  if (currentSubView === "catalogo-online") return <CatalogoOnlineSection onCancel={popSubView} setCustomBack={setCustomBack} setCustomTitle={setCustomTitle} onNavigate={pushSubView} />
  if (currentSubView === "identificacao") return <IdentificacaoSection onCancel={popSubView} setCustomBack={setCustomBack} setCustomTitle={setCustomTitle} />
  if (currentSubView === "catalogo-produtos") return <CatalogoProdutosSection onCancel={popSubView} setCustomBack={setCustomBack} setCustomTitle={setCustomTitle} setCustomActions={setCustomActions} />
  if (currentSubView === "horario-atendimento") return <HorarioAtendimentoSection onCancel={popSubView} setCustomBack={setCustomBack} setCustomTitle={setCustomTitle} />
  if (currentSubView === "formas-pagamento") return <FormasPagamentoSection onCancel={popSubView} setCustomBack={setCustomBack} setCustomTitle={setCustomTitle} />
  if (currentSubView === "whatsapp") return <WhatsAppSection onCancel={popSubView} setCustomBack={setCustomBack} setCustomTitle={setCustomTitle} />
  return null
}

function renderOpcoesPedidoSubViews(p: CommonRouterProps): React.ReactNode {
  const { currentSubView, popSubView, setCustomBack, setCustomTitle } = p
  if (currentSubView === "opcao-entrega") return <OpcoesEntregaSection onCancel={popSubView} setCustomBack={setCustomBack} setCustomTitle={setCustomTitle} />
  if (currentSubView === "opcao-pedido") return <OpcoesPedidoSection onCancel={popSubView} setCustomBack={setCustomBack} setCustomTitle={setCustomTitle} />
  if (currentSubView === "opcao-pedido-menu-digital") return <OpcoesPedidoMenuDigitalSection onCancel={popSubView} setCustomBack={setCustomBack} setCustomTitle={setCustomTitle} />
  return null
}

function renderMesasAndAutoatendimentoSubViews(p: CommonRouterProps): React.ReactNode {
  const { currentSubView, popSubView, pushSubView, setCustomBack, setCustomTitle } = p
  if (currentSubView === "mesas-comandas") return <MesasComandasSection onCancel={popSubView} setCustomBack={setCustomBack} setCustomTitle={setCustomTitle} onNavigate={pushSubView} />
  if (currentSubView === "configurar-comandas") return <ConfigurarComandasSection onCancel={popSubView} setCustomBack={setCustomBack} setCustomTitle={setCustomTitle} />
  if (currentSubView === "taxas-servico") return <TaxaServicoSection onCancel={popSubView} setCustomBack={setCustomBack} setCustomTitle={setCustomTitle} />
  if (currentSubView === "autoatendimento") return <AutoatendimentoSection onCancel={popSubView} setCustomBack={setCustomBack} setCustomTitle={setCustomTitle} onNavigate={pushSubView} />
  if (currentSubView === "autoatendimento-cartao") return <PagamentoIntegradoSection onCancel={popSubView} setCustomBack={setCustomBack} setCustomTitle={setCustomTitle} type="integrated" />
  if (currentSubView === "autoatendimento-pix") return <ContaDigitalSection onCancel={popSubView} setCustomBack={setCustomBack} setCustomTitle={setCustomTitle} />
  if (currentSubView === "autoatendimento-customizacao") return <AutoatendimentoCustomizacaoSection onCancel={popSubView} setCustomBack={setCustomBack} setCustomTitle={setCustomTitle} />
  if (currentSubView === "autoatendimento-numero") return <AutoatendimentoNumeroSection onCancel={popSubView} setCustomBack={setCustomBack} setCustomTitle={setCustomTitle} />
  return null
}

function renderCadastrosSubViews(p: CommonRouterProps): React.ReactNode {
  const { currentSubView, popSubView, setCustomBack, setCustomTitle, setCustomActions } = p
  if (currentSubView === "grupos-subgrupos") return <GruposSubgruposSection onCancel={popSubView} setCustomBack={setCustomBack} setCustomTitle={setCustomTitle} setCustomActions={setCustomActions} />
  if (currentSubView === "unidades") return <UnidadesSection onCancel={popSubView} setCustomBack={setCustomBack} setCustomTitle={setCustomTitle} setCustomActions={setCustomActions} />
  if (currentSubView === "fornecedores") return <FornecedoresSection onCancel={popSubView} setCustomBack={setCustomBack} setCustomTitle={setCustomTitle} setCustomActions={setCustomActions} />
  if (currentSubView === "cidades") return <CidadesSection onCancel={popSubView} setCustomBack={setCustomBack} setCustomTitle={setCustomTitle} setCustomActions={setCustomActions} />
  return null
}

function renderHardwareSubViews(p: CommonRouterProps): React.ReactNode {
  const { currentSubView, popSubView, pushSubView, setCustomBack, setCustomTitle, setCustomActions } = p
  if (currentSubView === "impressora") return <ImpressoraSection onCancel={popSubView} setCustomBack={setCustomBack} setCustomTitle={setCustomTitle} />
  if (currentSubView === "pontos-impressao") return <PontosImpressaoSection onCancel={popSubView} setCustomBack={setCustomBack} setCustomTitle={setCustomTitle} setCustomActions={setCustomActions} onNavigate={pushSubView} />
  if (currentSubView === "comprovantes") return <ComprovantesSection onCancel={popSubView} setCustomBack={setCustomBack} setCustomTitle={setCustomTitle} />
  if (currentSubView === "balanca-checkout") return <BalancaCheckoutSection onCancel={popSubView} setCustomBack={setCustomBack} setCustomTitle={setCustomTitle} />
  if (currentSubView === "balanca-etiquetadora") return <BalancaEtiquetadoraSection onCancel={popSubView} setCustomBack={setCustomBack} setCustomTitle={setCustomTitle} onNavigate={pushSubView} />
  if (currentSubView === "backup") return <BackupSection onCancel={popSubView} setCustomBack={setCustomBack} setCustomTitle={setCustomTitle} />
  return null
}

function ConfiguracoesMenuGrid({ onSelectView }: { onSelectView: (v: string) => void }) {
  return (
    <Box w="full">
      <Stack gap={5} w="full">
        {SETTINGS_GROUPS.map((group) => (
          <Box key={group.id} border borderColor="border-border" bg="bg-surface" radius="default" w="full" overflow="hidden">
            <Stack gap={0} w="full">
              {group.items.map((item, idx) => (
                <React.Fragment key={item.id}>
                  {idx > 0 && <Box h="h-[1px]" w="full" bg="bg-border" />}
                  <Box
                    padding={5} cursor="pointer" hoverBg="primary/10"
                    onClick={() => onSelectView(item.id === "backup-config" ? "backup" : item.id)}
                  >
                    <Stack direction="row" align="center" gap={5} w="full">
                      <Icon icon={item.icon} variant="circular-secondary" />
                      <Stack gap={1} align="stretch" flex="1">
                        <Stack direction="row" align="center" justify="between" w="full" gap={2.5}>
                          <Font variant="body-bold" text={item.title} align="left" />
                          {item.badge && <Box><Badge variant="success" label={item.badge} icon={Check} /></Box>}
                        </Stack>
                        {item.subtitle && <Font variant="description" text={item.subtitle} align="left" />}
                      </Stack>
                    </Stack>
                  </Box>
                </React.Fragment>
              ))}
            </Stack>
          </Box>
        ))}
      </Stack>
    </Box>
  )
}

function ConfiguracoesViewRouter(p: CommonRouterProps) {
  const empresaRes = renderEmpresaAndAuthSubViews(p)
  if (empresaRes) return empresaRes

  const pagamentosRes = renderPagamentosSubViews(p)
  if (pagamentosRes) return pagamentosRes

  const deliveryRes = renderDeliverySubViews(p)
  if (deliveryRes) return deliveryRes

  const catalogoRes = renderCatalogoSubViews(p)
  if (catalogoRes) return catalogoRes

  const opcoesRes = renderOpcoesPedidoSubViews(p)
  if (opcoesRes) return opcoesRes

  const mesasRes = renderMesasAndAutoatendimentoSubViews(p)
  if (mesasRes) return mesasRes

  const cadastrosRes = renderCadastrosSubViews(p)
  if (cadastrosRes) return cadastrosRes

  const hardwareRes = renderHardwareSubViews(p)
  if (hardwareRes) return hardwareRes

  return <ConfiguracoesMenuGrid onSelectView={p.pushSubView} />
}

export const ConfiguracoesSection: React.FC<ConfiguracoesSectionProps> = ({
  setCustomBack, setCustomTitle, setCustomActions,
}) => {
  const [currentSubView, setCurrentSubView] = React.useState<string | null>(null)
  const [subViewHistory, setSubViewHistory] = React.useState<string[]>([])

  const pushSubView = React.useCallback((view: string) => {
    setSubViewHistory((prev) => (currentSubView ? [...prev, currentSubView] : prev))
    setCurrentSubView(view)
  }, [currentSubView])

  const popSubView = React.useCallback(() => {
    setSubViewHistory((prev) => {
      if (prev.length === 0) { setCurrentSubView(null); return [] }
      const next = [...prev]
      const last = next.pop()
      setCurrentSubView(last || null)
      return next
    })
  }, [])

  React.useEffect(() => {
    if (currentSubView) {
      setCustomBack?.(() => popSubView)
      const mappedTitle = TITLES_MAP[currentSubView]
      if (mappedTitle) setCustomTitle?.(mappedTitle)
    } else {
      setCustomBack?.(null)
      setCustomTitle?.(null)
      setCustomActions?.(null)
    }
    return () => { setCustomBack?.(null); setCustomTitle?.(null); setCustomActions?.(null) }
  }, [currentSubView, setCustomBack, setCustomTitle, setCustomActions, popSubView])

  const stackViewKey = React.useMemo(() => [...subViewHistory, currentSubView || "root"].join("/"), [subViewHistory, currentSubView])

  return (
    <Box flex="1" minH="0" h="full" overflowY="auto" w="full">
      <ViewTransition viewKey={stackViewKey} flex="1" minH="0">
        <ConfiguracoesViewRouter
          currentSubView={currentSubView} popSubView={popSubView} pushSubView={pushSubView}
          setCustomBack={setCustomBack} setCustomTitle={setCustomTitle} setCustomActions={setCustomActions}
        />
      </ViewTransition>
    </Box>
  )
}
