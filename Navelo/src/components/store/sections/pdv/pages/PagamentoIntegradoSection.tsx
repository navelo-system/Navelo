"use client"

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Input } from "@/components/store/base/Input"
import { Button } from "@/components/store/base/Button"
import { Icon } from "@/components/store/base/Icon"
import { EmptyState } from "@/components/store/intermediary/EmptyState"
import { LinkPosModal } from "@/components/store/sections/pdv/modals/LinkPosModal"
import { CreditCard, Plus, Trash2 } from "lucide-react"
import { UI_STRINGS } from "@/constants/strings"

export interface PagamentoIntegradoSectionProps {
  onCancel: () => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
  type?: "integrated" | "order"
}

function DeviceNameCard({
  deviceName,
  setDeviceName,
}: {
  deviceName: string
  setDeviceName: (v: string) => void
}) {
  const [isEditing, setIsEditing] = React.useState(false)
  const [tempName, setTempName] = React.useState(deviceName)
  const s = UI_STRINGS.integratedPayment

  const handleEditClick = () => {
    if (isEditing) setDeviceName(tempName)
    else setTempName(deviceName)
    setIsEditing(!isEditing)
  }

  return (
    <Box bg="bg-white" border borderColor="border-border" radius="default" padding={5} w="full">
      <Stack direction="col" mobileDirection="row" align="stretch" mobileAlign="center" gap={5} w="full">
        <Stack gap={1} flex="1" w="full">
          <Input
            label={s.terminalIdLabel}
            value={isEditing ? tempName : deviceName}
            onChange={(e) => setTempName(e.target.value)}
            disabled={!isEditing}
            placeholder={s.terminalIdPlaceholder}
          />
          <Font variant="description" text={UI_STRINGS.pagamentoIntegrado.deviceNameNote} align="left" />
        </Stack>
        <Box shrink="0" w="full" display="flex">
          <Button variant="primary" label={isEditing ? UI_STRINGS.common.save : UI_STRINGS.common.edit} onClick={handleEditClick} />
        </Box>
      </Stack>
    </Box>
  )
}

function LinkedPosListCard({
  type,
  linkedPosList,
  onOpenModal,
  onUnlinkPos,
}: {
  type: "integrated" | "order"
  linkedPosList: string[]
  onOpenModal: () => void
  onUnlinkPos: (idx: number) => void
}) {
  const s = UI_STRINGS.integratedPayment
  const isIntegrated = type === "integrated"

  return (
    <Box bg={isIntegrated ? "bg-white" : "bg-transparent"} border={isIntegrated} borderColor="border-border" radius="default" padding={isIntegrated ? 5 : 0} w="full">
      <Stack gap={5} w="full">
        <Stack direction="col" mobileDirection="row" align="stretch" mobileAlign="center" justify="start" mobileJustify="between" w="full" gap={2.5}>
          <Font variant="body-bold" text={isIntegrated ? "POS's vinculados" : "POS's vinculados:"} align="left" />
          <Button variant="primary" label={s.providerTitle} icon={Plus} onClick={onOpenModal} />
        </Stack>

        {linkedPosList.length === 0 ? (
          <EmptyState icon={CreditCard} title={UI_STRINGS.pagamentoIntegrado.emptyPosTitle} subtitle={UI_STRINGS.pagamentoIntegrado.emptyPosSubtitle} />
        ) : (
          <Stack gap={2.5} w="full">
            {linkedPosList.map((pos, idx) => (
              <Box key={idx} border borderColor="border-border" padding={5} radius="default" w="full" bg="bg-white">
                <Stack direction="row" align="center" justify="between" w="full" gap={5}>
                  <Stack direction="row" align="center" gap={2.5}>
                    <Icon icon={CreditCard} size={20} color="muted" />
                    <Font variant="body-bold" text={`POS código: ${pos}`} />
                  </Stack>
                  <Button variant="outline" label={UI_STRINGS.common.delete} icon={Trash2} onClick={() => onUnlinkPos(idx)} />
                </Stack>
              </Box>
            ))}
          </Stack>
        )}
      </Stack>
    </Box>
  )
}

export const PagamentoIntegradoSection: React.FC<PagamentoIntegradoSectionProps> = ({
  onCancel,
  setCustomBack,
  setCustomTitle,
  type = "integrated",
}) => {
  const [deviceName, setDeviceName] = React.useState("Dispositivo 18")
  const [linkedPosList, setLinkedPosList] = React.useState<string[]>([])
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const s = UI_STRINGS.integratedPayment

  const pageTitle = type === "integrated" ? s.title : "Ordem de Pagamento"

  React.useEffect(() => {
    setCustomBack?.(() => () => onCancel())
    setCustomTitle?.(pageTitle)
    return () => {
      setCustomBack?.(null)
      setCustomTitle?.(null)
    }
  }, [setCustomBack, setCustomTitle, pageTitle, onCancel])

  return (
    <Stack gap={5} w="full">
      {type === "integrated" && <DeviceNameCard deviceName={deviceName} setDeviceName={setDeviceName} />}
      <LinkedPosListCard
        type={type}
        linkedPosList={linkedPosList}
        onOpenModal={() => setIsModalOpen(true)}
        onUnlinkPos={(idx) => setLinkedPosList((prev) => prev.filter((_, i) => i !== idx))}
      />
      <LinkPosModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onLink={(code) => { setLinkedPosList((prev) => [...prev, code]); setIsModalOpen(false) }}
        title={pageTitle}
      />
    </Stack>
  )
}
