"use client"

import * as React from "react"
import { useLiveQuery } from "dexie-react-hooks"
import { db, CashRegister, CashMovement, Sale } from "@/lib/dal/db"
import { useSales } from "@/lib/dal/hooks"
import { useTenant } from "@/lib/context/TenantContext"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Button } from "@/components/store/base/Button"
import { Icon } from "@/components/store/base/Icon"
import { SaleShareModal } from "@/components/store/sections/pdv/modals/SaleShareModal"
import { SaleLinkModal } from "@/components/store/sections/pdv/modals/SaleLinkModal"
import { EmptyState } from "@/components/store/intermediary/EmptyState"
import {
  generateCashConferencePdf,
  CashConferenceOperation,
} from "@/lib/pdf/generateCashConferencePdf"
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
  subItems?: { name: string; value: string; hasInfo?: boolean }[]
}

interface CompanyInfo {
  name: string
  trade_name?: string
  document?: string
  phone?: string
  email?: string
}

function formatPrice(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)
}

function formatDateTimeBr(date: Date) {
  const day = String(date.getDate()).padStart(2, "0")
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const year = date.getFullYear()
  const hours = String(date.getHours()).padStart(2, "0")
  const minutes = String(date.getMinutes()).padStart(2, "0")
  return `${day}/${month}/${year} às ${hours}:${minutes}`
}

function formatTimeBr(date: Date) {
  const hours = String(date.getHours()).padStart(2, "0")
  const minutes = String(date.getMinutes()).padStart(2, "0")
  return `${hours}:${minutes}`
}

function computeDinheiroSubItems(
  sangriaVal: number,
  suprimentoVal: number,
  trocoVal: number,
  gavetaVal: number
) {
  const s = UI_STRINGS.cashTotals
  return [
    { name: s.cashWithdrawalsLabel, value: formatPrice(sangriaVal) },
    { name: s.cashDepositsLabel, value: formatPrice(suprimentoVal) },
    { name: s.openingBalanceLabel, value: formatPrice(trocoVal) },
    { name: s.currentTotalLabel, value: formatPrice(gavetaVal), hasInfo: true },
  ]
}

function buildCashCategoriesList(
  sales: Sale[],
  movements: CashMovement[]
): PaymentCategory[] {
  const methodTotals: Record<string, number> = {
    Dinheiro: 0,
    "Cartão de Débito": 0,
    "Cartão de Crédito": 0,
    PIX: 0,
    Outros: 0,
  }

  sales.forEach((sale) => {
    const method = sale.payment_method || "Dinheiro"
    if (method.includes("Débito")) methodTotals["Cartão de Débito"] += sale.total
    else if (method.includes("Crédito")) methodTotals["Cartão de Crédito"] += sale.total
    else if (method.includes("PIX")) methodTotals["PIX"] += sale.total
    else if (method.includes("Dinheiro")) methodTotals["Dinheiro"] += sale.total
    else methodTotals["Outros"] += sale.total
  })

  let sangria = 0
  let suprimento = 0
  movements.forEach((m) => {
    if (m.type === "BLEED") sangria += m.amount
    else if (m.type === "SUPPLY") suprimento += m.amount
  })

  const gaveta = methodTotals["Dinheiro"] + suprimento - sangria

  return [
    {
      id: "dinheiro",
      name: "Dinheiro",
      total: formatPrice(methodTotals["Dinheiro"]),
      totalNumber: methodTotals["Dinheiro"],
      subItems: computeDinheiroSubItems(sangria, suprimento, 0, gaveta),
    },
    {
      id: "debito",
      name: "Cartão de Débito",
      total: formatPrice(methodTotals["Cartão de Débito"]),
      totalNumber: methodTotals["Cartão de Débito"],
    },
    {
      id: "credito",
      name: "Cartão de Crédito",
      total: formatPrice(methodTotals["Cartão de Crédito"]),
      totalNumber: methodTotals["Cartão de Crédito"],
    },
    {
      id: "pix",
      name: "PIX",
      total: formatPrice(methodTotals["PIX"]),
      totalNumber: methodTotals["PIX"],
    },
    {
      id: "outros",
      name: "Outros",
      total: formatPrice(methodTotals["Outros"]),
      totalNumber: methodTotals["Outros"],
    },
  ]
}

