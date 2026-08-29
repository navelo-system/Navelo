"use client"

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Switch } from "@/components/store/base/Switch"
import { Radio } from "@/components/store/base/Radio"
import { Warning } from "@/components/store/base/Warning"
import { Button } from "@/components/store/base/Button"
import { DiscardChangesModal } from "@/components/store/advanced/DiscardChangesModal"
import { Check, Info } from "lucide-react"
import { UI_STRINGS } from "@/constants/strings"

interface PdvCustomizacaoSectionProps {
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
  setCustomActions?: (actions: React.ReactNode | null) => void
  onBack: () => void
}

const STORAGE_KEY_ONLY_STOCK = "pdv_show_only_with_stock"
const STORAGE_KEY_STOCK_QTY = "pdv_show_stock_qty"
const STORAGE_KEY_MAIN_PAGE = "pdv_main_page"
export const PDV_CUSTOMIZATION_CHANGED_EVENT = "navelo:pdv_customization_changed"

function getStoredPdvConfig() {
  if (typeof window === "undefined") {
    return {
      onlyStock: false,
      stockQty: false,
      mainPage: "products" as "products" | "resume",
    }
  }
  return {
    onlyStock: localStorage.getItem(STORAGE_KEY_ONLY_STOCK) === "true",
    stockQty: localStorage.getItem(STORAGE_KEY_STOCK_QTY) === "true",
    mainPage: ((localStorage.getItem(STORAGE_KEY_MAIN_PAGE) as "products" | "resume") || "products"),
  }
}

interface EstoqueCardProps {
  showOnlyWithStock: boolean
  setShowOnlyWithStock: React.Dispatch<React.SetStateAction<boolean>>
  showStockQty: boolean
  setShowStockQty: React.Dispatch<React.SetStateAction<boolean>>
}

function PdvEstoqueConfigCard({
  showOnlyWithStock,
  setShowOnlyWithStock,
  showStockQty,
  setShowStockQty,
}: EstoqueCardProps) {
  const s = UI_STRINGS.pdv.pdvCustomization
  return (
    <Box bg="bg-white" padding={5} radius="default" border borderColor="border-border" w="full">
      <Stack gap={5} w="full">
        <Font variant="body-bold" text={s.stockSectionTitle} />

        {/* Toggle: apenas com estoque */}
        <Stack direction="row" align="center" gap={2.5}>
          <Switch
            checked={showOnlyWithStock}
            onChange={(e) => setShowOnlyWithStock(e.target.checked)}
          />
          <Box cursor="pointer" onClick={() => setShowOnlyWithStock((prev) => !prev)}>
            <Font variant="body" text={s.showOnlyWithStock} />
          </Box>
        </Stack>

        {/* Toggle: qtd de estoque */}
        <Stack direction="row" align="center" gap={2.5}>
          <Switch
            checked={showStockQty}
            onChange={(e) => setShowStockQty(e.target.checked)}
          />
          <Box cursor="pointer" onClick={() => setShowStockQty((prev) => !prev)}>
            <Font variant="body" text={s.showStockQty} />
          </Box>
        </Stack>
      </Stack>
    </Box>
  )
}

interface MainPageCardProps {
  mainPage: "products" | "resume"
  setMainPage: React.Dispatch<React.SetStateAction<"products" | "resume">>
}

function PdvMainPageConfigCard({ mainPage, setMainPage }: MainPageCardProps) {
  const s = UI_STRINGS.pdv.pdvCustomization
  return (
    <Box bg="bg-white" padding={5} radius="default" border borderColor="border-border" w="full">
      <Stack gap={5} w="full">
        <Stack gap={1}>
          <Font variant="body-bold" text={s.mainPageSectionTitle} />
          <Font variant="description" color="muted" text={s.mainPageSectionDesc} />
        </Stack>

        <Radio
          name="pdv-main-page"
          value="products"
          checked={mainPage === "products"}
          onChange={() => setMainPage("products")}
          label={s.mainPageProducts}
        />

        <Radio
          name="pdv-main-page"
          value="resume"
          checked={mainPage === "resume"}
          onChange={() => setMainPage("resume")}
          label={s.mainPageResume}
        />

        <Warning
          variant="info"
          icon={Info}
          title={`${s.scopeNotice} ${s.scopeNoticeBold} ${s.scopeNoticeAnd} ${s.scopeNoticeBold2} ${s.scopeNoticeEnd}`}
        />
      </Stack>
    </Box>
  )
}

