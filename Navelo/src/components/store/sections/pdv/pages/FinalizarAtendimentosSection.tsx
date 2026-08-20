"use client"

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Input } from "@/components/store/base/Input"
import { Button } from "@/components/store/base/Button"
import { MinusCircle } from "lucide-react"
import { UI_STRINGS } from "@/constants/strings"

function formatPrice(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)
}

export interface ComandaSummary {
  id: string
  label: string
  time: string
  total: number
}

export interface FinalizarAtendimentosSectionProps {
  comandas: ComandaSummary[]
  onBack: () => void
  onFinalize: (selectedComandaIds: string[]) => void
  setCustomTitle?: (title: string | null) => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomActions?: (actions: React.ReactNode | null) => void
}

function BatchComandaDropdownList({
  suggestions,
  onSelectSuggestion,
}: {
  suggestions: ComandaSummary[]
  onSelectSuggestion: (id: string) => void
}) {
  return (
    <Box
      position="absolute"
      zIndex="50"
      top="44px"
      left={0}
      right={0}
      w="full"
      bg="bg-surface"
      radius="default"
      border
      borderColor="border-border"
      shadow="default"
      overflow="hidden"
    >
      <Box maxH="60" overflow="auto" w="full">
        {suggestions.slice(0, 8).map((sug) => (
          <Box
            key={sug.id}
            paddingX={5}
            paddingY={2.5}
            cursor="pointer"
            hoverBg="surface-sunken"
            w="full"
            onClick={() => onSelectSuggestion(sug.id)}
          >
            <Stack direction="row" align="center" justify="between" w="full">
              <Font variant="body-sm-semibold" text={sug.label} />
              <Font variant="body-sm-medium" text={formatPrice(sug.total)} />
            </Stack>
          </Box>
        ))}
      </Box>
    </Box>
  )
}

function useDropdownOutsideClick(
  containerRef: React.RefObject<HTMLDivElement | null>,
  onDismiss: () => void
) {
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onDismiss()
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [containerRef, onDismiss])
}

function BatchComandaSearchForm({
  searchQuery,
  onSearchChange,
  onSubmit,
  suggestions,
  onSelectSuggestion,
}: {
  searchQuery: string
  onSearchChange: (val: string) => void
  onSubmit: (e: React.FormEvent) => void
  suggestions: ComandaSummary[]
  onSelectSuggestion: (id: string) => void
}) {
  const t = UI_STRINGS.tables
  const [isDismissed, setIsDismissed] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)

  const handleDismiss = React.useCallback(() => setIsDismissed(true), [])
  useDropdownOutsideClick(containerRef, handleDismiss)

  const isOpen = !isDismissed && searchQuery.trim().length > 0 && suggestions.length > 0

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsDismissed(false)
    onSearchChange(e.target.value)
  }

  return (
    <Box ref={containerRef} as="form" onSubmit={onSubmit} w="full" padding={0} position="relative">
      <Stack gap={1} w="full">
        <Input
          variant="bordered"
          placeholder={t.identifierInputPlaceholder}
          value={searchQuery}
          onChange={handleInputChange}
          onFocus={() => setIsDismissed(false)}
          autoFocus
        />
        <Font variant="auxiliary" color="muted" text={t.identifierInputHint} />
      </Stack>
      {isOpen && (
        <BatchComandaDropdownList
          suggestions={suggestions}
          onSelectSuggestion={(id) => {
            onSelectSuggestion(id)
            setIsDismissed(true)
          }}
        />
      )}
    </Box>
  )
}

function BatchComandaItemRow({
  comanda,
  onRemove,
}: {
  comanda: ComandaSummary
  onRemove: (id: string) => void
}) {
  return (
    <Box padding={0} w="full">
      <Stack direction="row" align="center" justify="between" w="full">
        <Font variant="body-medium" text={comanda.label} />
        <Stack direction="row" align="center" gap={2.5}>
          <Font variant="body-bold" text={formatPrice(comanda.total)} />
          <Button
            variant="secondary-pill-icon-xs"
            icon={MinusCircle}
            onClick={() => onRemove(comanda.id)}
            title={UI_STRINGS.common.delete}
          />
        </Stack>
      </Stack>
    </Box>
  )
}

