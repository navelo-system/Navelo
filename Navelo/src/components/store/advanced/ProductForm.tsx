"use client"

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Grid } from "@/components/store/base/Grid"
import { Font } from "@/components/store/base/Font"
import { Icon } from "@/components/store/base/Icon"
import { Input } from "@/components/store/base/Input"
import { Button } from "@/components/store/base/Button"
import { Switch } from "@/components/store/base/Switch"
import { CustomSelect, CustomSelectItem } from "@/components/store/base/CustomSelect"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/store/base/Tabs"
import { useCategories, useUnits, usePrintPoints, Unit, Category, PrintPoint } from "@/lib/dal"
import { useTenant } from "@/lib/context/TenantContext"
import {
  Package, FileSpreadsheet, Globe, Layers, Barcode, Printer, FileText,
  ChevronDown, ChevronUp, Plus, Trash2,
} from "lucide-react"
import { UI_STRINGS } from "@/constants/strings"

export interface ProductFormData {
  name: string
  category: string
  unitPrice: number
  stock: number
  unit: string
  ncm?: string
  cest?: string
  cfop?: string
  icmsOrigem?: string
  detailedDescription?: string
  subgroup?: string
  minStock?: number
  costPrice?: number
  otherCosts?: number
  margin?: number
  multissaborEnabled?: boolean
  multissaborLimit?: number
  multissaborPricingMode?: "proporcional" | "maior"
  complementosEnabled?: boolean
  plataformasEnabled?: boolean
  plataformasPriceDifferent?: number
  barcodes?: string[]
  printPoint?: string
  producaoPropria?: boolean
  ingredients?: string
  preparationMode?: string
  image?: string
  exTipi?: string
  icmsDefault?: boolean
  icmsCsosn?: string
  icmsReduction?: number
  icmsAliquot?: number
  pisCofinsDefault?: boolean
  pisCofinsCst?: string
}

export interface ProductFormProps {
  initialData?: ProductFormData | null
  onCancel: () => void
  onSave: (data: ProductFormData) => Promise<void> | void
  onAccessFiscalConfig?: () => void
  onDirtyChange?: (isDirty: boolean) => void
  onSubmitRef?: React.MutableRefObject<(() => void) | null>
}

const parseBrFloat = (val: string | number | undefined | null): number => {
  if (val === undefined || val === null || val === "") return 0
  if (typeof val === "number") return val
  const clean = val.toString().replace(/\./g, "").replace(",", ".")
  const parsed = parseFloat(clean)
  return isNaN(parsed) ? 0 : parsed
}