function usePdvCustomizacaoChrome({
  sectionTitle,
  handleBack,
  handleSave,
  setCustomBack,
  setCustomTitle,
  setCustomActions,
}: {
  sectionTitle: string
  handleBack: () => void
  handleSave: () => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
  setCustomActions?: (actions: React.ReactNode | null) => void
}) {
  const handleBackRef = React.useRef(handleBack)
  const handleSaveRef = React.useRef(handleSave)
  React.useEffect(() => {
    handleBackRef.current = handleBack
    handleSaveRef.current = handleSave
  })

  React.useEffect(() => {
    setCustomTitle?.(sectionTitle)
    setCustomBack?.(() => () => handleBackRef.current())
    setCustomActions?.(
      <Button
        variant="primary-icon"
        icon={Check}
        title={UI_STRINGS.common.confirm}
        onClick={() => handleSaveRef.current()}
      />
    )
    return () => {
      setCustomTitle?.(null)
      setCustomBack?.(null)
      setCustomActions?.(null)
    }
  }, [setCustomBack, setCustomTitle, setCustomActions, sectionTitle])
}

export const PdvCustomizacaoSection: React.FC<PdvCustomizacaoSectionProps> = ({
  setCustomBack,
  setCustomTitle,
  setCustomActions,
  onBack,
}) => {
  const s = UI_STRINGS.pdv.pdvCustomization
  const [initialValues] = React.useState(getStoredPdvConfig)
  const [savedValues, setSavedValues] = React.useState(initialValues)
  const [showOnlyWithStock, setShowOnlyWithStock] = React.useState(() => initialValues.onlyStock)
  const [showStockQty, setShowStockQty] = React.useState(() => initialValues.stockQty)
  const [mainPage, setMainPage] = React.useState<"products" | "resume">(() => initialValues.mainPage)
  const [isDiscardModalOpen, setIsDiscardModalOpen] = React.useState(false)
  const onBackRef = React.useRef(onBack)
  React.useEffect(() => { onBackRef.current = onBack }, [onBack])

  const isDirty =
    showOnlyWithStock !== savedValues.onlyStock ||
    showStockQty !== savedValues.stockQty ||
    mainPage !== savedValues.mainPage

  const handleSave = React.useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_ONLY_STOCK, String(showOnlyWithStock))
      localStorage.setItem(STORAGE_KEY_STOCK_QTY, String(showStockQty))
      localStorage.setItem(STORAGE_KEY_MAIN_PAGE, mainPage)
      window.dispatchEvent(new CustomEvent(PDV_CUSTOMIZATION_CHANGED_EVENT, {
        detail: { onlyStock: showOnlyWithStock, stockQty: showStockQty, mainPage },
      }))
    }
    setSavedValues({ onlyStock: showOnlyWithStock, stockQty: showStockQty, mainPage })
    onBackRef.current()
  }, [showOnlyWithStock, showStockQty, mainPage])

  const handleBack = React.useCallback(() => {
    if (isDirty) setIsDiscardModalOpen(true)
    else onBackRef.current()
  }, [isDirty])

  usePdvCustomizacaoChrome({
    sectionTitle: s.sectionTitle,
    handleBack,
    handleSave,
    setCustomBack,
    setCustomTitle,
    setCustomActions,
  })

  return (
    <>
      <Box flex="1" minH="0" overflowY="auto" w="full">
        <Stack gap={5} w="full">
          <PdvEstoqueConfigCard
            showOnlyWithStock={showOnlyWithStock}
            setShowOnlyWithStock={setShowOnlyWithStock}
            showStockQty={showStockQty}
            setShowStockQty={setShowStockQty}
          />
          <PdvMainPageConfigCard
            mainPage={mainPage}
            setMainPage={setMainPage}
          />
        </Stack>
      </Box>
      <DiscardChangesModal
        isOpen={isDiscardModalOpen}
        onClose={() => setIsDiscardModalOpen(false)}
        onConfirmDiscard={() => {
          setIsDiscardModalOpen(false)
          onBackRef.current()
        }}
      />
    </>
  )
}
