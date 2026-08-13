"use client"

/* eslint-disable max-lines-per-function */

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Input } from "@/components/store/base/Input"
import { Button } from "@/components/store/base/Button"
import { Modal } from "@/components/store/base/Modal"
import { Icon } from "@/components/store/base/Icon"
import { Avatar } from "@/components/store/base/Avatar"
import { EmptyState } from "@/components/store/intermediary/EmptyState"
import { FilterPanel } from "@/components/store/intermediary/FilterPanel"
import { FileText, Filter, Calendar, User, DollarSign, Share2, Printer, Trash2, ChevronDown, ChevronUp, Package } from "lucide-react"
import { useSales, useProducts, Sale, dal } from "@/lib/dal"
import { useTenant } from "@/lib/context/TenantContext"

interface NegociacoesSectionProps {
  title?: string
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
  setCustomActions?: (actions: React.ReactNode | null) => void
  onBack: () => void
  initialClientFilter?: string
}

export const NegociacoesSection: React.FC<NegociacoesSectionProps> = ({
  title,
  setCustomBack,
  setCustomTitle,
  setCustomActions,
  onBack,
  initialClientFilter,
}) => {
  const tenantCtx = useTenant()
  const tenantId = tenantCtx?.currentTenant?.id
  const dbSales = useSales(tenantId)
  const dbProducts = useProducts(tenantId)

  // Mapa de produtos para resolução automática de imagens reais e dados de produtos
  const productMap = React.useMemo(() => {
    const map = new Map<string, any>()
    if (dbProducts && dbProducts.length > 0) {
      dbProducts.forEach((p) => {
        if (p.id) map.set(p.id, p)
        if (p.name) map.set(p.name.toLowerCase().trim(), p)
      })
    }
    return map
  }, [dbProducts])

  const [period, setPeriod] = React.useState("Hoje")
  const [startDate, setStartDate] = React.useState("12/08/2026 00:00")
  const [endDate, setEndDate] = React.useState("12/08/2026 23:59")
  const [cliente, setCliente] = React.useState(initialClientFilter || "")
  const [usuario, setUsuario] = React.useState("")
  const [dispositivo, setDispositivo] = React.useState("")
  const [mesa, setMesa] = React.useState("")
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = React.useState(false)
  const [selectedSale, setSelectedSale] = React.useState<Sale | null>(null)
  const [isAccordionOpen, setIsAccordionOpen] = React.useState(false)

  const onBackRef = React.useRef(onBack)
  React.useEffect(() => {
    onBackRef.current = onBack
  }, [onBack])

  React.useEffect(() => {
    setCustomTitle?.(title || "Negociações")
    setCustomBack?.(() => () => onBackRef.current())

    setCustomActions?.(
      <Box display="block md:hidden">
        <Button
          variant="primary-pill-icon"
          icon={Filter}
          onClick={() => setIsFilterDrawerOpen(true)}
        />
      </Box>
    )

    return () => {
      setCustomTitle?.(null)
      setCustomBack?.(null)
      setCustomActions?.(null)
    }
  }, [setCustomBack, setCustomTitle, setCustomActions, title])

  React.useEffect(() => {
    if (initialClientFilter !== undefined) {
      setCliente(initialClientFilter)
    }
  }, [initialClientFilter])

  const filteredSales = React.useMemo(() => {
    if (!dbSales || dbSales.length === 0) return []
    const clientTerm = cliente.trim().toLowerCase()
    const userTerm = usuario.trim().toLowerCase()

    return dbSales
      .filter((sale) => {
        if (clientTerm) {
          if (!sale.customer_name) return false
          const lowerCust = sale.customer_name.toLowerCase().trim()
          if (lowerCust === "nao selecionado" || lowerCust === "venda avulsa") return false
          if (!lowerCust.includes(clientTerm)) return false
        }
        if (userTerm) {
          const saleUser = (sale as any).user_name || sale.operator_id || ""
          if (!saleUser || !saleUser.toLowerCase().includes(userTerm)) return false
        }
        return true
      })
      .sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())
  }, [dbSales, cliente, usuario])

  const totalFilteredSales = React.useMemo(() => {
    return filteredSales.reduce((acc, sale) => acc + (sale.total || 0), 0)
  }, [filteredSales])

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val)
  }

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "Agora"
    try {
      const d = new Date(dateStr)
      return d.toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })
    } catch {
      return dateStr
    }
  }

  const handleDeleteSale = async () => {
    if (selectedSale) {
      await dal.sales.delete(selectedSale.id)
      setSelectedSale(null)
    }
  }

  const renderFilterInputs = () => (
    <>
      <Input
        label="Cliente"
        placeholder="Cliente"
        value={cliente}
        onChange={(e) => setCliente(e.target.value)}
      />

      <Input
        label="Usuário"
        placeholder="Usuário"
        value={usuario}
        onChange={(e) => setUsuario(e.target.value)}
      />

      <Input
        label="Dispositivo"
        placeholder="Dispositivo"
        value={dispositivo}
        onChange={(e) => setDispositivo(e.target.value)}
      />

      <Input
        label="Comanda"
        placeholder="Comanda / Mesa"
        value={mesa}
        onChange={(e) => setMesa(e.target.value)}
      />
    </>
  )

  const getSaleCode = (sale: Sale) => {
    const saleIdx = filteredSales.findIndex((s) => s.id === sale.id)
    const saleNum = (saleIdx >= 0 ? filteredSales.length - saleIdx : 1).toString().padStart(3, "0")
    return `Nº ${saleNum}.${saleIdx >= 0 ? filteredSales.length - saleIdx : 1}`
  }

  return (
    <Stack direction="col" gap={5} w="full" flex="1" minH="0">
      <Stack direction="col" mobileDirection="row" gap={5} w="full" align="stretch" flex="1" minH="0" h="full">
        {/* Lado Esquerdo: Lista Minimalista + Card Fixo de Total Filtrado */}
        <Stack direction="col" gap={2.5} flex="1" w="full" h="full" minH="0">
          {/* Lista de Registros */}
          <Box flex="1" w="full" h="full" bg="bg-surface" padding={5} radius="default" direction="col" justify="start" minH="0" overflow="hidden">
            {filteredSales.length === 0 ? (
              <Box w="full" h="full" direction="col" align="center" justify="center">
                <EmptyState
                  variant="transparent"
                  icon={FileText}
                  title="Nenhuma negociação encontrada."
                  subtitle="As vendas concluídas no Caixa aparecerão nesta lista."
                />
              </Box>
            ) : (
              <Stack gap={0} w="full" overflow="auto" flex="1">
                {filteredSales.map((sale, idx) => {
                  const saleNum = (filteredSales.length - idx).toString().padStart(3, "0")
                  const saleCode = `Nº ${saleNum}.${filteredSales.length - idx}`

                  return (
                    <Box
                      key={sale.id}
                      w="full"
                      padding={2.5}
                      hoverBg="primary/10"
                      radius="default"
                      cursor="pointer"
                      border
                      borderColor="border/40"
                      onClick={() => {
                        setSelectedSale(sale)
                        setIsAccordionOpen(false)
                      }}
                    >
                      <Stack direction="row" justify="between" align="start" w="full">
                        {/* Lado Esquerdo da linha */}
                        <Stack gap={1} flex="1" minW="0">
                          <Font variant="body-sm-semibold" color="muted" text={saleCode} />

                          <Stack direction="row" align="center" gap={1}>
                            <Icon icon={Calendar} size={12} color="muted" />
                            <Font variant="auxiliary" color="muted" text={formatDate(sale.created_at)} />
                          </Stack>

                          {sale.customer_name && sale.customer_name !== "Nao selecionado" && (
                            <Stack direction="row" align="center" gap={1}>
                              <Icon icon={User} size={12} color="muted" />
                              <Font variant="auxiliary" color="muted" text={sale.customer_name} />
                            </Stack>
                          )}

                          <Stack direction="row" align="center" gap={1}>
                            <Icon icon={DollarSign} size={12} color="muted" />
                            <Font variant="auxiliary" color="muted" text={`${sale.payment_method || "Dinheiro"} ${formatPrice(sale.total)}`} />
                          </Stack>
                        </Stack>

                        {/* Lado Direito da linha */}
                        <Stack align="end" gap={0}>
                          <Font variant="body-bold" color="muted" text={formatPrice(sale.total)} />
                          <Font variant="auxiliary" color="muted" text={`Venda: ${formatPrice(sale.total)}`} />
                        </Stack>
                      </Stack>
                    </Box>
                  )
                })}
              </Stack>
            )}
          </Box>

          {/* Card Fixo no Canto Inferior Esquerdo: Total das negociações filtradas */}
          <Box w="full" bg="bg-surface" padding={5} radius="default">
            <Stack gap={1}>
              <Font variant="auxiliary" color="muted" text="Total das negociações filtradas" />
              <Font variant="h2" color="primary" text={formatPrice(totalFilteredSales)} />
            </Stack>
          </Box>
        </Stack>

        {/* Painel Direito Desktop: FilterPanel Inline */}
        <Box display="hidden md:flex" direction="col" h="full" minH="0" shrink="0">
          <FilterPanel
            title="Filtros"
            selectedPeriod={period}
            onPeriodChange={setPeriod}
            startDate={startDate}
            onStartDateChange={setStartDate}
            endDate={endDate}
            onEndDateChange={setEndDate}
            onFilter={() => {}}
          >
            {renderFilterInputs()}
          </FilterPanel>
        </Box>

        {/* Painel Drawer Mobile: FilterPanel dentro de Modal Sidebar */}
        <Modal
          isOpen={isFilterDrawerOpen}
          onClose={() => setIsFilterDrawerOpen(false)}
          title="Filtros"
          variant="sidebar"
        >
          <FilterPanel
            hideTitle
            borderless
            selectedPeriod={period}
            onPeriodChange={setPeriod}
            startDate={startDate}
            onStartDateChange={setStartDate}
            endDate={endDate}
            onEndDateChange={setEndDate}
            onFilter={() => setIsFilterDrawerOpen(false)}
          >
            {renderFilterInputs()}
          </FilterPanel>
        </Modal>

        {/* Modal de Detalhes da Venda no Estilo Padrão do Design System com Sanfona Animada */}
        <Modal
          isOpen={!!selectedSale}
          onClose={() => setSelectedSale(null)}
          title={selectedSale ? `Negociação ${getSaleCode(selectedSale)}` : "Detalhes da Negociação"}
          subtitle="Detalhamento completo dos produtos e pagamentos da negociação"
          icon={FileText}
          variant="default"
        >
          {selectedSale && (
            <Stack gap={5} w="full">
              {/* Box do Cliente (reutilizando a estrutura de item da tela de clientes) */}
              {selectedSale.customer_name &&
                selectedSale.customer_name !== "Nao selecionado" &&
                selectedSale.customer_name !== "Venda Avulsa" && (
                  <Box padding={2.5} bg="bg-brand-primary/10" radius="none" w="full">
                    <Stack direction="row" align="center" justify="between" w="full">
                      <Stack direction="row" align="center" gap={2.5} flex="1" minW="0">
                        <Avatar fallback={selectedSale.customer_name.substring(0, 2).toUpperCase()} />
                        <Stack gap={1} align="start" flex="1" minW="0">
                          <Font variant="body" text={selectedSale.customer_name} />
                          <Font variant="auxiliary" color="muted" text="Cliente cadastrado" />
                        </Stack>
                      </Stack>
                    </Stack>
                  </Box>
                )}

              {/* Box do Total com Sanfona (Accordion animado com bg-brand-primary/10) */}
              <Box
                padding={2.5}
                bg="bg-brand-primary/10"
                radius="none"
                w="full"
                cursor="pointer"
                onClick={() => setIsAccordionOpen((prev) => !prev)}
              >
                <Stack gap={2.5} w="full">
                  <Stack direction="row" justify="between" align="center" w="full">
                    <Stack gap={0}>
                      <Font variant="auxiliary" color="muted" text="Total" />
                      <Font
                        variant="auxiliary"
                        color="muted"
                        text={`Itens: ${
                          Array.isArray(selectedSale.items)
                            ? selectedSale.items.reduce((acc: number, it: any) => acc + (it.quantity || it.qty || it.amount || 1), 0)
                            : 0
                        }`}
                      />
                    </Stack>
                    <Stack direction="row" align="center" gap={2.5}>
                      <Font variant="body-bold" color="primary" text={formatPrice(selectedSale.total)} />
                      <Icon icon={isAccordionOpen ? ChevronUp : ChevronDown} size={16} color="primary" />
                    </Stack>
                  </Stack>

                  {/* Conteúdo Expandido Animado da Sanfona de Pagamentos */}
                  <Box
                    w="full"
                    style={{
                      maxHeight: isAccordionOpen ? "200px" : "0px",
                      opacity: isAccordionOpen ? 1 : 0,
                      transition: "max-height 0.3s ease-in-out, opacity 0.25s ease-in-out",
                      overflow: "hidden",
                    }}
                  >
                    <Box padding={1} w="full">
                      <Stack gap={2.5} w="full">
                        <Box border borderColor="border/30" w="full" />

                        <Stack direction="row" justify="between" align="center" w="full">
                          <Font variant="body-sm-medium" color="muted" text="Venda:" />
                          <Font variant="body-sm-medium" text={formatPrice(selectedSale.total)} />
                        </Stack>

                        <Stack direction="row" justify="between" align="center" w="full">
                          <Font variant="body-sm-medium" color="muted" text={`${selectedSale.payment_method || "Dinheiro"}:`} />
                          <Font variant="body-sm-medium" text={formatPrice(selectedSale.total)} />
                        </Stack>

                        <Stack direction="row" justify="between" align="center" w="full">
                          <Font variant="body-sm-medium" color="muted" text="Total pago:" />
                          <Font variant="body-sm-medium" text={formatPrice(selectedSale.total)} />
                        </Stack>
                      </Stack>
                    </Box>
                  </Box>
                </Stack>
              </Box>

              {/* Lista de Produtos do Pedido (reutilizando a estrutura idêntica da tela de produtos) */}
              <Stack gap={2.5} w="full">
                <Font variant="body-bold" color="primary" text="Produtos no pedido" />

                <Box maxH="240px" overflow="auto" w="full">
                  <Stack gap={2.5} w="full">
                    {Array.isArray(selectedSale.items) && selectedSale.items.length > 0 ? (
                      selectedSale.items.map((item: any, idx: number) => {
                        const itemProductId = item.product_id || item.productId || item.id || item.product?.id
                        const rawName = item.product_name || item.name || item.title || item.productName || item.description || item.product?.name || item.product?.product_name || ""
                        const itemProductName = rawName.toLowerCase().trim()

                        const matchedProd = (itemProductId ? productMap.get(itemProductId) : null) || (itemProductName ? productMap.get(itemProductName) : null)

                        const finalName = rawName || matchedProd?.name || "Item"
                        const finalUnitPrice = item.unit_price ?? item.unitPrice ?? item.price ?? item.unit_val ?? matchedProd?.price ?? matchedProd?.unit_price ?? 0
                        const finalQty = item.quantity ?? item.qty ?? item.amount ?? item.count ?? 1
                        const finalTotalPrice = item.total_price ?? item.totalPrice ?? item.total ?? (finalUnitPrice * finalQty)
                        const finalImage = item.image || item.image_url || item.imageUrl || matchedProd?.image_url || (matchedProd as any)?.image
                        const finalUnit = item.unit || item.unidade || matchedProd?.unit || "UN"

                        return (
                          <Box
                            key={idx}
                            padding={2.5}
                            bg="bg-brand-primary/10"
                            hoverBg="primary/10"
                            radius="none"
                            w="full"
                            cursor="pointer"
                          >
                            <Stack direction="row" align="center" justify="between" w="full">
                              {/* Lado Esquerdo: Thumbnail (estilo ProdutosSection) + Nome e Detalhes */}
                              <Stack direction="row" align="center" gap={2.5} flex="1" minW="0">
                                <Box
                                  w="w-10"
                                  h="h-10"
                                  bg="bg-surface-sunken"
                                  borderColor="border-border"
                                  border={true}
                                  radius="default"
                                  shrink="0"
                                  overflow="hidden"
                                >
                                  {finalImage ? (
                                    <Box
                                      as="img"
                                      src={finalImage}
                                      alt={finalName}
                                      w="full"
                                      h="full"
                                      objectFit="cover"
                                    />
                                  ) : (
                                    <Stack w="full" h="full" align="center" justify="center">
                                      <Icon icon={Package} size={20} color="muted" />
                                    </Stack>
                                  )}
                                </Box>

                                <Stack gap={1} align="start" flex="1" minW="0">
                                  <Font variant="body" text={finalName} />
                                  <Font
                                    variant="auxiliary"
                                    color="muted"
                                    truncate={true}
                                    text={`${finalQty} ${finalUnit} x ${formatPrice(finalUnitPrice)}`}
                                  />
                                </Stack>
                              </Stack>

                              {/* Lado Direito: Valor Total do Item */}
                              <Box shrink="0">
                                <Stack gap={1} align="end">
                                  <Font variant="body" text={formatPrice(finalTotalPrice)} />
                                </Stack>
                              </Box>
                            </Stack>
                          </Box>
                        )
                      })
                    ) : (
                      <Font variant="auxiliary" color="muted" text="Nenhum item detalhado nesta venda." />
                    )}
                  </Stack>
                </Box>
              </Stack>

              {/* 3 Botões de Ação no Rodapé (Lixeira, Seta de Compartilhamento, Impressora Primária) */}
              <Stack direction="row" justify="center" align="center" gap={5} w="full">
                <Button
                  variant="danger-pill-icon-confirm"
                  confirmTitle="Excluir Negociação"
                  confirmSubtitle="Confirmar exclusão de negociação"
                  confirmParagraph="Tem certeza de que deseja excluir esta negociação do sistema? Esta ação não poderá ser desfeita."
                  onConfirm={handleDeleteSale}
                  title="Excluir negociação"
                />
                <Button
                  variant="secondary-pill-icon"
                  icon={Share2}
                  onClick={() => {}}
                  title="Compartilhar negociação"
                />
                <Button
                  variant="primary-pill-icon"
                  icon={Printer}
                  onClick={() => {}}
                  title="Imprimir comprovante"
                />
              </Stack>
            </Stack>
          )}
        </Modal>
      </Stack>
    </Stack>
  )
}
