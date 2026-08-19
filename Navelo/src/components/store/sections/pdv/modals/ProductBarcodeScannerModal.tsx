"use client"

import * as React from "react"
import { Modal } from "@/components/store/base/Modal"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { EmptyState } from "@/components/store/intermediary/EmptyState"
import { Scan } from "lucide-react"
import { UI_STRINGS } from "@/constants/strings"

interface ProductBarcodeScannerModalProps {
  isOpen: boolean
  onClose: () => void
  onScan: (code: string) => void
}

type BarcodeDetectorLike = {
  detect: (source: ImageBitmapSource) => Promise<Array<{ rawValue: string }>>
}

function useBarcodeScanner(isOpen: boolean, onScan: (c: string) => void, onClose: () => void) {
  const videoRef = React.useRef<HTMLVideoElement>(null)
  const isBarcodeSupported = typeof window !== "undefined" && "BarcodeDetector" in window
  const [isSupported, setIsSupported] = React.useState(isBarcodeSupported)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (!isOpen) return
    let stream: MediaStream | null = null
    let animationFrame = 0
    let cancelled = false
    const video = videoRef.current

    const startScanner = async () => {
      if (!isBarcodeSupported) {
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

        const detector = new ((window as unknown) as {
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
            // ignore
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
      stream?.getTracks().forEach((t) => t.stop())
      if (video) video.srcObject = null
    }
  }, [isOpen, isBarcodeSupported, onClose, onScan])

  return { videoRef, isSupported, errorMessage }
}

export function ProductBarcodeScannerModal({
  isOpen,
  onClose,
  onScan,
}: ProductBarcodeScannerModalProps) {
  const { videoRef, isSupported, errorMessage } = useBarcodeScanner(isOpen, onScan, onClose)
  const s = UI_STRINGS.scanner

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={s.scanProductTitle} variant="bottom">
      <Stack gap={5} w="full">
        {!isSupported ? (
          <EmptyState icon={Scan} title={s.scannerUnavailableTitle} subtitle={s.scannerUnavailableSubtitle} />
        ) : errorMessage ? (
          <EmptyState icon={Scan} title={s.cameraUnavailableTitle} subtitle={errorMessage} />
        ) : (
          <Box w="full" overflow="hidden" radius="default" bg="bg-surface-sunken" border={true} borderColor="border-border">
            <Box as="video" ref={videoRef} w="full" h="h-56" objectFit="cover" playsInline muted />
          </Box>
        )}
        <Font variant="description" color="muted" text={s.pointCameraInstruction} align="center" />
      </Stack>
    </Modal>
  )
}
