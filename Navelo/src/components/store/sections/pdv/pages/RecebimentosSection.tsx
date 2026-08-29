"use client"

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Button } from "@/components/store/base/Button"
import { Checkbox } from "@/components/store/base/Checkbox"
import { EmptyState } from "@/components/store/intermediary/EmptyState"
import { Receipt, Check } from "lucide-react"
import { Modal } from "@/components/store/base/Modal"
import { UI_STRINGS } from "@/constants/strings"
import { useTenant } from "@/lib/context/TenantContext"
import { useReceivables, dal } from "@/lib/dal"

export interface ReceivableItem {
  id: string
  docNumber: string
  dueDate: string
  issueDate: string
  value: number
  fine: number
  interest: number
}

export interface RecebimentosSectionProps {
  clientName?: string
  onBack: () => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
  setCustomActions?: (actions: React.ReactNode | null) => void
}

function formatBRL(val: number): string {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val)
}

function SelectAllHeader({
  isAllSelected,
  onToggleAll,
}: {
  isAllSelected: boolean
  onToggleAll: () => void
}) {
  const r = UI_STRINGS.recebimentos
  return (
    <Box padding={2.5} w="full">
      <Checkbox
        checked={isAllSelected}
        onChange={onToggleAll}
        label={r.selectAll}
      />
    </Box>
  )
}

function ReceivablesTableHeader() {
  const r = UI_STRINGS.recebimentos
  return (
    <Box padding={2.5} borderBottom borderColor="border-border" w="full">
      <Stack direction="row" align="center" justify="between" w="full">
        <Stack direction="row" align="center" gap={2.5}>
          <Box w="w-5" />
          <Stack direction="row" align="center" gap={5}>
            <Font variant="body-bold" text={r.dueDateHeader} />
            <Font variant="body-bold" text={r.issueDateHeader} />
          </Stack>
        </Stack>
        <Font variant="body-bold" text={r.valueHeader} />
      </Stack>
    </Box>
  )
}

function ReceivableRow({
  item,
  isSelected,
  onToggle,
}: {
  item: ReceivableItem
  isSelected: boolean
  onToggle: () => void
}) {
  return (
    <Box
      padding={2.5}
      bg={isSelected ? "bg-secondary/10" : "transparent"}
      hoverBg="secondary/10"
      cursor="pointer"
      onClick={onToggle}
      w="full"
    >
      <Stack direction="row" align="center" justify="between" w="full" gap={2.5}>
        <Stack direction="row" align="center" gap={2.5} flex="1" minW="0">
          <Checkbox
            checked={isSelected}
            onChange={onToggle}
            onClick={(e) => e.stopPropagation()}
          />
          <Stack gap={0} align="start">
            <Font variant="body" text={item.docNumber} />
            <Stack direction="row" align="center" gap={5}>
              <Font variant="auxiliary" color="muted" text={item.dueDate} />
              <Font variant="auxiliary" color="muted" text={item.issueDate} />
            </Stack>
          </Stack>
        </Stack>
        <Font variant="body" text={formatBRL(item.value)} />
      </Stack>
    </Box>
  )
}

function ReceivablesSummaryCard({
  subtotal,
  interest,
  fine,
  total,
  hasSelection,
  onConfirm,
}: {
  subtotal: number
  interest: number
  fine: number
  total: number
  hasSelection: boolean
  onConfirm: () => void
}) {
  const r = UI_STRINGS.recebimentos
  return (
    <Box
      display="flex"
      direction="col"
      justify="between"
      h="full"
      flex="1"
      w="full"
      bg="bg-surface"
      radius="default"
      padding={5}
    >
      <Stack gap={2.5} w="full">
        <Stack direction="row" align="center" justify="between" w="full">
          <Font variant="body" color="muted" text={r.subtotalLabel} />
          <Font variant="body" text={formatBRL(subtotal)} />
        </Stack>
        <Stack direction="row" align="center" justify="between" w="full">
          <Font variant="body" color="muted" text={r.interestLabel} />
          <Font variant="body" text={formatBRL(interest)} />
        </Stack>
        <Stack direction="row" align="center" justify="between" w="full">
          <Font variant="body" color="muted" text={r.fineLabel} />
          <Font variant="body" text={formatBRL(fine)} />
        </Stack>
        <Box h="h-[1px]" w="full" bg="bg-border" />
        <Stack direction="row" align="center" justify="between" w="full">
          <Font variant="body-bold" text={r.totalLabel} />
          <Font variant="body-bold" text={formatBRL(total)} />
        </Stack>
      </Stack>

      <Box w="full">
        <Button
          variant="primary"
          label={r.confirmButton}
          disabled={!hasSelection}
          onClick={onConfirm}
          fullWidth
        />
      </Box>
    </Box>
  )
}

