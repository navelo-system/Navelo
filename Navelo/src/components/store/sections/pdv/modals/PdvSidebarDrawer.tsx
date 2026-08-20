"use client"

import * as React from "react"
import { Stack } from "@/components/store/base/Stack"
import { Box } from "@/components/store/base/Box"
import { Font } from "@/components/store/base/Font"
import { Icon } from "@/components/store/base/Icon"
import { Modal } from "@/components/store/base/Modal"
import { Cloud, AlertTriangle } from "lucide-react"
import { useSyncStatus } from "@/lib/dal/hooks"
import { UI_STRINGS, formatString } from "@/constants/strings"

interface PdvSidebarDrawerProps {
  isOpen: boolean
  onClose: () => void
  onBackToDashboard: () => void
  onNavigate: (view: "negociacoes" | "clientes" | "devolucao" | "totais-em-caixa" | "recebimentos" | "sangrias-suprimentos" | "ultimas-negociacoes") => void
  onOpenObservationModal: () => void
  onOpenSangriaModal: (mode?: "sangria" | "suprimento") => void
  onOpenDiscountModal: () => void
  discount?: number
  subtotal?: number
  onSyncClick?: () => void
  customerName?: string
  observationText?: string
  showOutOfStockProducts?: boolean
  onToggleShowOutOfStock?: (val: boolean) => void
  hasCartItems?: boolean
  onCancelOperation?: () => void
}

function DrawerSyncCard({ onSyncClick }: { onSyncClick?: () => void }) {
  const syncStatus = useSyncStatus()
  const d = UI_STRINGS.pdv.drawer

  return (
    <Box
      w="full"
      bg="bg-brand-secondary/10"
      padding={2.5}
      radius="default"
      cursor={syncStatus.pendingCount > 0 ? "pointer" : undefined}
      onClick={syncStatus.pendingCount > 0 ? onSyncClick : undefined}
    >
      <Stack gap={1}>
        <Stack direction="row" align="center" gap={2.5}>
          <Icon icon={syncStatus.pendingCount > 0 ? AlertTriangle : Cloud} size={16} color="primary" />
          <Font variant="body-bold" color="primary" text={d.syncTitle} align="left" />
        </Stack>
        <Font
          variant="auxiliary"
          color="muted"
          text={
            syncStatus.pendingCount > 0
              ? formatString(d.syncPendingChanges, { count: syncStatus.pendingCount })
              : d.syncAllSynced
          }
          align="left"
        />
      </Stack>
    </Box>
  )
}

function DrawerNegotiationSection({
  onClose,
  onNavigate,
  onCancelOperation,
  onBackToDashboard,
  hasCartItems,
}: {
  onClose: () => void
  onNavigate: (v: "negociacoes" | "ultimas-negociacoes") => void
  onCancelOperation?: () => void
  onBackToDashboard: () => void
  hasCartItems: boolean
}) {
  const d = UI_STRINGS.pdv.drawer
  return (
    <Stack gap={2.5}>
      <Font variant="body-xs-bold" color="muted" text={d.negotiationHeader} />
      <Box display="flex" direction="col" bg="bg-surface" border={true} borderColor="border-border" radius="default" overflow="hidden">
        <Box padding={2.5} w="full" cursor="pointer" hoverBg="secondary/10" onClick={() => { onClose(); onNavigate("negociacoes") }}>
          <Font variant="body-sm-semibold" text={d.searchNegotiations} align="left" />
        </Box>
        <Box h="h-[1px]" w="full" bg="bg-border" />
        <Box padding={2.5} w="full" cursor="pointer" hoverBg="secondary/10" onClick={() => { onClose(); onNavigate("ultimas-negociacoes") }}>
          <Font variant="body-sm-semibold" text={d.lastNegotiations} align="left" />
        </Box>
        <Box h="h-[1px]" w="full" bg="bg-border" />
        <Box
          padding={2.5}
          w="full"
          cursor="pointer"
          hoverBg="secondary/10"
          onClick={() => {
            onClose()
            if (onCancelOperation) onCancelOperation()
            else onBackToDashboard()
          }}
        >
          <Font variant="body-sm-semibold" text={hasCartItems ? d.cancelOperation : d.finalizeService} align="left" />
        </Box>
      </Box>
    </Stack>
  )
}

