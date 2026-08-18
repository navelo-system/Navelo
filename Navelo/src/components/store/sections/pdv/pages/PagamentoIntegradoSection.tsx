"use client"

/* eslint-disable max-lines-per-function */

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

export const PagamentoIntegradoSection: React.FC<PagamentoIntegradoSectionProps> = ({
  onCancel,
  setCustomBack,
  setCustomTitle,
  type = "integrated"
}) => {
  const [deviceName, setDeviceName] = React.useState("Dispositivo 18")
  const [isEditingName, setIsEditingName] = React.useState(false)
  const [tempDeviceName, setTempDeviceName] = React.useState("Dispositivo 18")

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

  const handleEditClick = () => {
    if (isEditingName) {
      setDeviceName(tempDeviceName)
    } else {
      setTempDeviceName(deviceName)
    }
    setIsEditingName(!isEditingName)
  }

  const handleLinkPos = (code: string) => {
    setLinkedPosList((prev) => [...prev, code])
    setIsModalOpen(false)
  }

  const handleUnlinkPos = (index: number) => {
    setLinkedPosList((prev) => prev.filter((_, idx) => idx !== index))
  }

  const posContent = (
    <Stack gap={5} w="full">
      <Stack direction="col" mobileDirection="row" align="stretch" mobileAlign="center" justify="start" mobileJustify="between" w="full" gap={2.5}>
        <Font variant="body-bold" text={type === "integrated" ? "POS's vinculados" : "POS's vinculados:"} align="left" />
        <Button
          variant="primary"
          label={s.providerTitle}
          icon={Plus}
          onClick={() => setIsModalOpen(true)}
        />
      </Stack>

      {linkedPosList.length === 0 ? (
        <EmptyState
          icon={CreditCard}
          title={UI_STRINGS.pagamentoIntegrado.emptyPosTitle}
          subtitle={UI_STRINGS.pagamentoIntegrado.emptyPosSubtitle}
        />
      ) : (
        <Stack gap={2.5} w="full">
          {linkedPosList.map((pos, idx) => (
            <Box
              key={idx}
              border={true}
              borderColor="border-border"
              padding={5}
              radius="default"
              w="full"
              bg="bg-white"
            >
              <Stack direction="row" align="center" justify="between" w="full" gap={5}>
                <Stack direction="row" align="center" gap={2.5}>
                  <Icon icon={CreditCard} size={20} color="muted" />
                  <Font variant="body-bold" text={`POS código: ${pos}`} />
                </Stack>
                <Button
                  variant="outline"
                  label={UI_STRINGS.common.delete}
                  icon={Trash2}
                  onClick={() => handleUnlinkPos(idx)}
                />
              </Stack>
            </Box>
          ))}
        </Stack>
      )}
    </Stack>
  )

  return (
    <Stack gap={5} w="full">
      {/* Nome do Dispositivo Card (Apenas para Pagamento Integrado) */}
      {type === "integrated" && (
        <Box
          bg="bg-white"
          border={true}
          borderColor="border-border"
          radius="default"
          padding={5}
          w="full"
        >
          <Stack direction="col" mobileDirection="row" align="stretch" mobileAlign="center" gap={5} w="full">
            <Box flex="1" w="full">
              <Input
                label={s.terminalIdLabel}
                value={isEditingName ? tempDeviceName : deviceName}
                onChange={(e) => setTempDeviceName(e.target.value)}
                disabled={!isEditingName}
                placeholder={s.terminalIdPlaceholder}
              />
              <Box paddingY={1}>
                <Font
                  variant="description"
                  text={UI_STRINGS.pagamentoIntegrado.deviceNameNote}
                  align="left"
                />
              </Box>
            </Box>
            <Box shrink="0" w="full" display="flex">
              <Button
                variant="primary"
                label={isEditingName ? UI_STRINGS.common.save : UI_STRINGS.common.edit}
                onClick={handleEditClick}
              />
            </Box>
          </Stack>
        </Box>
      )}

      {/* POSs Vinculados Card/Seção */}
      {type === "integrated" ? (
        <Box
          bg="bg-white"
          border={true}
          borderColor="border-border"
          radius="default"
          padding={5}
          w="full"
        >
          {posContent}
        </Box>
      ) : (
        <Box
          bg="bg-transparent"
          border={false}
          borderColor="border-border"
          radius="default"
          padding={0}
          w="full"
        >
          {posContent}
        </Box>
      )}

      {/* Vinculação Modal */}
      <LinkPosModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onLink={handleLinkPos}
        title={pageTitle}
      />
    </Stack>
  )
}
