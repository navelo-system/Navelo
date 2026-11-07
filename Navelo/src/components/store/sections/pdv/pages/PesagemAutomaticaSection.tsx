"use client"

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Input } from "@/components/store/base/Input"
import { Button } from "@/components/store/base/Button"
import { Switch } from "@/components/store/base/Switch"
import { Icon } from "@/components/store/base/Icon"
import { CircularIcon } from "@/components/store/intermediary/CircularIcon"
import { EmptyState } from "@/components/store/intermediary/EmptyState"
import { LinkDeviceModal } from "@/components/store/advanced/LinkDeviceModal"
import { DiscardChangesModal } from "@/components/store/advanced/DiscardChangesModal"
import { ProdutosSection } from "@/components/store/sections/pdv/pages/ProdutosSection"
import { Scale, Monitor, ChevronRight, LayoutGrid, Plus, Check } from "lucide-react"
import { UI_STRINGS } from "@/constants/strings"

interface LinkedDevice {
  id: string
  name: string
  code: string
}

interface SelectedProduct {
  id: string
  name: string
}

export interface PesagemAutomaticaSectionProps {
  onCancel: () => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
  setCustomActions?: (actions: React.ReactNode | null) => void
}

function PesagemAuthCard({
  password,
  setPassword,
}: {
  password: string
  setPassword: (v: string) => void
}) {
  const w = UI_STRINGS.weighing
  return (
    <Box bg="bg-white" border borderColor="border-border" radius="default" padding={5} w="full">
      <Stack gap={5} w="full">
        <Font variant="body-bold" text={w.authSectionTitle} />
        <Stack gap={2.5} w="full">
          <Input label={w.passwordLabel} type="password" placeholder={w.passwordPlaceholder} value={password} onChange={(e) => setPassword(e.target.value)} />
          <Font variant="description" text={w.authDesc} />
        </Stack>
      </Stack>
    </Box>
  )
}

function PesagemProductSettingsCard({
  buffetEnabled,
  setBuffetEnabled,
  mainProduct,
  buffetProduct,
  onSelectMain,
  onSelectBuffet,
}: {
  buffetEnabled: boolean
  setBuffetEnabled: (v: boolean) => void
  mainProduct: SelectedProduct | null
  buffetProduct: SelectedProduct | null
  onSelectMain: () => void
  onSelectBuffet: () => void
}) {
  const w = UI_STRINGS.weighing
  return (
    <Box bg="bg-white" border borderColor="border-border" radius="default" overflow="hidden" w="full">
      {/* Produto Principal */}
      <Box padding={5} cursor="pointer" hoverBg="secondary/10" w="full" onClick={onSelectMain}>
        <Stack direction="row" align="center" justify="between" w="full" gap={5}>
          <Stack direction="row" align="center" gap={5}>
            <CircularIcon icon={LayoutGrid} size={20} variant="secondary" />
            <Stack gap={1}>
              <Font variant="body-bold" text={w.mainProductTitle} />
              <Font variant="description" text={mainProduct ? mainProduct.name : w.selectProductPlaceholder} color={mainProduct ? "foreground" : "muted"} />
            </Stack>
          </Stack>
          <Icon icon={ChevronRight} size={16} color="muted" />
        </Stack>
      </Box>

      <Box h="h-[1px]" w="full" bg="bg-border" />

      {/* Toggle buffet */}
      <Box padding={5} w="full">
        <Stack direction="row" align="center" justify="between" w="full" gap={5}>
          <Font variant="body" text={w.enableBuffetToggle} />
          <Switch checked={buffetEnabled} onChange={(e) => setBuffetEnabled(e.target.checked)} />
        </Stack>
      </Box>

      <Box h="h-[1px]" w="full" bg="bg-border" />

      {/* Buffet Livre */}
      <Box
        padding={5}
        cursor={buffetEnabled ? "pointer" : undefined}
        hoverBg={buffetEnabled ? "secondary/10" : undefined}
        w="full"
        opacity={buffetEnabled ? "100" : "50"}
        onClick={buffetEnabled ? onSelectBuffet : undefined}
      >
        <Stack direction="row" align="center" justify="between" w="full" gap={5}>
          <Stack direction="row" align="center" gap={5}>
            <CircularIcon icon={LayoutGrid} size={20} variant={buffetEnabled ? "secondary" : "primary"} />
            <Stack gap={1}>
              <Font variant="body-bold" text={w.buffetFreeTitle} />
              <Font variant="description" text={buffetProduct ? buffetProduct.name : w.selectProductPlaceholder} color={buffetProduct ? "foreground" : "muted"} />
            </Stack>
          </Stack>
          <Icon icon={ChevronRight} size={16} color="muted" />
        </Stack>
      </Box>
    </Box>
  )
}

