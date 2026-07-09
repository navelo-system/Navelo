"use client"

/* eslint-disable max-lines-per-function */

import * as React from "react"
import { Box } from "../../base/Box"
import { Stack } from "../../base/Stack"
import { Font } from "../../base/Font"
import { Switch } from "../../base/Switch"
import { Button } from "../../base/Button"
import { CustomSelect, CustomSelectItem } from "../../base/CustomSelect"
import { Icon } from "../../base/Icon"
import { Modal } from "../../base/Modal"
import { Scale, Coins, Download, LayoutGrid, ChevronRight, HelpCircle } from "lucide-react"

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

  React.useEffect(() => {
    setCustomBack?.(() => () => onCancel())
    setCustomTitle?.("Balança etiquetadora")
    return () => {
      setCustomBack?.(null)
      setCustomTitle?.(null)
    }
  }, [setCustomBack, setCustomTitle, onCancel])

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
            <Font variant="body-bold" text="Habilitar" />
            <Switch
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
            />
          </Stack>

          {/* Leitura de etiquetas */}
          <Box opacity={enabled ? "100" : "50"} w="full">
            <Stack gap={2.5} w="full">
              <Font variant="body-bold" text="Leitura de etiquetas de balança" />
              
              <Stack direction="row" align="center" gap={2.5}>
                <Font variant="description" text="Retorno do código de barras" color="muted" />
                <Icon icon={HelpCircle} size={14} color="muted" />
              </Stack>

              <CustomSelect
                value={retornoCodigo}
                onChange={(val) => enabled && setRetornoCodigo(val as "peso" | "valor")}
                disabled={!enabled}
              >
                <CustomSelectItem value="peso" text="Peso do produto (KG)" icon={Scale} />
                <CustomSelectItem value="valor" text="Valor do produto (R$)" icon={Coins} />
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
                  <Font variant="body-bold" text="Produtos" />
                  <Font variant="description" text="0 produtos vinculados." color="muted" />
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
            <Font variant="body-bold" text="Exportar produtos" />
            <Font
              variant="description"
              text="Exporte um arquivo para realizar a carga de produtos no software da balança."
              color="muted"
            />
          </Stack>

          {/* Modelo da balança */}
          <Stack gap={1} w="full">
            <Font variant="sub-tiny-bold" text="Modelo da balança" />
            <CustomSelect
              value={modeloBalanca}
              onChange={(val) => setModeloBalanca(val)}
            >
              <CustomSelectItem value="filizola" text="Filizola" icon={Scale} />
              <CustomSelectItem value="toledo" text="Toledo" icon={Scale} />
              <CustomSelectItem value="urano" text="Urano" icon={Scale} />
            </CustomSelect>
          </Stack>

          {/* Botão Exportar alinhado à direita */}
          <Box w="full" display="flex" justify="end">
            <Button
              type="button"
              variant="outline"
              label="Exportar"
              icon={Download}
              onClick={handleExport}
            />
          </Box>
        </Stack>
      </Box>

      {/* Ações de Cancelar / Salvar */}
      <Box paddingY={2.5} w="full">
        <Stack direction="col" mobileDirection="row" justify="end" gap={2.5} w="full">
          <Button variant="outline" label="Cancelar" onClick={onCancel} />
          <Button type="button" variant="primary" label="Salvar alterações" onClick={handleSave} />
        </Stack>
      </Box>

      <Modal
        isOpen={modalMsg !== null}
        onClose={() => setModalMsg(null)}
        title="Carga de Produtos"
        subtitle="Exportação de carga"
        icon={Scale}
        successText="Ok"
        onSuccess={() => setModalMsg(null)}
        showCancelButton={false}
      >
        <Font variant="body" text={modalMsg || ""} />
      </Modal>
    </Stack>
  )
}