const formatBrDecimal = (num: number): string => {
  if (isNaN(num) || num === 0) return ""
  return num.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const maskCurrencyInput = (val: string): string => {
  const clean = val.replace(/[^\d,. ]/g, "").replace(/\./g, ",")
  const parts = clean.split(",")
  if (parts.length > 2) return parts[0] + "," + parts.slice(1).join("")
  if (parts[1] && parts[1].length > 2) return parts[0] + "," + parts[1].slice(0, 2)
  return clean
}

const maskNumberInput = (val: string): string => val.replace(/\D/g, "")

function resolveBasicPricing(d: ProductFormData) {
  return {
    price: d.unitPrice !== undefined && d.unitPrice !== null ? formatBrDecimal(d.unitPrice) : "",
    costPrice: d.costPrice ? formatBrDecimal(d.costPrice) : "",
    otherCosts: d.otherCosts ? formatBrDecimal(d.otherCosts) : "",
    profitMargin: d.margin ? formatBrDecimal(d.margin) : "",
  }
}

function resolveBasicTaxFields(d: ProductFormData) {
  return {
    ncm: d.ncm || "",
    cest: d.cest || "",
    cfop: d.cfop || "5.102",
    icmsOrigem: d.icmsOrigem || "0 - Nacional",
  }
}

function resolveBasicFields(d: ProductFormData) {
  return {
    name: d.name,
    category: d.category,
    stock: d.stock > 0 ? String(d.stock) : "",
    unit: d.unit,
    detailedDescription: d.detailedDescription || "",
    subgroup: d.subgroup || "",
    minStock: d.minStock && d.minStock > 0 ? String(d.minStock) : "",
    image: d.image || null,
    ...resolveBasicPricing(d),
    ...resolveBasicTaxFields(d),
  }
}

function resolveFiscalFields(d: ProductFormData) {
  return {
    exTipi: d.exTipi || "",
    icmsDefault: d.icmsDefault !== false,
    icmsCsosn: d.icmsCsosn || "500",
    icmsReduction: d.icmsReduction ? formatBrDecimal(d.icmsReduction) : "",
    icmsAliquot: d.icmsAliquot ? formatBrDecimal(d.icmsAliquot) : "",
    pisCofinsDefault: d.pisCofinsDefault !== false,
    pisCofinsCst: d.pisCofinsCst || "99",
  }
}

function resolveExtraFields(d: ProductFormData) {
  return {
    multissaborEnabled: !!d.multissaborEnabled,
    multissaborLimit: d.multissaborLimit ? String(d.multissaborLimit) : "2",
    multissaborPricingMode: d.multissaborPricingMode || "proporcional",
    complementosEnabled: !!d.complementosEnabled,
    plataformasEnabled: !!d.plataformasEnabled,
    plataformasPriceDifferent: d.plataformasPriceDifferent ? formatBrDecimal(d.plataformasPriceDifferent) : "",
    barcodes: d.barcodes || [],
    printPoint: d.printPoint || "",
    producaoPropria: !!d.producaoPropria,
    ingredients: d.ingredients || "",
    preparationMode: d.preparationMode || "",
  }
}

function resolveProductFormData(initialData?: ProductFormData | null) {
  const defaults: ProductFormData = {
    name: "", category: "", unitPrice: 0, stock: 0, unit: "UN",
    cfop: "5.102", icmsOrigem: "0 - Nacional", icmsCsosn: "500", pisCofinsCst: "99",
    multissaborLimit: 2, multissaborPricingMode: "proporcional",
  }
  const merged = initialData ? { ...defaults, ...initialData } : defaults
  return { ...resolveBasicFields(merged), ...resolveFiscalFields(merged), ...resolveExtraFields(merged) }
}

// ---------------- SUBCOMPONENTES DA ABA BÁSICA ----------------

function ProductImageUploader({
  image, onImageChange,
}: {
  image: string | null; onImageChange: (img: string | null) => void
}) {
  const pf = UI_STRINGS.products.form
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => onImageChange(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  return (
    <>
      <Box as="input" type="file" ref={fileInputRef} accept="image/*" onChange={handleFileChange} display="hidden" />
      <Stack align="center" gap={2.5} w="full">
        <Box
          w="w-24" h="h-24" radius="full" border borderColor="border-brand-secondary" bg="bg-slate-100"
          overflow="hidden" cursor="pointer" onClick={() => fileInputRef.current?.click()} title={pf.imageUploadTitle}
        >
          {image ? (
            <Box as="img" src={image} alt={pf.photoAlt} w="full" h="full" objectFit="cover" />
          ) : (
            <Stack align="center" justify="center" w="full" h="full">
              <Icon icon={Package} size={32} color="secondary" />
            </Stack>
          )}
        </Box>
        <Button variant="ghost" label={image ? pf.changeImage : pf.addImage} type="button" onClick={() => fileInputRef.current?.click()} />
      </Stack>
    </>
  )
}

function ProductBasicFields({
  name, setName, unit, setUnit, category, setCategory, subgroup, setSubgroup,
  detailedDescription, setDetailedDescription, dbUnits, dbCategories,
}: {
  name: string; setName: (v: string) => void
  unit: string; setUnit: (v: string) => void
  category: string; setCategory: (v: string) => void
  subgroup: string; setSubgroup: (v: string) => void
  detailedDescription: string; setDetailedDescription: (v: string) => void
  dbUnits?: Unit[]
  dbCategories?: Category[]
}) {
  const pf = UI_STRINGS.products.form
  const subgroupItems = React.useMemo(() => {
    const selectedCat = dbCategories?.find((c) => c.name === category)
    return selectedCat?.subgroups || []
  }, [dbCategories, category])

  return (
    <Stack gap={5} w="full">
      <Grid cols={2} gap={5}>
        <Input label={pf.nameLabel} placeholder={pf.namePlaceholder} value={name} onChange={(e) => setName(e.target.value)} required />
        <Stack gap={1}>
          <Font variant="body-sm-semibold" text={pf.unitLabel} />
          <CustomSelect value={unit} onChange={setUnit}>
            {(dbUnits || []).map((u) => <CustomSelectItem key={u.id} value={u.name} text={u.name} icon={Package} />)}
          </CustomSelect>
        </Stack>
        <Stack gap={1}>
          <Font variant="body-sm-semibold" text={pf.groupLabel} />
          <CustomSelect value={category} onChange={(val) => { setCategory(val); setSubgroup("") }}>
            {(dbCategories || []).map((c) => <CustomSelectItem key={c.id} value={c.name} text={c.name} icon={Layers} />)}
          </CustomSelect>
        </Stack>
        <Stack gap={1}>
          <Font variant="body-sm-semibold" text={pf.subgroupLabel} />
          <CustomSelect value={subgroup} onChange={setSubgroup} disabled={subgroupItems.length === 0} placeholder={pf.noSubgroupsRegistered}>
            {subgroupItems.map((sg) => <CustomSelectItem key={sg} value={sg} text={sg} icon={Layers} />)}
          </CustomSelect>
        </Stack>
      </Grid>
      <Input label={pf.detailedDescriptionLabel} placeholder={pf.detailedDescriptionPlaceholder} value={detailedDescription} onChange={(e) => setDetailedDescription(e.target.value)} />
    </Stack>
  )
}

function ProductValuesStockSection({
  stock, setStock, minStock, setMinStock, costPrice, otherCosts, profitMargin, price,
  onCostPriceChange, onOtherCostsChange, onMarginChange, onPriceChange,
}: {
  stock: string; setStock: (v: string) => void
  minStock: string; setMinStock: (v: string) => void
  costPrice: string; otherCosts: string; profitMargin: string; price: string
  onCostPriceChange: (v: string) => void; onOtherCostsChange: (v: string) => void
  onMarginChange: (v: string) => void; onPriceChange: (v: string) => void
}) {
  const pf = UI_STRINGS.products.form
  return (
    <Box padding={5} bg="bg-surface" radius="default" border borderColor="border-border">
      <Stack gap={5} w="full">
        <Font variant="body-bold" text={pf.valuesAndStockTitle} />
        <Grid cols={2} gap={5}>
          <Input label={pf.stockLabel} placeholder={pf.zeroPlaceholder} value={stock} onChange={(e) => setStock(maskNumberInput(e.target.value))} />
          <Input label={pf.minStockLabel} placeholder={pf.zeroPlaceholder} value={minStock} onChange={(e) => setMinStock(maskNumberInput(e.target.value))} />
          <Input label={pf.costPriceLabel} placeholder={pf.zeroDecimalPlaceholder} value={costPrice} onChange={(e) => onCostPriceChange(e.target.value)} />
          <Input label={pf.otherCostsLabel} placeholder={pf.zeroDecimalPlaceholder} value={otherCosts} onChange={(e) => onOtherCostsChange(e.target.value)} />
          <Input label={pf.marginLabel} placeholder={pf.zeroDecimalPlaceholder} value={profitMargin} onChange={(e) => onMarginChange(e.target.value)} />
          <Input label={pf.salePriceLabel} placeholder={pf.zeroDecimalPlaceholder} value={price} onChange={(e) => onPriceChange(e.target.value)} />
        </Grid>
      </Stack>
    </Box>
  )
}

// ---------------- SUBCOMPONENTES DA ABA AVANÇADA ----------------

function MultissaborAccordion({
  isOpen, onToggle, enabled, setEnabled, limit, setLimit, mode, setMode,
}: {
  isOpen: boolean; onToggle: () => void; enabled: boolean; setEnabled: (v: boolean) => void
  limit: string; setLimit: (v: string) => void; mode: "proporcional" | "maior"; setMode: (v: "proporcional" | "maior") => void
}) {
  const pf = UI_STRINGS.products.form
  return (
    <Box border borderColor="border-border" radius="default" overflow="hidden" bg="bg-surface">
      <Box padding={5} cursor="pointer" hoverBg="surface-sunken" onClick={onToggle}>
        <Stack direction="row" align="center" justify="between" w="full">
          <Stack direction="row" align="center" gap={2.5}>
            <Icon icon={Package} size={20} color="primary" />
            <Font variant="body-bold" text={pf.multissaborTitle} />
          </Stack>
          <Icon icon={isOpen ? ChevronUp : ChevronDown} size={20} color="muted" />
        </Stack>
      </Box>
      {isOpen && (
        <Box padding={5} borderTop borderColor="border-border" bg="bg-white">
          <Stack gap={5} w="full">
            <Stack direction="row" align="center" justify="between" w="full">
              <Font variant="body" text={pf.enableMultissaborTitle} />
              <Switch checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />
            </Stack>
            {enabled && (
              <Grid cols={2} gap={5}>
                <Input label={pf.multissaborLimitLabel} placeholder={pf.zeroPlaceholder} type="number" value={limit} onChange={(e) => setLimit(e.target.value)} />
                <Stack gap={1}>
                  <Font variant="body-sm-semibold" text={pf.pricingModeLabel} />
                  <CustomSelect value={mode} onChange={(val) => setMode(val as "proporcional" | "maior")}>
                    <CustomSelectItem value="proporcional" text={pf.proportionalAverageOption} icon={Package} />
                    <CustomSelectItem value="maior" text={pf.highestPriceOption} icon={Package} />
                  </CustomSelect>
                </Stack>
              </Grid>
            )}
          </Stack>
        </Box>
      )}
    </Box>
  )
}

function ComplementosAccordion({
  isOpen, onToggle, enabled, setEnabled,
}: {
  isOpen: boolean; onToggle: () => void; enabled: boolean; setEnabled: (v: boolean) => void
}) {
  const pf = UI_STRINGS.products.form
  return (
    <Box border borderColor="border-border" radius="default" overflow="hidden" bg="bg-surface">
      <Box padding={5} cursor="pointer" hoverBg="surface-sunken" onClick={onToggle}>
        <Stack direction="row" align="center" justify="between" w="full">
          <Stack direction="row" align="center" gap={2.5}>
            <Icon icon={Layers} size={20} color="primary" />
            <Font variant="body-bold" text={pf.subgroupComplementsTitle} />
          </Stack>
          <Icon icon={isOpen ? ChevronUp : ChevronDown} size={20} color="muted" />
        </Stack>
      </Box>
      {isOpen && (
        <Box padding={5} borderTop borderColor="border-border" bg="bg-white">
          <Stack gap={5} w="full">
            <Stack direction="row" align="center" justify="between" w="full">
              <Font variant="body" text={pf.linkComplementsTitle} />
              <Switch checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />
            </Stack>
            {enabled && (
              <Box padding={5} bg="bg-surface" radius="default" border borderColor="border-border">
                <Font variant="description" color="muted" text={pf.linkComplementsDesc} />
              </Box>
            )}
          </Stack>
        </Box>
      )}
    </Box>
  )
}

function PlataformasAccordion({
  isOpen, onToggle, enabled, setEnabled, price, setPrice,
}: {
  isOpen: boolean; onToggle: () => void; enabled: boolean; setEnabled: (v: boolean) => void
  price: string; setPrice: (v: string) => void
}) {
  const pf = UI_STRINGS.products.form
  return (
    <Box border borderColor="border-border" radius="default" overflow="hidden" bg="bg-surface">
      <Box padding={5} cursor="pointer" hoverBg="surface-sunken" onClick={onToggle}>
        <Stack direction="row" align="center" justify="between" w="full">
          <Stack direction="row" align="center" gap={2.5}>
            <Icon icon={Globe} size={20} color="primary" />
            <Font variant="body-bold" text={pf.salesPlatformsTitle} />
          </Stack>
          <Icon icon={isOpen ? ChevronUp : ChevronDown} size={20} color="muted" />
        </Stack>
      </Box>
      {isOpen && (
        <Box padding={5} borderTop borderColor="border-border" bg="bg-white">
          <Stack gap={5} w="full">
            <Stack direction="row" align="center" justify="between" w="full">
              <Font variant="body" text={pf.showInOnlineCatalogTitle} />
              <Switch checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />
            </Stack>
            {enabled && (
              <Input label={pf.catalogPriceLabel} placeholder={pf.zeroDecimalPlaceholder} value={price} onChange={(e) => setPrice(maskCurrencyInput(e.target.value))} />
            )}
          </Stack>
        </Box>
      )}
    </Box>
  )
}

function BarcodesAccordion({
  isOpen, onToggle, barcodes, newBarcode, setNewBarcode, onAddBarcode, onRemoveBarcode,
}: {
  isOpen: boolean; onToggle: () => void; barcodes: string[]; newBarcode: string
  setNewBarcode: (v: string) => void; onAddBarcode: () => void; onRemoveBarcode: (idx: number) => void
}) {
  const pf = UI_STRINGS.products.form
  return (
    <Box border borderColor="border-border" radius="default" overflow="hidden" bg="bg-surface">
      <Box padding={5} cursor="pointer" hoverBg="surface-sunken" onClick={onToggle}>
        <Stack direction="row" align="center" justify="between" w="full">
          <Stack direction="row" align="center" gap={2.5}>
            <Icon icon={Barcode} size={20} color="primary" />
            <Font variant="body-bold" text={pf.barcodesTitle} />
          </Stack>
          <Icon icon={isOpen ? ChevronUp : ChevronDown} size={20} color="muted" />
        </Stack>
      </Box>
      {isOpen && (
        <Box padding={5} borderTop borderColor="border-border" bg="bg-white">
          <Stack gap={5} w="full">
            <Stack direction="row" gap={2.5} align="end">
              <Box flex="1">
                <Input label={pf.addBarcodeLabel} placeholder={pf.barcodePlaceholder} value={newBarcode} onChange={(e) => setNewBarcode(e.target.value)} />
              </Box>
              <Button variant="primary-icon" icon={Plus} onClick={onAddBarcode} type="button" />
            </Stack>
            {barcodes.length > 0 && (
              <Stack gap={2.5} w="full">
                {barcodes.map((bc, idx) => (
                  <Box key={idx} padding={2.5} bg="bg-surface" radius="default" border borderColor="border-border">
                    <Stack direction="row" justify="between" align="center" w="full">
                      <Font variant="body" text={bc} />
                      <Button variant="danger-icon-xs" icon={Trash2} onClick={() => onRemoveBarcode(idx)} type="button" />
                    </Stack>
                  </Box>
                ))}
              </Stack>
            )}
          </Stack>
        </Box>
      )}
    </Box>
  )
}

function PrintAndProductionAccordions({
  isPrintOpen, onTogglePrint, printPoint, setPrintPoint, dbPrintPoints,
  isProdOpen, onToggleProd, producaoPropria, setProducaoPropria, ingredients, setIngredients, prepMode, setPrepMode,
}: {
  isPrintOpen: boolean; onTogglePrint: () => void; printPoint: string; setPrintPoint: (v: string) => void
  dbPrintPoints?: PrintPoint[]; isProdOpen: boolean; onToggleProd: () => void; producaoPropria: boolean
  setProducaoPropria: (v: boolean) => void; ingredients: string; setIngredients: (v: string) => void
  prepMode: string; setPrepMode: (v: string) => void
}) {
  const pf = UI_STRINGS.products.form
  return (
    <>
      <Box border borderColor="border-border" radius="default" overflow="hidden" bg="bg-surface">
        <Box padding={5} cursor="pointer" hoverBg="surface-sunken" onClick={onTogglePrint}>
          <Stack direction="row" align="center" justify="between" w="full">
            <Stack direction="row" align="center" gap={2.5}>
              <Icon icon={Printer} size={20} color="primary" />
              <Font variant="body-bold" text={pf.printPointTitle} />
            </Stack>
            <Icon icon={isPrintOpen ? ChevronUp : ChevronDown} size={20} color="muted" />
          </Stack>
        </Box>
        {isPrintOpen && (
          <Box padding={5} borderTop borderColor="border-border" bg="bg-white">
            <Stack gap={1} w="full">
              <Font variant="body-sm-semibold" text={pf.printDestinationLabel} />
              <CustomSelect value={printPoint} onChange={setPrintPoint} placeholder={pf.noPrintOption}>
                {(dbPrintPoints || []).map((pp) => <CustomSelectItem key={pp.id} value={pp.name} text={pp.name} icon={Printer} />)}
              </CustomSelect>
            </Stack>
          </Box>
        )}
      </Box>

      <Box border borderColor="border-border" radius="default" overflow="hidden" bg="bg-surface">
        <Box padding={5} cursor="pointer" hoverBg="surface-sunken" onClick={onToggleProd}>
          <Stack direction="row" align="center" justify="between" w="full">
            <Stack direction="row" align="center" gap={2.5}>
              <Icon icon={FileText} size={20} color="primary" />
              <Font variant="body-bold" text={pf.productionTitle} />
            </Stack>
            <Icon icon={isProdOpen ? ChevronUp : ChevronDown} size={20} color="muted" />
          </Stack>
        </Box>
        {isProdOpen && (
          <Box padding={5} borderTop borderColor="border-border" bg="bg-white">
            <Stack gap={5} w="full">
              <Stack direction="row" align="center" justify="between" w="full">
                <Font variant="body" text={pf.inHouseProductionTitle} />
                <Switch checked={producaoPropria} onChange={(e) => setProducaoPropria(e.target.checked)} />
              </Stack>
              {producaoPropria && (
                <Grid cols={2} gap={5}>
                  <Input label={pf.ingredientsLabel} placeholder={pf.ingredientsPlaceholder} value={ingredients} onChange={(e) => setIngredients(e.target.value)} />
                  <Input label={pf.preparationModeLabel} placeholder={pf.preparationModePlaceholder} value={prepMode} onChange={(e) => setPrepMode(e.target.value)} />
                </Grid>
              )}
            </Stack>
          </Box>
        )}
      </Box>
    </>
  )
}

function ProductFiscalAccordion(p: {
  isOpen: boolean; onToggle: () => void; ncm: string; setNcm: (v: string) => void
  exTipi: string; setExTipi: (v: string) => void; cest: string; setCest: (v: string) => void
  icmsOrigem: string; setIcmsOrigem: (v: string) => void; icmsDefault: boolean; setIcmsDefault: (v: boolean) => void
  icmsCsosn: string; setIcmsCsosn: (v: string) => void; icmsReduction: string; setIcmsReduction: (v: string) => void
  icmsAliquot: string; setIcmsAliquot: (v: string) => void; pisCofinsDefault: boolean; setPisCofinsDefault: (v: boolean) => void
  pisCofinsCst: string; setPisCofinsCst: (v: string) => void; onAccessFiscalConfig?: () => void
}) {
  const pf = UI_STRINGS.products.form
  return (
    <Box border borderColor="border-border" radius="default" overflow="hidden" bg="bg-surface">
      <Box padding={5} cursor="pointer" hoverBg="surface-sunken" onClick={p.onToggle}>
        <Stack direction="row" align="center" justify="between" w="full">
          <Stack direction="row" align="center" gap={2.5}>
            <Icon icon={FileSpreadsheet} size={20} color="primary" />
            <Font variant="body-bold" text={pf.fiscalTitle} />
          </Stack>
          <Icon icon={p.isOpen ? ChevronUp : ChevronDown} size={20} color="muted" />
        </Stack>
      </Box>
      {p.isOpen && (
        <Box padding={5} borderTop borderColor="border-border" bg="bg-white">
          <Stack gap={5} w="full">
            <Grid cols={3} gap={5}>
              <Input label={pf.ncmLabel} placeholder={pf.ncmPlaceholder} value={p.ncm} onChange={(e) => p.setNcm(e.target.value)} />
              <Input label={pf.exTipiLabel} placeholder={pf.exTipiPlaceholder} value={p.exTipi} onChange={(e) => p.setExTipi(e.target.value)} />
              <Input label={pf.cestLabel} placeholder={pf.cestPlaceholder} value={p.cest} onChange={(e) => p.setCest(e.target.value)} />
            </Grid>
            <Stack gap={1}>
              <Font variant="body-sm-semibold" text={pf.originLabel} />
              <CustomSelect value={p.icmsOrigem} onChange={p.setIcmsOrigem}>
                <CustomSelectItem value="0 - Nacional" text={pf.originNational} icon={Package} />
                <CustomSelectItem value="1 - Estrangeira - Importação direta" text={pf.originImported} icon={Package} />
                <CustomSelectItem value="2 - Estrangeira - Adquirida no mercado interno" text={pf.originImportedFull} icon={Package} />
              </CustomSelect>
            </Stack>
            <Box h="h-[1px]" w="full" bg="bg-border" />
            <Stack gap={2.5} w="full">
              <Stack direction="row" align="center" justify="between" w="full">
                <Font variant="body-bold" text={pf.useDefaultIcmsTitle} />
                <Stack direction="row" align="center" gap={2.5}>
                  <Font variant="auxiliary" color="muted" text={pf.useDefaultIcmsTitle} />
                  <Switch checked={p.icmsDefault} onChange={(e) => p.setIcmsDefault(e.target.checked)} />
                </Stack>
              </Stack>
              {!p.icmsDefault && (
                <Grid cols={3} gap={5}>
                  <Input label={pf.csosnIcmsLabel} placeholder={pf.zeroPlaceholder} value={p.icmsCsosn} onChange={(e) => p.setIcmsCsosn(e.target.value)} />
                  <Input label={pf.reductionBaseShortLabel} placeholder={pf.zeroDecimalPlaceholder} value={p.icmsReduction} onChange={(e) => p.setIcmsReduction(maskCurrencyInput(e.target.value))} />
                  <Input label={pf.aliquotEffectiveLabel} placeholder={pf.zeroDecimalPlaceholder} value={p.icmsAliquot} onChange={(e) => p.setIcmsAliquot(maskCurrencyInput(e.target.value))} />
                </Grid>
              )}
            </Stack>
            <Box h="h-[1px]" w="full" bg="bg-border" />
            <Stack gap={2.5} w="full">
              <Stack direction="row" align="center" justify="between" w="full">
                <Font variant="body-bold" text={pf.useDefaultPisCofinsTitle} />
                <Stack direction="row" align="center" gap={2.5}>
                  <Font variant="auxiliary" color="muted" text={pf.useDefaultPisCofinsTitle} />
                  <Switch checked={p.pisCofinsDefault} onChange={(e) => p.setPisCofinsDefault(e.target.checked)} />
                </Stack>
              </Stack>
              {!p.pisCofinsDefault && (
                <Input label={pf.cstPisCofinsLabel} placeholder={pf.zeroPlaceholder} value={p.pisCofinsCst} onChange={(e) => p.setPisCofinsCst(e.target.value)} />
              )}
            </Stack>
            {p.onAccessFiscalConfig && (
              <Box paddingY={2.5}>
                <Button variant="ghost-secondary" label={pf.accessFiscalConfigButton} onClick={p.onAccessFiscalConfig} type="button" />
              </Box>
            )}
          </Stack>
        </Box>
      )}
    </Box>
  )
}

function isObjectModified<T extends Record<string, unknown>>(current: T, initial: T, keys: (keyof T)[]): boolean {
  for (const k of keys) {
    if (current[k] !== initial[k]) return true
  }
  return false
}

function useProductFormState(initialData?: ProductFormData | null) {
  const init = resolveProductFormData(initialData)
  const [name, setName] = React.useState(init.name)
  const [category, setCategory] = React.useState(init.category)
  const [price, setPrice] = React.useState(init.price)
  const [stock, setStock] = React.useState(init.stock)
  const [unit, setUnit] = React.useState(init.unit)
  const [ncm, setNcm] = React.useState(init.ncm)
  const [cest, setCest] = React.useState(init.cest)
  const [cfop, setCfop] = React.useState(init.cfop)
  const [icmsOrigem, setIcmsOrigem] = React.useState(init.icmsOrigem)
  const [detailedDescription, setDetailedDescription] = React.useState(init.detailedDescription)
  const [subgroup, setSubgroup] = React.useState(init.subgroup)
  const [minStock, setMinStock] = React.useState(init.minStock)
  const [costPrice, setCostPrice] = React.useState(init.costPrice)
  const [otherCosts, setOtherCosts] = React.useState(init.otherCosts)
  const [profitMargin, setProfitMargin] = React.useState(init.profitMargin)
  const [image, setImage] = React.useState<string | null>(init.image)
  const [multissaborEnabled, setMultissaborEnabled] = React.useState(init.multissaborEnabled)
  const [multissaborLimit, setMultissaborLimit] = React.useState(init.multissaborLimit)
  const [multissaborPricingMode, setMultissaborPricingMode] = React.useState(init.multissaborPricingMode)
  const [complementosEnabled, setComplementosEnabled] = React.useState(init.complementosEnabled)
  const [plataformasEnabled, setPlataformasEnabled] = React.useState(init.plataformasEnabled)
  const [plataformasPriceDifferent, setPlataformasPriceDifferent] = React.useState(init.plataformasPriceDifferent)
  const [barcodes, setBarcodes] = React.useState<string[]>(init.barcodes)
  const [newBarcode, setNewBarcode] = React.useState("")
  const [printPoint, setPrintPoint] = React.useState(init.printPoint)
  const [producaoPropria, setProducaoPropria] = React.useState(init.producaoPropria)
  const [ingredients, setIngredients] = React.useState(init.ingredients)
  const [preparationMode, setPreparationMode] = React.useState(init.preparationMode)
  const [exTipi, setExTipi] = React.useState(init.exTipi)
  const [icmsDefault, setIcmsDefault] = React.useState(init.icmsDefault)
  const [icmsCsosn, setIcmsCsosn] = React.useState(init.icmsCsosn)
  const [icmsReduction, setIcmsReduction] = React.useState(init.icmsReduction)
  const [icmsAliquot, setIcmsAliquot] = React.useState(init.icmsAliquot)
  const [pisCofinsDefault, setPisCofinsDefault] = React.useState(init.pisCofinsDefault)
  const [pisCofinsCst, setPisCofinsCst] = React.useState(init.pisCofinsCst)

  const currentSnapshot = {
    name, category, price, stock, unit, ncm, cest, cfop, icmsOrigem,
    detailedDescription, subgroup, minStock, costPrice, otherCosts, profitMargin,
    image, multissaborEnabled, multissaborLimit, multissaborPricingMode,
    complementosEnabled, plataformasEnabled, plataformasPriceDifferent,
    printPoint, producaoPropria, ingredients, preparationMode,
    exTipi, icmsDefault, icmsCsosn, icmsReduction, icmsAliquot,
    pisCofinsDefault, pisCofinsCst,
  }
  const keys = Object.keys(currentSnapshot) as (keyof typeof currentSnapshot)[]
  const isDirty = isObjectModified(currentSnapshot, init, keys) || barcodes.length !== init.barcodes.length

  return {
    name, setName, category, setCategory, price, setPrice, stock, setStock, unit, setUnit,
    ncm, setNcm, cest, setCest, cfop, setCfop, icmsOrigem, setIcmsOrigem,
    detailedDescription, setDetailedDescription, subgroup, setSubgroup, minStock, setMinStock,
    costPrice, setCostPrice, otherCosts, setOtherCosts, profitMargin, setProfitMargin,
    image, setImage, multissaborEnabled, setMultissaborEnabled, multissaborLimit, setMultissaborLimit,
    multissaborPricingMode, setMultissaborPricingMode, complementosEnabled, setComplementosEnabled,
    plataformasEnabled, setPlataformasEnabled, plataformasPriceDifferent, setPlataformasPriceDifferent,
    barcodes, setBarcodes, newBarcode, setNewBarcode, printPoint, setPrintPoint,
    producaoPropria, setProducaoPropria, ingredients, setIngredients, preparationMode, setPreparationMode,
    exTipi, setExTipi, icmsDefault, setIcmsDefault, icmsCsosn, setIcmsCsosn,
    icmsReduction, setIcmsReduction, icmsAliquot, setIcmsAliquot, pisCofinsDefault, setPisCofinsDefault,
    pisCofinsCst, setPisCofinsCst, isDirty,
  }
}

function ProductAdvancedTabContent({
  s, dbPrintPoints, onAccessFiscalConfig,
}: {
  s: ReturnType<typeof useProductFormState>
  dbPrintPoints?: PrintPoint[]
  onAccessFiscalConfig?: () => void
}) {
  const [isMultissaborOpen, setIsMultissaborOpen] = React.useState(false)
  const [isComplementosOpen, setIsComplementosOpen] = React.useState(false)
  const [isPlataformasOpen, setIsPlataformasOpen] = React.useState(false)
  const [isBarcodesOpen, setIsBarcodesOpen] = React.useState(false)
  const [isPrintPointOpen, setIsPrintPointOpen] = React.useState(false)
  const [isProducaoOpen, setIsProducaoOpen] = React.useState(false)
  const [isFiscalOpen, setIsFiscalOpen] = React.useState(false)

  return (
    <Stack gap={2.5} w="full">
      <MultissaborAccordion
        isOpen={isMultissaborOpen} onToggle={() => setIsMultissaborOpen(!isMultissaborOpen)}
        enabled={s.multissaborEnabled} setEnabled={s.setMultissaborEnabled}
        limit={s.multissaborLimit} setLimit={s.setMultissaborLimit}
        mode={s.multissaborPricingMode} setMode={s.setMultissaborPricingMode}
      />
      <ComplementosAccordion isOpen={isComplementosOpen} onToggle={() => setIsComplementosOpen(!isComplementosOpen)} enabled={s.complementosEnabled} setEnabled={s.setComplementosEnabled} />
      <PlataformasAccordion isOpen={isPlataformasOpen} onToggle={() => setIsPlataformasOpen(!isPlataformasOpen)} enabled={s.plataformasEnabled} setEnabled={s.setPlataformasEnabled} price={s.plataformasPriceDifferent} setPrice={s.setPlataformasPriceDifferent} />
      <BarcodesAccordion
        isOpen={isBarcodesOpen} onToggle={() => setIsBarcodesOpen(!isBarcodesOpen)}
        barcodes={s.barcodes} newBarcode={s.newBarcode} setNewBarcode={s.setNewBarcode}
        onAddBarcode={() => {
          if (s.newBarcode.trim()) {
            s.setBarcodes((prev) => [...prev, s.newBarcode.trim()])
            s.setNewBarcode("")
          }
        }}
        onRemoveBarcode={(idx) => s.setBarcodes((prev) => prev.filter((_, i) => i !== idx))}
      />
      <PrintAndProductionAccordions
        isPrintOpen={isPrintPointOpen} onTogglePrint={() => setIsPrintPointOpen(!isPrintPointOpen)}
        printPoint={s.printPoint} setPrintPoint={s.setPrintPoint} dbPrintPoints={dbPrintPoints}
        isProdOpen={isProducaoOpen} onToggleProd={() => setIsProducaoOpen(!isProducaoOpen)}
        producaoPropria={s.producaoPropria} setProducaoPropria={s.setProducaoPropria}
        ingredients={s.ingredients} setIngredients={s.setIngredients}
        prepMode={s.preparationMode} setPrepMode={s.setPreparationMode}
      />
      <ProductFiscalAccordion
        isOpen={isFiscalOpen} onToggle={() => setIsFiscalOpen(!isFiscalOpen)}
        ncm={s.ncm} setNcm={s.setNcm} exTipi={s.exTipi} setExTipi={s.setExTipi} cest={s.cest} setCest={s.setCest}
        icmsOrigem={s.icmsOrigem} setIcmsOrigem={s.setIcmsOrigem}
        icmsDefault={s.icmsDefault} setIcmsDefault={s.setIcmsDefault}
        icmsCsosn={s.icmsCsosn} setIcmsCsosn={s.setIcmsCsosn}
        icmsReduction={s.icmsReduction} setIcmsReduction={s.setIcmsReduction}
        icmsAliquot={s.icmsAliquot} setIcmsAliquot={s.setIcmsAliquot}
        pisCofinsDefault={s.pisCofinsDefault} setPisCofinsDefault={s.setPisCofinsDefault}
        pisCofinsCst={s.pisCofinsCst} setPisCofinsCst={s.setPisCofinsCst}
        onAccessFiscalConfig={onAccessFiscalConfig}
      />
    </Stack>
  )
}

function ProductBasicTabContent({
  s, dbUnits, dbCategories,
}: {
  s: ReturnType<typeof useProductFormState>
  dbUnits?: Unit[]
  dbCategories?: Category[]
}) {
  const handleCostPriceChange = (val: string) => {
    const formatted = maskCurrencyInput(val)
    s.setCostPrice(formatted)
    const costNum = parseBrFloat(formatted)
    const otherNum = parseBrFloat(s.otherCosts)
    const marginNum = parseBrFloat(s.profitMargin)
    const totalCost = costNum > 0 ? costNum * (1 + otherNum / 100) : 0
    if (totalCost > 0 && marginNum > 0) s.setPrice(formatBrDecimal(totalCost * (1 + marginNum / 100)))
  }

  const handlePriceChange = (val: string) => {
    const formatted = maskCurrencyInput(val)
    s.setPrice(formatted)
    const costNum = parseBrFloat(s.costPrice)
    const otherNum = parseBrFloat(s.otherCosts)
    const priceNum = parseBrFloat(formatted)
    const totalCost = costNum > 0 ? costNum * (1 + otherNum / 100) : 0
    if (totalCost > 0 && priceNum > 0) s.setProfitMargin(formatBrDecimal(((priceNum / totalCost) - 1) * 100))
  }

  return (
    <Stack gap={5} w="full">
      <Box padding={5} bg="bg-surface" radius="default" border borderColor="border-border">
        <Stack gap={5} w="full">
          <ProductImageUploader image={s.image} onImageChange={s.setImage} />
          <ProductBasicFields
            name={s.name} setName={s.setName} unit={s.unit} setUnit={s.setUnit}
            category={s.category} setCategory={s.setCategory} subgroup={s.subgroup} setSubgroup={s.setSubgroup}
            detailedDescription={s.detailedDescription} setDetailedDescription={s.setDetailedDescription}
            dbUnits={dbUnits} dbCategories={dbCategories}
          />
        </Stack>
      </Box>
      <ProductValuesStockSection
        stock={s.stock} setStock={s.setStock} minStock={s.minStock} setMinStock={s.setMinStock}
        costPrice={s.costPrice} otherCosts={s.otherCosts} profitMargin={s.profitMargin} price={s.price}
        onCostPriceChange={handleCostPriceChange}
        onOtherCostsChange={(v) => s.setOtherCosts(maskCurrencyInput(v))}
        onMarginChange={(v) => s.setProfitMargin(maskCurrencyInput(v))}
        onPriceChange={handlePriceChange}
      />
    </Stack>
  )
}

export function ProductForm({ initialData, onSave, onAccessFiscalConfig, onDirtyChange, onSubmitRef }: ProductFormProps) {
  const pf = UI_STRINGS.products.form
  const tenantCtx = useTenant()
  const tenantId = tenantCtx?.currentTenant?.id
  const dbCategories = useCategories(tenantId)
  const dbUnits = useUnits(tenantId)
  const dbPrintPoints = usePrintPoints(tenantId)
  const s = useProductFormState(initialData)

  React.useEffect(() => {
    onDirtyChange?.(s.isDirty)
  }, [s.isDirty, onDirtyChange])

  const submitProductForm = React.useCallback(() => {
    if (!s.name.trim()) return
    onSave({
      name: s.name.trim(), category: s.category || "", unitPrice: parseBrFloat(s.price), stock: parseBrFloat(s.stock), unit: s.unit || "UN",
      ncm: s.ncm, cest: s.cest, cfop: s.cfop, icmsOrigem: s.icmsOrigem, image: s.image || undefined,
      detailedDescription: s.detailedDescription, subgroup: s.subgroup, minStock: parseBrFloat(s.minStock),
      costPrice: parseBrFloat(s.costPrice), otherCosts: parseBrFloat(s.otherCosts), margin: parseBrFloat(s.profitMargin),
      multissaborEnabled: s.multissaborEnabled, multissaborLimit: parseInt(s.multissaborLimit) || 2,
      multissaborPricingMode: s.multissaborPricingMode, complementosEnabled: s.complementosEnabled,
      plataformasEnabled: s.plataformasEnabled, plataformasPriceDifferent: parseBrFloat(s.plataformasPriceDifferent),
      barcodes: s.barcodes, printPoint: s.printPoint, producaoPropria: s.producaoPropria, ingredients: s.ingredients,
      preparationMode: s.preparationMode, exTipi: s.exTipi, icmsDefault: s.icmsDefault, icmsCsosn: s.icmsCsosn,
      icmsReduction: parseBrFloat(s.icmsReduction), icmsAliquot: parseBrFloat(s.icmsAliquot),
      pisCofinsDefault: s.pisCofinsDefault, pisCofinsCst: s.pisCofinsCst,
    })
  }, [s, onSave])

  React.useEffect(() => {
    if (onSubmitRef) onSubmitRef.current = submitProductForm
    return () => {
      if (onSubmitRef) onSubmitRef.current = null
    }
  }, [onSubmitRef, submitProductForm])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    submitProductForm()
  }

  return (
    <Box as="form" id="product-form" onSubmit={handleSubmit} w="full">
      <Stack gap={5} w="full">
        <Tabs defaultValue="basico">
          <TabsList grid cols={2}>
            <TabsTrigger value="basico" fullWidth>{pf.basicDataTab}</TabsTrigger>
            <TabsTrigger value="avancado" fullWidth>{pf.advancedResourcesTab}</TabsTrigger>
          </TabsList>
          <TabsContent value="basico">
            <ProductBasicTabContent s={s} dbUnits={dbUnits} dbCategories={dbCategories} />
          </TabsContent>
          <TabsContent value="avancado">
            <ProductAdvancedTabContent s={s} dbPrintPoints={dbPrintPoints} onAccessFiscalConfig={onAccessFiscalConfig} />
          </TabsContent>
        </Tabs>
      </Stack>
    </Box>
  )
}
