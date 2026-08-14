"use client"

/* eslint-disable max-lines-per-function */

import * as React from "react"
import { Download, Link2, Share2 } from "lucide-react"
import { Stack } from "@/components/store/base/Stack"
import { Box } from "@/components/store/base/Box"
import { Font } from "@/components/store/base/Font"
import { Modal } from "@/components/store/base/Modal"
import { CircularIcon } from "@/components/store/intermediary/CircularIcon"

interface SaleShareModalProps {
  isOpen: boolean
  onClose: () => void
  /** URL pública do PDF no Supabase Storage. Null se ainda não gerado. */
  pdfUrl: string | null
  saleName: string
  /** Callback async que gera o PDF sob demanda (retorna a URL pública) */
  onGeneratePdf: () => Promise<string | null>
  onOpenLinkModal: (url: string) => void
}

export const SaleShareModal: React.FC<SaleShareModalProps> = ({
  isOpen,
  onClose,
  pdfUrl,
  saleName,
  onGeneratePdf,
  onOpenLinkModal,
}) => {
  const [isGenerating, setIsGenerating] = React.useState(false)

  const resolveUrl = async (): Promise<string | null> => {
    if (pdfUrl) return pdfUrl
    setIsGenerating(true)
    try {
      const url = await onGeneratePdf()
      return url
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSaveFile = async () => {
    const url = await resolveUrl()
    if (!url) return
    const link = document.createElement("a")
    link.href = url
    link.download = `${saleName.replace(/\s+/g, "_")}.pdf`
    link.target = "_blank"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    onClose()
  }

  const handleSendLink = async () => {
    const url = await resolveUrl()
    if (!url) return
    onOpenLinkModal(url)
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      variant="bottom"
      title="Compartilhar Comprovante"
      subtitle={saleName}
      icon={Share2}
      showCancelButton
    >
      <Stack direction="col" gap={2.5} w="full">
        {/* Opção 1 — Salvar arquivo */}
        <Box
          w="full"
          padding={5}
          radius="default"
          bg="bg-brand-primary/10"
          hoverBg="primary/10"
          cursor="pointer"
          onClick={handleSaveFile}
        >
          <Stack direction="row" gap={2.5} align="center" w="full">
            <CircularIcon icon={Download} size={20} variant="solid" solidColor="primary" solidRadius="default" />
            <Stack direction="col" gap={1} align="start" flex="1">
              <Font variant="body-medium" text={isGenerating ? "Gerando PDF..." : "Salvar arquivo"} />
              <Font variant="auxiliary" color="muted" text="Download do PDF no dispositivo" />
            </Stack>
          </Stack>
        </Box>

        {/* Opção 2 — Enviar link */}
        <Box
          w="full"
          padding={5}
          radius="default"
          bg="bg-brand-primary/10"
          hoverBg="primary/10"
          cursor="pointer"
          onClick={handleSendLink}
        >
          <Stack direction="row" gap={2.5} align="center" w="full">
            <CircularIcon icon={Link2} size={20} variant="solid" solidColor="secondary" solidRadius="default" />
            <Stack direction="col" gap={1} align="start" flex="1">
              <Font variant="body-medium" text="Enviar link de download" />
              <Font variant="auxiliary" color="muted" text="Compartilhe via QR Code ou WhatsApp" />
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Modal>
  )
}
