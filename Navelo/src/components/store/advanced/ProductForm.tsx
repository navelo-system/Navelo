"use client"

/* eslint-disable max-lines-per-function, complexity, react-hooks/set-state-in-effect */

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
  PlusCircle
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
  return num.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

const maskCurrencyInput = (val: string): string => {
  const clean = val.replace(/[^\d,. ]/g, "").replace(/\./g, ",")
  const parts = clean.split(",")
  if (parts.length > 2) return parts[0] + "," + parts.slice(1).join("")
  if (parts[1] && parts[1].length > 2) {
    return parts[0] + "," + parts[1].slice(0, 2)
  }
  return clean
}

const maskNumberInput = (val: string): string => {
  return val.replace(/\D/g, "")
}

export const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
  onSave,
  onAccessFiscalConfig,
}) => {
  const pf = UI_STRINGS.products.form

  // Tenant & DAL
  const tenantCtx = useTenant()
  const tenantId = tenantCtx?.currentTenant?.id
  const dbCategories = useCategories(tenantId)
  const dbUnits = useUnits(tenantId)
  const dbPrintPoints = usePrintPoints(tenantId)

  // Accordion state
  const [isMultissaborOpen, setIsMultissaborOpen] = React.useState(false)
  const [isComplementosOpen, setIsComplementosOpen] = React.useState(false)
  const [isPlataformasOpen, setIsPlataformasOpen] = React.useState(false)
  const [isBarcodesOpen, setIsBarcodesOpen] = React.useState(false)
  const [isPrintPointOpen, setIsPrintPointOpen] = React.useState(false)
  const [isProducaoOpen, setIsProducaoOpen] = React.useState(false)
  const [isFiscalOpen, setIsFiscalOpen] = React.useState(false)

  // Form states initialized directly from initialData
  const [name, setName] = React.useState(() => initialData?.name || "")
  const [category, setCategory] = React.useState(() => initialData?.category || "")
  const [price, setPrice] = React.useState(() => (initialData?.unitPrice ? formatBrDecimal(initialData.unitPrice) : ""))
  const [stock, setStock] = React.useState(() => initialData?.stock?.toString() || "")
  const [unit, setUnit] = React.useState(() => initialData?.unit || "UN")
  const [ncm, setNcm] = React.useState(() => initialData?.ncm || "")
  const [cest, setCest] = React.useState(() => initialData?.cest || "")
  const [cfop, setCfop] = React.useState(() => initialData?.cfop || "5.102")
  const [icmsOrigem, setIcmsOrigem] = React.useState(() => initialData?.icmsOrigem || "0 - Nacional")

  const [detailedDescription, setDetailedDescription] = React.useState(() => initialData?.detailedDescription || "")
  const [subgroup, setSubgroup] = React.useState(() => initialData?.subgroup || "")
  const [minStock, setMinStock] = React.useState(() => initialData?.minStock?.toString() || "")
  const [costPrice, setCostPrice] = React.useState(() => (initialData?.costPrice ? formatBrDecimal(initialData.costPrice) : ""))
  const [otherCosts, setOtherCosts] = React.useState(() => (initialData?.otherCosts ? formatBrDecimal(initialData.otherCosts) : ""))
  const [margin, setMargin] = React.useState(() => (initialData?.margin ? formatBrDecimal(initialData.margin) : ""))

  const [image, setImage] = React.useState<string | null>(() => initialData?.image || null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const [multissaborEnabled, setMultissaborEnabled] = React.useState(() => !!initialData?.multissaborEnabled)
  const [multissaborLimit, setMultissaborLimit] = React.useState(() => initialData?.multissaborLimit?.toString() || "2")
  const [multissaborPricingMode, setMultissaborPricingMode] = React.useState<"proporcional" | "maior">(
    () => initialData?.multissaborPricingMode || "proporcional"
  )

  const [complementosEnabled, setComplementosEnabled] = React.useState(() => !!initialData?.complementosEnabled)

  const [plataformasEnabled, setPlataformasEnabled] = React.useState(() => !!initialData?.plataformasEnabled)
  const [plataformasPriceDifferent, setPlataformasPriceDifferent] = React.useState(
    () => (initialData?.plataformasPriceDifferent ? formatBrDecimal(initialData.plataformasPriceDifferent) : "")
  )

  const [barcodes, setBarcodes] = React.useState<string[]>(() => initialData?.barcodes || [])
  const [newBarcode, setNewBarcode] = React.useState("")

  const [printPoint, setPrintPoint] = React.useState(() => initialData?.printPoint || "")

  const [producaoPropria, setProducaoPropria] = React.useState(() => !!initialData?.producaoPropria)
  const [ingredients, setIngredients] = React.useState(() => initialData?.ingredients || "")
  const [preparationMode, setPreparationMode] = React.useState(() => initialData?.preparationMode || "")

  const [exTipi, setExTipi] = React.useState(() => initialData?.exTipi || "")
  const [icmsDefault, setIcmsDefault] = React.useState(() => initialData?.icmsDefault !== false)
  const [icmsCsosn, setIcmsCsosn] = React.useState(() => initialData?.icmsCsosn || "500")
  const [icmsReduction, setIcmsReduction] = React.useState(
    () => (initialData?.icmsReduction ? formatBrDecimal(initialData.icmsReduction) : "")
  )
  const [icmsAliquot, setIcmsAliquot] = React.useState(
    () => (initialData?.icmsAliquot ? formatBrDecimal(initialData.icmsAliquot) : "")
  )
  const [pisCofinsDefault, setPisCofinsDefault] = React.useState(() => initialData?.pisCofinsDefault !== false)
  const [pisCofinsCst, setPisCofinsCst] = React.useState(() => initialData?.pisCofinsCst || "99")

  // Sincroniza estado apenas quando a referência de initialData muda via useEffect
  React.useEffect(() => {
    if (initialData) {
      setName(initialData.name || "")
      setCategory(initialData.category || "")
      setPrice(initialData.unitPrice ? formatBrDecimal(initialData.unitPrice) : "")
      setStock(initialData.stock?.toString() || "")
      setUnit(initialData.unit || "UN")
      setNcm(initialData.ncm || "")
      setCest(initialData.cest || "")
      setCfop(initialData.cfop || "5.102")
      setIcmsOrigem(initialData.icmsOrigem || "0 - Nacional")

      setDetailedDescription(initialData.detailedDescription || "")
      setSubgroup(initialData.subgroup || "")
      setMinStock(initialData.minStock?.toString() || "")
      setCostPrice(initialData.costPrice ? formatBrDecimal(initialData.costPrice) : "")
      setOtherCosts(initialData.otherCosts ? formatBrDecimal(initialData.otherCosts) : "")
      setMargin(initialData.margin ? formatBrDecimal(initialData.margin) : "")
      setImage(initialData.image || null)

      setMultissaborEnabled(!!initialData.multissaborEnabled)
      setMultissaborLimit(initialData.multissaborLimit?.toString() || "2")
      setMultissaborPricingMode(initialData.multissaborPricingMode || "proporcional")

      setComplementosEnabled(!!initialData.complementosEnabled)

      setPlataformasEnabled(!!initialData.plataformasEnabled)
      setPlataformasPriceDifferent(initialData.plataformasPriceDifferent ? formatBrDecimal(initialData.plataformasPriceDifferent) : "")

      setBarcodes(initialData.barcodes || [])
      setPrintPoint(initialData.printPoint || "")

      setProducaoPropria(!!initialData.producaoPropria)
      setIngredients(initialData.ingredients || "")
      setPreparationMode(initialData.preparationMode || "")

      setExTipi(initialData.exTipi || "")
      setIcmsDefault(initialData.icmsDefault !== false)
      setIcmsCsosn(initialData.icmsCsosn || "500")
      setIcmsReduction(initialData.icmsReduction ? formatBrDecimal(initialData.icmsReduction) : "")
      setIcmsAliquot(initialData.icmsAliquot ? formatBrDecimal(initialData.icmsAliquot) : "")
      setPisCofinsDefault(initialData.pisCofinsDefault !== false)
      setPisCofinsCst(initialData.pisCofinsCst || "99")
    }
  }, [initialData])

  // Handlers para cálculo bidirecional entre Preço de Custo, Outros Custos, Margem e Preço de Venda
  const handleCostPriceChange = (val: string) => {
    const formatted = maskCurrencyInput(val)
    setCostPrice(formatted)

    const costNum = parseBrFloat(formatted)
    const otherNum = parseBrFloat(otherCosts)
    const marginNum = parseBrFloat(margin)
    const priceNum = parseBrFloat(price)

    const totalCost = costNum > 0 ? costNum * (1 + otherNum / 100) : 0

    if (totalCost > 0) {
      if (marginNum > 0) {
        const calcPrice = totalCost * (1 + marginNum / 100)
        setPrice(formatBrDecimal(calcPrice))
      } else if (priceNum > 0) {
        const calcMargin = ((priceNum / totalCost) - 1) * 100
        setMargin(formatBrDecimal(calcMargin))
      }
    }
  }

  const handleOtherCostsChange = (val: string) => {
    const formatted = maskCurrencyInput(val)
    setOtherCosts(formatted)

    const costNum = parseBrFloat(costPrice)
    const otherNum = parseBrFloat(formatted)
    const marginNum = parseBrFloat(margin)
    const priceNum = parseBrFloat(price)

    const totalCost = costNum > 0 ? costNum * (1 + otherNum / 100) : 0

    if (totalCost > 0) {
      if (marginNum > 0) {
        const calcPrice = totalCost * (1 + marginNum / 100)
        setPrice(formatBrDecimal(calcPrice))
      } else if (priceNum > 0) {
        const calcMargin = ((priceNum / totalCost) - 1) * 100
        setMargin(formatBrDecimal(calcMargin))
      }
    }
  }

  const handleMarginChange = (val: string) => {
    const formatted = maskCurrencyInput(val)
    setMargin(formatted)

    const costNum = parseBrFloat(costPrice)
    const otherNum = parseBrFloat(otherCosts)
    const marginNum = parseBrFloat(formatted)

    const totalCost = costNum > 0 ? costNum * (1 + otherNum / 100) : 0

    if (totalCost > 0 && marginNum > 0) {
      const calcPrice = totalCost * (1 + marginNum / 100)
      setPrice(formatBrDecimal(calcPrice))
    }
  }

  const handlePriceChange = (val: string) => {
    const formatted = maskCurrencyInput(val)
    setPrice(formatted)

    const costNum = parseBrFloat(costPrice)
    const otherNum = parseBrFloat(otherCosts)
    const priceNum = parseBrFloat(formatted)

    const totalCost = costNum > 0 ? costNum * (1 + otherNum / 100) : 0

    if (totalCost > 0 && priceNum > 0) {
      const calcMargin = ((priceNum / totalCost) - 1) * 100
      setMargin(formatBrDecimal(calcMargin))
    }
  }

  const handleAddBarcode = () => {
    if (!newBarcode.trim()) return
    setBarcodes((prev) => [...prev, newBarcode.trim()])
    setNewBarcode("")
  }

  const handleRemoveBarcode = (index: number) => {
    setBarcodes((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      name,
      category,
      unitPrice: parseBrFloat(price),
      stock: parseBrFloat(stock),
      unit,
      ncm,
      cest,
      cfop,
      icmsOrigem,
      image: image || undefined,

      detailedDescription,
      subgroup,
      minStock: parseBrFloat(minStock),
      costPrice: parseBrFloat(costPrice),
      otherCosts: parseBrFloat(otherCosts),
      margin: parseBrFloat(margin),

      multissaborEnabled,
      multissaborLimit: parseInt(multissaborLimit) || 2,
      multissaborPricingMode,

      complementosEnabled,

      plataformasEnabled,
      plataformasPriceDifferent: parseBrFloat(plataformasPriceDifferent),

      barcodes,
      printPoint,

      producaoPropria,
      ingredients,
      preparationMode,

      exTipi,
      icmsDefault,
      icmsCsosn,
      icmsReduction: parseBrFloat(icmsReduction),
      icmsAliquot: parseBrFloat(icmsAliquot),
      pisCofinsDefault,
      pisCofinsCst,
    })
  }
  // Subgroup items computed from selected category
  const subgroupItems = React.useMemo(() => {
    const selectedCat = dbCategories?.find(c => c.name === category)
    if (selectedCat?.subgroups && selectedCat.subgroups.length > 0) {
      return selectedCat.subgroups
    }
    return [] as string[]
  }, [dbCategories, category])

  return (
    <Box as="form" id="product-form" onSubmit={handleSubmit} w="full">
      <Stack gap={5} w="full">
        <Tabs defaultValue="basico">
          <TabsList grid cols={2}>
            <TabsTrigger value="basico" fullWidth>
              {pf.basicDataTab}
            </TabsTrigger>
            <TabsTrigger value="avancado" fullWidth>
              {pf.advancedResourcesTab}
            </TabsTrigger>
          </TabsList>

          {/* ABA DADOS BÁSICOS */}
          <TabsContent value="basico">
            <Stack gap={5} w="full">
              {/* Foto + Campos Básicos */}
              <Box padding={5} bg="bg-surface" radius="default" border={true} borderColor="border-border">
                <Stack gap={5} w="full">
                  {/* Visual Preview da Foto */}
                  <Box
                    as="input"
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleImageChange}
                    display="hidden"
                  />
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
                        <Box
                          as="img"
                          src={image}
                          alt={pf.photoAlt}
                          w="full"
                          h="full"
                          objectFit="cover"
                        />
                      ) : (
                        <Stack align="center" justify="center" w="full" h="full">
                          <Icon icon={Package} size={32} color="secondary" />
                        </Stack>
                      )}
                    </Box>
                    <Button
                      variant="ghost"
                      label={image ? pf.changeImage : pf.addImage}
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                    />
                  </Stack>

                  <Grid cols={2} gap={5}>
                    <Input
                      label={pf.nameLabel}
                      placeholder={pf.namePlaceholder}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />

                    <Stack gap={1}>
                      <Font variant="body-sm-semibold" text={pf.unitLabel} />
                      <CustomSelect value={unit} onChange={(val) => setUnit(val)}>
                        {dbUnits && dbUnits.length > 0
                          ? dbUnits.map(u => (
                              <CustomSelectItem key={u.id} value={u.name} text={u.name} icon={Package} />
                            ))
                          : [
                              <CustomSelectItem key="__empty__" value="" text={pf.noUnitsRegistered} icon={Package} />
                            ]}
                      </CustomSelect>
                    </Stack>

                    <Stack gap={1}>
                      <Font variant="body-sm-semibold" text={pf.groupLabel} />
                      <CustomSelect value={category} onChange={(val) => { setCategory(val); setSubgroup("") }}>
                        {dbCategories && dbCategories.length > 0
                          ? dbCategories.map(c => (
                              <CustomSelectItem key={c.id} value={c.name} text={c.name} icon={Layers} />
                            ))
                          : [
                              <CustomSelectItem key="__empty__" value="" text={pf.noGroupsRegistered} icon={Layers} />
                            ]}
                      </CustomSelect>
                    </Stack>

                    <Stack gap={1}>
                      <Font variant="body-sm-semibold" text={pf.subgroupLabel} />
                      <CustomSelect value={subgroup} onChange={(val) => setSubgroup(val)}>
                        {subgroupItems.length > 0
                          ? subgroupItems.map(s => (
                              <CustomSelectItem key={s} value={s} text={s} icon={Layers} />
                            ))
                          : [<CustomSelectItem key="__empty__" value="" text={pf.noSubgroupsRegistered} icon={Layers} />]}
                      </CustomSelect>
                    </Stack>
                  </Grid>

                  <Input
                    label={pf.detailedDescriptionLabel}
                    placeholder={pf.detailedDescriptionPlaceholder}
                    value={detailedDescription}
                    onChange={(e) => setDetailedDescription(e.target.value)}
                  />
                </Stack>
              </Box>

              {/* Valores e Estoque */}
              <Box padding={5} bg="bg-surface" radius="default" border={true} borderColor="border-border">
                <Stack gap={2.5} w="full">
                  <Font variant="body-semibold" text={pf.valuesAndStockTitle} />
                  <Grid cols={3} gap={5}>
                    <Input
                      label={pf.stockLabel}
                      variant="outlined-label"
                      placeholder={pf.zeroPlaceholder}
                      value={stock}
                      onChange={(e) => setStock(maskNumberInput(e.target.value))}
                      required
                    />
                    <Input
                      label={pf.minStockLabel}
                      variant="outlined-label"
                      placeholder={pf.zeroPlaceholder}
                      value={minStock}
                      onChange={(e) => setMinStock(maskNumberInput(e.target.value))}
                    />
                    <Input
                      label={pf.costPriceLabel}
                      variant="outlined-label"
                      placeholder={pf.zeroDecimalPlaceholder}
                      value={costPrice}
                      onChange={(e) => handleCostPriceChange(e.target.value)}
                    />
                    <Input
                      label={pf.otherCostsLabel}
                      variant="outlined-label"
                      placeholder={pf.zeroDecimalPlaceholder}
                      value={otherCosts}
                      onChange={(e) => handleOtherCostsChange(e.target.value)}
                    />
                    <Input
                      label={pf.marginLabel}
                      variant="outlined-label"
                      placeholder={pf.zeroDecimalPlaceholder}
                      value={margin}
                      onChange={(e) => handleMarginChange(e.target.value)}
                    />
                    <Input
                      label={pf.salePriceLabel}
                      variant="outlined-label"
                      placeholder={pf.zeroDecimalPlaceholder}
                      value={price}
                      onChange={(e) => handlePriceChange(e.target.value)}
                      required
                    />
                  </Grid>
                </Stack>
              </Box>
            </Stack>
          </TabsContent>

          {/* ABA RECURSOS AVANÇADOS */}
          <TabsContent value="avancado">
            <Stack gap={2.5} w="full">
              {/* ACCORDION: Multissabor */}
              <Stack gap={1} w="full">
                <Box
                  padding={2.5}
                  bg="bg-surface"
                  border={true}
                  borderColor="border-border"
                  radius="default"
                  w="full"
                  cursor="pointer"
                  onClick={() => setIsMultissaborOpen(!isMultissaborOpen)}
                >
                  <Stack direction="row" align="center" justify="between" w="full">
                    <Stack direction="row" align="center" gap={2.5}>
                      <Icon icon={Layers} size={18} color="secondary" />
                      <Font variant="body-semibold" text={pf.multissaborTitle} />
                    </Stack>
                    <Icon icon={isMultissaborOpen ? ChevronUp : ChevronDown} size={18} color="muted" />
                  </Stack>
                </Box>
                <Box
                  transition="all"
                  overflow="hidden"
                  maxH={isMultissaborOpen ? "2000px" : "0"}
                  opacity={isMultissaborOpen ? "100" : "0"}
                  w="full"
                >
                  <Box padding={5} bg="bg-surface" border={true} borderColor="border-border" radius="default" w="full">
                    <Stack gap={5} w="full">
                      <Stack direction="col" mobileDirection="row" gap={5} align="start" mobileAlign="center" justify="start" mobileJustify="between" w="full">
                        <Stack gap={1} order="2" mdOrder="1">
                          <Font variant="body-semibold" text={pf.enableMultissaborTitle} align="left" />
                          <Font variant="description" text={pf.enableMultissaborDesc} align="left" />
                        </Stack>
                        <Box order="1" mdOrder="2">
                          <Switch checked={multissaborEnabled} onChange={(e) => setMultissaborEnabled(e.target.checked)} />
                        </Box>
                      </Stack>
                      {multissaborEnabled && (
                        <Grid cols={2} gap={5}>
                          <Input
                            label={pf.multissaborLimitLabel}
                            placeholder="2"
                            value={multissaborLimit}
                            onChange={(e) => setMultissaborLimit(e.target.value)}
                          />
                          <Stack gap={1}>
                            <Font variant="body-sm-semibold" text={pf.pricingModeLabel} />
                            <CustomSelect value={multissaborPricingMode} onChange={(val) => setMultissaborPricingMode(val as "proporcional" | "maior")}>
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

              {/* ACCORDION: Complementos */}
              <Stack gap={1} w="full">
                <Box
                  padding={2.5}
                  bg="bg-surface"
                  border={true}
                  borderColor="border-border"
                  radius="default"
                  w="full"
                  cursor="pointer"
                  onClick={() => setIsComplementosOpen(!isComplementosOpen)}
                >
                  <Stack direction="row" align="center" justify="between" w="full">
                    <Stack direction="row" align="center" gap={2.5}>
                      <Icon icon={PlusCircle} size={18} color="secondary" />
                      <Font variant="body-semibold" text={pf.subgroupComplementsTitle} />
                    </Stack>
                    <Icon icon={isComplementosOpen ? ChevronUp : ChevronDown} size={18} color="muted" />
                  </Stack>
                </Box>
                <Box
                  transition="all"
                  overflow="hidden"
                  maxH={isComplementosOpen ? "2000px" : "0"}
                  opacity={isComplementosOpen ? "100" : "0"}
                  w="full"
                >
                  <Box padding={5} bg="bg-surface" border={true} borderColor="border-border" radius="default" w="full">
                    <Stack gap={5} w="full">
                      <Stack direction="col" mobileDirection="row" gap={5} align="start" mobileAlign="center" justify="start" mobileJustify="between" w="full">
                        <Stack gap={1} order="2" mdOrder="1">
                          <Font variant="body-semibold" text={pf.linkComplementsTitle} align="left" />
                          <Font variant="description" text={pf.linkComplementsDesc} align="left" />
                        </Stack>
                        <Box order="1" mdOrder="2">
                          <Switch checked={complementosEnabled} onChange={(e) => setComplementosEnabled(e.target.checked)} />
                        </Box>
                      </Stack>
                    </Stack>
                  </Box>
                </Box>
              </Stack>

              {/* ACCORDION: Plataformas de Venda */}
              <Stack gap={1} w="full">
                <Box
                  padding={2.5}
                  bg="bg-surface"
                  border={true}
                  borderColor="border-border"
                  radius="default"
                  w="full"
                  cursor="pointer"
                  onClick={() => setIsPlataformasOpen(!isPlataformasOpen)}
                >
                  <Stack direction="row" align="center" justify="between" w="full">
                    <Stack direction="row" align="center" gap={2.5}>
                      <Icon icon={Globe} size={18} color="secondary" />
                      <Font variant="body-semibold" text={pf.salesPlatformsTitle} />
                    </Stack>
                    <Icon icon={isPlataformasOpen ? ChevronUp : ChevronDown} size={18} color="muted" />
                  </Stack>
                </Box>
                <Box
                  transition="all"
                  overflow="hidden"
                  maxH={isPlataformasOpen ? "2000px" : "0"}
                  opacity={isPlataformasOpen ? "100" : "0"}
                  w="full"
                >
                  <Box padding={5} bg="bg-surface" border={true} borderColor="border-border" radius="default" w="full">
                    <Stack gap={5} w="full">
                      <Stack direction="col" mobileDirection="row" gap={5} align="start" mobileAlign="center" justify="start" mobileJustify="between" w="full">
                        <Stack gap={1} order="2" mdOrder="1">
                          <Font variant="body-semibold" text={pf.showInOnlineCatalogTitle} align="left" />
                          <Font variant="description" text={pf.showInOnlineCatalogDesc} align="left" />
                        </Stack>
                        <Box order="1" mdOrder="2">
                          <Switch checked={plataformasEnabled} onChange={(e) => setPlataformasEnabled(e.target.checked)} />
                        </Box>
                      </Stack>
                      {plataformasEnabled && (
                        <Box w="full">
                          <Input
                            label={pf.catalogPriceLabel}
                            placeholder={pf.zeroDecimalPlaceholder}
                            value={plataformasPriceDifferent}
                            onChange={(e) => setPlataformasPriceDifferent(e.target.value)}
                          />
                        </Box>
                      )}
                    </Stack>
                  </Box>
                </Box>
              </Stack>

              {/* ACCORDION: Códigos de barras */}
              <Stack gap={1} w="full">
                <Box
                  padding={2.5}
                  bg="bg-surface"
                  border={true}
                  borderColor="border-border"
                  radius="default"
                  w="full"
                  cursor="pointer"
                  onClick={() => setIsBarcodesOpen(!isBarcodesOpen)}
                >
                  <Stack direction="row" align="center" justify="between" w="full">
                    <Stack direction="row" align="center" gap={2.5}>
                      <Icon icon={Barcode} size={18} color="secondary" />
                      <Font variant="body-semibold" text={pf.barcodesTitle} />
                    </Stack>
                    <Icon icon={isBarcodesOpen ? ChevronUp : ChevronDown} size={18} color="muted" />
                  </Stack>
                </Box>
                <Box
                  transition="all"
                  overflow="hidden"
                  maxH={isBarcodesOpen ? "2000px" : "0"}
                  opacity={isBarcodesOpen ? "100" : "0"}
                  w="full"
                >
                  <Box padding={5} bg="bg-surface" border={true} borderColor="border-border" radius="default" w="full">
                    <Stack gap={5} w="full">
                      <Stack direction="col" mobileDirection="row" gap={2.5} align="stretch" mobileAlign="end" w="full">
                        <Box flex="1" w="full">
                          <Input
                            label={pf.addBarcodeLabel}
                            placeholder={pf.barcodePlaceholder}
                            value={newBarcode}
                            onChange={(e) => setNewBarcode(e.target.value)}
                          />
                        </Box>
                        <Button
                          variant="primary"
                          label={UI_STRINGS.common.save}
                          icon={Plus}
                          onClick={handleAddBarcode}
                          type="button"
                        />
                      </Stack>
                      {barcodes.length > 0 && (
                        <Stack gap={2.5} w="full">
                          <Font variant="sub-tiny" text={pf.registeredBarcodesTitle} />
                          <Grid cols={2} gap={2.5}>
                            {barcodes.map((code, idx) => (
                              <Box key={idx} padding={2.5} bg="bg-slate-100" radius="default" border={true} borderColor="border-border">
                                <Stack direction="row" align="center" justify="between" w="full">
                                  <Font variant="body" text={code} />
                                  <Button
                                    variant="danger-icon-xs"
                                    icon={Trash2}
                                    onClick={() => handleRemoveBarcode(idx)}
                                    type="button"
                                  />
                                </Stack>
                              </Box>
                            ))}
                          </Grid>
                        </Stack>
                      )}
                    </Stack>
                  </Box>
                </Box>
              </Stack>

              {/* ACCORDION: Ponto de impressão */}
              <Stack gap={1} w="full">
                <Box
                  padding={2.5}
                  bg="bg-surface"
                  border={true}
                  borderColor="border-border"
                  radius="default"
                  w="full"
                  cursor="pointer"
                  onClick={() => setIsPrintPointOpen(!isPrintPointOpen)}
                >
                  <Stack direction="row" align="center" justify="between" w="full">
                    <Stack direction="row" align="center" gap={2.5}>
                      <Icon icon={Printer} size={18} color="secondary" />
                      <Font variant="body-semibold" text={pf.printPointTitle} />
                    </Stack>
                    <Icon icon={isPrintPointOpen ? ChevronUp : ChevronDown} size={18} color="muted" />
                  </Stack>
                </Box>
                <Box
                  transition="all"
                  overflow="hidden"
                  maxH={isPrintPointOpen ? "2000px" : "0"}
                  opacity={isPrintPointOpen ? "100" : "0"}
                  w="full"
                >
                  <Box padding={5} bg="bg-surface" border={true} borderColor="border-border" radius="default" w="full">
                    <Stack gap={1} w="full">
                      <Font variant="body-sm-semibold" text={pf.printDestinationLabel} />
                      <CustomSelect value={printPoint} onChange={setPrintPoint}>
                        {[
                          <CustomSelectItem key="__none__" value="" text={pf.noPrintOption} icon={Printer} />,
                          ...(dbPrintPoints ?? []).map(p => (
                            <CustomSelectItem key={p.id} value={p.name} text={p.name} icon={Printer} />
                          ))
                        ]}
                      </CustomSelect>
                    </Stack>
                  </Box>
                </Box>
              </Stack>

              {/* ACCORDION: Produção */}
              <Stack gap={1} w="full">
                <Box
                  padding={2.5}
                  bg="bg-surface"
                  border={true}
                  borderColor="border-border"
                  radius="default"
                  w="full"
                  cursor="pointer"
                  onClick={() => setIsProducaoOpen(!isProducaoOpen)}
                >
                  <Stack direction="row" align="center" justify="between" w="full">
                    <Stack direction="row" align="center" gap={2.5}>
                      <Icon icon={FileText} size={18} color="secondary" />
                      <Font variant="body-semibold" text={pf.productionTitle} />
                    </Stack>
                    <Icon icon={isProducaoOpen ? ChevronUp : ChevronDown} size={18} color="muted" />
                  </Stack>
                </Box>
                <Box
                  transition="all"
                  overflow="hidden"
                  maxH={isProducaoOpen ? "2000px" : "0"}
                  opacity={isProducaoOpen ? "100" : "0"}
                  w="full"
                >
                  <Box padding={5} bg="bg-surface" border={true} borderColor="border-border" radius="default" w="full">
                    <Stack gap={5} w="full">
                      <Stack direction="col" mobileDirection="row" gap={5} align="start" mobileAlign="center" justify="start" mobileJustify="between" w="full">
                        <Stack gap={1} order="2" mdOrder="1">
                          <Font variant="body-semibold" text={pf.inHouseProductionTitle} align="left" />
                          <Font variant="description" text={pf.inHouseProductionDesc} align="left" />
                        </Stack>
                        <Box order="1" mdOrder="2">
                          <Switch checked={producaoPropria} onChange={(e) => setProducaoPropria(e.target.checked)} />
                        </Box>
                      </Stack>
                      {producaoPropria && (
                        <Stack gap={5} w="full">
                          <Input
                            label={pf.ingredientsLabel}
                            placeholder={pf.ingredientsPlaceholder}
                            value={ingredients}
                            onChange={(e) => setIngredients(e.target.value)}
                          />
                          <Input
                            label={pf.preparationModeLabel}
                            placeholder={pf.preparationModePlaceholder}
                            value={preparationMode}
                            onChange={(e) => setPreparationMode(e.target.value)}
                          />
                        </Stack>
                      )}
                    </Stack>
                  </Box>
                </Box>
              </Stack>

              {/* ACCORDION: Fiscal */}
              <Stack gap={1} w="full">
                <Box
                  padding={2.5}
                  bg="bg-surface"
                  border={true}
                  borderColor="border-border"
                  radius="default"
                  w="full"
                  cursor="pointer"
                  onClick={() => setIsFiscalOpen(!isFiscalOpen)}
                >
                  <Stack direction="row" align="center" justify="between" w="full">
                    <Stack direction="row" align="center" gap={2.5}>
                      <Icon icon={FileSpreadsheet} size={18} color="secondary" />
                      <Font variant="body-semibold" text={pf.fiscalTitle} />
                    </Stack>
                    <Icon icon={isFiscalOpen ? ChevronUp : ChevronDown} size={18} color="muted" />
                  </Stack>
                </Box>
                <Box
                  transition="all"
                  overflow="hidden"
                  maxH={isFiscalOpen ? "2000px" : "0"}
                  opacity={isFiscalOpen ? "100" : "0"}
                  w="full"
                >
                  <Box padding={5} bg="bg-surface" border={true} borderColor="border-border" radius="default" w="full">
                    <Stack gap={5} w="full">
                      <Grid cols={2} gap={5}>
                        <Input
                          label={pf.ncmLabel}
                          placeholder={pf.ncmPlaceholder}
                          value={ncm}
                          onChange={(e) => setNcm(e.target.value)}
                        />
                        <Input
                          label={pf.exTipiLabel}
                          placeholder={pf.exTipiPlaceholder}
                          value={exTipi}
                          onChange={(e) => setExTipi(e.target.value)}
                        />
                        <Input
                          label={pf.cestLabel}
                          placeholder={pf.cestPlaceholder}
                          value={cest}
                          onChange={(e) => setCest(e.target.value)}
                        />
                        <Stack gap={1}>
                          <Font variant="body-sm-semibold" text={pf.originLabel} />
                          <CustomSelect value={icmsOrigem} onChange={setIcmsOrigem}>
                            <CustomSelectItem value="0 - Nacional" text={pf.originNational} icon={Globe} />
                            <CustomSelectItem value="1 - Estrangeira Importada" text={pf.originImported} icon={Globe} />
                          </CustomSelect>
                        </Stack>
                      </Grid>

                      <Box h="h-[1px]" bg="bg-border" w="full" />

                      {/* Configurações de ICMS */}
                      <Stack gap={5} w="full">
                        <Stack direction="col" mobileDirection="row" gap={5} align="start" mobileAlign="center" justify="start" mobileJustify="between" w="full">
                          <Stack gap={1} order="2" mdOrder="1">
                            <Font variant="body-semibold" text={pf.useDefaultIcmsTitle} align="left" />
                            <Font variant="description" text={pf.useDefaultIcmsDesc} align="left" />
                          </Stack>
                          <Box order="1" mdOrder="2">
                            <Switch checked={icmsDefault} onChange={(e) => setIcmsDefault(e.target.checked)} />
                          </Box>
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
                            <Input
                              label={pf.reductionBaseShortLabel}
                              placeholder={pf.zeroDecimalPlaceholder}
                              value={icmsReduction}
                              onChange={(e) => setIcmsReduction(e.target.value)}
                            />
                            <Input
                              label={pf.aliquotEffectiveLabel}
                              placeholder={pf.zeroDecimalPlaceholder}
                              value={icmsAliquot}
                              onChange={(e) => setIcmsAliquot(e.target.value)}
                            />
                          </Grid>
                        )}
                      </Stack>

                      <Box h="h-[1px]" bg="bg-border" w="full" />

                      {/* Configurações de PIS/COFINS */}
                      <Stack gap={5} w="full">
                        <Stack direction="col" mobileDirection="row" gap={5} align="start" mobileAlign="center" justify="start" mobileJustify="between" w="full">
                          <Stack gap={1} order="2" mdOrder="1">
                            <Font variant="body-semibold" text={pf.useDefaultPisCofinsTitle} align="left" />
                            <Font variant="description" text={pf.useDefaultPisCofinsDesc} align="left" />
                          </Stack>
                          <Box order="1" mdOrder="2">
                            <Switch checked={pisCofinsDefault} onChange={(e) => setPisCofinsDefault(e.target.checked)} />
                          </Box>
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

                      {/* Link Fiscal Padrão */}
                      {onAccessFiscalConfig && (
                        <Box w="full" display="flex" justify="end">
                          <Button
                            variant="ghost-secondary"
                            label={pf.accessFiscalConfigButton}
                            onClick={onAccessFiscalConfig}
                            type="button"
                          />
                        </Box>
                      )}
                    </Stack>
                  </Box>
                </Box>
              </Stack>
            </Stack>
          </TabsContent>
        </Tabs>
      </Stack>
    </Box>
  )
}
