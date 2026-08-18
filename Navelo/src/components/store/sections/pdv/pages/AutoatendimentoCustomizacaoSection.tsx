"use client"

/* eslint-disable max-lines-per-function */

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Switch } from "@/components/store/base/Switch"
import { FormActions } from "@/components/store/intermediary/FormActions"
import { CustomSelect, CustomSelectItem } from "@/components/store/base/CustomSelect"
import { Package, ClipboardList } from "lucide-react"
import { UI_STRINGS } from "@/constants/strings"

export interface AutoatendimentoCustomizacaoSectionProps {
  onCancel: () => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
}

export const AutoatendimentoCustomizacaoSection: React.FC<AutoatendimentoCustomizacaoSectionProps> = ({
  onCancel,
  setCustomBack,
  setCustomTitle
}) => {
  const [exibirApenasEstoque, setExibirApenasEstoque] = React.useState(false)
  const [exibirQuantidadeEstoque, setExibirQuantidadeEstoque] = React.useState(false)
  const [paginaPrincipal, setPaginaPrincipal] = React.useState<"produtos" | "resumo">("produtos")
  const s = UI_STRINGS.selfService

  React.useEffect(() => {
    setCustomBack?.(() => () => onCancel())
    setCustomTitle?.(s.customizationPdvTitle)
    return () => {
      setCustomBack?.(null)
      setCustomTitle?.(null)
    }
  }, [setCustomBack, setCustomTitle, onCancel, s.customizationPdvTitle])

  const handleSave = () => {
    onCancel()
  }

  return (
    <Stack gap={5} w="full">
      {/* Card 1: Estoque */}
      <Box
        bg="bg-white"
        border={true}
        borderColor="border-border"
        radius="default"
        padding={5}
        w="full"
      >
        <Stack gap={5} w="full">
          <Font variant="body-bold" text={s.stockSectionTitle} />

          {/* Exibir apenas produtos com estoque */}
          <Stack direction="row" align="center" justify="between" w="full" gap={5}>
            <Font variant="body" text={s.showOnlyInStock} />
            <Switch
              checked={exibirApenasEstoque}
              onChange={(e) => setExibirApenasEstoque(e.target.checked)}
            />
          </Stack>

          <Box h="h-[1px]" w="full" bg="bg-border" />

          {/* Exibir a quantidade de estoque de cada produto */}
          <Stack direction="row" align="center" justify="between" w="full" gap={5}>
            <Font variant="body" text={s.showStockQuantity} />
            <Switch
              checked={exibirQuantidadeEstoque}
              onChange={(e) => setExibirQuantidadeEstoque(e.target.checked)}
            />
          </Stack>
        </Stack>
      </Box>

      {/* Card 2: Página principal */}
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
            <Font variant="body-bold" text={s.mainPageSectionTitle} />
            <Font
              variant="description"
              text={s.mainPageSectionDesc}
              color="muted"
            />
          </Stack>

          <CustomSelect
            value={paginaPrincipal}
            onChange={(val) => setPaginaPrincipal(val as "produtos" | "resumo")}
          >
            <CustomSelectItem value="produtos" text={s.productsPageOption} icon={Package} />
            <CustomSelectItem value="resumo" text={s.summaryPageOption} icon={ClipboardList} />
          </CustomSelect>
        </Stack>
      </Box>

      {/* Rodapé Informativo */}
      <Box
        bg="bg-surface"
        border={true}
        borderColor="border-border"
        radius="default"
        padding={5}
        w="full"
      >
        <Font
          variant="description"
          text={s.customizationScopeNotice}
          color="muted"
        />
      </Box>

      {/* Botões de Ação */}
      <FormActions
        confirmLabel={UI_STRINGS.common.save}
        onConfirm={handleSave}
        onCancel={onCancel}
      />
    </Stack>
  )
}
