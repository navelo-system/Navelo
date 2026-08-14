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

interface SaleLinkModalProps {
  isOpen: boolean
  onClose: () => void
  pdfUrl: string
  saleName: string
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
    const rawPhone = phone.replace(/\D/g, "")
    const message = encodeURIComponent(
      `Olá,\n\nSegue o link para download do documento *${saleName}*:\n\n🔗 Baixe o comprovante aqui: ${pdfUrl}`
    )
    const url = rawPhone
      ? `https://wa.me/${rawPhone}?text=${message}`
      : `https://wa.me/?text=${message}`
    window.open(url, "_blank", "noopener,noreferrer")
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Enviar Link de Download"
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
            text="Escaneie para baixar o comprovante"
            align="center"
          />
        </Stack>

        {/* Link + Copiar */}
        <Stack direction="col" gap={2.5} w="full">
          <Font variant="body-sm-medium" text="Link do comprovante" color="muted" />
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
              title={copied ? "Copiado!" : "Copiar link"}
            />
          </Stack>
        </Stack>

        {/* Divisor */}
        <Stack direction="row" gap={2.5} w="full" align="center">
          <Box flex="1" h="fit-content" borderBottom />
          <Font variant="auxiliary" color="muted" text="Enviar via WhatsApp" />
          <Box flex="1" h="fit-content" borderBottom />
        </Stack>

        {/* Campo de número + Botão Enviar WhatsApp */}
        <Stack direction="col" gap={2.5} w="full">
          <Font variant="body-sm-medium" text="Número do destinatário" color="muted" />
          <Stack direction="row" gap={2.5} w="full" align="center">
            <Box flex="1">
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+55 (11) 99999-9999"
                type="tel"
              />
            </Box>
            <Button
              variant="primary-icon"
              icon={MessageCircle}
              onClick={handleSendWhatsApp}
              title="Enviar via WhatsApp"
            />
          </Stack>
          <Font
            variant="auxiliary"
            color="muted"
            text="Deixe em branco para abrir o WhatsApp sem destinatário"
          />
        </Stack>
      </Stack>
    </Modal>
  )
}
