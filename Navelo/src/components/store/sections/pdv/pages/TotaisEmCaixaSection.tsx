"use client"

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Icon } from "@/components/store/base/Icon"
import { Button } from "@/components/store/base/Button"
import { EmptyState } from "@/components/store/intermediary/EmptyState"
import { SaleShareModal } from "@/components/store/sections/pdv/modals/SaleShareModal"
import { SaleLinkModal } from "@/components/store/sections/pdv/modals/SaleLinkModal"
import { generateCashConferencePdf, CashConferenceOperation } from "@/lib/pdf/generateCashConferencePdf"
import { useTenant } from "@/lib/context/TenantContext"
import { useSales } from "@/lib/dal"
import { db } from "@/lib/dal/db"
import { useLiveQuery } from "dexie-react-hooks"
import { ChevronRight, Info, Share2, FileText } from "lucide-react"
import { UI_STRINGS } from "@/constants/strings"

export interface TotaisEmCaixaSectionProps {
  onBackToDashboard?: () => void
  onBack?: () => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
  setCustomActions?: (actions: React.ReactNode | null) => void
}

interface PaymentCategory {
  id: string
  name: string
  total: string
  totalNumber: number
  subItems?: Array<{ name: string; value: string; hasInfo?: boolean }>
}

function formatPrice(val: number): string {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val)
}

function formatDateTimeBr(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0")
  const day = pad(d.getDate())
  const month = pad(d.getMonth() + 1)
  const year = d.getFullYear()
  const hours = pad(d.getHours())
  const mins = pad(d.getMinutes())
  return `${day}/${month}/${year} ${hours}:${mins}`
}

function computeCategoryTotals(salesList: Array<{ payment_method?: string; total?: number }>, movementsList: Array<{ type?: string; amount?: number }>) {
  const sumByMethod = (predicate: (m: string) => boolean) =>
    salesList.filter((s) => predicate((s.payment_method || "").toLowerCase())).reduce((acc, s) => acc + (s.total || 0), 0)

  const dinheiroSales = sumByMethod((m) => m.includes("dinheiro") || m === "")
  const suprimentos = movementsList.filter((m) => m.type === "SUPPLY").reduce((acc, m) => acc + (m.amount || 0), 0)
  const sangrias = movementsList.filter((m) => m.type === "BLEED").reduce((acc, m) => acc + (m.amount || 0), 0)
  const dinheiroTotal = Math.max(0, dinheiroSales + suprimentos - sangrias)

  const creditoTotal = sumByMethod((m) => m.includes("crédito") || m.includes("credito"))
  const debitoTotal = sumByMethod((m) => m.includes("débito") || m.includes("debito"))
  const pixTotal = sumByMethod((m) => m.includes("pix"))
  const crediarioTotal = sumByMethod((m) => m.includes("crediário") || m.includes("crediario"))
  const alimentacaoTotal = sumByMethod((m) => m.includes("alimentação") || m.includes("alimentacao"))
  const refeicaoTotal = sumByMethod((m) => m.includes("refeição") || m.includes("refeicao"))
  const outrosTotal = sumByMethod((m) => m.includes("outro"))

  return [
    {
      id: "dinheiro", name: "Dinheiro", totalNumber: dinheiroTotal, total: formatPrice(dinheiroTotal),
      subItems: [
        { name: "Negociação", value: formatPrice(dinheiroSales) },
        { name: "Suprimento", value: formatPrice(suprimentos) },
        { name: "Sangria", value: formatPrice(sangrias) },
      ],
    },
    {
      id: "credito", name: "Cartão de crédito", totalNumber: creditoTotal, total: formatPrice(creditoTotal),
      subItems: [
        { name: "À vista", value: formatPrice(creditoTotal) },
        { name: "Parcelado", value: formatPrice(0) },
        { name: "Indefinido", value: formatPrice(0), hasInfo: true },
      ],
    },
    { id: "debito", name: "Cartão de débito", totalNumber: debitoTotal, total: formatPrice(debitoTotal) },
    { id: "crediario", name: "Crediário", totalNumber: crediarioTotal, total: formatPrice(crediarioTotal) },
    { id: "alimentacao", name: "Vale Alimentação", totalNumber: alimentacaoTotal, total: formatPrice(alimentacaoTotal) },
    { id: "refeicao", name: "Vale Refeição", totalNumber: refeicaoTotal, total: formatPrice(refeicaoTotal) },
    { id: "pix", name: "Pix", totalNumber: pixTotal, total: formatPrice(pixTotal) },
    { id: "outros", name: "Outros", totalNumber: outrosTotal, total: formatPrice(outrosTotal) },
  ]
}