function ReceivablesListColumn({
  items,
  selectedIds,
  onToggleItem,
  onToggleAll,
}: {
  items: ReceivableItem[]
  selectedIds: string[]
  onToggleItem: (id: string) => void
  onToggleAll: () => void
}) {
  const r = UI_STRINGS.recebimentos
  const isAllSelected = items.length > 0 && selectedIds.length === items.length

  if (items.length === 0) {
    return (
      <Box flex="1" minH="0" h="full" display="flex" direction="col" w="full">
        <EmptyState
          title={r.emptyTitle}
          subtitle={r.emptySubtitle}
          icon={Receipt}
        />
      </Box>
    )
  }

  return (
    <Box flex="1" minH="0" h="full" display="flex" direction="col" w="full">
      <SelectAllHeader isAllSelected={isAllSelected} onToggleAll={onToggleAll} />
      <ReceivablesTableHeader />
      <Box flex="1" minH="0" overflow="x-hidden y-auto" w="full">
        <Stack gap={0} w="full">
          {items.map((item) => (
            <ReceivableRow
              key={item.id}
              item={item}
              isSelected={selectedIds.includes(item.id)}
              onToggle={() => onToggleItem(item.id)}
            />
          ))}
        </Stack>
      </Box>
    </Box>
  )
}

function RecebimentoSuccessModal({
  isOpen,
  selectedCount,
  total,
  onClose,
  onSuccess,
}: {
  isOpen: boolean
  selectedCount: number
  total: number
  onClose: () => void
  onSuccess: () => void
}) {
  const r = UI_STRINGS.recebimentos
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={r.successModalTitle}
      variant="default"
      successText={UI_STRINGS.common.confirm}
      onSuccess={onSuccess}
    >
      <Stack gap={2.5} w="full">
        <Stack direction="row" align="center" justify="between" w="full">
          <Font variant="body" color="muted" text={r.settledCountLabel} />
          <Font variant="body-bold" text={`${selectedCount}`} />
        </Stack>
        <Stack direction="row" align="center" justify="between" w="full">
          <Font variant="body" color="muted" text={r.totalReceivedLabel} />
          <Font variant="body-bold" color="primary" text={formatBRL(total)} />
        </Stack>
      </Stack>
    </Modal>
  )
}

function useRecebimentosSectionHeader(
  onBack: () => void,
  setCustomBack?: (cb: (() => void) | null) => void,
  setCustomTitle?: (title: string | null) => void,
  setCustomActions?: (actions: React.ReactNode | null) => void
) {
  const r = UI_STRINGS.recebimentos
  const onBackRef = React.useRef(onBack)
  React.useEffect(() => {
    onBackRef.current = onBack
  }, [onBack])

  React.useEffect(() => {
    setCustomTitle?.(r.title)
    setCustomBack?.(() => () => onBackRef.current())
    setCustomActions?.(null)
    return () => {
      setCustomTitle?.(null)
      setCustomBack?.(null)
      setCustomActions?.(null)
    }
  }, [r.title, setCustomBack, setCustomTitle, setCustomActions])
}

export function RecebimentosSection({
  clientName,
  onBack,
  setCustomBack,
  setCustomTitle,
  setCustomActions,
}: RecebimentosSectionProps) {
  const tenantCtx = useTenant()
  const tenantId = tenantCtx?.currentTenant?.id || "demo-tenant"
  const dbReceivables = useReceivables(tenantId, clientName)
  const [selectedIds, setSelectedIds] = React.useState<string[]>([])
  const [isSuccessModalOpen, setIsSuccessModalOpen] = React.useState(false)

  const items: ReceivableItem[] = React.useMemo(() => {
    if (!dbReceivables) return []
    return dbReceivables
      .filter((r) => r.status === "PENDING")
      .map((r) => ({
        id: r.id,
        docNumber: r.doc_number,
        dueDate: r.due_date,
        issueDate: r.issue_date,
        value: r.value,
        fine: r.fine || 0,
        interest: r.interest || 0,
      }))
  }, [dbReceivables])

  useRecebimentosSectionHeader(onBack, setCustomBack, setCustomTitle, setCustomActions)

  const handleToggleSelectAll = () => {
    setSelectedIds((prev) => (prev.length === items.length ? [] : items.map((it) => it.id)))
  }

  const handleToggleItem = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const selectedItems = items.filter((it) => selectedIds.includes(it.id))
  const subtotal = selectedItems.reduce((acc, it) => acc + it.value, 0)
  const interest = selectedItems.reduce((acc, it) => acc + it.interest, 0)
  const fine = selectedItems.reduce((acc, it) => acc + it.fine, 0)
  const total = subtotal + interest + fine

  const handleFinishReceipt = async () => {
    if (selectedIds.length > 0) {
      await dal.receivables.settle(selectedIds)
    }
    setSelectedIds([])
    setIsSuccessModalOpen(false)
    onBack()
  }

  return (
    <Box flex="1" minH="0" h="full" w="full" padding={0}>
      <Stack direction="col" mobileDirection="row" gap={5} w="full" h="full" flex="1" minH="0">
        <Box flex="1" minH="0" h="full" w="full">
          <ReceivablesListColumn
            items={items}
            selectedIds={selectedIds}
            onToggleItem={handleToggleItem}
            onToggleAll={handleToggleSelectAll}
          />
        </Box>
        <Box flex="1" minH="0" h="full" w="full">
          <ReceivablesSummaryCard
            subtotal={subtotal}
            interest={interest}
            fine={fine}
            total={total}
            hasSelection={selectedIds.length > 0}
            onConfirm={() => selectedIds.length > 0 && setIsSuccessModalOpen(true)}
          />
        </Box>
      </Stack>

      <RecebimentoSuccessModal
        isOpen={isSuccessModalOpen}
        selectedCount={selectedIds.length}
        total={total}
        onClose={() => setIsSuccessModalOpen(false)}
        onSuccess={handleFinishReceipt}
      />
    </Box>
  )
}
