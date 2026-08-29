"use client"

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Icon } from "@/components/store/base/Icon"
import { Badge } from "@/components/store/base/Badge"
import { CompanyDataForm } from "@/components/store/advanced/CompanyDataForm"
import { CompanySyncForm } from "@/components/store/advanced/CompanySyncForm"
import { ContaDigitalSection } from "@/components/store/sections/pdv/pages/ContaDigitalSection"
import {
  loadContaDigitalSettings,
  CONTA_DIGITAL_SETTINGS_EVENT,
} from "@/lib/sync/contaDigitalSettings"
import {
  UsuariosSection,
  RestricoesSection,
  AutorizacoesSection,
  NotaFiscalSection,
  PagamentoIntegradoSection,
  PixSection,
  CrediarioSection,
  FormasPagamentoSection,
  CatalogoOnlineSection,
  ConectaEntregadorSection,
  IFoodSection,
  TaxaEntregaSection,
  WhatsAppSection,
  OpcoesEntregaSection,
  OpcoesPedidoSection,
  OpcoesPedidoMenuDigitalSection,
  ImpressoraSection,
  PontosImpressaoSection,
  ComprovantesSection,
  BalancaCheckoutSection,
  BalancaEtiquetadoraSection,
  MesasComandasSection,
  ConfigurarComandasSection,
  TaxaServicoSection,
  AutoatendimentoSection,
  AutoatendimentoCustomizacaoSection,
  AutoatendimentoNumeroSection,
  GruposSubgruposSection,
  UnidadesSection,
  FornecedoresSection,
  CidadesSection,
  ConsultaPrecoSection,
  PesagemAutomaticaSection,
  MenuDigitalSection,
  IdentificacaoSection,
  CatalogoProdutosSection,
  HorarioAtendimentoSection,
  BackupSection,
} from "@/components/store/sections/pdv/settings"
import {
  Building, Cloud, Users, Lock, ClipboardList, ArrowLeftRight, CreditCard, Smartphone,
  Wallet, QrCode, Coins, Globe, Bike, Utensils, Truck, Barcode, Scale, BookOpen, Coffee,
  Layers, Box as BoxIcon, Package, MapPin, Printer, FileText, Tag, Database, Check, LucideIcon,
} from "lucide-react"
import { ViewTransition } from "@/components/store/base/ViewTransition"
import { useAppNavigation } from "@/lib/navigation/NavigationContext"
import { UI_STRINGS } from "@/constants/strings"
import { loadDeviceSyncSettings } from "@/lib/sync/deviceSyncSettings"

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
      { id: "sincronizacao", title: "Sincronização", subtitle: "Habilitar sincronização entre dispositivos", icon: Cloud },
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
      { id: "backup", title: "Backup", icon: Database },
    ],
  },
]

const TITLES_MAP: Record<string, string> = {
  "dados-empresa": "Dados da Empresa",
  "sincronizacao": "Sincronização",
  "usuarios": "Usuários",
  "novo-usuario": "Novo Usuário",
  "restricoes": "Restrições de Acesso",
  "autorizacoes": "Registro de Autorizações",
  "nota-fiscal": "Nota Fiscal",
  "nota-fiscal-config": "Nota Fiscal",
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
  "backup-config": "Backup",
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
  if (currentSubView === "dados-empresa") return <CompanyDataForm onCancel={popSubView} setCustomBack={setCustomBack} setCustomTitle={setCustomTitle} setCustomActions={setCustomActions} />
  if (currentSubView === "sincronizacao") return <CompanySyncForm onCancel={popSubView} setCustomBack={setCustomBack} setCustomTitle={setCustomTitle} setCustomActions={setCustomActions} />
  if (currentSubView === "usuarios") return <UsuariosSection onCancel={popSubView} setCustomBack={setCustomBack} setCustomTitle={setCustomTitle} setCustomActions={setCustomActions} />
  if (currentSubView === "restricoes") return <RestricoesSection onCancel={popSubView} setCustomBack={setCustomBack} setCustomTitle={setCustomTitle} setCustomActions={setCustomActions} />
  if (currentSubView === "autorizacoes") return <AutorizacoesSection onCancel={popSubView} setCustomBack={setCustomBack} setCustomTitle={setCustomTitle} setCustomActions={setCustomActions} />
  if (currentSubView === "nota-fiscal-config" || currentSubView === "nota-fiscal") return <NotaFiscalSection onCancel={popSubView} setCustomBack={setCustomBack} setCustomTitle={setCustomTitle} setCustomActions={setCustomActions} />
  return null
}