const CATEGORY_MATCHERS: Record<string, (m: string) => boolean> = {
  dinheiro: (m) => m.includes("dinheiro") || m === "",
  credito: (m) => m.includes("crédito") || m.includes("credito"),
  debito: (m) => m.includes("débito") || m.includes("debito"),
  pix: (m) => m.includes("pix"),
  crediario: (m) => m.includes("crediário") || m.includes("crediario"),
  alimentacao: (m) => m.includes("alimentação") || m.includes("alimentacao"),
  refeicao: (m) => m.includes("refeição") || m.includes("refeicao"),
}

function matchesCategoryMethod(catId: string, method: string) {
  const m = (method || "").toLowerCase()
  const matcher = CATEGORY_MATCHERS[catId]
  if (matcher) return matcher(m)
  return m.includes("outro")
}

function extractCategoryOperations(
  catId: string,
  salesList: ReturnType<typeof useSales>,
  movementsList: Array<{ created_at?: string; type?: string; amount?: number; description?: string; id?: string }>
): CashConferenceOperation[] {
  const ops: CashConferenceOperation[] = []

  if (catId === "dinheiro" && movementsList.length > 0) {
    movementsList.forEach((mov) => {
      const d = mov.created_at ? new Date(mov.created_at) : new Date()
      const typeLabel = mov.type === "SUPPLY" ? "Suprimento" : mov.type === "BLEED" ? "Sangria" : "Movimentação"
      ops.push({
        date: formatDateTimeBr(d),
        description: `${typeLabel}: ${mov.description || mov.id?.slice(0, 4) || ""}`,
        total: mov.amount || 0,
      })
    })
  }

  salesList.filter((s) => matchesCategoryMethod(catId, s.payment_method || "")).forEach((s) => {
    const saleCode = (s as unknown as { code?: string }).code
    const code = saleCode ? String(saleCode) : s.id ? s.id.split("-").pop()?.slice(0, 4).toUpperCase() || "001" : "001"
    const d = s.created_at ? new Date(s.created_at) : new Date()
    ops.push({ date: formatDateTimeBr(d), description: `Negociação: ${code}`, total: s.total || 0 })
  })

  return ops.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

function CashCategoryRow({ cat, onClick }: { cat: PaymentCategory; onClick: () => void }) {
  const hasSub = Boolean(cat.subItems && cat.subItems.length > 0)
  const subItemsList = cat.subItems || []

  return (
    <>
      <Box padding={2.5} w="full" cursor="pointer" hoverBg="secondary/10" onClick={onClick}>
        <Stack direction="row" align="center" justify="between" w="full">
          <Font variant="body-medium" text={cat.name} />
          <Stack direction="row" align="center" gap={2.5}>
            <Font variant="body-medium" text={cat.total} />
            <Icon icon={ChevronRight} size={16} color="primary" />
          </Stack>
        </Stack>
      </Box>

      {hasSub && (
        <Box paddingX={2.5} paddingY={1} bg="bg-surface">
          <Stack gap={1} w="full">
            {subItemsList.map((sub) => (
              <Stack key={sub.name} direction="row" justify="between" align="center" w="full">
                <Stack direction="row" align="center" gap={1}>
                  <Font variant="body-sm-medium" color="muted" text={sub.name} />
                  {sub.hasInfo && <Icon icon={Info} size={14} color="muted" />}
                </Stack>
                <Font variant="body-sm-medium" color="muted" text={sub.value} />
              </Stack>
            ))}
          </Stack>
        </Box>
      )}
    </>
  )
}

function CashCategoryDetailView({
  selectedCategory,
  categoryOperations,
  isShareModalOpen,
  setIsShareModalOpen,
  isLinkModalOpen,
  setIsLinkModalOpen,
  linkModalUrl,
  setLinkModalUrl,
  onGeneratePdf,
}: {
  selectedCategory: PaymentCategory
  categoryOperations: CashConferenceOperation[]
  isShareModalOpen: boolean
  setIsShareModalOpen: (v: boolean) => void
  isLinkModalOpen: boolean
  setIsLinkModalOpen: (v: boolean) => void
  linkModalUrl: string
  setLinkModalUrl: (v: string) => void
  onGeneratePdf: () => Promise<string | null>
}) {
  const s = UI_STRINGS.cashTotals
  return (
    <Box w="full" flex="1" direction="col" overflow="hidden" minH="0">
      <Box w="full" flex="1" bg="bg-surface" radius="default" border borderColor="border-border" overflow="x-hidden y-auto" minH="0">
        {categoryOperations.length === 0 ? (
          <Box w="full" h="full" direction="col" align="center" justify="center" padding={5}>
            <EmptyState icon={FileText} title={s.emptyOperationsTitle} subtitle={s.emptyOperationsSubtitle} />
          </Box>
        ) : (
          <Stack gap={0} w="full">
            {categoryOperations.map((op, idx) => (
              <React.Fragment key={`${op.description}-${idx}`}>
                {idx > 0 && <Box h="h-[1px]" bg="bg-border" w="full" />}
                <Box padding={2.5} w="full">
                  <Stack direction="row" align="center" justify="between" w="full">
                    <Stack gap={1} flex="1" minW="0">
                      <Font variant="auxiliary" color="muted" text={op.date} />
                      <Font variant="body-sm-medium" text={op.description} />
                    </Stack>
                    <Box shrink="0">
                      <Font variant="body" text={formatPrice(op.total)} />
                    </Box>
                  </Stack>
                </Box>
              </React.Fragment>
            ))}
          </Stack>
        )}
      </Box>

      <SaleShareModal
        isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} pdfUrl={null}
        saleName={`Conferência - ${selectedCategory.name}`} onGeneratePdf={onGeneratePdf}
        onOpenLinkModal={(url) => { setLinkModalUrl(url); setIsLinkModalOpen(true) }}
      />
      <SaleLinkModal isOpen={isLinkModalOpen} onClose={() => setIsLinkModalOpen(false)} pdfUrl={linkModalUrl} saleName={`Conferência - ${selectedCategory.name}`} />
    </Box>
  )
}

