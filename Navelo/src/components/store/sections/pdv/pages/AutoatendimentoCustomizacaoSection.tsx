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
import { Package, ClipboardList } from "lucide-react"

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

  React.useEffect(() => {
    setCustomBack?.(() => () => onCancel())
    setCustomTitle?.("Customização PDV")
    return () => {
      setCustomBack?.(null)
      setCustomTitle?.(null)
    }
  }, [setCustomBack, setCustomTitle, onCancel])

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
          <Font variant="body-bold" text="Estoque" />

          {/* Exibir apenas produtos com estoque */}
          <Stack direction="row" align="center" justify="between" w="full" gap={5}>
            <Font variant="body" text="Exibir apenas produtos com estoque" />
            <Switch
              checked={exibirApenasEstoque}
              onChange={(e) => setExibirApenasEstoque(e.target.checked)}
            />
          </Stack>

          <Box h="h-[1px]" w="full" bg="bg-border" />

          {/* Exibir a quantidade de estoque de cada produto */}
          <Stack direction="row" align="center" justify="between" w="full" gap={5}>
            <Font variant="body" text="Exibir a quantidade de estoque de cada produto" />
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
            <Font variant="body-bold" text="Página principal" />
            <Font
              variant="description"
              text="Defina qual página será exibida primeiro no PDV em telas verticais: Produtos ou Resumo. Eles aparecem uma por vez e o usuário pode alternar entre eles. Em telas horizontais eles aparecem juntos."
              color="muted"
            />
          </Stack>

          <CustomSelect
            value={paginaPrincipal}
            onChange={(val) => setPaginaPrincipal(val as "produtos" | "resumo")}
          >
            <CustomSelectItem value="produtos" text="Página de produtos (ideal para escolha do produto em tela)" icon={Package} />
            <CustomSelectItem value="resumo" text="Página de resumo (ideal para adição de produto por código de barras)" icon={ClipboardList} />
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
          text="ℹ️ A customização de PDV será aplicada no Caixa, Delivery, Mesas e comandas e Autoatendimento. Outros dispositivos não serão afetados."
          color="muted"
        />
      </Box>

      {/* Botões de Ação */}
            <FormActions
        confirmLabel="Salvar alterações"
        onConfirm={handleSave}
        onCancel={onCancel}
      />
    </Stack>
  )
}
