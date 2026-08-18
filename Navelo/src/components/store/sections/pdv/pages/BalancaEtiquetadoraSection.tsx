"use client"

/* eslint-disable max-lines-per-function */

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Switch } from "@/components/store/base/Switch"
import { Button } from "@/components/store/base/Button"
import { FormActions } from "@/components/store/intermediary/FormActions"
import { CustomSelect, CustomSelectItem } from "@/components/store/base/CustomSelect"
import { Icon } from "@/components/store/base/Icon"
import { Scale, Coins, Download, LayoutGrid, ChevronRight, HelpCircle } from "lucide-react"
import { ScaleStatusModal } from "@/components/store/sections/pdv/modals/ScaleStatusModal"
import { UI_STRINGS } from "@/constants/strings"

export interface BalancaEtiquetadoraSectionProps {
  onCancel: () => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
  onNavigate: (subView: string) => void
}

export const BalancaEtiquetadoraSection: React.FC<BalancaEtiquetadoraSectionProps> = ({
  onCancel,
  setCustomBack,
  setCustomTitle,
  onNavigate
}) => {
  const [enabled, setEnabled] = React.useState(false)
  const [retornoCodigo, setRetornoCodigo] = React.useState<"peso" | "valor">("valor")
  const [modeloBalanca, setModeloBalanca] = React.useState("filizola")
  const [modalMsg, setModalMsg] = React.useState<string | null>(null)
  const s = UI_STRINGS.scales

  React.useEffect(() => {
    setCustomBack?.(() => () => onCancel())
    setCustomTitle?.(s.labelScaleTitle)
    return () => {
      setCustomBack?.(null)
      setCustomTitle?.(null)
    }
  }, [setCustomBack, setCustomTitle, onCancel, s.labelScaleTitle])

  const handleSave = () => {
    onCancel()
  }

  const handleExport = () => {
    setModalMsg("Exportando arquivo de carga de produtos...")
  }

  return (
    <Stack gap={5} w="full">
      {/* Card 1: Configuração e Leitura */}
      <Box
        bg="bg-white"
        border={true}
        borderColor="border-border"
        radius="default"
        padding={5}
        w="full"
      >
        <Stack gap={5} w="full">
          {/* Habilitar */}
          <Stack direction="row" align="center" justify="between" w="full" gap={5}>
            <Font variant="body-bold" text={UI_STRINGS.selfService.enableToggle} />
            <Switch
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
            />
          </Stack>

          {/* Leitura de etiquetas */}
          <Box opacity={enabled ? "100" : "50"} w="full">
            <Stack gap={2.5} w="full">
              <Font variant="body-bold" text={s.readLabelsTitle} />
              
              <Stack direction="row" align="center" gap={2.5}>
                <Font variant="description" text={s.barcodeReturnLabel} color="muted" />
                <Icon icon={HelpCircle} size={14} color="muted" />
              </Stack>

              <CustomSelect
                value={retornoCodigo}
                onChange={(val) => enabled && setRetornoCodigo(val as "peso" | "valor")}
                disabled={!enabled}
              >
                <CustomSelectItem value="peso" text={s.weightReturnOption} icon={Scale} />
                <CustomSelectItem value="valor" text={s.priceReturnOption} icon={Coins} />
              </CustomSelect>
            </Stack>
          </Box>

          <Box h="h-[1px]" w="full" bg="bg-border" />

          {/* Produtos */}
          <Box
            opacity={enabled ? "100" : "50"}
            cursor={enabled ? "pointer" : undefined}
            onClick={() => enabled && onNavigate("catalogo-produtos")}
            w="full"
          >
            <Stack direction="row" align="center" justify="between" w="full">
              <Stack direction="row" align="center" gap={2.5}>
                <Icon icon={LayoutGrid} size={20} color="primary" />
                <Stack gap={1}>
                  <Font variant="body-bold" text={s.productsSectionTitle} />
                  <Font variant="description" text={s.linkedProductsDesc} color="muted" />
                </Stack>
              </Stack>
              <Icon icon={ChevronRight} size={16} color="muted" />
            </Stack>
          </Box>
        </Stack>
      </Box>

      {/* Card 2: Exportar produtos */}
      <Box
        bg="bg-white"
        border={true}
        borderColor="border-border"
        radius="default"
        padding={5}
        w="full"
      >
        <Stack gap={5} w="full">
          <Stack gap={1}>
            <Font variant="body-bold" text={s.exportProductsTitle} />
            <Font
              variant="description"
              text={s.exportProductsDesc}
              color="muted"
            />
          </Stack>

          {/* Modelo da balança */}
          <Stack gap={1} w="full">
            <Font variant="sub-tiny-bold" text={s.scaleModelLabel} />
            <CustomSelect
              value={modeloBalanca}
              onChange={(val) => setModeloBalanca(val)}
            >
              <CustomSelectItem value="filizola" text={s.fizilolaModel} icon={Scale} />
              <CustomSelectItem value="toledo" text={s.toledoModel} icon={Scale} />
              <CustomSelectItem value="urano" text={s.uranoModel} icon={Scale} />
            </CustomSelect>
          </Stack>

          {/* Botão Exportar alinhado à direita */}
          <Box w="full" display="flex" justify="end">
            <Button
              type="button"
              variant="outline"
              label={UI_STRINGS.common.export}
              icon={Download}
              onClick={handleExport}
            />
          </Box>
        </Stack>
      </Box>

      {/* Ações de Cancelar / Salvar */}
      <FormActions
        confirmLabel={UI_STRINGS.common.save}
        onConfirm={handleSave}
        onCancel={onCancel}
      />

      <ScaleStatusModal
        isOpen={modalMsg !== null}
        onClose={() => setModalMsg(null)}
        title={s.exportModalTitle}
        subtitle={s.exportModalSubtitle}
        message={modalMsg || ""}
      />
    </Stack>
  )
}
