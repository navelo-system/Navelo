"use client"

import * as React from "react"
import { Box } from "../../base/Box"
import { Stack } from "../../base/Stack"
import { Font } from "../../base/Font"
import { Button } from "../../base/Button"
import { Modal } from "../../base/Modal"
import { Cloud } from "lucide-react"
import { CircularIcon } from "../../intermediary/CircularIcon"

export interface BackupSectionProps {
  onCancel: () => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
}

export const BackupSection: React.FC<BackupSectionProps> = ({
  onCancel,
  setCustomBack,
  setCustomTitle
}) => {
  const [backingUp, setBackingUp] = React.useState(false)
  const [showModal, setShowModal] = React.useState(false)

  React.useEffect(() => {
    setCustomBack?.(() => () => onCancel())
    setCustomTitle?.("Backup")
    return () => {
      setCustomBack?.(null)
      setCustomTitle?.(null)
    }
  }, [setCustomBack, setCustomTitle, onCancel])

  const handleBackup = () => {
    setBackingUp(true)
    setTimeout(() => {
      setBackingUp(false)
      setShowModal(true)
    }, 2000)
  }

  return (
    <Stack gap={5} w="full">
      <Box
        bg="bg-white"
        border={true}
        borderColor="border-border"
        radius="default"
        padding={12}
        w="full"
      >
        <Stack gap={5} align="center" justify="center" w="full">
          <CircularIcon icon={Cloud} size={32} variant="primary" />

          <Font
            variant="description"
            text="Faça backup dos seus dados e salve-os em um local seguro."
            color="muted"
            align="center"
          />

          <Box w="fit-content">
            <Button
              type="button"
              variant="primary"
              label={backingUp ? "Realizando backup..." : "Fazer backup"}
              onClick={handleBackup}
              disabled={backingUp}
            />
          </Box>
        </Stack>
      </Box>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Backup Concluído"
        subtitle="Seus dados foram salvos com sucesso"
        icon={Cloud}
        successText="Ok"
        onSuccess={() => setShowModal(false)}
        showCancelButton={false}
      >
        <Font variant="body" text="Backup realizado com sucesso!" />
      </Modal>
    </Stack>
  )
}