function CashTotalsListView({
  openingTimeText,
  categories,
  totalGeral,
  onSelectCategory,
}: {
  openingTimeText: string
  categories: PaymentCategory[]
  totalGeral: number
  onSelectCategory: (cat: PaymentCategory) => void
}) {
  const s = UI_STRINGS.cashTotals
  return (
    <Box w="full" flex="1" direction="col" justify="between" overflow="hidden" minH="0">
      <Box w="full" flex="1" overflow="x-hidden y-auto" minH="0">
        <Stack gap={5} w="full">
          <Box padding={1} shrink="0">
            <Font variant="body-sm-semibold" color="muted" text={openingTimeText} />
          </Box>
          <Box bg="bg-surface" radius="default" border borderColor="border-border">
            <Stack gap={0} w="full">
              {categories.map((cat, idx) => (
                <React.Fragment key={cat.id}>
                  {idx > 0 && <Box h="h-[1px]" bg="bg-border" w="full" />}
                  <CashCategoryRow cat={cat} onClick={() => onSelectCategory(cat)} />
                </React.Fragment>
              ))}
              <Box h="h-[1px]" bg="bg-border" w="full" />
              <Box padding={2.5} w="full">
                <Stack direction="row" align="center" justify="between" w="full">
                  <Font variant="body-bold" text={s.totalLabel} />
                  <Font variant="body-bold" text={formatPrice(totalGeral)} />
                </Stack>
              </Box>
            </Stack>
          </Box>
        </Stack>
      </Box>
    </Box>
  )
}

