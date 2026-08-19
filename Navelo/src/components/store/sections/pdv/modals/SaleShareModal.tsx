"use client"

import * as React from "react"
import { Download, Link2, Share2 } from "lucide-react"
import { Stack } from "@/components/store/base/Stack"
import { Box } from "@/components/store/base/Box"
import { Font } from "@/components/store/base/Font"
import { Modal } from "@/components/store/base/Modal"
import { CircularIcon } from "@/components/store/intermediary/CircularIcon"
import { UI_STRINGS } from "@/constants/strings"

interface SaleShareModalProps {
  isOpen: boolean
  onClose: () => void
  pdfUrl: string | null
  saleName: string
  onGeneratePdf: () => Promise<string | null>
  onOpenLinkModal: (url: string) => void
}

interface ShareOptionCardProps {
  icon: typeof Download
  color: "primary" | "secondary"
  title: string
  subtitle: string
  onClick: () => void
}

function ShareOptionCard({ icon, color, title, subtitle, onClick }: ShareOptionCardProps) {
  return (
    <Box
      w="full"
      padding={5}
      radius="default"
      bg="bg-brand-primary/10"
      hoverBg="primary/10"
      cursor="pointer"
      onClick={onClick}
    >
      <Stack direction="row" gap={2.5} align="center" w="full">
        <CircularIcon icon={icon} size={20} variant="solid" solidColor={color} solidRadius="default" />
        <Stack direction="col" gap={1} align="start" flex="1">
          <Font variant="body-medium" text={title} />
          <Font variant="auxiliary" color="muted" text={subtitle} />
        </Stack>
      </Stack>
    </Box>
  )
}

export function SaleShareModal({
  isOpen,
  onClose,
  pdfUrl,
  saleName,
  onGeneratePdf,
  onOpenLinkModal,
}: SaleShareModalProps) {
  const [isGenerating, setIsGenerating] = React.useState(false)
  const s = UI_STRINGS.saleShare

  const resolveUrl = async (): Promise<string | null> => {
    if (pdfUrl) return pdfUrl
    setIsGenerating(true)
    try {
      return await onGeneratePdf()
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
      title={s.shareReceiptModalTitle}
      subtitle={saleName}
      icon={Share2}
      showCancelButton
    >
      <Stack direction="col" gap={2.5} w="full">
        <ShareOptionCard
          icon={Download}
          color="primary"
          title={isGenerating ? s.generatingPdf : s.saveFile}
          subtitle={s.downloadPdfDevice}
          onClick={handleSaveFile}
        />
        <ShareOptionCard
          icon={Link2}
          color="secondary"
          title={s.sendDownloadLink}
          subtitle={s.shareQrOrWhatsApp}
          onClick={handleSendLink}
        />
      </Stack>
    </Modal>
  )
}
