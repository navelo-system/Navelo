"use client"

/* eslint-disable max-lines-per-function, complexity */

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Grid } from "@/components/store/base/Grid"
import { Font } from "@/components/store/base/Font"
import { Icon } from "@/components/store/base/Icon"
import { Input } from "@/components/store/base/Input"
import { Button } from "@/components/store/base/Button"
import { FormActions } from "@/components/store/intermediary/FormActions"
import { Switch } from "@/components/store/base/Switch"
import { CustomSelect, CustomSelectItem } from "@/components/store/base/CustomSelect"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/store/base/Tabs"
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

export const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
  onCancel,
  onSave,
  onAccessFiscalConfig,
}) => {
  // Accordion state
  const [isMultissaborOpen, setIsMultissaborOpen] = React.useState(false)
  const [isComplementosOpen, setIsComplementosOpen] = React.useState(false)
  const [isPlataformasOpen, setIsPlataformasOpen] = React.useState(false)
  const [isBarcodesOpen, setIsBarcodesOpen] = React.useState(false)
  const [isPrintPointOpen, setIsPrintPointOpen] = React.useState(false)
  const [isProducaoOpen, setIsProducaoOpen] = React.useState(false)
  const [isFiscalOpen, setIsFiscalOpen] = React.useState(false)

  // Form states
  const [name, setName] = React.useState("")
  const [category, setCategory] = React.useState("Bebidas")
  const [price, setPrice] = React.useState("")
  const [stock, setStock] = React.useState("")
  const [unit, setUnit] = React.useState("UN")
  const [ncm, setNcm] = React.useState("")
  const [cest, setCest] = React.useState("")
  const [cfop, setCfop] = React.useState("5.102")
  const [icmsOrigem, setIcmsOrigem] = React.useState("0 - Nacional")

  const [detailedDescription, setDetailedDescription] = React.useState("")
  const [subgroup, setSubgroup] = React.useState("UNICO")
  const [minStock, setMinStock] = React.useState("")
  const [costPrice, setCostPrice] = React.useState("")
  const [otherCosts, setOtherCosts] = React.useState("")
  const [margin, setMargin] = React.useState("")

  const [multissaborEnabled, setMultissaborEnabled] = React.useState(false)
  const [multissaborLimit, setMultissaborLimit] = React.useState("2")
  const [multissaborPricingMode, setMultissaborPricingMode] = React.useState<"proporcional" | "maior">("proporcional")

  const [complementosEnabled, setComplementosEnabled] = React.useState(false)

  const [plataformasEnabled, setPlataformasEnabled] = React.useState(false)
  const [plataformasPriceDifferent, setPlataformasPriceDifferent] = React.useState("")

  const [barcodes, setBarcodes] = React.useState<string[]>([])
  const [newBarcode, setNewBarcode] = React.useState("")

  const [printPoint, setPrintPoint] = React.useState("Sem Impressão")

  const [producaoPropria, setProducaoPropria] = React.useState(false)
  const [ingredients, setIngredients] = React.useState("")
  const [preparationMode, setPreparationMode] = React.useState("")

  const [exTipi, setExTipi] = React.useState("")
  const [icmsDefault, setIcmsDefault] = React.useState(true)
  const [icmsCsosn, setIcmsCsosn] = React.useState("500")
  const [icmsReduction, setIcmsReduction] = React.useState("")
  const [icmsAliquot, setIcmsAliquot] = React.useState("")
  const [pisCofinsDefault, setPisCofinsDefault] = React.useState(true)
  const [pisCofinsCst, setPisCofinsCst] = React.useState("99")

  const [prevInitialData, setPrevInitialData] = React.useState(initialData)

  if (initialData !== prevInitialData) {
    setPrevInitialData(initialData)
    if (initialData) {
      setName(initialData.name || "")
      setCategory(initialData.category || "Bebidas")
      setPrice(initialData.unitPrice?.toString() || "")
      setStock(initialData.stock?.toString() || "")
      setUnit(initialData.unit || "UN")
      setNcm(initialData.ncm || "")
      setCest(initialData.cest || "")
      setCfop(initialData.cfop || "5.102")
      setIcmsOrigem(initialData.icmsOrigem || "0 - Nacional")

      setDetailedDescription(initialData.detailedDescription || "")
      setSubgroup(initialData.subgroup || "UNICO")
      setMinStock(initialData.minStock?.toString() || "")
      setCostPrice(initialData.costPrice?.toString() || "")
      setOtherCosts(initialData.otherCosts?.toString() || "")
      setMargin(initialData.margin?.toString() || "")

      setMultissaborEnabled(!!initialData.multissaborEnabled)
      setMultissaborLimit(initialData.multissaborLimit?.toString() || "2")
      setMultissaborPricingMode(initialData.multissaborPricingMode || "proporcional")

      setComplementosEnabled(!!initialData.complementosEnabled)

      setPlataformasEnabled(!!initialData.plataformasEnabled)
      setPlataformasPriceDifferent(initialData.plataformasPriceDifferent?.toString() || "")

      setBarcodes(initialData.barcodes || [])

      setPrintPoint(initialData.printPoint || "Sem Impressão")

      setProducaoPropria(!!initialData.producaoPropria)
      setIngredients(initialData.ingredients || "")
      setPreparationMode(initialData.preparationMode || "")

      setExTipi(initialData.exTipi || "")
      setIcmsDefault(initialData.icmsDefault !== false)
      setIcmsCsosn(initialData.icmsCsosn || "500")
      setIcmsReduction(initialData.icmsReduction?.toString() || "")
      setIcmsAliquot(initialData.icmsAliquot?.toString() || "")
      setPisCofinsDefault(initialData.pisCofinsDefault !== false)
      setPisCofinsCst(initialData.pisCofinsCst || "99")
    } else {
      setName("")
      setCategory("Bebidas")
      setPrice("")
      setStock("")
      setUnit("UN")
      setNcm("")
      setCest("")
      setCfop("5.102")
      setIcmsOrigem("0 - Nacional")

      setDetailedDescription("")
      setSubgroup("UNICO")
      setMinStock("")
      setCostPrice("")
      setOtherCosts("")
      setMargin("")

      setMultissaborEnabled(false)
      setMultissaborLimit("2")
      setMultissaborPricingMode("proporcional")

      setComplementosEnabled(false)

      setPlataformasEnabled(false)
      setPlataformasPriceDifferent("")

      setBarcodes([])

      setPrintPoint("Sem Impressão")

      setProducaoPropria(false)
      setIngredients("")
      setPreparationMode("")

      setExTipi("")
      setIcmsDefault(true)
      setIcmsCsosn("500")
      setIcmsReduction("")
      setIcmsAliquot("")
      setPisCofinsDefault(true)
      setPisCofinsCst("99")
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
      unitPrice: parseFloat(price.replace(",", ".")) || 0,
      stock: parseInt(stock) || 0,
      unit,
      ncm,
      cest,
      cfop,
      icmsOrigem,

      detailedDescription,
      subgroup,
      minStock: parseInt(minStock) || 0,
      costPrice: parseFloat(costPrice) || 0,
      otherCosts: parseFloat(otherCosts) || 0,
      margin: parseFloat(margin) || 0,

      multissaborEnabled,
      multissaborLimit: parseInt(multissaborLimit) || 2,
      multissaborPricingMode,

      complementosEnabled,

      plataformasEnabled,
      plataformasPriceDifferent: parseFloat(plataformasPriceDifferent) || 0,

      barcodes,
      printPoint,

      producaoPropria,
      ingredients,
      preparationMode,

      exTipi,
      icmsDefault,
      icmsCsosn,
      icmsReduction: parseFloat(icmsReduction) || 0,
      icmsAliquot: parseFloat(icmsAliquot) || 0,
      pisCofinsDefault,
      pisCofinsCst,
    })
  }

  return (
    <Box as="form" onSubmit={handleSubmit} w="full">
      <Stack gap={5} w="full">
        <Tabs defaultValue="basico">
          <TabsList className="flex-col md:flex-row gap-2.5 w-full md:w-auto">
            <TabsTrigger value="basico" className="w-full md:w-auto">
              Dados Básicos
            </TabsTrigger>
            <TabsTrigger value="avancado" className="w-full md:w-auto">
              Recursos Avançados
            </TabsTrigger>
          </TabsList>

          {/* ABA DADOS BÁSICOS */}
          <TabsContent value="basico">
            <Stack gap={5} w="full">
              {/* Foto + Campos Básicos */}
              <Box padding={5} bg="bg-surface" radius="default" border={true} borderColor="border-border">
                <Stack gap={5} w="full">
                  {/* Visual Preview da Foto */}
                  <Stack align="center" gap={2.5} w="full">
                    <Box
                      w="w-24"
                      h="h-24"
                      radius="full"
                      border={true}
                      borderColor="border-brand-secondary"
                      bg="bg-slate-100"
                      overflow="hidden"
                    >
                      <Stack align="center" justify="center" w="full" h="full">
                        <Icon icon={Package} size={32} color="secondary" />
                      </Stack>
                    </Box>
                    <Button variant="ghost" label="Adicionar Imagem" type="button" />
                  </Stack>

                  <Grid cols={2} gap={5}>
                    <Input
                      label="Descrição (Nome do Produto) *"
                      placeholder="Ex: COCA-COLA LATA 350ML"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />

                    <Stack gap={1}>
                      <Font variant="body-sm-semibold" text="Unidade *" />
                      <CustomSelect value={unit} onChange={(val) => setUnit(val)}>
                        <CustomSelectItem value="UN" text="UN - Unidade" icon={Package} />
                        <CustomSelectItem value="KG" text="KG - Quilograma" icon={Package} />
                        <CustomSelectItem value="LT" text="LT - Litro" icon={Package} />
                      </CustomSelect>
                    </Stack>

                    <Stack gap={1}>
                      <Font variant="body-sm-semibold" text="Grupo *" />
                      <CustomSelect value={category} onChange={(val) => setCategory(val)}>
                        <CustomSelectItem value="Bebidas" text="Bebidas" icon={Layers} />
                        <CustomSelectItem value="Lanches" text="Lanches" icon={Layers} />
                        <CustomSelectItem value="Acompanhamentos" text="Acompanhamentos" icon={Layers} />
                      </CustomSelect>
                    </Stack>

                    <Stack gap={1}>
                      <Font variant="body-sm-semibold" text="Subgrupo *" />
                      <CustomSelect value={subgroup} onChange={(val) => setSubgroup(val)}>
                        <CustomSelectItem value="UNICO" text="Único" icon={Layers} />
                        <CustomSelectItem value="PADRAO" text="Padrão" icon={Layers} />
                      </CustomSelect>
                    </Stack>
                  </Grid>

                  <Input
                    label="Descrição Detalhada para Catálogo"
                    placeholder="Ex: Bebida refrescante gaseificada, lata 350ml..."
                    value={detailedDescription}
                    onChange={(e) => setDetailedDescription(e.target.value)}
                  />
                </Stack>
              </Box>

              {/* Valores e Estoque */}
              <Box padding={5} bg="bg-surface" radius="default" border={true} borderColor="border-border">
                <Stack gap={2.5} w="full">
                  <Font variant="body-semibold" text="Valores e Estoque" />
                  <Grid cols={3} gap={5}>
                    <Input
                      label="Estoque *"
                      placeholder="0"
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                      required
                    />
                    <Input
                      label="Estoque Mínimo"
                      placeholder="0"
                      value={minStock}
                      onChange={(e) => setMinStock(e.target.value)}
                    />
                    <Input
                      label="Preço de Custo (R$)"
                      placeholder="0,00"
                      value={costPrice}
                      onChange={(e) => setCostPrice(e.target.value)}
                    />
                    <Input
                      label="Outros Custos (%)"
                      placeholder="0,00"
                      value={otherCosts}
                      onChange={(e) => setOtherCosts(e.target.value)}
                    />
                    <Input
                      label="Margem (%)"
                      placeholder="0,00"
                      value={margin}
                      onChange={(e) => setMargin(e.target.value)}
                    />
                    <Input
                      label="Preço de Venda (R$) *"
                      placeholder="0,00"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
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
                      <Font variant="body-semibold" text="Multissabor" />
                    </Stack>
                    <Icon icon={isMultissaborOpen ? ChevronUp : ChevronDown} size={18} color="muted" />
                  </Stack>
                </Box>
                {isMultissaborOpen && (
                  <Box padding={5} bg="bg-surface" border={true} borderColor="border-border" radius="default" w="full">
                    <Stack gap={5} w="full">
                      <Stack direction="col" mobileDirection="row" gap={5} align="start" mobileAlign="center" justify="start" mobileJustify="between" w="full">
                        <Stack gap={1} order="2" mdOrder="1">
                          <Font variant="body-semibold" text="Habilitar Multissabor" align="left" />
                          <Font variant="description" text="Permite que o produto seja fracionado em diferentes sabores" align="left" />
                        </Stack>
                        <Box order="1" mdOrder="2">
                          <Switch checked={multissaborEnabled} onChange={(e) => setMultissaborEnabled(e.target.checked)} />
                        </Box>
                      </Stack>
                      {multissaborEnabled && (
                        <Grid cols={2} gap={5}>
                          <Input
                            label="Limite Máximo de Sabores"
                            placeholder="2"
                            value={multissaborLimit}
                            onChange={(e) => setMultissaborLimit(e.target.value)}
                          />
                          <Stack gap={1}>
                            <Font variant="body-sm-semibold" text="Cobrança da Precificação" />
                            <CustomSelect value={multissaborPricingMode} onChange={(val) => setMultissaborPricingMode(val as "proporcional" | "maior")}>
                              <CustomSelectItem value="proporcional" text="Proporcional (Média)" icon={Layers} />
                              <CustomSelectItem value="maior" text="Pelo Maior Preço" icon={Layers} />
                            </CustomSelect>
                          </Stack>
                        </Grid>
                      )}
                    </Stack>
                  </Box>
                )}
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
                      <Font variant="body-semibold" text="Complementos do subgrupo" />
                    </Stack>
                    <Icon icon={isComplementosOpen ? ChevronUp : ChevronDown} size={18} color="muted" />
                  </Stack>
                </Box>
                {isComplementosOpen && (
                  <Box padding={5} bg="bg-surface" border={true} borderColor="border-border" radius="default" w="full">
                    <Stack gap={5} w="full">
                      <Stack direction="col" mobileDirection="row" gap={5} align="start" mobileAlign="center" justify="start" mobileJustify="between" w="full">
                        <Stack gap={1} order="2" mdOrder="1">
                          <Font variant="body-semibold" text="Vincular Complementos" align="left" />
                          <Font variant="description" text="Vincular opcionais e acompanhamentos cadastrados no subgrupo" align="left" />
                        </Stack>
                        <Box order="1" mdOrder="2">
                          <Switch checked={complementosEnabled} onChange={(e) => setComplementosEnabled(e.target.checked)} />
                        </Box>
                      </Stack>
                    </Stack>
                  </Box>
                )}
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
                      <Font variant="body-semibold" text="Plataformas de venda" />
                    </Stack>
                    <Icon icon={isPlataformasOpen ? ChevronUp : ChevronDown} size={18} color="muted" />
                  </Stack>
                </Box>
                {isPlataformasOpen && (
                  <Box padding={5} bg="bg-surface" border={true} borderColor="border-border" radius="default" w="full">
                    <Stack gap={5} w="full">
                      <Stack direction="col" mobileDirection="row" gap={5} align="start" mobileAlign="center" justify="start" mobileJustify="between" w="full">
                        <Stack gap={1} order="2" mdOrder="1">
                          <Font variant="body-semibold" text="Exibir no Catálogo Online" align="left" />
                          <Font variant="description" text="Habilita a exibição do produto em vendas digitais" align="left" />
                        </Stack>
                        <Box order="1" mdOrder="2">
                          <Switch checked={plataformasEnabled} onChange={(e) => setPlataformasEnabled(e.target.checked)} />
                        </Box>
                      </Stack>
                      {plataformasEnabled && (
                        <Box w="full">
                          <Input
                            label="Preço Diferente para Catálogo (R$)"
                            placeholder="0,00"
                            value={plataformasPriceDifferent}
                            onChange={(e) => setPlataformasPriceDifferent(e.target.value)}
                          />
                        </Box>
                      )}
                    </Stack>
                  </Box>
                )}
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
                      <Font variant="body-semibold" text="Códigos de barras" />
                    </Stack>
                    <Icon icon={isBarcodesOpen ? ChevronUp : ChevronDown} size={18} color="muted" />
                  </Stack>
                </Box>
                {isBarcodesOpen && (
                  <Box padding={5} bg="bg-surface" border={true} borderColor="border-border" radius="default" w="full">
                    <Stack gap={5} w="full">
                      <Stack direction="col" mobileDirection="row" gap={2.5} align="stretch" mobileAlign="end" w="full">
                        <Box flex="1" w="full">
                          <Input
                            label="Adicionar Novo EAN / GTIN"
                            placeholder="Ex: 7891234567890"
                            value={newBarcode}
                            onChange={(e) => setNewBarcode(e.target.value)}
                          />
                        </Box>
                        <Button
                          variant="primary"
                          label="Adicionar"
                          icon={Plus}
                          onClick={handleAddBarcode}
                          type="button"
                        />
                      </Stack>
                      {barcodes.length > 0 && (
                        <Stack gap={2.5} w="full">
                          <Font variant="sub-tiny" text="Códigos Cadastrados" />
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
                )}
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
                      <Font variant="body-semibold" text="Ponto de impressão" />
                    </Stack>
                    <Icon icon={isPrintPointOpen ? ChevronUp : ChevronDown} size={18} color="muted" />
                  </Stack>
                </Box>
                {isPrintPointOpen && (
                  <Box padding={5} bg="bg-surface" border={true} borderColor="border-border" radius="default" w="full">
                    <Stack gap={1} w="full">
                      <Font variant="body-sm-semibold" text="Destino de Impressão" />
                      <CustomSelect value={printPoint} onChange={setPrintPoint}>
                        <CustomSelectItem value="Sem Impressão" text="Sem Impressão" icon={Printer} />
                        <CustomSelectItem value="Cozinha" text="Cozinha" icon={Printer} />
                        <CustomSelectItem value="Copa" text="Copa" icon={Printer} />
                        <CustomSelectItem value="Caixa" text="Caixa" icon={Printer} />
                      </CustomSelect>
                    </Stack>
                  </Box>
                )}
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
                      <Font variant="body-semibold" text="Produção" />
                    </Stack>
                    <Icon icon={isProducaoOpen ? ChevronUp : ChevronDown} size={18} color="muted" />
                  </Stack>
                </Box>
                {isProducaoOpen && (
                  <Box padding={5} bg="bg-surface" border={true} borderColor="border-border" radius="default" w="full">
                    <Stack gap={5} w="full">
                      <Stack direction="col" mobileDirection="row" gap={5} align="start" mobileAlign="center" justify="start" mobileJustify="between" w="full">
                        <Stack gap={1} order="2" mdOrder="1">
                          <Font variant="body-semibold" text="Produção Própria" align="left" />
                          <Font variant="description" text="Habilite se o item for de fabricação interna (KDS)" align="left" />
                        </Stack>
                        <Box order="1" mdOrder="2">
                          <Switch checked={producaoPropria} onChange={(e) => setProducaoPropria(e.target.checked)} />
                        </Box>
                      </Stack>
                      {producaoPropria && (
                        <Stack gap={5} w="full">
                          <Input
                            label="Ingredientes (Ficha Técnica)"
                            placeholder="Ex: Pão brioche, blend de carne 150g, queijo cheddar..."
                            value={ingredients}
                            onChange={(e) => setIngredients(e.target.value)}
                          />
                          <Input
                            label="Modo de Preparo (KDS)"
                            placeholder="Ex: Selar o pão na manteiga, fritar o blend por 3 min de cada lado..."
                            value={preparationMode}
                            onChange={(e) => setPreparationMode(e.target.value)}
                          />
                        </Stack>
                      )}
                    </Stack>
                  </Box>
                )}
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
                      <Font variant="body-semibold" text="Fiscal" />
                    </Stack>
                    <Icon icon={isFiscalOpen ? ChevronUp : ChevronDown} size={18} color="muted" />
                  </Stack>
                </Box>
                {isFiscalOpen && (
                  <Box padding={5} bg="bg-surface" border={true} borderColor="border-border" radius="default" w="full">
                    <Stack gap={5} w="full">
                      <Grid cols={2} gap={5}>
                        <Input
                          label="NCM (Nomenclatura Comum do Mercosul)"
                          placeholder="Ex: 2202.10.00"
                          value={ncm}
                          onChange={(e) => setNcm(e.target.value)}
                        />
                        <Input
                          label="EX TIPI"
                          placeholder="Exceção do IPI"
                          value={exTipi}
                          onChange={(e) => setExTipi(e.target.value)}
                        />
                        <Input
                          label="CEST (Substituição Tributária)"
                          placeholder="Ex: 17.111.00"
                          value={cest}
                          onChange={(e) => setCest(e.target.value)}
                        />
                        <Stack gap={1}>
                          <Font variant="body-sm-semibold" text="Origem da Mercadoria *" />
                          <CustomSelect value={icmsOrigem} onChange={setIcmsOrigem}>
                            <CustomSelectItem value="0 - Nacional" text="0 - Nacional" icon={Globe} />
                            <CustomSelectItem value="1 - Estrangeira Importada" text="1 - Importada Direta" icon={Globe} />
                          </CustomSelect>
                        </Stack>
                      </Grid>

                      <Box h="h-[1px]" bg="bg-border" w="full" />

                      {/* Configurações de ICMS */}
                      <Stack gap={5} w="full">
                        <Stack direction="col" mobileDirection="row" gap={5} align="start" mobileAlign="center" justify="start" mobileJustify="between" w="full">
                          <Stack gap={1} order="2" mdOrder="1">
                            <Font variant="body-semibold" text="Utilizar ICMS Padrão" align="left" />
                            <Font variant="description" text="Herda as definições fiscais padrão da filial" align="left" />
                          </Stack>
                          <Box order="1" mdOrder="2">
                            <Switch checked={icmsDefault} onChange={(e) => setIcmsDefault(e.target.checked)} />
                          </Box>
                        </Stack>

                        {!icmsDefault && (
                          <Grid cols={3} gap={5}>
                            <Stack gap={1}>
                              <Font variant="body-sm-semibold" text="CSOSN ICMS" />
                              <CustomSelect value={icmsCsosn} onChange={setIcmsCsosn}>
                                <CustomSelectItem value="101" text="101 - Simples Nacional sem crédito" icon={FileSpreadsheet} />
                                <CustomSelectItem value="500" text="500 - Substituição Tributária" icon={FileSpreadsheet} />
                              </CustomSelect>
                            </Stack>
                            <Input
                              label="Redução Base Cálculo (%)"
                              placeholder="0,00"
                              value={icmsReduction}
                              onChange={(e) => setIcmsReduction(e.target.value)}
                            />
                            <Input
                              label="Alíquota Efetiva (%)"
                              placeholder="0,00"
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
                            <Font variant="body-semibold" text="Utilizar PIS/COFINS Padrão" align="left" />
                            <Font variant="description" text="Herda as definições de PIS/COFINS padrão da filial" align="left" />
                          </Stack>
                          <Box order="1" mdOrder="2">
                            <Switch checked={pisCofinsDefault} onChange={(e) => setPisCofinsDefault(e.target.checked)} />
                          </Box>
                        </Stack>

                        {!pisCofinsDefault && (
                          <Stack gap={1} w="full">
                            <Font variant="body-sm-semibold" text="CST PIS/COFINS" />
                            <CustomSelect value={pisCofinsCst} onChange={setPisCofinsCst}>
                              <CustomSelectItem value="49" text="49 - Outras Op. de Saída" icon={Globe} />
                              <CustomSelectItem value="99" text="99 - Outras Operações" icon={Globe} />
                            </CustomSelect>
                          </Stack>
                        )}
                      </Stack>

                      {/* Link Fiscal Padrão */}
                      {onAccessFiscalConfig && (
                        <Box w="full" display="flex" justify="end">
                          <Button
                            variant="ghost-secondary"
                            label="Acessar configuração fiscal padrão"
                            onClick={onAccessFiscalConfig}
                            type="button"
                          />
                        </Box>
                      )}
                    </Stack>
                  </Box>
                )}
              </Stack>
            </Stack>
          </TabsContent>
        </Tabs>

        {/* Ações do Formulário */}
              <FormActions
        confirmLabel="Salvar Produto"
        onConfirm={() => {}}
        isSubmit={true}
        onCancel={onCancel}
      />
      </Stack>
    </Box>
  )
}
