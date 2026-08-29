"use client"

import * as React from "react"
import { FileText, FileSpreadsheet, Download } from "lucide-react"
import { Stack } from "@/components/store/base/Stack"
import { Box } from "@/components/store/base/Box"
import { Font } from "@/components/store/base/Font"
import { Modal } from "@/components/store/base/Modal"
import { CircularIcon } from "@/components/store/intermediary/CircularIcon"
import { UI_STRINGS } from "@/constants/strings"

export interface SaleExportModalProps {
  isOpen: boolean
  onClose: () => void
  onExportPdf: () => Promise<void> | void
  onExportCsv: () => void
}

export const SaleExportModal: React.FC<SaleExportModalProps> = ({
  isOpen,
  onClose,
  onExportPdf,
  onExportCsv,
}) => {
  const [isExporting, setIsExporting] = React.useState(false)
  const s = UI_STRINGS.negotiations

  const handlePdfClick = async () => {
    setIsExporting(true)
    try {
      await onExportPdf()
      onClose()
    } finally {
      setIsExporting(false)
    }
  }

  const handleCsvClick = () => {
    onExportCsv()
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      variant="bottom"
      title={s.exportSalesModalTitle}
      showCancelButton
    >
      <Stack direction="col" gap={2.5} w="full">
        {/* Opção 1 — Exportar para PDF */}
        <Box
          w="full"
          padding={5}
          radius="default"
          bg="bg-brand-primary/10"
          hoverBg="secondary/10"
          cursor="pointer"
          onClick={handlePdfClick}
        >
          <Stack direction="row" gap={2.5} align="center" w="full">
            <CircularIcon icon={FileText} size={20} variant="solid" solidColor="primary" solidRadius="default" />
            <Stack direction="col" gap={1} align="start" flex="1">
              <Font variant="body-medium" text={isExporting ? s.generatingExport : s.exportToPdfTitle} />
              <Font variant="auxiliary" color="muted" text={s.exportToPdfSubtitle} />
            </Stack>
          </Stack>
        </Box>

        {/* Opção 2 — Exportar para CSV */}
        <Box
          w="full"
          padding={5}
          radius="default"
          bg="bg-brand-primary/10"
          hoverBg="secondary/10"
          cursor="pointer"
          onClick={handleCsvClick}
        >
          <Stack direction="row" gap={2.5} align="center" w="full">
            <CircularIcon icon={FileSpreadsheet} size={20} variant="solid" solidColor="secondary" solidRadius="default" />
            <Stack direction="col" gap={1} align="start" flex="1">
              <Font variant="body-medium" text={s.exportToCsvTitle} />
              <Font variant="auxiliary" color="muted" text={s.exportToCsvSubtitle} />
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Modal>
  )
}