interface ConferenceActionOptions {
  selectedCategory: PaymentCategory | null
  openingTimeText: string
  categoryOperations: CashConferenceOperation[]
  categoryTotalAmount: number
  tenantId?: string
  tenantCtx?: ReturnType<typeof useTenant>
  dbCompany?: unknown
}

function useCashConferenceActions(opts: ConferenceActionOptions) {
  const { selectedCategory, openingTimeText, categoryOperations, categoryTotalAmount, tenantId, tenantCtx, dbCompany } = opts

  const handleGenerateConferencePdf = async (): Promise<string | null> => {
    if (!selectedCategory) return null
    try {
      const pdfData = { paymentMethod: selectedCategory.name, periodText: openingTimeText, operations: categoryOperations, totalAmount: categoryTotalAmount }
      const companyData = dbCompany || (tenantCtx?.currentTenant as unknown as typeof dbCompany) || undefined
      const { base64, blob } = await generateCashConferencePdf(pdfData, companyData)
      const fileName = `Conferencia_Caixa_${selectedCategory.id}_${Date.now()}.pdf`
      const response = await fetch("/api/upload-receipt", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pdfBase64: base64, fileName, tenantId: tenantId || "default" }),
      })
      if (!response.ok) return URL.createObjectURL(blob)
      const resData = (await response.json()) as { url?: string }
      return resData.url || URL.createObjectURL(blob)
    } catch {
      return null
    }
  }

  const handlePrintConference = React.useCallback(async () => {
    if (!selectedCategory) return
    const pdfData = { paymentMethod: selectedCategory.name, periodText: openingTimeText, operations: categoryOperations, totalAmount: categoryTotalAmount }
    const companyData = dbCompany || (tenantCtx?.currentTenant as unknown as typeof dbCompany) || undefined
    const { blob, dataUrl } = await generateCashConferencePdf(pdfData, companyData)
    const blobUrl = URL.createObjectURL(blob)
    const iframe = document.createElement("iframe")
    iframe.style.position = "fixed"; iframe.style.right = "0"; iframe.style.bottom = "0"; iframe.style.width = "0"; iframe.style.height = "0"; iframe.style.border = "0"
    iframe.src = blobUrl || dataUrl
    document.body.appendChild(iframe)
    iframe.onload = () => { setTimeout(() => { iframe.contentWindow?.focus(); iframe.contentWindow?.print() }, 300) }
  }, [selectedCategory, openingTimeText, categoryOperations, categoryTotalAmount, dbCompany, tenantCtx?.currentTenant])

  return { handleGenerateConferencePdf, handlePrintConference }
}

