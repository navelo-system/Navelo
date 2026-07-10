"use client"

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Button } from "@/components/store/base/Button"
import { BackupSuccessModal } from "@/components/store/sections/pdv/modals/BackupSuccessModal"
import { Cloud } from "lucide-react"
import { CircularIcon } from "@/components/store/intermediary/CircularIcon"

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

      <BackupSuccessModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </Stack>
  )
}