function DrawerDetailsSection({
  customerName,
  observationText,
  discountPercentFormatted,
  onClose,
  onNavigate,
  onOpenDiscountModal,
  onOpenObservationModal,
}: {
  customerName?: string
  observationText?: string
  discountPercentFormatted: string
  onClose: () => void
  onNavigate: (v: "clientes" | "recebimentos" | "devolucao") => void
  onOpenDiscountModal: () => void
  onOpenObservationModal: () => void
}) {
  const d = UI_STRINGS.pdv.drawer
  return (
    <Stack gap={2.5}>
      <Box display="flex" direction="col" bg="bg-surface" border={true} borderColor="border-border" radius="default" overflow="hidden">
        <Box padding={2.5} w="full" cursor="pointer" hoverBg="secondary/10" onClick={() => { onClose(); onNavigate("clientes") }}>
          <Stack direction="row" align="center" justify="between" w="full" gap={2.5}>
            <Box shrink="0">
              <Font variant="body-sm-semibold" text={d.clientLabel} align="left" />
            </Box>
            <Box flex="1" minW="0" overflow="hidden" display="flex" justify="end">
              <Font as="div" variant="body-sm-medium" color="muted" align="right" truncate={true} lineClamp={1} text={customerName || UI_STRINGS.common.notSelected} />
            </Box>
          </Stack>
        </Box>
        <Box h="h-[1px]" w="full" bg="bg-border" />
        <Box padding={2.5} w="full" cursor="pointer" hoverBg="secondary/10" onClick={() => { onClose(); onOpenDiscountModal() }}>
          <Stack direction="row" align="center" justify="between" w="full">
            <Font variant="body-sm-semibold" text={d.discountOnSale} align="left" />
            <Font variant="body-sm-medium" color="muted" text={discountPercentFormatted} />
          </Stack>
        </Box>
        <Box h="h-[1px]" w="full" bg="bg-border" />
        <Box padding={2.5} w="full" cursor="pointer" hoverBg="secondary/10" onClick={() => { onClose(); onOpenObservationModal() }}>
          <Stack direction="row" align="center" justify="between" w="full" gap={2.5}>
            <Box shrink="0">
              <Font variant="body-sm-semibold" text={d.observation} align="left" />
            </Box>
            {observationText ? (
              <Box flex="1" minW="0" overflow="hidden" display="flex" justify="end">
                <Font as="div" variant="body-sm-medium" color="muted" align="right" truncate={true} lineClamp={1} text={observationText} />
              </Box>
            ) : null}
          </Stack>
        </Box>
        <Box h="h-[1px]" w="full" bg="bg-border" />
        <Box padding={2.5} w="full" cursor="pointer" hoverBg="secondary/10" onClick={() => { onClose(); onNavigate("recebimentos") }}>
          <Font variant="body-sm-semibold" text={d.receipts} align="left" />
        </Box>
        <Box h="h-[1px]" w="full" bg="bg-border" />
        <Box padding={2.5} w="full" cursor="pointer" hoverBg="secondary/10" onClick={() => { onClose(); onNavigate("devolucao") }}>
          <Font variant="body-sm-semibold" text={d.returns} align="left" />
        </Box>
      </Box>
    </Stack>
  )
}