export const TotaisEmCaixaSection: React.FC<TotaisEmCaixaSectionProps> = ({
  onBackToDashboard,
  onBack,
  setCustomBack,
  setCustomTitle,
  setCustomActions,
}) => {
  const tenantCtx = useTenant()
  const tenantId = tenantCtx?.currentTenant?.id
  const dbSales = useSales(tenantId)
  const dbCompany = useLiveQuery(async () => (tenantId ? await db.companies.get(tenantId) : null), [tenantId])

  const openRegister = useLiveQuery(async () => {
    if (!tenantId) return null
    const list = await db.cash_registers.filter((r) => r.company_id === tenantId || r.tenant_id === tenantId).toArray()
    return list.find((r) => r.status === "OPEN") || list[0] || null
  }, [tenantId])

  const cashMovements = useLiveQuery(async () => {
    if (!tenantId) return []
    return await db.cash_movements.filter((m) => m.company_id === tenantId || m.tenant_id === tenantId).toArray()
  }, [tenantId])

  const s = UI_STRINGS.cashTotals
  const [selectedCategory, setSelectedCategory] = React.useState<PaymentCategory | null>(null)
  const [isShareModalOpen, setIsShareModalOpen] = React.useState(false)
  const [isLinkModalOpen, setIsLinkModalOpen] = React.useState(false)
  const [linkModalUrl, setLinkModalUrl] = React.useState("")

  const handleBack = onBack || onBackToDashboard
  const handleBackRef = React.useRef(handleBack)
  React.useEffect(() => { handleBackRef.current = handleBack }, [handleBack])

  const openingTimeText = React.useMemo(() => {
    if (openRegister?.opened_at) return `${s.openingTimePrefix}${formatDateTimeBr(new Date(openRegister.opened_at))}`
    if (dbSales?.[0]?.created_at) return `${s.openingTimePrefix}${formatDateTimeBr(new Date(dbSales[0].created_at))}`
    return `${s.openingTimePrefix}${formatDateTimeBr(new Date())}`
  }, [openRegister, dbSales, s.openingTimePrefix])

  const categories = React.useMemo(() => computeCategoryTotals(dbSales || [], cashMovements || []), [dbSales, cashMovements])
  const totalGeral = React.useMemo(() => categories.reduce((acc, cat) => acc + cat.totalNumber, 0), [categories])

  const categoryOperations = React.useMemo(() => {
    if (!selectedCategory) return []
    return extractCategoryOperations(selectedCategory.id, dbSales || [], cashMovements || [])
  }, [selectedCategory, dbSales, cashMovements])

  const categoryTotalAmount = React.useMemo(() => categoryOperations.reduce((acc, op) => acc + op.total, 0), [categoryOperations])

  const { handleGenerateConferencePdf, handlePrintConference } = useCashConferenceActions({
    selectedCategory, openingTimeText, categoryOperations, categoryTotalAmount, tenantId, tenantCtx, dbCompany
  })

  React.useEffect(() => {
    if (selectedCategory) {
      setCustomTitle?.(selectedCategory.name)
      setCustomBack?.(() => () => setSelectedCategory(null))
      setCustomActions?.(
        <Stack direction="row" align="center" gap={2.5}>
          <Button variant="secondary-pill-icon" icon={Share2} title={s.shareConferenceTitle} onClick={() => setIsShareModalOpen(true)} />
          <Button variant="primary-pill-icon-print" title={s.printConferenceTitle} onClick={handlePrintConference} />
        </Stack>
      )
    } else {
      setCustomTitle?.(s.title)
      setCustomBack?.(() => () => handleBackRef.current?.())
      setCustomActions?.(null)
    }
    return () => { setCustomTitle?.(null); setCustomBack?.(null); setCustomActions?.(null) }
  }, [selectedCategory, setCustomBack, setCustomTitle, setCustomActions, s, handlePrintConference])

  if (selectedCategory) {
    return (
      <CashCategoryDetailView
        selectedCategory={selectedCategory} categoryOperations={categoryOperations}
        isShareModalOpen={isShareModalOpen} setIsShareModalOpen={setIsShareModalOpen}
        isLinkModalOpen={isLinkModalOpen} setIsLinkModalOpen={setIsLinkModalOpen}
        linkModalUrl={linkModalUrl} setLinkModalUrl={setLinkModalUrl}
        onGeneratePdf={handleGenerateConferencePdf}
      />
    )
  }

  return (
    <CashTotalsListView
      openingTimeText={openingTimeText} categories={categories}
      totalGeral={totalGeral} onSelectCategory={setSelectedCategory}
    />
  )
}