function renderPagamentosSubViews(p: CommonRouterProps): React.ReactNode {
  const { currentSubView, popSubView, setCustomBack, setCustomTitle, setCustomActions } = p
  if (currentSubView === "pagamento-integrado") return <PagamentoIntegradoSection onCancel={popSubView} setCustomBack={setCustomBack} setCustomTitle={setCustomTitle} setCustomActions={setCustomActions} />
  if (currentSubView === "ordem-pagamento") return <PagamentoIntegradoSection type="order" onCancel={popSubView} setCustomBack={setCustomBack} setCustomTitle={setCustomTitle} setCustomActions={setCustomActions} />
  if (currentSubView === "conta-digital") return <ContaDigitalSection onCancel={popSubView} setCustomBack={setCustomBack} setCustomTitle={setCustomTitle} setCustomActions={setCustomActions} />
  if (currentSubView === "pix") return <PixSection onCancel={popSubView} setCustomBack={setCustomBack} setCustomTitle={setCustomTitle} setCustomActions={setCustomActions} />
  if (currentSubView === "crediario") return <CrediarioSection onCancel={popSubView} setCustomBack={setCustomBack} setCustomTitle={setCustomTitle} setCustomActions={setCustomActions} />
  return null
}

function renderDeliverySubViews(p: CommonRouterProps): React.ReactNode {
  const { currentSubView, popSubView, setCustomBack, setCustomTitle, setCustomActions } = p
  if (currentSubView === "entregadores") return <ConectaEntregadorSection onCancel={popSubView} setCustomBack={setCustomBack} setCustomTitle={setCustomTitle} />
  if (currentSubView === "ifood") return <IFoodSection onCancel={popSubView} setCustomBack={setCustomBack} setCustomTitle={setCustomTitle} />
  if (currentSubView === "taxa-entrega") return <TaxaEntregaSection onCancel={popSubView} setCustomBack={setCustomBack} setCustomTitle={setCustomTitle} setCustomActions={setCustomActions} />
  if (currentSubView === "consulta-preco") return <ConsultaPrecoSection onCancel={popSubView} setCustomBack={setCustomBack} setCustomTitle={setCustomTitle} setCustomActions={setCustomActions} />
  if (currentSubView === "pesagem-automatica") return <PesagemAutomaticaSection onCancel={popSubView} setCustomBack={setCustomBack} setCustomTitle={setCustomTitle} setCustomActions={setCustomActions} />
  return null
}

function renderCatalogoSubViews(p: CommonRouterProps): React.ReactNode {
  const { currentSubView, popSubView, pushSubView, setCustomBack, setCustomTitle, setCustomActions } = p
  if (currentSubView === "menu-digital") return <MenuDigitalSection onCancel={popSubView} setCustomBack={setCustomBack} setCustomTitle={setCustomTitle} onNavigate={pushSubView} />
  if (currentSubView === "catalogo-online") return <CatalogoOnlineSection onCancel={popSubView} setCustomBack={setCustomBack} setCustomTitle={setCustomTitle} onNavigate={pushSubView} />
  if (currentSubView === "identificacao") return <IdentificacaoSection onCancel={popSubView} setCustomBack={setCustomBack} setCustomTitle={setCustomTitle} setCustomActions={setCustomActions} />
  if (currentSubView === "catalogo-produtos") return <CatalogoProdutosSection onCancel={popSubView} setCustomBack={setCustomBack} setCustomTitle={setCustomTitle} setCustomActions={setCustomActions} />
  if (currentSubView === "horario-atendimento") return <HorarioAtendimentoSection onCancel={popSubView} setCustomBack={setCustomBack} setCustomTitle={setCustomTitle} setCustomActions={setCustomActions} />
  if (currentSubView === "formas-pagamento") return <FormasPagamentoSection onCancel={popSubView} setCustomBack={setCustomBack} setCustomTitle={setCustomTitle} setCustomActions={setCustomActions} />
  if (currentSubView === "whatsapp") return <WhatsAppSection onCancel={popSubView} setCustomBack={setCustomBack} setCustomTitle={setCustomTitle} setCustomActions={setCustomActions} />
  return null
}

function renderOpcoesPedidoSubViews(p: CommonRouterProps): React.ReactNode {
  const { currentSubView, popSubView, setCustomBack, setCustomTitle, setCustomActions } = p
  if (currentSubView === "opcao-entrega") return <OpcoesEntregaSection onCancel={popSubView} setCustomBack={setCustomBack} setCustomTitle={setCustomTitle} setCustomActions={setCustomActions} />
  if (currentSubView === "opcao-pedido") return <OpcoesPedidoSection onCancel={popSubView} setCustomBack={setCustomBack} setCustomTitle={setCustomTitle} setCustomActions={setCustomActions} />
  if (currentSubView === "opcao-pedido-menu-digital") return <OpcoesPedidoMenuDigitalSection onCancel={popSubView} setCustomBack={setCustomBack} setCustomTitle={setCustomTitle} setCustomActions={setCustomActions} />
  return null
}