function useCashTotalsCategories(
  dbSales: Sale[] | undefined,
  cashMovements: CashMovement[] | undefined
): PaymentCategory[] {
  return React.useMemo(() => {
    return buildCashCategoriesList(dbSales || [], cashMovements || [])
  }, [dbSales, cashMovements])
}

function filterSalesForCategory(sales: Sale[], catId: string): CashConferenceOperation[] {
  return sales
    .filter((sale) => {
      const pm = sale.payment_method || "Dinheiro"
      if (catId === "debito") return pm.includes("Débito")
      if (catId === "credito") return pm.includes("Crédito")
      if (catId === "pix") return pm.includes("PIX")
      if (catId === "dinheiro") return pm.includes("Dinheiro")
      return !pm.includes("Débito") && !pm.includes("Crédito") && !pm.includes("PIX") && !pm.includes("Dinheiro")
    })
    .map((sale) => ({
      date: sale.created_at ? formatTimeBr(new Date(sale.created_at)) : "",
      description: `Venda #${sale.id.slice(-4)}`,
      total: sale.total,
    }))
}

function useCategoryOperations(
  selectedCategory: PaymentCategory | null,
  dbSales: Sale[] | undefined,
  cashMovements: CashMovement[] | undefined
): CashConferenceOperation[] {
  return React.useMemo(() => {
    if (!selectedCategory) return []
    const sales = dbSales || []
    const movements = cashMovements || []

    if (selectedCategory.id === "dinheiro") {
      const sOps = filterSalesForCategory(sales, "dinheiro")
      const mOps = movements.map((m) => ({
        date: m.created_at ? formatTimeBr(new Date(m.created_at)) : "",
        description: `${m.type === "BLEED" ? "Sangria" : "Suprimento"} - ${m.description || "Sem motivo"}`,
        total: m.type === "BLEED" ? -m.amount : m.amount,
      }))
      return [...sOps, ...mOps]
    }

    return filterSalesForCategory(sales, selectedCategory.id)
  }, [selectedCategory, dbSales, cashMovements])
}

function CategoryDetailOperationsView({
  categoryOperations,
}: {
  categoryOperations: CashConferenceOperation[]
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
    </Box>
  )
}

