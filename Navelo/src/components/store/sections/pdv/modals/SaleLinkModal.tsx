"use client"

import * as React from "react"
import { Link2, Copy, Check, MessageCircle } from "lucide-react"
import { Stack } from "@/components/store/base/Stack"
import { Box } from "@/components/store/base/Box"
import { Font } from "@/components/store/base/Font"
import { Button } from "@/components/store/base/Button"
import { Input } from "@/components/store/base/Input"
import { Modal } from "@/components/store/base/Modal"
import { UI_STRINGS } from "@/constants/strings"

interface SaleLinkModalProps {
  isOpen: boolean
  onClose: () => void
  pdfUrl: string
  saleName: string
}

function normalizePhoneForWhatsApp(rawPhone: string): string {
  const digits = rawPhone.replace(/\D/g, "")
  if (!digits) return ""
  if (digits.startsWith("55") && (digits.length === 12 || digits.length === 13)) {
    return digits
  }
  if (digits.length === 10 || digits.length === 11) {
    return `55${digits}`
  }
  return digits
}

function SaleLinkQrSection({ qrDataUrl }: { qrDataUrl: string }) {
  const s = UI_STRINGS.saleShare
  return (
    <Stack direction="col" gap={2.5} align="center">
      <Box padding={2.5} radius="default" bg="bg-surface" align="center" justify="center" shadow="default">
        {qrDataUrl && (
          <Box as="img" src={qrDataUrl} alt="QR Code do Comprovante" radius="default" display="block" />
        )}
      </Box>
      <Font variant="auxiliary" color="muted" text={s.scanQrInstruction} align="center" />
    </Stack>
  )
}

function useQrCodeData(isOpen: boolean, pdfUrl: string) {
  const [qrDataUrl, setQrDataUrl] = React.useState<string>("")
  React.useEffect(() => {
    if (!isOpen || !pdfUrl) return
    let cancelled = false
    const generateQr = async () => {
      try {
        const QRCode = (await import("qrcode")).default
        if (cancelled) return
        const url = await QRCode.toDataURL(pdfUrl, {
          width: 180,
          margin: 2,
          color: { dark: "#122b4d", light: "#ffffff" },
        })
        if (!cancelled) setQrDataUrl(url)
      } catch (err) {
        console.error("[SaleLinkModal] Erro ao gerar QR Code:", err)
      }
    }
    generateQr()
    return () => {
      cancelled = true
    }
  }, [isOpen, pdfUrl])
  return qrDataUrl
}

function SaleLinkCopySection({ pdfUrl }: { pdfUrl: string }) {
  const [copied, setCopied] = React.useState(false)
  const s = UI_STRINGS.saleShare

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(pdfUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      const ta = document.createElement("textarea")
      ta.value = pdfUrl
      document.body.appendChild(ta)
      ta.select()
      document.execCommand("copy")
      document.body.removeChild(ta)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
  }

  return (
    <Stack direction="col" gap={2.5} w="full">
      <Font variant="body-sm-medium" text={s.receiptLinkLabel} color="muted" />
      <Stack direction="row" gap={2.5} w="full" align="center">
        <Box flex="1" padding={2.5} radius="default" bg="bg-card" overflow="hidden">
          <Font variant="auxiliary" text={pdfUrl} truncate mono />
        </Box>
        <Button
          variant={copied ? "primary-icon" : "secondary-icon"}
          icon={copied ? Check : Copy}
          onClick={handleCopy}
          title={copied ? s.copiedTooltip : s.copyLinkTooltip}
        />
      </Stack>
    </Stack>
  )
}

function SaleLinkWhatsAppSection({ pdfUrl, saleName }: { pdfUrl: string; saleName: string }) {
  const [phone, setPhone] = React.useState("")
  const isPhoneValid = phone.replace(/\D/g, "").length >= 10
  const s = UI_STRINGS.saleShare

  const handleSendWhatsApp = () => {
    const normalizedPhone = normalizePhoneForWhatsApp(phone)
    if (!normalizedPhone) return
    const message = encodeURIComponent(
      `Olá,\n\nSegue o link para download do documento *${saleName}*:\n\n🔗 Baixe o comprovante aqui: ${pdfUrl}`
    )
    window.open(`https://wa.me/${normalizedPhone}?text=${message}`, "_blank", "noopener,noreferrer")
  }

  return (
    <Stack direction="col" gap={2.5} w="full">
      <Font variant="body-sm-medium" text={s.recipientNumberLabel} color="muted" />
      <Stack direction="row" gap={2.5} w="full" align="center">
        <Box flex="1">
          <Input
            mask="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder={s.phonePlaceholder}
            type="tel"
          />
        </Box>
        <Button
          variant="primary-icon"
          icon={MessageCircle}
          onClick={handleSendWhatsApp}
          disabled={!isPhoneValid}
          title={s.sendViaWhatsApp}
        />
      </Stack>
      <Font variant="auxiliary" color="muted" text={s.phoneHelpText} />
    </Stack>
  )
}

export function SaleLinkModal({
  isOpen,
  onClose,
  pdfUrl,
  saleName,
}: SaleLinkModalProps) {
  const qrDataUrl = useQrCodeData(isOpen, pdfUrl)
  const s = UI_STRINGS.saleShare

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={s.sendLinkModalTitle}
      variant="default"
      showCancelButton
    >
      <Stack direction="col" gap={5} w="full" align="center">
        <SaleLinkQrSection qrDataUrl={qrDataUrl} />
        <SaleLinkCopySection pdfUrl={pdfUrl} />
        <Stack direction="row" gap={2.5} w="full" align="center">
          <Box flex="1" h="fit-content" borderBottom />
          <Font variant="auxiliary" color="muted" text={s.sendViaWhatsApp} />
          <Box flex="1" h="fit-content" borderBottom />
        </Stack>
        <SaleLinkWhatsAppSection pdfUrl={pdfUrl} saleName={saleName} />
      </Stack>
    </Modal>
  )
}
