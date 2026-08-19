"use client"

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Button } from "@/components/store/base/Button"
import { Input } from "@/components/store/base/Input"
import { Avatar } from "@/components/store/base/Avatar"
import { EmptyState } from "@/components/store/intermediary/EmptyState"
import { Plus, Trash2, MapPin, DollarSign } from "lucide-react"
import { MobileHeaderSearch } from "@/components/store/intermediary/PdvCatalogToolbar"
import { useTenant } from "@/lib/context/TenantContext"
import { useDeliveryRates, dal, DeliveryRate } from "@/lib/dal"
import { UI_STRINGS } from "@/constants/strings"

export interface DeliveryRatesScreenProps {
  onBack: () => void
  onSelectRate?: (rate: DeliveryRate) => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
  setCustomActions?: (actions: React.ReactNode | null) => void
}

interface DeliveryRateFormViewProps {
  editingRate: DeliveryRate | null
  neighborhood: string
  setNeighborhood: (v: string) => void
  fee: string
  setFee: (v: string) => void
  onSubmit: (e: React.FormEvent) => void
  onDelete: () => void
}

function DeliveryRateFormView({
  editingRate,
  neighborhood,
  setNeighborhood,
  fee,
  setFee,
  onSubmit,
  onDelete,
}: DeliveryRateFormViewProps) {
  const df = UI_STRINGS.deliveryFees
  return (
    <Box display="flex" direction="col" flex="1" minH="0" overflow="auto" w="full" padding={0}>
      <Box as="form" id="rate-form" onSubmit={onSubmit} w="full">
        <Stack gap={5} w="full">
          <Box padding={5} bg="bg-surface" radius="default" border={true} borderColor="border-border" w="full">
            <Stack gap={5} w="full">
              <Font variant="body-bold" text={df.rateDataTitle} />
              <Stack gap={2.5} w="full">
                <Input
                  label={df.regionNameLabel}
                  placeholder={df.regionNamePlaceholder}
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  required
                />
                <Input
                  mask="currency"
                  label={df.rateValueLabel}
                  placeholder={df.rateValuePlaceholder}
                  value={fee}
                  onChange={(e) => setFee(e.target.value)}
                  icon={DollarSign}
                  required
                />
              </Stack>
            </Stack>
          </Box>

          <Box paddingY={2.5} w="full">
            <Stack direction="row" gap={2.5} w="full">
              {editingRate && (
                <Button
                  type="button"
                  variant="danger-pill-icon"
                  icon={Trash2}
                  onClick={onDelete}
                  title={df.deleteRateTitle}
                />
              )}
              <Box flex="1">
                <Button
                  variant="primary"
                  label={df.saveRateButton}
                  type="submit"
                  fullWidth={true}
                />
              </Box>
            </Stack>
          </Box>
        </Stack>
      </Box>
    </Box>
  )
}

interface DeliveryRatesListViewProps {
  filteredRates: DeliveryRate[]
  onSelectRate?: (rate: DeliveryRate) => void
  onEdit: (rate: DeliveryRate) => void
  onCreateNew: () => void
}