function renderMesasAndAutoatendimentoSubViews(p: CommonRouterProps): React.ReactNode {
  const { currentSubView, popSubView, pushSubView, setCustomBack, setCustomTitle, setCustomActions } = p
  if (currentSubView === "mesas-comandas") return <MesasComandasSection onCancel={popSubView} setCustomBack={setCustomBack} setCustomTitle={setCustomTitle} onNavigate={pushSubView} />
  if (currentSubView === "configurar-comandas") return <ConfigurarComandasSection onCancel={popSubView} setCustomBack={setCustomBack} setCustomTitle={setCustomTitle} />
  if (currentSubView === "taxas-servico") return <TaxaServicoSection onCancel={popSubView} setCustomBack={setCustomBack} setCustomTitle={setCustomTitle} />
  if (currentSubView === "autoatendimento") return <AutoatendimentoSection onCancel={popSubView} setCustomBack={setCustomBack} setCustomTitle={setCustomTitle} onNavigate={pushSubView} />
  if (currentSubView === "autoatendimento-cartao") return <PagamentoIntegradoSection onCancel={popSubView} setCustomBack={setCustomBack} setCustomTitle={setCustomTitle} setCustomActions={setCustomActions} type="integrated" />
  if (currentSubView === "autoatendimento-pix") return <ContaDigitalSection onCancel={popSubView} setCustomBack={setCustomBack} setCustomTitle={setCustomTitle} setCustomActions={setCustomActions} />
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
  const syncEnabled = loadDeviceSyncSettings().enabled
  const [contaDigitalEnabled, setContaDigitalEnabled] = React.useState(
    () => loadContaDigitalSettings().enabled
  )

  React.useEffect(() => {
    const handleSync = () => {
      setContaDigitalEnabled(loadContaDigitalSettings().enabled)
    }
    window.addEventListener(CONTA_DIGITAL_SETTINGS_EVENT, handleSync)
    return () => {
      window.removeEventListener(CONTA_DIGITAL_SETTINGS_EVENT, handleSync)
    }
  }, [])

  return (
    <Box w="full">
      <Stack gap={5} w="full">
        {SETTINGS_GROUPS.map((group) => (
          <Box key={group.id} border borderColor="border-border" bg="bg-surface" radius="default" w="full" overflow="hidden">
            <Stack gap={0} w="full">
              {group.items.map((item, idx) => {
                let showEnabledBadge = Boolean(item.badge)
                let badgeLabel: string | undefined = item.badge
                if (item.id === "sincronizacao") {
                  showEnabledBadge = syncEnabled
                  badgeLabel = UI_STRINGS.companySync.enabledBadge
                } else if (item.id === "conta-digital") {
                  showEnabledBadge = contaDigitalEnabled
                  badgeLabel = "habilitado"
                }

                return (
                <React.Fragment key={item.id}>
                  {idx > 0 && <Box h="h-[1px]" w="full" bg="bg-border" />}
                  <Box
                    padding={5} cursor="pointer" hoverBg="secondary/10"
                    onClick={() => onSelectView(item.id === "backup-config" ? "backup" : item.id)}
                  >
                    <Stack direction="row" align="center" gap={5} w="full">
                      <Icon icon={item.icon} variant="circular-secondary" />
                      <Stack gap={1} align="stretch" flex="1">
                        <Stack direction="row" align="center" justify="between" w="full" gap={2.5}>
                          <Font variant="body-bold" text={item.title} align="left" />
                          {showEnabledBadge && badgeLabel && <Box><Badge variant="success" label={badgeLabel} icon={Check} /></Box>}
                        </Stack>
                        {item.subtitle && <Font variant="description" text={item.subtitle} align="left" />}
                      </Stack>
                    </Stack>
                  </Box>
                </React.Fragment>
                )
              })}
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
  const { currentRoute, navigate, goBack } = useAppNavigation()

  const currentSubView =
    currentRoute.view !== "configuracoes" && TITLES_MAP[currentRoute.view]
      ? currentRoute.view
      : null

  const pushSubView = React.useCallback((view: string) => {
    navigate(view.startsWith("#") ? view : `#${view}`)
  }, [navigate])

  const popSubView = React.useCallback(() => {
    goBack("#configuracoes")
  }, [goBack])

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

  return (
    <Box flex="1" minH="0" h="full" overflowY="auto" w="full">
      <ViewTransition viewKey={currentSubView || "root"} flex="1" minH="0">
        <ConfiguracoesViewRouter
          currentSubView={currentSubView} popSubView={popSubView} pushSubView={pushSubView}
          setCustomBack={setCustomBack} setCustomTitle={setCustomTitle} setCustomActions={setCustomActions}
        />
      </ViewTransition>
    </Box>
  )
}
