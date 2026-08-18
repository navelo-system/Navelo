"use client"

/* eslint-disable max-lines-per-function */

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

export const SaleLinkModal: React.FC<SaleLinkModalProps> = ({
  isOpen,
  onClose,
  pdfUrl,
  saleName,
}) => {
  const [copied, setCopied] = React.useState(false)
  const [phone, setPhone] = React.useState("")
  const [qrDataUrl, setQrDataUrl] = React.useState<string>("")

  const phoneDigits = phone.replace(/\D/g, "")
  const isPhoneValid = phoneDigits.length >= 10

  // Gera o QR Code em Data URL quando o modal abre ou a URL muda
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
          color: {
            dark: "#122b4d",
            light: "#ffffff",
          },
        })
        if (!cancelled) {
          setQrDataUrl(url)
        }
      } catch (err) {
        console.error("[SaleLinkModal] Erro ao gerar QR Code:", err)
      }
    }

    generateQr()

    return () => {
      cancelled = true
    }
  }, [isOpen, pdfUrl])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(pdfUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      // fallback para browsers sem clipboard API
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

  const handleSendWhatsApp = () => {
    const normalizedPhone = normalizePhoneForWhatsApp(phone)
    if (!normalizedPhone) return

    const message = encodeURIComponent(
      `Olá,\n\nSegue o link para download do documento *${saleName}*:\n\n🔗 Baixe o comprovante aqui: ${pdfUrl}`
    )
    const url = `https://wa.me/${normalizedPhone}?text=${message}`
    window.open(url, "_blank", "noopener,noreferrer")
  }

  const s = UI_STRINGS.saleShare

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={s.sendLinkModalTitle}
      subtitle={saleName}
      icon={Link2}
      variant="default"
      showCancelButton
    >
      <Stack direction="col" gap={5} w="full" align="center">
        {/* QR Code */}
        <Stack direction="col" gap={2.5} align="center">
          <Box
            padding={2.5}
            radius="default"
            bg="bg-surface"
            align="center"
            justify="center"
            shadow="default"
          >
            {qrDataUrl && (
              <Box
                as="img"
                src={qrDataUrl}
                alt="QR Code do Comprovante"
                radius="default"
                display="block"
              />
            )}
          </Box>
          <Font
            variant="auxiliary"
            color="muted"
            text={s.scanQrInstruction}
            align="center"
          />
        </Stack>

        {/* Link + Copiar */}
        <Stack direction="col" gap={2.5} w="full">
          <Font variant="body-sm-medium" text={s.receiptLinkLabel} color="muted" />
          <Stack direction="row" gap={2.5} w="full" align="center">
            <Box
              flex="1"
              padding={2.5}
              radius="default"
              bg="bg-card"
              overflow="hidden"
            >
              <Font
                variant="auxiliary"
                text={pdfUrl}
                truncate
                mono
              />
            </Box>
            <Button
              variant={copied ? "primary-icon" : "secondary-icon"}
              icon={copied ? Check : Copy}
              onClick={handleCopy}
              title={copied ? s.copiedTooltip : s.copyLinkTooltip}
            />
          </Stack>
        </Stack>

        {/* Divisor */}
        <Stack direction="row" gap={2.5} w="full" align="center">
          <Box flex="1" h="fit-content" borderBottom />
          <Font variant="auxiliary" color="muted" text={s.sendViaWhatsApp} />
          <Box flex="1" h="fit-content" borderBottom />
        </Stack>

        {/* Campo de número + Botão Enviar WhatsApp */}
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
          <Font
            variant="auxiliary"
            color="muted"
            text={s.phoneHelpText}
          />
        </Stack>
      </Stack>
    </Modal>
  )
}
