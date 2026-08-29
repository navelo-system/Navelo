"use client"

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Checkbox } from "@/components/store/base/Checkbox"
import { Button } from "@/components/store/base/Button"
import { Warning } from "@/components/store/base/Warning"
import { DiscardChangesModal } from "@/components/store/advanced/DiscardChangesModal"
import { CustomSelect, CustomSelectItem } from "@/components/store/base/CustomSelect"
import { Monitor, Check, Info } from "lucide-react"
import { UI_STRINGS } from "@/constants/strings"
import { getActiveDevices } from "@/lib/sync/deviceSyncSettings"

export interface OpcoesPedidoMenuDigitalSectionProps {
  onCancel: () => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
  setCustomActions?: (actions: React.ReactNode | null) => void
}

interface OpcoesPedidoMenuDigitalState {
  aceitarPedidos: boolean
  dispositivo: string
}

const STORAGE_KEY = "navelo_opcoes_pedido_menu_digital_settings"

function getDefaultState(): OpcoesPedidoMenuDigitalState {
  return {
    aceitarPedidos: false,
    dispositivo: "current",
  }
}

function loadOpcoesPedidoMenuDigitalState(): OpcoesPedidoMenuDigitalState {
  if (typeof window === "undefined") return getDefaultState()
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return getDefaultState()
    return { ...getDefaultState(), ...JSON.parse(raw) }
  } catch {
    return getDefaultState()
  }
}

function OpcoesPedidoMenuDigitalCard({
  aceitarPedidos,
  setAceitarPedidos,
  dispositivo,
  setDispositivo,
}: {
  aceitarPedidos: boolean
  setAceitarPedidos: (v: boolean) => void
  dispositivo: string
  setDispositivo: (v: string) => void
}) {
  const o = UI_STRINGS.orderOptions
  const devices = React.useMemo(() => getActiveDevices(), [])

  React.useEffect(() => {
    if (devices.length > 0 && (!dispositivo || !devices.some((d) => d.id === dispositivo || d.name === dispositivo))) {
      setDispositivo(devices[0].id)
    }
  }, [devices, dispositivo, setDispositivo])

  return (
    <Box bg="bg-white" border borderColor="border-border" radius="default" padding={5} w="full">
      <Stack gap={5} w="full">
        <Stack direction="row" align="start" gap={2.5} w="full">
          <Checkbox checked={aceitarPedidos} onChange={(e) => setAceitarPedidos(e.target.checked)} />
          <Stack gap={1} flex="1">
            <Font variant="body-bold" text={UI_STRINGS.digitalMenu.allowOnlineOrdersToggle} />
            <Font variant="description" text={o.allowOnlineOrdersDesc} color="muted" />
          </Stack>
        </Stack>
        <Box h="h-[1px]" w="full" bg="bg-border" />
        <Stack gap={2.5} w="full">
          <Font variant="description" text={o.deviceReceivingOrdersLabel} color="muted" />
          <CustomSelect value={dispositivo} onChange={setDispositivo} placeholder={o.selectDevicePlaceholder}>
            {devices.map((d) => (
              <CustomSelectItem
                key={d.id}
                value={d.id}
                text={d.isCurrent ? `${d.name} (Este dispositivo)` : d.name}
                icon={Monitor}
              />
            ))}
          </CustomSelect>
        </Stack>
      </Stack>
    </Box>
  )
}

export const OpcoesPedidoMenuDigitalSection: React.FC<OpcoesPedidoMenuDigitalSectionProps> = ({
  onCancel,
  setCustomBack,
  setCustomTitle,
  setCustomActions,
}) => {
  const [initial, setInitial] = React.useState<OpcoesPedidoMenuDigitalState>(() => loadOpcoesPedidoMenuDigitalState())
  const [draft, setDraft] = React.useState<OpcoesPedidoMenuDigitalState>(() => loadOpcoesPedidoMenuDigitalState())
  const [isDiscardModalOpen, setIsDiscardModalOpen] = React.useState(false)
  const s = UI_STRINGS.orderOptions

  const isDirty = React.useMemo(
    () => JSON.stringify(draft) !== JSON.stringify(initial),
    [draft, initial]
  )

  const handleBack = React.useCallback(() => {
    if (isDirty) {
      setIsDiscardModalOpen(true)
    } else {
      onCancel()
    }
  }, [isDirty, onCancel])

  const handleSave = React.useCallback(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(draft))
    }
    setInitial(draft)
    onCancel()
  }, [draft, onCancel])

  const handleBackRef = React.useRef(handleBack)
  const handleSaveRef = React.useRef(handleSave)

  React.useEffect(() => {
    handleBackRef.current = handleBack
    handleSaveRef.current = handleSave
  }, [handleBack, handleSave])

  React.useEffect(() => {
    setCustomBack?.(() => () => handleBackRef.current())
    setCustomTitle?.(s.title)
    setCustomActions?.(
      <Button
        variant="primary-pill-icon"
        icon={Check}
        onClick={() => handleSaveRef.current()}
      />
    )
    return () => {
      setCustomBack?.(null)
      setCustomTitle?.(null)
      setCustomActions?.(null)
    }
  }, [setCustomBack, setCustomTitle, setCustomActions, s.title])

  return (
    <>
      <Box flex="1" minH="0" h="full" overflowY="auto" w="full">
        <Stack gap={5} w="full">
          <OpcoesPedidoMenuDigitalCard
            aceitarPedidos={draft.aceitarPedidos}
            setAceitarPedidos={(val) => setDraft((p) => ({ ...p, aceitarPedidos: val }))}
            dispositivo={draft.dispositivo}
            setDispositivo={(val) => setDraft((p) => ({ ...p, dispositivo: val }))}
          />
          <Warning variant="info" icon={Info} title={s.deviceReceivingNotice} />
        </Stack>
      </Box>

      {/* Modal de Descarte de Alterações */}
      <DiscardChangesModal
        isOpen={isDiscardModalOpen}
        onClose={() => setIsDiscardModalOpen(false)}
        onConfirmDiscard={() => {
          setIsDiscardModalOpen(false)
          onCancel()
        }}
      />
    </>
  )
}