function DrawerOperationsSection({
  onClose,
  onNavigate,
  onOpenSangriaModal,
}: {
  onClose: () => void
  onNavigate: (v: "totais-em-caixa" | "sangrias-suprimentos") => void
  onOpenSangriaModal: (mode?: "sangria" | "suprimento") => void
}) {
  const d = UI_STRINGS.pdv.drawer
  return (
    <Stack gap={2.5}>
      <Font variant="body-xs-bold" color="muted" text={d.otherOperationsHeader} />
      <Box display="flex" direction="col" bg="bg-surface" border={true} borderColor="border-border" radius="default" overflow="hidden">
        <Box padding={2.5} w="full" cursor="pointer" hoverBg="secondary/10" onClick={() => { onClose(); onOpenSangriaModal("sangria") }}>
          <Font variant="body-sm-semibold" text={d.sangria} align="left" />
        </Box>
        <Box h="h-[1px]" w="full" bg="bg-border" />
        <Box padding={2.5} w="full" cursor="pointer" hoverBg="secondary/10" onClick={() => { onClose(); onOpenSangriaModal("suprimento") }}>
          <Font variant="body-sm-semibold" text={d.supply} align="left" />
        </Box>
        <Box h="h-[1px]" w="full" bg="bg-border" />
        <Box padding={2.5} w="full" cursor="pointer" hoverBg="secondary/10" onClick={() => { onClose(); onNavigate("sangrias-suprimentos") }}>
          <Font variant="body-sm-semibold" text={d.searchSangrias} align="left" />
        </Box>
        <Box h="h-[1px]" w="full" bg="bg-border" />
        <Box padding={2.5} w="full" cursor="pointer" hoverBg="secondary/10" onClick={() => { onClose(); onNavigate("totais-em-caixa") }}>
          <Font variant="body-sm-semibold" text={d.cashTotals} align="left" />
        </Box>
      </Box>
    </Stack>
  )
}

export function PdvSidebarDrawer({
  isOpen,
  onClose,
  onBackToDashboard,
  onNavigate,
  onOpenObservationModal,
  onOpenSangriaModal,
  onOpenDiscountModal,
  discount = 0,
  subtotal = 0,
  onSyncClick,
  customerName,
  observationText,
  showOutOfStockProducts = true,
  onToggleShowOutOfStock,
  hasCartItems = false,
  onCancelOperation,
}: PdvSidebarDrawerProps) {
  const d = UI_STRINGS.pdv.drawer

  const discountPercentFormatted = React.useMemo(() => {
    if (!discount || !subtotal || subtotal <= 0) return "0,00%"
    const pct = (discount / subtotal) * 100
    return `${Number(pct.toFixed(2)).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`
  }, [discount, subtotal])

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={d.menuTitle} variant="sidebar">
      <Stack gap={5}>
        <DrawerSyncCard onSyncClick={onSyncClick} />
        <DrawerNegotiationSection
          onClose={onClose}
          onNavigate={onNavigate}
          onCancelOperation={onCancelOperation}
          onBackToDashboard={onBackToDashboard}
          hasCartItems={hasCartItems}
        />
        <DrawerDetailsSection
          customerName={customerName}
          observationText={observationText}
          discountPercentFormatted={discountPercentFormatted}
          onClose={onClose}
          onNavigate={onNavigate}
          onOpenDiscountModal={onOpenDiscountModal}
          onOpenObservationModal={onOpenObservationModal}
        />
        <DrawerOperationsSection
          onClose={onClose}
          onNavigate={onNavigate}
          onOpenSangriaModal={onOpenSangriaModal}
        />
        <Stack gap={2.5}>
          <Font variant="body-xs-bold" color="muted" text={d.optionsHeader} />
          <Box display="flex" direction="col" bg="bg-surface" border={true} borderColor="border-border" radius="default" overflow="hidden">
            <Box
              padding={2.5}
              w="full"
              cursor="pointer"
              hoverBg="secondary/10"
              onClick={() => onToggleShowOutOfStock?.(!showOutOfStockProducts)}
            >
              <Stack direction="row" align="center" justify="between" w="full">
                <Font variant="body-sm-semibold" text={d.showOutOfStockProducts} align="left" />
                <Font variant="body-sm-medium" color={showOutOfStockProducts ? "success" : "muted"} text={showOutOfStockProducts ? "Sim" : "Não"} />
              </Stack>
            </Box>
            <Box h="h-[1px]" w="full" bg="bg-border" />
            <Box padding={2.5} w="full" cursor="pointer" hoverBg="secondary/10" onClick={onBackToDashboard}>
              <Font variant="body-sm-semibold" text={UI_STRINGS.pdv.drawer.backToDashboard} align="left" />
            </Box>
          </Box>
        </Stack>
      </Stack>
    </Modal>
  )
}