function CashTotalsMainListView({
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
                  <Box padding={2.5} w="full" cursor="pointer" hoverBg="secondary/10" onClick={() => onSelectCategory(cat)}>
                    <Stack direction="row" align="center" justify="between" w="full">
                      <Font variant="body-medium" text={cat.name} />
                      <Stack direction="row" align="center" gap={2.5}>
                        <Font variant="body-medium" text={cat.total} />
                        <Icon icon={ChevronRight} size={16} color="primary" />
                      </Stack>
                    </Stack>
                  </Box>
                  {cat.subItems && (
                    <Box paddingX={2.5} paddingY={1} bg="bg-surface">
                      <Stack gap={1} w="full">
                        {cat.subItems.map((sub) => (
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

function printCashConferencePdf(
  selectedCategory: PaymentCategory,
  openingTimeText: string,
  categoryOperations: CashConferenceOperation[],
  dbCompany?: CompanyInfo | null
) {
  const totalAmount = categoryOperations.reduce((acc, op) => acc + op.total, 0)
  const pdfData = { paymentMethod: selectedCategory.name, periodText: openingTimeText, operations: categoryOperations, totalAmount }
  generateCashConferencePdf(pdfData, dbCompany || undefined).then(({ blob, dataUrl }) => {
    const blobUrl = URL.createObjectURL(blob)
    const iframe = document.createElement("iframe")
    iframe.style.position = "fixed"
    iframe.style.right = "0"
    iframe.style.bottom = "0"
    iframe.style.width = "0"
    iframe.style.height = "0"
    iframe.style.border = "0"
    iframe.src = blobUrl || dataUrl
    document.body.appendChild(iframe)
    iframe.onload = () => {
      setTimeout(() => {
        iframe.contentWindow?.focus()
        iframe.contentWindow?.print()
      }, 300)
    }
  })
}

interface ConferencePdfOptions {
  selectedCategory: PaymentCategory | null
  openingTimeText: string
  categoryOperations: CashConferenceOperation[]
  totalAmount: number
  dbCompany: CompanyInfo | null | undefined
  tenantId: string | undefined
}

function useConferencePdfGenerator(opts: ConferencePdfOptions) {
  const { selectedCategory, openingTimeText, categoryOperations, totalAmount, dbCompany, tenantId } = opts
  return React.useCallback(async (): Promise<string | null> => {
    if (!selectedCategory) return null
    try {
      const pdfData = { paymentMethod: selectedCategory.name, periodText: openingTimeText, operations: categoryOperations, totalAmount }
      const { base64, blob } = await generateCashConferencePdf(pdfData, dbCompany || undefined)
      const fileName = `Conferencia_Caixa_${selectedCategory.id}_${Date.now()}.pdf`
      const res = await fetch("/api/upload-receipt", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pdfBase64: base64, fileName, tenantId: tenantId || "default" }),
      })
      if (!res.ok) return URL.createObjectURL(blob)
      const data = (await res.json()) as { url?: string }
      return data.url || URL.createObjectURL(blob)
    } catch {
      return null
    }
  }, [selectedCategory, openingTimeText, categoryOperations, totalAmount, dbCompany, tenantId])
}

function useTotaisHeaderSync({
  selectedCategoryName,
  handleBack,
  setSelectedCategory,
  onShare,
  onPrint,
  setCustomTitle,
  setCustomBack,
  setCustomActions,
}: {
  selectedCategoryName?: string
  handleBack?: () => void
  setSelectedCategory: (c: PaymentCategory | null) => void
  onShare: () => void
  onPrint: () => void
  setCustomTitle?: (title: string | null) => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomActions?: (actions: React.ReactNode | null) => void
}) {
  const s = UI_STRINGS.cashTotals
  const onShareRef = React.useRef(onShare)
  const onPrintRef = React.useRef(onPrint)
  const onBackRef = React.useRef(handleBack)
  const onSelectCatRef = React.useRef(setSelectedCategory)

  React.useEffect(() => { onShareRef.current = onShare }, [onShare])
  React.useEffect(() => { onPrintRef.current = onPrint }, [onPrint])
  React.useEffect(() => { onBackRef.current = handleBack }, [handleBack])
  React.useEffect(() => { onSelectCatRef.current = setSelectedCategory }, [setSelectedCategory])

  React.useEffect(() => {
    if (selectedCategoryName) {
      setCustomTitle?.(selectedCategoryName)
      setCustomBack?.(() => () => onSelectCatRef.current(null))
      setCustomActions?.(
        <Stack direction="row" align="center" gap={2.5}>
          <Button variant="secondary-pill-icon" icon={Share2} title={s.shareConferenceTitle} onClick={() => onShareRef.current()} />
          <Button variant="primary-pill-icon-print" title={s.printConferenceTitle} onClick={() => onPrintRef.current()} />
        </Stack>
      )
    } else {
      setCustomTitle?.(s.title)
      setCustomBack?.(() => () => onBackRef.current?.())
      setCustomActions?.(null)
    }
    return () => { setCustomTitle?.(null); setCustomBack?.(null); setCustomActions?.(null) }
  }, [selectedCategoryName, setCustomTitle, setCustomBack, setCustomActions, s.shareConferenceTitle, s.printConferenceTitle, s.title])
}

function useTotaisDbQueries(tenantId?: string) {
  const dbSales = useSales(tenantId)
  const dbCompany = useLiveQuery(async () => (tenantId ? await db.companies.get(tenantId) : null), [tenantId])
  const openRegister = useLiveQuery(async () => {
    if (!tenantId) return null
    const list = await db.cash_registers.filter((r: CashRegister) => r.company_id === tenantId || r.tenant_id === tenantId).toArray()
    return list.find((r: CashRegister) => r.status === "OPEN") || list[0] || null
  }, [tenantId])
  const cashMovements = useLiveQuery(async () => {
    if (!tenantId) return []
    return await db.cash_movements.filter((m: CashMovement) => m.company_id === tenantId || m.tenant_id === tenantId).toArray()
  }, [tenantId])

  return { dbSales, dbCompany, openRegister, cashMovements }
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
  const { dbSales, dbCompany, openRegister, cashMovements } = useTotaisDbQueries(tenantId)

  const s = UI_STRINGS.cashTotals
  const [selectedCategory, setSelectedCategory] = React.useState<PaymentCategory | null>(null)
  const [isShareModalOpen, setIsShareModalOpen] = React.useState(false)
  const [isLinkModalOpen, setIsLinkModalOpen] = React.useState(false)
  const [linkModalUrl, setLinkModalUrl] = React.useState("")

  const handleBack = onBack || onBackToDashboard
  const openingTimeText = React.useMemo(() => {
    if (openRegister?.opened_at) return `${s.openingTimePrefix}${formatDateTimeBr(new Date(openRegister.opened_at))}`
    return `${s.openingTimePrefix}${formatDateTimeBr(new Date())}`
  }, [openRegister, s.openingTimePrefix])

  const categories = useCashTotalsCategories(dbSales, cashMovements)
  const totalGeral = React.useMemo(() => categories.reduce((acc, cat) => acc + cat.totalNumber, 0), [categories])
  const categoryOperations = useCategoryOperations(selectedCategory, dbSales, cashMovements)
  const totalAmount = React.useMemo(() => categoryOperations.reduce((acc, op) => acc + op.total, 0), [categoryOperations])

  const handleGeneratePdf = useConferencePdfGenerator({ selectedCategory, openingTimeText, categoryOperations, totalAmount, dbCompany, tenantId })

  const handleOpenShare = React.useCallback(() => {
    setIsShareModalOpen(true)
  }, [])

  const handlePrint = React.useCallback(() => {
    if (selectedCategory) printCashConferencePdf(selectedCategory, openingTimeText, categoryOperations, dbCompany)
  }, [selectedCategory, openingTimeText, categoryOperations, dbCompany])

  useTotaisHeaderSync({
    selectedCategoryName: selectedCategory?.name,
    handleBack,
    setSelectedCategory,
    onShare: handleOpenShare,
    onPrint: handlePrint,
    setCustomTitle,
    setCustomBack,
    setCustomActions,
  })

  return (
    <Box w="full" flex="1" direction="col" overflow="hidden" minH="0">
      {selectedCategory ? (
        <CategoryDetailOperationsView categoryOperations={categoryOperations} />
      ) : (
        <CashTotalsMainListView
          openingTimeText={openingTimeText}
          categories={categories}
          totalGeral={totalGeral}
          onSelectCategory={setSelectedCategory}
        />
      )}

      {selectedCategory && (
        <>
          <SaleShareModal
            isOpen={isShareModalOpen}
            onClose={() => setIsShareModalOpen(false)}
            pdfUrl={null}
            saleName={`Conferência - ${selectedCategory.name}`}
            onGeneratePdf={handleGeneratePdf}
            onOpenLinkModal={(url: string) => { setLinkModalUrl(url); setIsLinkModalOpen(true) }}
          />
          <SaleLinkModal
            isOpen={isLinkModalOpen}
            onClose={() => setIsLinkModalOpen(false)}
            pdfUrl={linkModalUrl}
            saleName={`Conferência - ${selectedCategory.name}`}
          />
        </>
      )}
    </Box>
  )
}
