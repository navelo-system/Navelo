"use client"

/* eslint-disable max-lines-per-function, complexity */

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
  Building,
  Cloud,
  Users,
  Lock,
  ClipboardList,
  ArrowLeftRight,
  CreditCard,
  Smartphone,
  Wallet,
  QrCode,
  Coins,
  Globe,
  Bike,
  Utensils,
  Truck,
  Barcode,
  Scale,
  BookOpen,
  Coffee,
  Layers,
  Box as BoxIcon,
  Package,
  MapPin,
  Printer,
  FileText,
  Tag,
  Database,
  Check,
  LucideIcon
} from "lucide-react"

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
      { id: "sincronizacao", title: "Sincronização", subtitle: "Habilitar sincronização entre dispositivos", icon: Cloud, badge: "habilitado" }
    ]
  },
  {
    id: "usuarios-acesso",
    items: [
      { id: "usuarios", title: "Usuários", icon: Users },
      { id: "restricoes", title: "Restrições de acesso", subtitle: "Configurar restrições de acesso a recursos", icon: Lock },
      { id: "autorizacoes", title: "Registro de autorizações", subtitle: "Visualizar registro de autorizações e tentativas de acesso a recursos restritos", icon: ClipboardList }
    ]
  },
  {
    id: "nota-fiscal",
    items: [
      { id: "nota-fiscal-config", title: "Nota fiscal", subtitle: "NFC-e • NF-e • Certificado • Série e número", icon: ArrowLeftRight }
    ]
  },
  {
    id: "pagamentos-crediario",
    items: [
      { id: "pagamento-integrado", title: "Pagamento Integrado", subtitle: "Integração com maquininhas smart POS no caixa", icon: CreditCard },
      { id: "ordem-pagamento", title: "Ordem de Pagamento", subtitle: "Integração com maquininhas smart POS separadas do caixa", icon: Smartphone },
      { id: "conta-digital", title: "Conta Digital", subtitle: "Configuração de conta digital.", icon: Wallet },
      { id: "pix", title: "Pix", subtitle: "Pagamentos via QR Code", icon: QrCode, badge: "habilitado" },
      { id: "crediario", title: "Crediário", subtitle: "Juros • Multa • Carência", icon: Coins }
    ]
  },
  {
    id: "delivery-catalogo",
    items: [
      { id: "catalogo-online", title: "Catálogo Online", subtitle: "Para delivery", icon: Globe, badge: "habilitado" },
      { id: "entregadores", title: "Entregadores", icon: Bike },
      { id: "ifood", title: "iFood", icon: Utensils },
      { id: "taxa-entrega", title: "Taxas de entrega", icon: Truck }
    ]
  },
  {
    id: "consulta-balanca",
    items: [
      { id: "consulta-preco", title: "Consulta Preço", subtitle: "Integração com o aplicativo Consulta Preço.", icon: Barcode },
      { id: "pesagem-automatica", title: "Pesagem Automática", subtitle: "Integração com aplicativo de pesagem de produtos para restaurantes.", icon: Scale },
      { id: "menu-digital", title: "Menu Digital", subtitle: "Para mesas ou comandas", icon: BookOpen },
      { id: "mesas-comandas", title: "Mesas e comandas", subtitle: "Taxas de serviço • Limite de consumo", icon: Coffee, badge: "habilitado" },
      { id: "autoatendimento", title: "Autoatendimento", subtitle: "Configuração de Autoatendimento", icon: Smartphone }
    ]
  },
  {
    id: "cadastros-basicos",
    items: [
      { id: "grupos-subgrupos", title: "Grupos e subgrupos", icon: Layers },
      { id: "unidades", title: "Unidades", icon: BoxIcon },
      { id: "fornecedores", title: "Fornecedores", icon: Package },
      { id: "cidades", title: "Cidades", icon: MapPin }
    ]
  },
  {
    id: "impressora-comprovantes",
    items: [
      { id: "impressora", title: "Impressora", subtitle: "Tamanho da bobina • Aumentar fonte • Gaveta de dinheiro", icon: Printer },
      { id: "pontos-impressao", title: "Pontos de impressão", subtitle: "Monitor de Cozinha • Tamanho da bobina • Aumentar fonte • Produtos do ponto de impressão", icon: Printer },
      { id: "comprovantes", title: "Comprovantes", subtitle: "Habilitar impressão de comprovantes • Carnê • Recibo • Ticket • NFC-e", icon: FileText }
    ]
  },
  {
    id: "balancas",
    items: [
      { id: "balanca-checkout", title: "Balança de checkout", subtitle: "Pesagem de produtos", icon: Scale },
      { id: "balanca-etiquetadora", title: "Balança etiquetadora", subtitle: "Configuração de balança etiquetadora • Exportar produtos para balança etiquetadora", icon: Tag }
    ]
  },
  {
    id: "backup",
    items: [
      { id: "backup-config", title: "Backup", icon: Database }
    ]
  }
]