function DeliveryRatesListView({
  filteredRates,
  onSelectRate,
  onEdit,
  onCreateNew,
}: DeliveryRatesListViewProps) {
  const df = UI_STRINGS.deliveryFees
  return (
    <Box display="flex" direction="col" flex="1" minH="0" overflow="auto" w="full" padding={0} position="relative">
      <Stack gap={5} w="full">
        {filteredRates.length === 0 ? (
          <EmptyState icon={MapPin} title={df.emptyTitle} subtitle={df.emptySubtitleFab} />
        ) : (
          <Box display="flex" direction="col" w="full">
            {filteredRates.map((rate, idx) => (
              <Box key={rate.id}>
                <Box
                  w="full"
                  paddingY={2.5}
                  paddingX={2.5}
                  radius="none"
                  hoverBg="primary/10"
                  cursor="pointer"
                  onClick={() => (onSelectRate ? onSelectRate(rate) : onEdit(rate))}
                >
                  <Stack direction="row" align="center" justify="between" w="full">
                    <Stack direction="row" align="center" gap={2.5} flex="1" minW="0">
                      <Avatar fallback={rate.neighborhood ? rate.neighborhood.charAt(0).toUpperCase() : "T"} />
                      <Stack gap={0} align="start" flex="1" minW="0">
                        <Font variant="body" text={rate.neighborhood} />
                        <Font
                          variant="auxiliary"
                          color="primary"
                          text={`R$ ${(rate.fee || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
                        />
                      </Stack>
                    </Stack>
                  </Stack>
                </Box>
                {idx < filteredRates.length - 1 && (
                  <Box borderBottom={true} borderColor="border-border" w="full" />
                )}
              </Box>
            ))}
          </Box>
        )}
      </Stack>

      <Box position="fixed" bottom={6} right={6} zIndex="50">
        <Button variant="secondary-pill-icon" icon={Plus} title={df.newRateFabTitle} onClick={onCreateNew} />
      </Box>
    </Box>
  )
}

interface RatesSyncParams {
  mode: "list" | "form"
  editingRate: DeliveryRate | null
  searchQuery: string
  setSearchQuery: (v: string) => void
  setMode: (m: "list" | "form") => void
  onBack: () => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (t: string | null) => void
  setCustomActions?: (a: React.ReactNode | null) => void
}

function useDeliveryRatesSync(params: RatesSyncParams) {
  const { mode, editingRate, searchQuery, setSearchQuery, setMode, onBack, setCustomBack, setCustomTitle, setCustomActions } = params
  const df = UI_STRINGS.deliveryFees
  const onBackRef = React.useRef(onBack)
  const setCustomBackRef = React.useRef(setCustomBack)
  const setCustomTitleRef = React.useRef(setCustomTitle)
  const setCustomActionsRef = React.useRef(setCustomActions)

  React.useEffect(() => {
    onBackRef.current = onBack
    setCustomBackRef.current = setCustomBack
    setCustomTitleRef.current = setCustomTitle
    setCustomActionsRef.current = setCustomActions
  })

  React.useEffect(() => {
    return () => {
      setCustomBackRef.current?.(null)
      setCustomTitleRef.current?.(null)
      setCustomActionsRef.current?.(null)
    }
  }, [])

  React.useEffect(() => {
    if (mode === "form") {
      setCustomBackRef.current?.(() => () => setMode("list"))
      setCustomTitleRef.current?.(editingRate ? "Editar Taxa de Entrega" : "Nova Taxa de Entrega")
      setCustomActionsRef.current?.(null)
    } else {
      setCustomBackRef.current?.(() => () => onBackRef.current?.())
      setCustomTitleRef.current?.("Taxas de Entrega")
      setCustomActionsRef.current?.(
        <MobileHeaderSearch searchQuery={searchQuery} onSearchQueryChange={setSearchQuery} placeholder={df.searchPlaceholder}>
          <Box />
        </MobileHeaderSearch>
      )
    }
  }, [mode, searchQuery, editingRate, df, setMode, setSearchQuery])
}

export function DeliveryRatesScreen({
  onBack,
  onSelectRate,
  setCustomBack,
  setCustomTitle,
  setCustomActions,
}: DeliveryRatesScreenProps) {
  const tenantCtx = useTenant()
  const tenantId = tenantCtx?.currentTenant?.id || "default"
  const dbRates = useDeliveryRates(tenantId)
  const ratesList = React.useMemo(() => (Array.isArray(dbRates) ? dbRates : []), [dbRates])

  const [mode, setMode] = React.useState<"list" | "form">("list")
  const [editingRate, setEditingRate] = React.useState<DeliveryRate | null>(null)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [neighborhood, setNeighborhood] = React.useState("")
  const [fee, setFee] = React.useState("")

  useDeliveryRatesSync({
    mode, editingRate, searchQuery, setSearchQuery, setMode, onBack, setCustomBack, setCustomTitle, setCustomActions
  })

  const handleEdit = (rate: DeliveryRate) => {
    setEditingRate(rate)
    setNeighborhood(rate.neighborhood || "")
    setFee(rate.fee !== undefined ? rate.fee.toString().replace(".", ",") : "")
    setMode("form")
  }

  const handleDelete = async () => {
    if (editingRate) {
      await dal.deliveryRates.delete(editingRate.id, tenantId)
      setMode("list")
      setEditingRate(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!neighborhood.trim()) return

    const parsedFee = parseFloat(fee.replace(",", ".")) || 0
    const rateId = editingRate ? editingRate.id : `rate-${Date.now()}`
    const payload: DeliveryRate = {
      id: rateId, company_id: tenantId, tenant_id: tenantId, neighborhood: neighborhood.trim(), fee: parsedFee,
    }

    try {
      if (editingRate) await dal.deliveryRates.update(payload)
      else await dal.deliveryRates.create(payload)
      if (onSelectRate) onSelectRate(payload)
      setMode("list")
    } catch (err) {
      console.error("Erro ao salvar taxa de entrega:", err)
    }
  }

  const filteredRates = React.useMemo(() => {
    if (!searchQuery.trim()) return ratesList
    const q = searchQuery.toLowerCase()
    return ratesList.filter((r) => r.neighborhood.toLowerCase().includes(q))
  }, [ratesList, searchQuery])

  if (mode === "form") {
    return (
      <DeliveryRateFormView
        editingRate={editingRate} neighborhood={neighborhood} setNeighborhood={setNeighborhood}
        fee={fee} setFee={setFee} onSubmit={handleSubmit} onDelete={handleDelete}
      />
    )
  }

  return (
    <DeliveryRatesListView
      filteredRates={filteredRates}
      onSelectRate={onSelectRate}
      onEdit={handleEdit}
      onCreateNew={() => {
        setEditingRate(null)
        setNeighborhood("")
        setFee("")
        setMode("form")
      }}
    />
  )
}