function PesagemDevicesCard({
  devicesEnabled,
  setDevicesEnabled,
  devices,
  onOpenModal,
  onRemoveDevice,
}: {
  devicesEnabled: boolean
  setDevicesEnabled: (v: boolean) => void
  devices: LinkedDevice[]
  onOpenModal: () => void
  onRemoveDevice: (id: string) => void
}) {
  const w = UI_STRINGS.weighing
  return (
    <Box bg="bg-white" border borderColor="border-border" radius="default" padding={5} w="full">
      <Stack gap={5} w="full">
        <Stack direction="row" align="center" justify="between" w="full" gap={5}>
          <Font variant="body-bold" text={w.linkedDevicesTitle} />
          <Switch checked={devicesEnabled} onChange={(e) => setDevicesEnabled(e.target.checked)} />
        </Stack>

        {devicesEnabled ? (
          <Stack gap={2.5} w="full">
            {devices.length === 0 ? (
              <EmptyState icon={Monitor} title={w.emptyDevicesTitle} subtitle={w.emptyDevicesSubtitle} />
            ) : (
              <Stack gap={0} w="full">
                {devices.map((device, idx) => (
                  <React.Fragment key={device.id}>
                    {idx > 0 && <Box h="h-[1px]" w="full" bg="bg-border" />}
                    <Box padding={2.5} w="full">
                      <Stack direction="row" align="center" justify="between" w="full" gap={5}>
                        <Stack direction="row" align="center" gap={2.5}>
                          <Icon icon={Monitor} size={16} color="muted" />
                          <Stack gap={1}>
                            <Font variant="body-bold" text={device.name} />
                            <Font variant="description" text={`Código: ${device.code}`} />
                          </Stack>
                        </Stack>
                        <Button
                          variant="danger-icon-xs-confirm"
                          confirmTitle="Remover Balança"
                          confirmSubtitle="Confirmar remoção de dispositivo"
                          confirmParagraph="Tem certeza que deseja desvincular este dispositivo de pesagem?"
                          onConfirm={() => onRemoveDevice(device.id)}
                        />
                      </Stack>
                    </Box>
                  </React.Fragment>
                ))}
              </Stack>
            )}
            <Box>
              <Button variant="primary" label={w.linkDeviceButton} icon={Plus} onClick={onOpenModal} fullWidth={true} />
            </Box>
          </Stack>
        ) : (
          <EmptyState icon={Scale} title={w.disabledDevicesTitle} subtitle={w.disabledDevicesSubtitle} />
        )}
      </Stack>
    </Box>
  )
}

export const PesagemAutomaticaSection: React.FC<PesagemAutomaticaSectionProps> = ({
  onCancel,
  setCustomBack,
  setCustomTitle,
  setCustomActions,
}) => {
  const [password, setPassword] = React.useState("")
  const [buffetEnabled, setBuffetEnabled] = React.useState(false)
  const [devicesEnabled, setDevicesEnabled] = React.useState(false)
  const [devices, setDevices] = React.useState<LinkedDevice[]>([])
  const [mainProduct, setMainProduct] = React.useState<SelectedProduct | null>(null)
  const [buffetProduct, setBuffetProduct] = React.useState<SelectedProduct | null>(null)
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [isDiscardModalOpen, setIsDiscardModalOpen] = React.useState(false)
  const [pickerMode, setPickerMode] = React.useState<null | "main" | "buffet">(null)
  const w = UI_STRINGS.weighing

  const [savedPassword] = React.useState("")
  const [savedBuffet] = React.useState(false)
  const isDirty = password !== savedPassword || buffetEnabled !== savedBuffet

  const onCancelRef = React.useRef(onCancel)
  React.useEffect(() => { onCancelRef.current = onCancel })

  const handleSaveRef = React.useRef(() => { onCancelRef.current() })
  const handleRequestBackRef = React.useRef(() => {
    if (isDirty) setIsDiscardModalOpen(true)
    else onCancelRef.current()
  })

  React.useEffect(() => {
    handleRequestBackRef.current = () => {
      if (isDirty) setIsDiscardModalOpen(true)
      else onCancelRef.current()
    }
  }, [isDirty])

  React.useEffect(() => {
    if (pickerMode) return
    setCustomBack?.(() => () => handleRequestBackRef.current())
    setCustomTitle?.(w.title)
    setCustomActions?.(
      <Button variant="primary-pill-icon" icon={Check} onClick={() => handleSaveRef.current()} />
    )
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pickerMode])

  React.useEffect(() => {
    return () => {
      setCustomBack?.(null)
      setCustomTitle?.(null)
      setCustomActions?.(null)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Picker mode — reutiliza ProdutosSection com prop onSelectProduct
  if (pickerMode) {
    return (
      <ProdutosSection
        pickerTitle={pickerMode === "main" ? w.mainProductTitle : w.buffetFreeTitle}
        selectedProductId={pickerMode === "main" ? mainProduct?.id : buffetProduct?.id}
        setCustomBack={setCustomBack}
        setCustomTitle={setCustomTitle}
        setCustomActions={setCustomActions}
        onSelectProduct={(prod) => {
          if (pickerMode === "main") setMainProduct(prod)
          else setBuffetProduct(prod)
          setPickerMode(null)
        }}
      />
    )
  }

  return (
    <>
      <Stack gap={5} w="full">
        <PesagemAuthCard password={password} setPassword={setPassword} />
        <PesagemProductSettingsCard
          buffetEnabled={buffetEnabled}
          setBuffetEnabled={setBuffetEnabled}
          mainProduct={mainProduct}
          buffetProduct={buffetProduct}
          onSelectMain={() => setPickerMode("main")}
          onSelectBuffet={() => setPickerMode("buffet")}
        />
        <PesagemDevicesCard
          devicesEnabled={devicesEnabled}
          setDevicesEnabled={setDevicesEnabled}
          devices={devices}
          onOpenModal={() => setIsModalOpen(true)}
          onRemoveDevice={(id) => setDevices((prev) => prev.filter((d) => d.id !== id))}
        />
        <LinkDeviceModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={(code, name) => setDevices((prev) => [...prev, { id: Date.now().toString(), name, code }])}
          appName={w.title}
          appIcon={Scale}
        />
      </Stack>
      <DiscardChangesModal
        isOpen={isDiscardModalOpen}
        onClose={() => setIsDiscardModalOpen(false)}
        onConfirmDiscard={() => {
          setIsDiscardModalOpen(false)
          onCancelRef.current()
        }}
      />
    </>
  )
}