export const ConfiguracoesSection: React.FC<ConfiguracoesSectionProps> = ({
  setCustomBack,
  setCustomTitle,
  setCustomActions
}) => {
  const [currentSubView, setCurrentSubView] = React.useState<string | null>(null)
  const [, setSubViewHistory] = React.useState<string[]>([])

  const scrollPositions = React.useRef<Record<string, number>>({})

  React.useEffect(() => {
    if (typeof window === "undefined") return
    const handleScroll = () => {
      const key = currentSubView || "root"
      scrollPositions.current[key] = window.scrollY
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [currentSubView])

  React.useEffect(() => {
    if (typeof window === "undefined") return
    const key = currentSubView || "root"
    const savedScroll = scrollPositions.current[key] || 0
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.scrollTo({ top: savedScroll, behavior: "instant" })
      })
    })
  }, [currentSubView])

  const pushSubView = React.useCallback((view: string) => {
    setSubViewHistory(prev => {
      const next = [...prev]
      if (currentSubView) {
        next.push(currentSubView)
      }
      return next
    })
    setCurrentSubView(view)
  }, [currentSubView])

  const popSubView = React.useCallback(() => {
    setSubViewHistory(prev => {
      if (prev.length === 0) {
        setCurrentSubView(null)
        return []
      }
      const next = [...prev]
      const last = next.pop()
      setCurrentSubView(last || null)
      return next
    })
  }, [])

  React.useEffect(() => {
    const handleBack = () => popSubView()

    if (currentSubView === "dados-empresa") {
      setCustomBack?.(() => handleBack)
      setCustomTitle?.("Dados da Empresa")
    } else if (currentSubView === "sincronizacao") {
      setCustomBack?.(() => handleBack)
      setCustomTitle?.("Sincronização")
    } else if (currentSubView === "usuarios") {
      setCustomBack?.(() => handleBack)
      setCustomTitle?.("Usuários")
    } else if (currentSubView === "restricoes") {
      // O próprio RestricoesSection se encarrega de setar o customActions via effects!
    } else if (currentSubView === "autorizacoes") {
      // O próprio AutorizacoesSection se encarrega de setar o custom header via effects
    } else if (currentSubView === "nota-fiscal-config") {
      // NotaFiscalSection se encarrega de setar o customActions via effects!
    } else if (currentSubView === "pagamento-integrado") {
      setCustomBack?.(() => handleBack)
      setCustomTitle?.("Pagamento Integrado")
    } else if (currentSubView === "ordem-pagamento") {
      setCustomBack?.(() => handleBack)
      setCustomTitle?.("Ordem de Pagamento")
    } else if (currentSubView === "conta-digital") {
      setCustomBack?.(() => handleBack)
      setCustomTitle?.("Conta Digital")
    } else if (currentSubView === "pix") {
      setCustomBack?.(() => handleBack)
      setCustomTitle?.("Pix")
    } else if (currentSubView === "crediario") {
      setCustomBack?.(() => handleBack)
      setCustomTitle?.("Crediário")
    } else if (currentSubView === "entregadores") {
      setCustomBack?.(() => handleBack)
      setCustomTitle?.("Conecta Entregador")
    } else if (currentSubView === "ifood") {
      setCustomBack?.(() => handleBack)
      setCustomTitle?.("iFood")
    } else if (currentSubView === "taxa-entrega") {
      setCustomBack?.(() => handleBack)
      setCustomTitle?.("Taxa de entrega")
    } else if (currentSubView === "consulta-preco") {
      setCustomBack?.(() => handleBack)
      setCustomTitle?.("Consulta Preço")
    } else if (currentSubView === "pesagem-automatica") {
      setCustomBack?.(() => handleBack)
      setCustomTitle?.("Pesagem Automática")
    } else if (currentSubView === "menu-digital") {
      setCustomBack?.(() => handleBack)
      setCustomTitle?.("Menu Digital")
    } else if (currentSubView === "catalogo-online") {
      setCustomBack?.(() => handleBack)
      setCustomTitle?.("Catálogo Online")
    } else if (currentSubView === "identificacao") {
      setCustomBack?.(() => handleBack)
      setCustomTitle?.("Identificação")
    } else if (currentSubView === "catalogo-produtos") {
      setCustomBack?.(() => handleBack)
      setCustomTitle?.("Produtos")
    } else if (currentSubView === "horario-atendimento") {
      setCustomBack?.(() => handleBack)
      setCustomTitle?.("Horário de atendimento")
    } else if (currentSubView === "formas-pagamento") {
      setCustomBack?.(() => handleBack)
      setCustomTitle?.("Formas de pagamento")
    } else if (currentSubView === "whatsapp") {
      setCustomBack?.(() => handleBack)
      setCustomTitle?.("WhatsApp")
    } else if (currentSubView === "opcao-entrega") {
      setCustomBack?.(() => handleBack)
      setCustomTitle?.("Opções de entrega")
    } else if (currentSubView === "opcao-pedido") {
      setCustomBack?.(() => handleBack)
      setCustomTitle?.("Opções de pedido")
    } else if (currentSubView === "opcao-pedido-menu-digital") {
      setCustomBack?.(() => handleBack)
      setCustomTitle?.("Opções de Pedido")
    } else if (currentSubView === "mesas-comandas") {
      setCustomBack?.(() => handleBack)
      setCustomTitle?.("Mesas e comandas")
    } else if (currentSubView === "configurar-comandas") {
      setCustomBack?.(() => handleBack)
      setCustomTitle?.("Configurar comandas")
    } else if (currentSubView === "taxas-servico") {
      setCustomBack?.(() => handleBack)
      setCustomTitle?.("Taxas de serviço")
    } else if (currentSubView === "autoatendimento") {
      setCustomBack?.(() => handleBack)
      setCustomTitle?.("Autoatendimento")
    } else if (currentSubView === "autoatendimento-cartao") {
      setCustomBack?.(() => handleBack)
      setCustomTitle?.("Cartão")
    } else if (currentSubView === "autoatendimento-pix") {
      setCustomBack?.(() => handleBack)
      setCustomTitle?.("Pix")
    } else if (currentSubView === "autoatendimento-customizacao") {
      setCustomBack?.(() => handleBack)
      setCustomTitle?.("Customização PDV")
    } else if (currentSubView === "autoatendimento-numero") {
      setCustomBack?.(() => handleBack)
      setCustomTitle?.("Número de atendimento")
    } else if (currentSubView === "grupos-subgrupos") {
      setCustomBack?.(() => handleBack)
      setCustomTitle?.("Grupos e subgrupos")
    } else if (currentSubView === "unidades") {
      setCustomBack?.(() => handleBack)
      setCustomTitle?.("Unidades")
    } else if (currentSubView === "fornecedores") {
      setCustomBack?.(() => handleBack)
      setCustomTitle?.("Fornecedores")
    } else if (currentSubView === "cidades") {
      setCustomBack?.(() => handleBack)
      setCustomTitle?.("Cidades")
    } else if (currentSubView === "impressora") {
      setCustomBack?.(() => handleBack)
      setCustomTitle?.("Impressora")
    } else if (currentSubView === "pontos-impressao") {
      setCustomBack?.(() => handleBack)
      setCustomTitle?.("Pontos de impressão")
    } else if (currentSubView === "comprovantes") {
      setCustomBack?.(() => handleBack)
      setCustomTitle?.("Comprovantes")
    } else if (currentSubView === "balanca-checkout") {
      setCustomBack?.(() => handleBack)
      setCustomTitle?.("Balança checkout")
    } else if (currentSubView === "balanca-etiquetadora") {
      setCustomBack?.(() => handleBack)
      setCustomTitle?.("Balança etiquetadora")
    } else if (currentSubView === "backup") {
      setCustomBack?.(() => handleBack)
      setCustomTitle?.("Backup")
    } else {
      setCustomBack?.(null)
      setCustomTitle?.(null)
      setCustomActions?.(null)
    }
    return () => {
      setCustomBack?.(null)
      setCustomTitle?.(null)
      setCustomActions?.(null)
    }
  }, [currentSubView, setCustomBack, setCustomTitle, setCustomActions, popSubView])

  if (currentSubView === "dados-empresa") {
    return (
      <CompanyDataForm
        onCancel={popSubView}
        onSave={popSubView}
      />
    )
  }

  if (currentSubView === "sincronizacao") {
    return (
      <CompanySyncForm
        onCancel={popSubView}
      />
    )
  }

  if (currentSubView === "usuarios") {
    return (
      <UsuariosSection
        onCancel={popSubView}
        setCustomBack={setCustomBack}
        setCustomTitle={setCustomTitle}
      />
    )
  }

  if (currentSubView === "restricoes") {
    return (
      <RestricoesSection
        onCancel={popSubView}
        setCustomBack={setCustomBack}
        setCustomTitle={setCustomTitle}
        setCustomActions={setCustomActions}
      />
    )
  }

  if (currentSubView === "autorizacoes") {
    return (
      <AutorizacoesSection
        onCancel={popSubView}
        setCustomBack={setCustomBack}
        setCustomTitle={setCustomTitle}
      />
    )
  }

  if (currentSubView === "nota-fiscal-config") {
    return (
      <NotaFiscalSection
        onCancel={popSubView}
        setCustomBack={setCustomBack}
        setCustomTitle={setCustomTitle}
        setCustomActions={setCustomActions}
      />
    )
  }

  if (currentSubView === "pagamento-integrado") {
    return (
      <PagamentoIntegradoSection
        onCancel={popSubView}
        setCustomBack={setCustomBack}
        setCustomTitle={setCustomTitle}
      />
    )
  }

  if (currentSubView === "ordem-pagamento") {
    return (
      <PagamentoIntegradoSection
        type="order"
        onCancel={popSubView}
        setCustomBack={setCustomBack}
        setCustomTitle={setCustomTitle}
      />
    )
  }

  if (currentSubView === "conta-digital") {
    return (
      <ContaDigitalSection
        onCancel={popSubView}
        setCustomBack={setCustomBack}
        setCustomTitle={setCustomTitle}
      />
    )
  }

  if (currentSubView === "pix") {
    return (
      <PixSection
        onCancel={popSubView}
        setCustomBack={setCustomBack}
        setCustomTitle={setCustomTitle}
      />
    )
  }

  if (currentSubView === "crediario") {
    return (
      <CrediarioSection
        onCancel={popSubView}
        setCustomBack={setCustomBack}
        setCustomTitle={setCustomTitle}
      />
    )
  }

  if (currentSubView === "entregadores") {
    return (
      <ConectaEntregadorSection
        onCancel={popSubView}
        setCustomBack={setCustomBack}
        setCustomTitle={setCustomTitle}
      />
    )
  }

  if (currentSubView === "ifood") {
    return (
      <IFoodSection
        onCancel={popSubView}
        setCustomBack={setCustomBack}
        setCustomTitle={setCustomTitle}
      />
    )
  }

  if (currentSubView === "taxa-entrega") {
    return (
      <TaxaEntregaSection
        onCancel={popSubView}
        setCustomBack={setCustomBack}
        setCustomTitle={setCustomTitle}
      />
    )
  }

  if (currentSubView === "consulta-preco") {
    return (
      <ConsultaPrecoSection
        onCancel={popSubView}
        setCustomBack={setCustomBack}
        setCustomTitle={setCustomTitle}
      />
    )
  }

  if (currentSubView === "pesagem-automatica") {
    return (
      <PesagemAutomaticaSection
        onCancel={popSubView}
        setCustomBack={setCustomBack}
        setCustomTitle={setCustomTitle}
      />
    )
  }

  if (currentSubView === "menu-digital") {
    return (
      <MenuDigitalSection
        onCancel={popSubView}
        setCustomBack={setCustomBack}
        setCustomTitle={setCustomTitle}
        onNavigate={pushSubView}
      />
    )
  }

  if (currentSubView === "catalogo-online") {
    return (
      <CatalogoOnlineSection
        onCancel={popSubView}
        setCustomBack={setCustomBack}
        setCustomTitle={setCustomTitle}
        onNavigate={pushSubView}
      />
    )
  }

  if (currentSubView === "identificacao") {
    return (
      <IdentificacaoSection
        onCancel={popSubView}
        setCustomBack={setCustomBack}
        setCustomTitle={setCustomTitle}
      />
    )
  }

  if (currentSubView === "catalogo-produtos") {
    return (
      <CatalogoProdutosSection
        onCancel={popSubView}
        setCustomBack={setCustomBack}
        setCustomTitle={setCustomTitle}
      />
    )
  }

  if (currentSubView === "horario-atendimento") {
    return (
      <HorarioAtendimentoSection
        onCancel={popSubView}
        setCustomBack={setCustomBack}
        setCustomTitle={setCustomTitle}
      />
    )
  }

  if (currentSubView === "formas-pagamento") {
    return (
      <FormasPagamentoSection
        onCancel={popSubView}
        setCustomBack={setCustomBack}
        setCustomTitle={setCustomTitle}
      />
    )
  }

  if (currentSubView === "whatsapp") {
    return (
      <WhatsAppSection
        onCancel={popSubView}
        setCustomBack={setCustomBack}
        setCustomTitle={setCustomTitle}
      />
    )
  }

  if (currentSubView === "opcao-entrega") {
    return (
      <OpcoesEntregaSection
        onCancel={popSubView}
        setCustomBack={setCustomBack}
        setCustomTitle={setCustomTitle}
      />
    )
  }

  if (currentSubView === "opcao-pedido") {
    return (
      <OpcoesPedidoSection
        onCancel={popSubView}
        setCustomBack={setCustomBack}
        setCustomTitle={setCustomTitle}
      />
    )
  }

  if (currentSubView === "opcao-pedido-menu-digital") {
    return (
      <OpcoesPedidoMenuDigitalSection
        onCancel={popSubView}
        setCustomBack={setCustomBack}
        setCustomTitle={setCustomTitle}
      />
    )
  }

  if (currentSubView === "mesas-comandas") {
    return (
      <MesasComandasSection
        onCancel={popSubView}
        setCustomBack={setCustomBack}
        setCustomTitle={setCustomTitle}
        onNavigate={pushSubView}
      />
    )
  }

  if (currentSubView === "configurar-comandas") {
    return (
      <ConfigurarComandasSection
        onCancel={popSubView}
        setCustomBack={setCustomBack}
        setCustomTitle={setCustomTitle}
      />
    )
  }

  if (currentSubView === "taxas-servico") {
    return (
      <TaxaServicoSection
        onCancel={popSubView}
        setCustomBack={setCustomBack}
        setCustomTitle={setCustomTitle}
      />
    )
  }

  if (currentSubView === "autoatendimento") {
    return (
      <AutoatendimentoSection
        onCancel={popSubView}
        setCustomBack={setCustomBack}
        setCustomTitle={setCustomTitle}
        onNavigate={pushSubView}
      />
    )
  }

  if (currentSubView === "autoatendimento-cartao") {
    return (
      <PagamentoIntegradoSection
        onCancel={popSubView}
        setCustomBack={setCustomBack}
        setCustomTitle={setCustomTitle}
        type="integrated"
      />
    )
  }

  if (currentSubView === "autoatendimento-pix") {
    return (
      <ContaDigitalSection
        onCancel={popSubView}
        setCustomBack={setCustomBack}
        setCustomTitle={setCustomTitle}
      />
    )
  }

  if (currentSubView === "autoatendimento-customizacao") {
    return (
      <AutoatendimentoCustomizacaoSection
        onCancel={popSubView}
        setCustomBack={setCustomBack}
        setCustomTitle={setCustomTitle}
      />
    )
  }

  if (currentSubView === "autoatendimento-numero") {
    return (
      <AutoatendimentoNumeroSection
        onCancel={popSubView}
        setCustomBack={setCustomBack}
        setCustomTitle={setCustomTitle}
      />
    )
  }

  if (currentSubView === "grupos-subgrupos") {
    return (
      <GruposSubgruposSection
        onCancel={popSubView}
        setCustomBack={setCustomBack}
        setCustomTitle={setCustomTitle}
      />
    )
  }

  if (currentSubView === "unidades") {
    return (
      <UnidadesSection
        onCancel={popSubView}
        setCustomBack={setCustomBack}
        setCustomTitle={setCustomTitle}
      />
    )
  }

  if (currentSubView === "fornecedores") {
    return (
      <FornecedoresSection
        onCancel={popSubView}
        setCustomBack={setCustomBack}
        setCustomTitle={setCustomTitle}
      />
    )
  }

  if (currentSubView === "cidades") {
    return (
      <CidadesSection
        onCancel={popSubView}
        setCustomBack={setCustomBack}
        setCustomTitle={setCustomTitle}
      />
    )
  }

  if (currentSubView === "impressora") {
    return (
      <ImpressoraSection
        onCancel={popSubView}
        setCustomBack={setCustomBack}
        setCustomTitle={setCustomTitle}
      />
    )
  }

  if (currentSubView === "pontos-impressao") {
    return (
      <PontosImpressaoSection
        onCancel={popSubView}
        setCustomBack={setCustomBack}
        setCustomTitle={setCustomTitle}
        onNavigate={pushSubView}
      />
    )
  }

  if (currentSubView === "comprovantes") {
    return (
      <ComprovantesSection
        onCancel={popSubView}
        setCustomBack={setCustomBack}
        setCustomTitle={setCustomTitle}
      />
    )
  }

  if (currentSubView === "balanca-checkout") {
    return (
      <BalancaCheckoutSection
        onCancel={popSubView}
        setCustomBack={setCustomBack}
        setCustomTitle={setCustomTitle}
      />
    )
  }

  if (currentSubView === "balanca-etiquetadora") {
    return (
      <BalancaEtiquetadoraSection
        onCancel={popSubView}
        setCustomBack={setCustomBack}
        setCustomTitle={setCustomTitle}
        onNavigate={pushSubView}
      />
    )
  }

  if (currentSubView === "backup") {
    return (
      <BackupSection
        onCancel={popSubView}
        setCustomBack={setCustomBack}
        setCustomTitle={setCustomTitle}
      />
    )
  }

  return (
    <Stack gap={5} w="full">
      {/* Listagem de Grupos de Configuração */}
      <Stack gap={5} w="full">
        {SETTINGS_GROUPS.map((group) => (
          <Box
            key={group.id}
            border={true}
            borderColor="border-border"
            bg="bg-surface"
            radius="default"
            w="full"
            overflow="hidden"
          >
            <Stack gap={0} w="full">
              {group.items.map((item, idx) => (
                <React.Fragment key={item.id}>
                  {idx > 0 && <Box h="h-[1px]" w="full" bg="bg-border" />}
                  <Box
                    padding={5}
                    cursor="pointer"
                    hoverBg="primary/10"
                    onClick={() => {
                      if (item.id === "dados-empresa") {
                        pushSubView("dados-empresa")
                      } else if (item.id === "sincronizacao") {
                        pushSubView("sincronizacao")
                      } else if (item.id === "usuarios") {
                        pushSubView("usuarios")
                      } else if (item.id === "restricoes") {
                        pushSubView("restricoes")
                      } else if (item.id === "autorizacoes") {
                        pushSubView("autorizacoes")
                      } else if (item.id === "nota-fiscal-config") {
                        pushSubView("nota-fiscal-config")
                      } else if (item.id === "pagamento-integrado") {
                        pushSubView("pagamento-integrado")
                      } else if (item.id === "ordem-pagamento") {
                        pushSubView("ordem-pagamento")
                      } else if (item.id === "conta-digital") {
                        pushSubView("conta-digital")
                      } else if (item.id === "pix") {
                        pushSubView("pix")
                      } else if (item.id === "crediario") {
                        pushSubView("crediario")
                      } else if (item.id === "entregadores") {
                        pushSubView("entregadores")
                      } else if (item.id === "ifood") {
                        pushSubView("ifood")
                      } else if (item.id === "taxa-entrega") {
                        pushSubView("taxa-entrega")
                      } else if (item.id === "consulta-preco") {
                        pushSubView("consulta-preco")
                      } else if (item.id === "pesagem-automatica") {
                        pushSubView("pesagem-automatica")
                      } else if (item.id === "menu-digital") {
                        pushSubView("menu-digital")
                      } else if (item.id === "catalogo-online") {
                        pushSubView("catalogo-online")
                      } else if (item.id === "mesas-comandas") {
                        pushSubView("mesas-comandas")
                      } else if (item.id === "autoatendimento") {
                        pushSubView("autoatendimento")
                      } else if (item.id === "grupos-subgrupos") {
                        pushSubView("grupos-subgrupos")
                      } else if (item.id === "unidades") {
                        pushSubView("unidades")
                      } else if (item.id === "fornecedores") {
                        pushSubView("fornecedores")
                      } else if (item.id === "cidades") {
                        pushSubView("cidades")
                      } else if (item.id === "impressora") {
                        pushSubView("impressora")
                      } else if (item.id === "pontos-impressao") {
                        pushSubView("pontos-impressao")
                      } else if (item.id === "comprovantes") {
                        pushSubView("comprovantes")
                      } else if (item.id === "balanca-checkout") {
                        pushSubView("balanca-checkout")
                      } else if (item.id === "balanca-etiquetadora") {
                        pushSubView("balanca-etiquetadora")
                      } else if (item.id === "backup" || item.id === "backup-config") {
                        pushSubView("backup")
                      }
                    }}
                  >
                    <Stack direction="row" align="center" gap={5} w="full">
                      <Icon icon={item.icon} variant="circular-secondary" />
                      <Stack gap={1} align="stretch" flex="1">
                        <Stack direction="row" align="center" justify="between" w="full" gap={2.5}>
                          <Font variant="body-bold" text={item.title} align="left" />
                          {item.badge && (
                            <Box>
                              <Badge variant="success" label={item.badge} icon={Check} />
                            </Box>
                          )}
                        </Stack>
                        {item.subtitle && (
                          <Font variant="description" text={item.subtitle} align="left" />
                        )}
                      </Stack>
                    </Stack>
                  </Box>
                </React.Fragment>
              ))}
            </Stack>
          </Box>
        ))}
      </Stack>
    </Stack>
  )
}