function useBatchComandasSearch(comandas: ComandaSummary[], selectedIds: string[]) {
  const [searchQuery, setSearchQuery] = React.useState("")

  const unselectedComandas = React.useMemo(() => {
    return comandas.filter((c) => !selectedIds.includes(c.id))
  }, [comandas, selectedIds])

  const suggestions = React.useMemo(() => {
    if (!searchQuery.trim()) return []
    const q = searchQuery.toLowerCase().trim()
    return unselectedComandas.filter((c) => c.label.toLowerCase().includes(q) || c.id.toLowerCase().includes(q))
  }, [unselectedComandas, searchQuery])

  return { searchQuery, setSearchQuery, unselectedComandas, suggestions }
}

export const FinalizarAtendimentosSection: React.FC<FinalizarAtendimentosSectionProps> = ({
  comandas,
  onBack,
  onFinalize,
  setCustomTitle,
  setCustomBack,
  setCustomActions,
}) => {
  const [selectedIds, setSelectedIds] = React.useState<string[]>([])
  const { searchQuery, setSearchQuery, unselectedComandas, suggestions } = useBatchComandasSearch(comandas, selectedIds)
  const t = UI_STRINGS.tables

  const onBackRef = React.useRef(onBack)
  React.useEffect(() => { onBackRef.current = onBack }, [onBack])

  React.useEffect(() => {
    setCustomTitle?.(t.batchFinishTitle)
    setCustomBack?.(() => onBackRef.current)
    setCustomActions?.(null)
    return () => { setCustomTitle?.(null); setCustomBack?.(null) }
  }, [setCustomTitle, setCustomBack, setCustomActions, t.batchFinishTitle])

  const selectedComandas = React.useMemo(() => {
    return selectedIds.map((id) => comandas.find((c) => c.id === id)).filter((c): c is ComandaSummary => Boolean(c))
  }, [selectedIds, comandas])

  const handleAddComanda = (id: string) => {
    if (!selectedIds.includes(id)) setSelectedIds((prev) => [...prev, id])
    setSearchQuery("")
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    const q = searchQuery.toLowerCase().trim()
    const match = unselectedComandas.find((c) => c.label.toLowerCase() === q || c.id.toLowerCase() === q || `#${c.label.toLowerCase()}` === q)
    if (match) handleAddComanda(match.id)
    else if (suggestions.length > 0) handleAddComanda(suggestions[0].id)
  }

  const handleFinalize = React.useCallback(() => {
    if (selectedIds.length > 0) onFinalize(selectedIds)
  }, [selectedIds, onFinalize])

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => { if (e.key === "F9") { e.preventDefault(); handleFinalize() } }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleFinalize])

  return (
    <Box flex="1" minH="0" h="full" display="flex" direction="col" justify="between" w="full" padding={0}>
      <Box flex="1" minH="0" w="full" overflowY="auto">
        <Stack gap={5} w="full">
          <BatchComandaSearchForm
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSubmit={handleSearchSubmit}
            suggestions={suggestions}
            onSelectSuggestion={handleAddComanda}
          />
          <Stack gap={2.5} w="full">
            {selectedComandas.map((c) => (
              <BatchComandaItemRow
                key={c.id}
                comanda={c}
                onRemove={(id) => setSelectedIds((prev) => prev.filter((i) => i !== id))}
              />
            ))}
          </Stack>
        </Stack>
      </Box>
      <Box w="full" shrink="0" paddingY={2.5}>
        <Button
          variant="primary"
          fullWidth
          label={t.batchFinishButton}
          disabled={selectedIds.length === 0}
          onClick={handleFinalize}
        />
      </Box>
    </Box>
  )
}
