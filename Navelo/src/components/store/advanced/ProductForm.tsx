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
import { useCategories, useUnits, usePrintPoints } from "@/lib/dal"
import { useTenant } from "@/lib/context/TenantContext"
import {
  Package,
  FileSpreadsheet,
  Globe,
  Layers,
  Barcode,
  Printer,
  FileText,
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
  PlusCircle,
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
  onSave: (data: ProductFormData) => void
  onAccessFiscalConfig?: () => void
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

function resolveBasicFields(d: ProductFormData) {
  const isP = d.unitPrice > 0
  const isS = d.stock > 0
  const isM = d.minStock !== undefined && d.minStock > 0
  return {
    name: d.name,
    category: d.category,
    price: isP ? formatBrDecimal(d.unitPrice) : "",
    stock: isS ? String(d.stock) : "",
    unit: d.unit,
    ncm: d.ncm || "",
    cest: d.cest || "",
    cfop: d.cfop || "5.102",
    icmsOrigem: d.icmsOrigem || "0 - Nacional",
    detailedDescription: d.detailedDescription || "",
    subgroup: d.subgroup || "",
    minStock: isM ? String(d.minStock) : "",
    costPrice: d.costPrice ? formatBrDecimal(d.costPrice) : "",
    otherCosts: d.otherCosts ? formatBrDecimal(d.otherCosts) : "",
    profitMargin: d.margin ? formatBrDecimal(d.margin) : "",
    image: d.image || null,
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
  image,
  onImageChange,
}: {
  image: string | null
  onImageChange: (img: string | null) => void
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
          w="w-24"
          h="h-24"
          radius="full"
          border={true}
          borderColor="border-brand-secondary"
          bg="bg-slate-100"
          overflow="hidden"
          cursor="pointer"
          onClick={() => fileInputRef.current?.click()}
          title={pf.imageUploadTitle}
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
  name, setName,
  unit, setUnit,
  category, setCategory,
  subgroup, setSubgroup,
  detailedDescription, setDetailedDescription,
  dbUnits, dbCategories,
}: {
  name: string; setName: (v: string) => void
  unit: string; setUnit: (v: string) => void
  category: string; setCategory: (v: string) => void
  subgroup: string; setSubgroup: (v: string) => void
  detailedDescription: string; setDetailedDescription: (v: string) => void
  dbUnits?: { id: string; name: string }[]
  dbCategories?: { id: string; name: string; subgroups?: string[] }[]
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
            {(dbUnits || []).map((u) => (
              <CustomSelectItem key={u.id} value={u.name} text={u.name} icon={Package} />
            ))}
          </CustomSelect>
        </Stack>

        <Stack gap={1}>
          <Font variant="body-sm-semibold" text={pf.groupLabel} />
          <CustomSelect value={category} onChange={(val) => { setCategory(val); setSubgroup("") }}>
            {(dbCategories || []).map((c) => (
              <CustomSelectItem key={c.id} value={c.name} text={c.name} icon={Layers} />
            ))}
          </CustomSelect>
        </Stack>

        <Stack gap={1}>
          <Font variant="body-sm-semibold" text={pf.subgroupLabel} />
          <CustomSelect value={subgroup} onChange={setSubgroup}>
            {subgroupItems.map((s) => (
              <CustomSelectItem key={s} value={s} text={s} icon={Layers} />
            ))}
          </CustomSelect>
        </Stack>
      </Grid>
      <Input label={pf.detailedDescriptionLabel} placeholder={pf.detailedDescriptionPlaceholder} value={detailedDescription} onChange={(e) => setDetailedDescription(e.target.value)} />
    </Stack>
  )
}

function ProductValuesStockSection({
  stock, setStock,
  minStock, setMinStock,
  costPrice, otherCosts, profitMargin, price,
  onCostPriceChange, onOtherCostsChange, onMarginChange, onPriceChange,
}: {
  stock: string; setStock: (v: string) => void
  minStock: string; setMinStock: (v: string) => void
  costPrice: string; otherCosts: string; profitMargin: string; price: string
  onCostPriceChange: (v: string) => void
  onOtherCostsChange: (v: string) => void
  onMarginChange: (v: string) => void
  onPriceChange: (v: string) => void
}) {
  const pf = UI_STRINGS.products.form
  return (
    <Box padding={5} bg="bg-surface" radius="default" border borderColor="border-border">
      <Stack gap={2.5} w="full">
        <Font variant="body-semibold" text={pf.valuesAndStockTitle} />
        <Grid cols={3} gap={5}>
          <Input label={pf.stockLabel} variant="outlined-label" placeholder={pf.zeroPlaceholder} value={stock} onChange={(e) => setStock(maskNumberInput(e.target.value))} required />
          <Input label={pf.minStockLabel} variant="outlined-label" placeholder={pf.zeroPlaceholder} value={minStock} onChange={(e) => setMinStock(maskNumberInput(e.target.value))} />
          <Input label={pf.costPriceLabel} variant="outlined-label" placeholder={pf.zeroDecimalPlaceholder} value={costPrice} onChange={(e) => onCostPriceChange(e.target.value)} />
          <Input label={pf.otherCostsLabel} variant="outlined-label" placeholder={pf.zeroDecimalPlaceholder} value={otherCosts} onChange={(e) => onOtherCostsChange(e.target.value)} />
          <Input label={pf.marginLabel} variant="outlined-label" placeholder={pf.zeroDecimalPlaceholder} value={profitMargin} onChange={(e) => onMarginChange(e.target.value)} />
          <Input label={pf.salePriceLabel} variant="outlined-label" placeholder={pf.zeroDecimalPlaceholder} value={price} onChange={(e) => onPriceChange(e.target.value)} required />
        </Grid>
      </Stack>
    </Box>
  )
}

// ---------------- ACCORDIONS DE RECURSOS AVANÇADOS ----------------

function MultissaborAccordion({
  isOpen, onToggle,
  enabled, setEnabled,
  limit, setLimit,
  mode, setMode,
}: {
  isOpen: boolean; onToggle: () => void
  enabled: boolean; setEnabled: (v: boolean) => void
  limit: string; setLimit: (v: string) => void
  mode: "proporcional" | "maior"; setMode: (v: "proporcional" | "maior") => void
}) {
  const pf = UI_STRINGS.products.form
  return (
    <Stack gap={1} w="full">
      <Box padding={2.5} bg="bg-surface" border borderColor="border-border" radius="default" w="full" cursor="pointer" onClick={onToggle}>
        <Stack direction="row" align="center" justify="between" w="full">
          <Stack direction="row" align="center" gap={2.5}>
            <Icon icon={Layers} size={18} color="secondary" />
            <Font variant="body-semibold" text={pf.multissaborTitle} />
          </Stack>
          <Icon icon={isOpen ? ChevronUp : ChevronDown} size={18} color="muted" />
        </Stack>
      </Box>
      <Box transition="all" overflow="hidden" maxH={isOpen ? "2000px" : "0"} opacity={isOpen ? "100" : "0"} w="full">
        <Box padding={5} bg="bg-surface" border borderColor="border-border" radius="default" w="full">
          <Stack gap={5} w="full">
            <Stack direction="row" align="center" justify="between" w="full">
              <Stack gap={1}>
                <Font variant="body-semibold" text={pf.enableMultissaborTitle} align="left" />
                <Font variant="description" text={pf.enableMultissaborDesc} align="left" />
              </Stack>
              <Switch checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />
            </Stack>
            {enabled && (
              <Grid cols={2} gap={5}>
                <Input label={pf.multissaborLimitLabel} placeholder="2" value={limit} onChange={(e) => setLimit(e.target.value)} />
                <Stack gap={1}>
                  <Font variant="body-sm-semibold" text={pf.pricingModeLabel} />
                  <CustomSelect value={mode} onChange={(val) => setMode(val as "proporcional" | "maior")}>
                    <CustomSelectItem value="proporcional" text={pf.proportionalAverageOption} icon={Layers} />
                    <CustomSelectItem value="maior" text={pf.highestPriceOption} icon={Layers} />
                  </CustomSelect>
                </Stack>
              </Grid>
            )}
          </Stack>
        </Box>
      </Box>
    </Stack>
  )
}

function ComplementosAccordion({
  isOpen, onToggle,
  enabled, setEnabled,
}: {
  isOpen: boolean; onToggle: () => void
  enabled: boolean; setEnabled: (v: boolean) => void
}) {
  const pf = UI_STRINGS.products.form
  return (
    <Stack gap={1} w="full">
      <Box padding={2.5} bg="bg-surface" border borderColor="border-border" radius="default" w="full" cursor="pointer" onClick={onToggle}>
        <Stack direction="row" align="center" justify="between" w="full">
          <Stack direction="row" align="center" gap={2.5}>
            <Icon icon={PlusCircle} size={18} color="secondary" />
            <Font variant="body-semibold" text={pf.subgroupComplementsTitle} />
          </Stack>
          <Icon icon={isOpen ? ChevronUp : ChevronDown} size={18} color="muted" />
        </Stack>
      </Box>
      <Box transition="all" overflow="hidden" maxH={isOpen ? "2000px" : "0"} opacity={isOpen ? "100" : "0"} w="full">
        <Box padding={5} bg="bg-surface" border borderColor="border-border" radius="default" w="full">
          <Stack direction="row" align="center" justify="between" w="full">
            <Stack gap={1}>
              <Font variant="body-semibold" text={pf.linkComplementsTitle} align="left" />
              <Font variant="description" text={pf.linkComplementsDesc} align="left" />
            </Stack>
            <Switch checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />
          </Stack>
        </Box>
      </Box>
    </Stack>
  )
}

function PlataformasAccordion({
  isOpen, onToggle,
  enabled, setEnabled,
  price, setPrice,
}: {
  isOpen: boolean; onToggle: () => void
  enabled: boolean; setEnabled: (v: boolean) => void
  price: string; setPrice: (v: string) => void
}) {
  const pf = UI_STRINGS.products.form
  return (
    <Stack gap={1} w="full">
      <Box padding={2.5} bg="bg-surface" border borderColor="border-border" radius="default" w="full" cursor="pointer" onClick={onToggle}>
        <Stack direction="row" align="center" justify="between" w="full">
          <Stack direction="row" align="center" gap={2.5}>
            <Icon icon={Globe} size={18} color="secondary" />
            <Font variant="body-semibold" text={pf.salesPlatformsTitle} />
          </Stack>
          <Icon icon={isOpen ? ChevronUp : ChevronDown} size={18} color="muted" />
        </Stack>
      </Box>
      <Box transition="all" overflow="hidden" maxH={isOpen ? "2000px" : "0"} opacity={isOpen ? "100" : "0"} w="full">
        <Box padding={5} bg="bg-surface" border borderColor="border-border" radius="default" w="full">
          <Stack gap={5} w="full">
            <Stack direction="row" align="center" justify="between" w="full">
              <Stack gap={1}>
                <Font variant="body-semibold" text={pf.showInOnlineCatalogTitle} align="left" />
                <Font variant="description" text={pf.showInOnlineCatalogDesc} align="left" />
              </Stack>
              <Switch checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />
            </Stack>
            {enabled && (
              <Input label={pf.catalogPriceLabel} placeholder={pf.zeroDecimalPlaceholder} value={price} onChange={(e) => setPrice(e.target.value)} />
            )}
          </Stack>
        </Box>
      </Box>
    </Stack>
  )
}

function BarcodesAccordion({
  isOpen, onToggle,
  barcodes, newBarcode, setNewBarcode, onAddBarcode, onRemoveBarcode,
}: {
  isOpen: boolean; onToggle: () => void
  barcodes: string[]; newBarcode: string; setNewBarcode: (v: string) => void
  onAddBarcode: () => void; onRemoveBarcode: (idx: number) => void
}) {
  const pf = UI_STRINGS.products.form
  return (
    <Stack gap={1} w="full">
      <Box padding={2.5} bg="bg-surface" border borderColor="border-border" radius="default" w="full" cursor="pointer" onClick={onToggle}>
        <Stack direction="row" align="center" justify="between" w="full">
          <Stack direction="row" align="center" gap={2.5}>
            <Icon icon={Barcode} size={18} color="secondary" />
            <Font variant="body-semibold" text={pf.barcodesTitle} />
          </Stack>
          <Icon icon={isOpen ? ChevronUp : ChevronDown} size={18} color="muted" />
        </Stack>
      </Box>
      <Box transition="all" overflow="hidden" maxH={isOpen ? "2000px" : "0"} opacity={isOpen ? "100" : "0"} w="full">
        <Box padding={5} bg="bg-surface" border borderColor="border-border" radius="default" w="full">
          <Stack gap={5} w="full">
            <Stack direction="row" gap={2.5} align="end" w="full">
              <Box flex="1">
                <Input label={pf.addBarcodeLabel} placeholder={pf.barcodePlaceholder} value={newBarcode} onChange={(e) => setNewBarcode(e.target.value)} />
              </Box>
              <Button variant="primary" label={UI_STRINGS.common.save} icon={Plus} onClick={onAddBarcode} type="button" />
            </Stack>
            {barcodes.length > 0 && (
              <Grid cols={2} gap={2.5}>
                {barcodes.map((code, idx) => (
                  <Box key={idx} padding={2.5} bg="bg-slate-100" radius="default" border borderColor="border-border">
                    <Stack direction="row" align="center" justify="between" w="full">
                      <Font variant="body" text={code} />
                      <Button variant="danger-icon-xs" icon={Trash2} onClick={() => onRemoveBarcode(idx)} type="button" />
                    </Stack>
                  </Box>
                ))}
              </Grid>
            )}
          </Stack>
        </Box>
      </Box>
    </Stack>
  )
}

function PrintAndProductionAccordions({
  isPrintOpen, onTogglePrint,
  printPoint, setPrintPoint, dbPrintPoints,
  isProdOpen, onToggleProd,
  producaoPropria, setProducaoPropria,
  ingredients, setIngredients,
  prepMode, setPrepMode,
}: {
  isPrintOpen: boolean; onTogglePrint: () => void
  printPoint: string; setPrintPoint: (v: string) => void
  dbPrintPoints?: { id: string; name: string }[]
  isProdOpen: boolean; onToggleProd: () => void
  producaoPropria: boolean; setProducaoPropria: (v: boolean) => void
  ingredients: string; setIngredients: (v: string) => void
  prepMode: string; setPrepMode: (v: string) => void
}) {
  const pf = UI_STRINGS.products.form
  return (
    <>
      <Stack gap={1} w="full">
        <Box padding={2.5} bg="bg-surface" border borderColor="border-border" radius="default" w="full" cursor="pointer" onClick={onTogglePrint}>
          <Stack direction="row" align="center" justify="between" w="full">
            <Stack direction="row" align="center" gap={2.5}>
              <Icon icon={Printer} size={18} color="secondary" />
              <Font variant="body-semibold" text={pf.printPointTitle} />
            </Stack>
            <Icon icon={isPrintOpen ? ChevronUp : ChevronDown} size={18} color="muted" />
          </Stack>
        </Box>
        <Box transition="all" overflow="hidden" maxH={isPrintOpen ? "2000px" : "0"} opacity={isPrintOpen ? "100" : "0"} w="full">
          <Box padding={5} bg="bg-surface" border borderColor="border-border" radius="default" w="full">
            <Stack gap={1} w="full">
              <Font variant="body-sm-semibold" text={pf.printDestinationLabel} />
              <CustomSelect value={printPoint} onChange={setPrintPoint}>
                {[
                  <CustomSelectItem key="__none__" value="" text={pf.noPrintOption} icon={Printer} />,
                  ...(dbPrintPoints ?? []).map((p) => (
                    <CustomSelectItem key={p.id} value={p.name} text={p.name} icon={Printer} />
                  )),
                ]}
              </CustomSelect>
            </Stack>
          </Box>
        </Box>
      </Stack>

      <Stack gap={1} w="full">
        <Box padding={2.5} bg="bg-surface" border borderColor="border-border" radius="default" w="full" cursor="pointer" onClick={onToggleProd}>
          <Stack direction="row" align="center" justify="between" w="full">
            <Stack direction="row" align="center" gap={2.5}>
              <Icon icon={FileText} size={18} color="secondary" />
              <Font variant="body-semibold" text={pf.productionTitle} />
            </Stack>
            <Icon icon={isProdOpen ? ChevronUp : ChevronDown} size={18} color="muted" />
          </Stack>
        </Box>
        <Box transition="all" overflow="hidden" maxH={isProdOpen ? "2000px" : "0"} opacity={isProdOpen ? "100" : "0"} w="full">
          <Box padding={5} bg="bg-surface" border borderColor="border-border" radius="default" w="full">
            <Stack gap={5} w="full">
              <Stack direction="row" align="center" justify="between" w="full">
                <Stack gap={1}>
                  <Font variant="body-semibold" text={pf.inHouseProductionTitle} align="left" />
                  <Font variant="description" text={pf.inHouseProductionDesc} align="left" />
                </Stack>
                <Switch checked={producaoPropria} onChange={(e) => setProducaoPropria(e.target.checked)} />
              </Stack>
              {producaoPropria && (
                <Stack gap={5} w="full">
                  <Input label={pf.ingredientsLabel} placeholder={pf.ingredientsPlaceholder} value={ingredients} onChange={(e) => setIngredients(e.target.value)} />
                  <Input label={pf.preparationModeLabel} placeholder={pf.preparationModePlaceholder} value={prepMode} onChange={(e) => setPrepMode(e.target.value)} />
                </Stack>
              )}
            </Stack>
          </Box>
        </Box>
      </Stack>
    </>
  )
}

function FiscalIcmsSection({
  icmsDefault, setIcmsDefault,
  icmsCsosn, setIcmsCsosn,
  icmsReduction, setIcmsReduction,
  icmsAliquot, setIcmsAliquot,
}: {
  icmsDefault: boolean; setIcmsDefault: (v: boolean) => void
  icmsCsosn: string; setIcmsCsosn: (v: string) => void
  icmsReduction: string; setIcmsReduction: (v: string) => void
  icmsAliquot: string; setIcmsAliquot: (v: string) => void
}) {
  const pf = UI_STRINGS.products.form
  return (
    <Stack gap={5} w="full">
      <Stack direction="row" align="center" justify="between" w="full">
        <Stack gap={1}>
          <Font variant="body-semibold" text={pf.useDefaultIcmsTitle} align="left" />
          <Font variant="description" text={pf.useDefaultIcmsDesc} align="left" />
        </Stack>
        <Switch checked={icmsDefault} onChange={(e) => setIcmsDefault(e.target.checked)} />
      </Stack>
      {!icmsDefault && (
        <Grid cols={3} gap={5}>
          <Stack gap={1}>
            <Font variant="body-sm-semibold" text={pf.csosnIcmsLabel} />
            <CustomSelect value={icmsCsosn} onChange={setIcmsCsosn}>
              <CustomSelectItem value="101" text={pf.csosn101Short} icon={FileSpreadsheet} />
              <CustomSelectItem value="500" text={pf.csosn500Short} icon={FileSpreadsheet} />
            </CustomSelect>
          </Stack>
          <Input label={pf.reductionBaseShortLabel} placeholder={pf.zeroDecimalPlaceholder} value={icmsReduction} onChange={(e) => setIcmsReduction(e.target.value)} />
          <Input label={pf.aliquotEffectiveLabel} placeholder={pf.zeroDecimalPlaceholder} value={icmsAliquot} onChange={(e) => setIcmsAliquot(e.target.value)} />
        </Grid>
      )}
    </Stack>
  )
}

function FiscalPisSection({
  pisCofinsDefault, setPisCofinsDefault,
  pisCofinsCst, setPisCofinsCst,
}: {
  pisCofinsDefault: boolean; setPisCofinsDefault: (v: boolean) => void
  pisCofinsCst: string; setPisCofinsCst: (v: string) => void
}) {
  const pf = UI_STRINGS.products.form
  return (
    <Stack gap={5} w="full">
      <Stack direction="row" align="center" justify="between" w="full">
        <Stack gap={1}>
          <Font variant="body-semibold" text={pf.useDefaultPisCofinsTitle} align="left" />
          <Font variant="description" text={pf.useDefaultPisCofinsDesc} align="left" />
        </Stack>
        <Switch checked={pisCofinsDefault} onChange={(e) => setPisCofinsDefault(e.target.checked)} />
      </Stack>
      {!pisCofinsDefault && (
        <Stack gap={1} w="full">
          <Font variant="body-sm-semibold" text={pf.cstPisCofinsLabel} />
          <CustomSelect value={pisCofinsCst} onChange={setPisCofinsCst}>
            <CustomSelectItem value="49" text={pf.pis49Short} icon={Globe} />
            <CustomSelectItem value="99" text={pf.pis99Short} icon={Globe} />
          </CustomSelect>
        </Stack>
      )}
    </Stack>
  )
}

function ProductFiscalAccordion({
  isOpen, onToggle,
  ncm, setNcm, exTipi, setExTipi, cest, setCest, icmsOrigem, setIcmsOrigem,
  icmsDefault, setIcmsDefault, icmsCsosn, setIcmsCsosn, icmsReduction, setIcmsReduction, icmsAliquot, setIcmsAliquot,
  pisCofinsDefault, setPisCofinsDefault, pisCofinsCst, setPisCofinsCst,
  onAccessFiscalConfig,
}: {
  isOpen: boolean; onToggle: () => void
  ncm: string; setNcm: (v: string) => void
  exTipi: string; setExTipi: (v: string) => void
  cest: string; setCest: (v: string) => void
  icmsOrigem: string; setIcmsOrigem: (v: string) => void
  icmsDefault: boolean; setIcmsDefault: (v: boolean) => void
  icmsCsosn: string; setIcmsCsosn: (v: string) => void
  icmsReduction: string; setIcmsReduction: (v: string) => void
  icmsAliquot: string; setIcmsAliquot: (v: string) => void
  pisCofinsDefault: boolean; setPisCofinsDefault: (v: boolean) => void
  pisCofinsCst: string; setPisCofinsCst: (v: string) => void
  onAccessFiscalConfig?: () => void
}) {
  const pf = UI_STRINGS.products.form
  return (
    <Stack gap={1} w="full">
      <Box padding={2.5} bg="bg-surface" border borderColor="border-border" radius="default" w="full" cursor="pointer" onClick={onToggle}>
        <Stack direction="row" align="center" justify="between" w="full">
          <Stack direction="row" align="center" gap={2.5}>
            <Icon icon={FileSpreadsheet} size={18} color="secondary" />
            <Font variant="body-semibold" text={pf.fiscalTitle} />
          </Stack>
          <Icon icon={isOpen ? ChevronUp : ChevronDown} size={18} color="muted" />
        </Stack>
      </Box>
      <Box transition="all" overflow="hidden" maxH={isOpen ? "2000px" : "0"} opacity={isOpen ? "100" : "0"} w="full">
        <Box padding={5} bg="bg-surface" border borderColor="border-border" radius="default" w="full">
          <Stack gap={5} w="full">
            <Grid cols={2} gap={5}>
              <Input label={pf.ncmLabel} placeholder={pf.ncmPlaceholder} value={ncm} onChange={(e) => setNcm(e.target.value)} />
              <Input label={pf.exTipiLabel} placeholder={pf.exTipiPlaceholder} value={exTipi} onChange={(e) => setExTipi(e.target.value)} />
              <Input label={pf.cestLabel} placeholder={pf.cestPlaceholder} value={cest} onChange={(e) => setCest(e.target.value)} />
              <Stack gap={1}>
                <Font variant="body-sm-semibold" text={pf.originLabel} />
                <CustomSelect value={icmsOrigem} onChange={setIcmsOrigem}>
                  <CustomSelectItem value="0 - Nacional" text={pf.originNational} icon={Globe} />
                  <CustomSelectItem value="1 - Estrangeira Importada" text={pf.originImported} icon={Globe} />
                </CustomSelect>
              </Stack>
            </Grid>
            <Box h="h-[1px]" bg="bg-border" w="full" />
            <FiscalIcmsSection icmsDefault={icmsDefault} setIcmsDefault={setIcmsDefault} icmsCsosn={icmsCsosn} setIcmsCsosn={setIcmsCsosn} icmsReduction={icmsReduction} setIcmsReduction={setIcmsReduction} icmsAliquot={icmsAliquot} setIcmsAliquot={setIcmsAliquot} />
            <Box h="h-[1px]" bg="bg-border" w="full" />
            <FiscalPisSection pisCofinsDefault={pisCofinsDefault} setPisCofinsDefault={setPisCofinsDefault} pisCofinsCst={pisCofinsCst} setPisCofinsCst={setPisCofinsCst} />
            {onAccessFiscalConfig && (
              <Box w="full" display="flex" justify="end">
                <Button variant="ghost-secondary" label={pf.accessFiscalConfigButton} onClick={onAccessFiscalConfig} type="button" />
              </Box>
            )}
          </Stack>
        </Box>
      </Box>
    </Stack>
  )
}

export function ProductForm({ initialData, onSave, onAccessFiscalConfig }: ProductFormProps) {
  const pf = UI_STRINGS.products.form
  const tenantCtx = useTenant()
  const tenantId = tenantCtx?.currentTenant?.id
  const dbCategories = useCategories(tenantId)
  const dbUnits = useUnits(tenantId)
  const dbPrintPoints = usePrintPoints(tenantId)

  const [isMultissaborOpen, setIsMultissaborOpen] = React.useState(false)
  const [isComplementosOpen, setIsComplementosOpen] = React.useState(false)
  const [isPlataformasOpen, setIsPlataformasOpen] = React.useState(false)
  const [isBarcodesOpen, setIsBarcodesOpen] = React.useState(false)
  const [isPrintPointOpen, setIsPrintPointOpen] = React.useState(false)
  const [isProducaoOpen, setIsProducaoOpen] = React.useState(false)
  const [isFiscalOpen, setIsFiscalOpen] = React.useState(false)

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

  const [prevInitialData, setPrevInitialData] = React.useState(initialData)

  if (initialData !== prevInitialData) {
    setPrevInitialData(initialData)
    const next = resolveProductFormData(initialData)
    setName(next.name); setCategory(next.category); setPrice(next.price); setStock(next.stock)
    setUnit(next.unit); setNcm(next.ncm); setCest(next.cest); setCfop(next.cfop); setIcmsOrigem(next.icmsOrigem)
    setDetailedDescription(next.detailedDescription); setSubgroup(next.subgroup); setMinStock(next.minStock)
    setCostPrice(next.costPrice); setOtherCosts(next.otherCosts); setProfitMargin(next.profitMargin); setImage(next.image)
    setMultissaborEnabled(next.multissaborEnabled); setMultissaborLimit(next.multissaborLimit)
    setMultissaborPricingMode(next.multissaborPricingMode); setComplementosEnabled(next.complementosEnabled)
    setPlataformasEnabled(next.plataformasEnabled); setPlataformasPriceDifferent(next.plataformasPriceDifferent)
    setBarcodes(next.barcodes); setPrintPoint(next.printPoint); setProducaoPropria(next.producaoPropria)
    setIngredients(next.ingredients); setPreparationMode(next.preparationMode); setExTipi(next.exTipi)
    setIcmsDefault(next.icmsDefault); setIcmsCsosn(next.icmsCsosn); setIcmsReduction(next.icmsReduction)
    setIcmsAliquot(next.icmsAliquot); setPisCofinsDefault(next.pisCofinsDefault); setPisCofinsCst(next.pisCofinsCst)
  }

  const handleCostPriceChange = (val: string) => {
    const formatted = maskCurrencyInput(val)
    setCostPrice(formatted)
    const costNum = parseBrFloat(formatted)
    const otherNum = parseBrFloat(otherCosts)
    const marginNum = parseBrFloat(profitMargin)
    const priceNum = parseBrFloat(price)
    const totalCost = costNum > 0 ? costNum * (1 + otherNum / 100) : 0
    if (totalCost > 0) {
      if (marginNum > 0) setPrice(formatBrDecimal(totalCost * (1 + marginNum / 100)))
      else if (priceNum > 0) setProfitMargin(formatBrDecimal(((priceNum / totalCost) - 1) * 100))
    }
  }

  const handleOtherCostsChange = (val: string) => {
    const formatted = maskCurrencyInput(val)
    setOtherCosts(formatted)
    const costNum = parseBrFloat(costPrice)
    const otherNum = parseBrFloat(formatted)
    const marginNum = parseBrFloat(profitMargin)
    const priceNum = parseBrFloat(price)
    const totalCost = costNum > 0 ? costNum * (1 + otherNum / 100) : 0
    if (totalCost > 0) {
      if (marginNum > 0) setPrice(formatBrDecimal(totalCost * (1 + marginNum / 100)))
      else if (priceNum > 0) setProfitMargin(formatBrDecimal(((priceNum / totalCost) - 1) * 100))
    }
  }

  const handleMarginChange = (val: string) => {
    const formatted = maskCurrencyInput(val)
    setProfitMargin(formatted)
    const costNum = parseBrFloat(costPrice)
    const otherNum = parseBrFloat(otherCosts)
    const marginNum = parseBrFloat(formatted)
    const totalCost = costNum > 0 ? costNum * (1 + otherNum / 100) : 0
    if (totalCost > 0 && marginNum > 0) setPrice(formatBrDecimal(totalCost * (1 + marginNum / 100)))
  }

  const handlePriceChange = (val: string) => {
    const formatted = maskCurrencyInput(val)
    setPrice(formatted)
    const costNum = parseBrFloat(costPrice)
    const otherNum = parseBrFloat(otherCosts)
    const priceNum = parseBrFloat(formatted)
    const totalCost = costNum > 0 ? costNum * (1 + otherNum / 100) : 0
    if (totalCost > 0 && priceNum > 0) setProfitMargin(formatBrDecimal(((priceNum / totalCost) - 1) * 100))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      name, category, unitPrice: parseBrFloat(price), stock: parseBrFloat(stock), unit,
      ncm, cest, cfop, icmsOrigem, image: image || undefined, detailedDescription, subgroup,
      minStock: parseBrFloat(minStock), costPrice: parseBrFloat(costPrice), otherCosts: parseBrFloat(otherCosts), margin: parseBrFloat(profitMargin),
      multissaborEnabled, multissaborLimit: parseInt(multissaborLimit) || 2, multissaborPricingMode,
      complementosEnabled, plataformasEnabled, plataformasPriceDifferent: parseBrFloat(plataformasPriceDifferent),
      barcodes, printPoint, producaoPropria, ingredients, preparationMode,
      exTipi, icmsDefault, icmsCsosn, icmsReduction: parseBrFloat(icmsReduction), icmsAliquot: parseBrFloat(icmsAliquot),
      pisCofinsDefault, pisCofinsCst,
    })
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
            <Stack gap={5} w="full">
              <Box padding={5} bg="bg-surface" radius="default" border borderColor="border-border">
                <Stack gap={5} w="full">
                  <ProductImageUploader image={image} onImageChange={setImage} />
                  <ProductBasicFields
                    name={name} setName={setName} unit={unit} setUnit={setUnit}
                    category={category} setCategory={setCategory} subgroup={subgroup} setSubgroup={setSubgroup}
                    detailedDescription={detailedDescription} setDetailedDescription={setDetailedDescription}
                    dbUnits={dbUnits} dbCategories={dbCategories}
                  />
                </Stack>
              </Box>
              <ProductValuesStockSection
                stock={stock} setStock={setStock} minStock={minStock} setMinStock={setMinStock}
                costPrice={costPrice} otherCosts={otherCosts} profitMargin={profitMargin} price={price}
                onCostPriceChange={handleCostPriceChange} onOtherCostsChange={handleOtherCostsChange}
                onMarginChange={handleMarginChange} onPriceChange={handlePriceChange}
              />
            </Stack>
          </TabsContent>

          <TabsContent value="avancado">
            <Stack gap={2.5} w="full">
              <MultissaborAccordion
                isOpen={isMultissaborOpen} onToggle={() => setIsMultissaborOpen(!isMultissaborOpen)}
                enabled={multissaborEnabled} setEnabled={setMultissaborEnabled}
                limit={multissaborLimit} setLimit={setMultissaborLimit}
                mode={multissaborPricingMode} setMode={setMultissaborPricingMode}
              />
              <ComplementosAccordion isOpen={isComplementosOpen} onToggle={() => setIsComplementosOpen(!isComplementosOpen)} enabled={complementosEnabled} setEnabled={setComplementosEnabled} />
              <PlataformasAccordion isOpen={isPlataformasOpen} onToggle={() => setIsPlataformasOpen(!isPlataformasOpen)} enabled={plataformasEnabled} setEnabled={setPlataformasEnabled} price={plataformasPriceDifferent} setPrice={setPlataformasPriceDifferent} />
              <BarcodesAccordion
                isOpen={isBarcodesOpen} onToggle={() => setIsBarcodesOpen(!isBarcodesOpen)}
                barcodes={barcodes} newBarcode={newBarcode} setNewBarcode={setNewBarcode}
                onAddBarcode={() => {
                  if (newBarcode.trim()) {
                    setBarcodes((prev) => [...prev, newBarcode.trim()])
                    setNewBarcode("")
                  }
                }}
                onRemoveBarcode={(idx) => setBarcodes((prev) => prev.filter((_, i) => i !== idx))}
              />
              <PrintAndProductionAccordions
                isPrintOpen={isPrintPointOpen} onTogglePrint={() => setIsPrintPointOpen(!isPrintPointOpen)}
                printPoint={printPoint} setPrintPoint={setPrintPoint} dbPrintPoints={dbPrintPoints}
                isProdOpen={isProducaoOpen} onToggleProd={() => setIsProducaoOpen(!isProducaoOpen)}
                producaoPropria={producaoPropria} setProducaoPropria={setProducaoPropria}
                ingredients={ingredients} setIngredients={setIngredients}
                prepMode={preparationMode} setPrepMode={setPreparationMode}
              />
              <ProductFiscalAccordion
                isOpen={isFiscalOpen} onToggle={() => setIsFiscalOpen(!isFiscalOpen)}
                ncm={ncm} setNcm={setNcm} exTipi={exTipi} setExTipi={setExTipi} cest={cest} setCest={setCest}
                icmsOrigem={icmsOrigem} setIcmsOrigem={setIcmsOrigem}
                icmsDefault={icmsDefault} setIcmsDefault={setIcmsDefault}
                icmsCsosn={icmsCsosn} setIcmsCsosn={setIcmsCsosn}
                icmsReduction={icmsReduction} setIcmsReduction={setIcmsReduction}
                icmsAliquot={icmsAliquot} setIcmsAliquot={setIcmsAliquot}
                pisCofinsDefault={pisCofinsDefault} setPisCofinsDefault={setPisCofinsDefault}
                pisCofinsCst={pisCofinsCst} setPisCofinsCst={setPisCofinsCst}
                onAccessFiscalConfig={onAccessFiscalConfig}
              />
            </Stack>
          </TabsContent>
        </Tabs>
      </Stack>
    </Box>
  )
}
