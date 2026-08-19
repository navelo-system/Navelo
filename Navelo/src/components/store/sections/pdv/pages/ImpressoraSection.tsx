"use client"


import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Switch } from "@/components/store/base/Switch"
import { Checkbox } from "@/components/store/base/Checkbox"
import { Input } from "@/components/store/base/Input"
import { Button } from "@/components/store/base/Button"
import { FormActions } from "@/components/store/intermediary/FormActions"
import { CustomSelect, CustomSelectItem } from "@/components/store/base/CustomSelect"
import { Printer, Settings, RefreshCw } from "lucide-react"
import { PrintTestModal } from "@/components/store/sections/pdv/modals/PrintTestModal"
import { UI_STRINGS } from "@/constants/strings"

export interface ImpressoraSectionProps {
  onCancel: () => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
}

export const ImpressoraSection: React.FC<ImpressoraSectionProps> = ({
  onCancel,
  setCustomBack,
  setCustomTitle
}) => {
  const [habilitarImpressao, setHabilitarImpressao] = React.useState(false)
  const [tipoConexao, setTipoConexao] = React.useState<"usb" | "rede">("usb")
  const [tamanhoBobina, setTamanhoBobina] = React.useState("58MM")
  const [modoCompatibilidade, setModoCompatibilidade] = React.useState("default")
  const [aumentarFonte, setAumentarFonte] = React.useState(false)
  const [numeroColunas, setNumeroColunas] = React.useState(32)

  const [habilitarGaveta, setHabilitarGaveta] = React.useState(false)
  const [modeloImpressora, setModeloImpressora] = React.useState("custom")
  const [comandoGaveta, setComandoGaveta] = React.useState("")
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const s = UI_STRINGS.printers

  React.useEffect(() => {
    setCustomBack?.(() => () => onCancel())
    setCustomTitle?.(s.title)
    return () => {
      setCustomBack?.(null)
      setCustomTitle?.(null)
    }
  }, [setCustomBack, setCustomTitle, onCancel, s.title])

  const handleSave = () => {
    onCancel()
  }

  const handlePrintTest = () => {
    setIsModalOpen(true)
  }

  return (
    <Stack gap={5} w="full">
      {/* Card 1: Configurações Gerais de Impressão */}
      <Box
        bg="bg-white"
        border={true}
        borderColor="border-border"
        radius="default"
        padding={5}
        w="full"
      >
        <Stack gap={5} w="full">
          {/* Habilitar Impressão */}
          <Stack direction="row" align="center" justify="between" w="full" gap={5}>
            <Font variant="body-bold" text={s.title} />
            <Switch
              checked={habilitarImpressao}
              onChange={(e) => setHabilitarImpressao(e.target.checked)}
            />
          </Stack>

          {habilitarImpressao && (
            <>
              <Box h="h-[1px]" w="full" bg="bg-border" />

              {/* Tipo de Conexão */}
              <Stack gap={1} w="full">
                <Font variant="sub-tiny-bold" text={s.typeLabel} />
                <CustomSelect
                  value={tipoConexao}
                  onChange={(val) => setTipoConexao(val as "usb" | "rede")}
                >
                  <CustomSelectItem value="usb" text={s.usbOption} icon={Settings} />
                  <CustomSelectItem value="rede" text={s.networkOption} icon={Settings} />
                </CustomSelect>
              </Stack>

              <Box h="h-[1px]" w="full" bg="bg-border" />

              {/* Tamanho da bobina */}
              <Stack gap={1} w="full">
                <Font variant="sub-tiny-bold" text={s.paperWidthLabel} />
                <CustomSelect
                  value={tamanhoBobina}
                  onChange={(val) => setTamanhoBobina(val)}
                >
                  <CustomSelectItem value="58MM" text={s.width58mm} icon={Printer} />
                  <CustomSelectItem value="80MM" text={s.width80mm} icon={Printer} />
                </CustomSelect>
              </Stack>

              {/* Modo de compatibilidade */}
              <Stack gap={1} w="full">
                <Font variant="sub-tiny-bold" text={s.compatibilityModeLabel} />
                <CustomSelect
                  value={modoCompatibilidade}
                  onChange={(val) => setModoCompatibilidade(val)}
                >
                  <CustomSelectItem value="default" text={s.disabledDefaultOption} icon={Settings} />
                  <CustomSelectItem value="escpos" text={s.escposOption} icon={Settings} />
                </CustomSelect>
              </Stack>

              {/* Aumentar fonte */}
              <Stack direction="row" align="center" gap={2.5} w="full">
                <Checkbox
                  checked={aumentarFonte}
                  onChange={(e) => setAumentarFonte(e.target.checked)}
                />
                <Font variant="body" text={s.increaseFontLabel} />
              </Stack>

              {/* Número de colunas */}
              <Stack gap={2.5} w="full">
                <Stack direction="row" align="center" justify="between" w="full">
                  <Font variant="body" text={s.columnsNumberLabel} />
                  <Font variant="body-bold" text={numeroColunas.toString()} />
                </Stack>
                <Input
                  type="range"
                  min="20"
                  max="60"
                  value={numeroColunas}
                  onChange={(e) => setNumeroColunas(parseInt(e.target.value, 10))}
                />
              </Stack>
            </>
          )}
        </Stack>
      </Box>

      {/* Card 2: Gaveta de Dinheiro */}
      <Box
        bg="bg-white"
        border={true}
        borderColor="border-border"
        radius="default"
        padding={5}
        w="full"
      >
        <Stack gap={5} w="full">
          {/* Habilitar gaveta */}
          <Stack direction="row" align="center" justify="between" w="full" gap={5}>
            <Font variant="body-bold" text={s.enableDrawerToggle} />
            <Switch
              checked={habilitarGaveta}
              onChange={(e) => setHabilitarGaveta(e.target.checked)}
            />
          </Stack>

          {habilitarGaveta && (
            <>
              <Box h="h-[1px]" w="full" bg="bg-border" />

              {/* Modelo da impressora */}
              <Stack gap={1} w="full">
                <Font variant="sub-tiny-bold" text={s.printerModelLabel} />
                <CustomSelect
                  value={modeloImpressora}
                  onChange={(val) => setModeloImpressora(val)}
                >
                  <CustomSelectItem value="custom" text={s.customOption} icon={Printer} />
                  <CustomSelectItem value="bematech" text={s.bematechOption} icon={Printer} />
                  <CustomSelectItem value="elgin" text={s.elginOption} icon={Printer} />
                </CustomSelect>
              </Stack>

              {/* Comando de abertura da gaveta */}
              <Input
                label={s.drawerCommandLabel}
                placeholder={s.drawerCommandPlaceholder}
                value={comandoGaveta}
                onChange={(e) => setComandoGaveta(e.target.value)}
                required
              />
            </>
          )}
        </Stack>
      </Box>

      {/* Botão de Teste no Rodapé */}
      <Box w="full" display="flex" justify="center" paddingY={2.5}>
        <Button
          type="button"
          variant="outline"
          label={s.testPrintButton}
          icon={RefreshCw}
          onClick={handlePrintTest}
        />
      </Box>

      {/* Ações de Cancelar / Salvar */}
      <FormActions
        confirmLabel={UI_STRINGS.pdv.cart.saveChangesButton}
        onConfirm={handleSave}
        isSubmit={false}
        onCancel={onCancel}
      />

      {/* Modal de Impressão de Teste */}
      <PrintTestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </Stack>
  )
}
