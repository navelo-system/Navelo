"use client"

/* eslint-disable max-lines-per-function */
/* eslint-disable react-hooks/set-state-in-effect */

import * as React from "react"
import { Modal } from "@/components/store/base/Modal"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { EmptyState } from "@/components/store/intermediary/EmptyState"
import { Scan } from "lucide-react"

interface ProductBarcodeScannerModalProps {
  isOpen: boolean
  onClose: () => void
  onScan: (code: string) => void
}

type BarcodeDetectorLike = {
  detect: (source: ImageBitmapSource) => Promise<Array<{ rawValue: string }>>
}

export const ProductBarcodeScannerModal: React.FC<ProductBarcodeScannerModalProps> = ({
  isOpen,
  onClose,
  onScan,
}) => {
  const videoRef = React.useRef<HTMLVideoElement>(null)
  const [isSupported, setIsSupported] = React.useState(true)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (!isOpen) return

    setIsSupported(true)
    setErrorMessage(null)

    let stream: MediaStream | null = null
    let animationFrame = 0
    let cancelled = false
    const video = videoRef.current

    const startScanner = async () => {
      setErrorMessage(null)

      if (typeof window === "undefined" || !("BarcodeDetector" in window)) {
        setIsSupported(false)
        return
      }

      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "environment" } },
          audio: false,
        })

        if (!video || cancelled) return

        video.srcObject = stream
        await video.play()

        const detector = new (window as Window & {
          BarcodeDetector: new (options: { formats: string[] }) => BarcodeDetectorLike
        }).BarcodeDetector({
          formats: ["ean_13", "ean_8", "code_128", "upc_a", "qr_code"],
        })

        const scanFrame = async () => {
          if (cancelled || !videoRef.current) return

          try {
            const codes = await detector.detect(videoRef.current)
            if (codes.length > 0 && codes[0]?.rawValue) {
              onScan(codes[0].rawValue)
              onClose()
              return
            }
          } catch {
            // Ignora frames sem leitura válida
          }

          animationFrame = requestAnimationFrame(scanFrame)
        }

        animationFrame = requestAnimationFrame(scanFrame)
      } catch {
        setErrorMessage("Não foi possível acessar a câmera. Verifique as permissões do navegador.")
      }
    }

    startScanner()

    return () => {
      cancelled = true
      cancelAnimationFrame(animationFrame)
      stream?.getTracks().forEach((track) => track.stop())
      if (video) {
        video.srcObject = null
      }
    }
  }, [isOpen, onClose, onScan])

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Escanear produto" variant="bottom">
      <Stack gap={5} w="full">
        {!isSupported ? (
          <EmptyState
            icon={Scan}
            title="Leitor indisponível"
            subtitle="Seu navegador não suporta leitura de código de barras pela câmera."
          />
        ) : errorMessage ? (
          <EmptyState
            icon={Scan}
            title="Câmera indisponível"
            subtitle={errorMessage}
          />
        ) : (
          <Box
            w="full"
            overflow="hidden"
            radius="default"
            bg="bg-surface-sunken"
            border={true}
            borderColor="border-border"
          >
            <Box
              as="video"
              ref={videoRef}
              w="full"
              h="h-56"
              objectFit="cover"
              playsInline
              muted
            />
          </Box>
        )}

        <Font
          variant="description"
          color="muted"
          text="Aponte a câmera para o código de barras do produto."
          align="center"
        />
      </Stack>
    </Modal>
  )
}
