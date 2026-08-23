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

interface GeneralPrinterConfigProps {
  enabled: boolean
  onToggleEnabled: (val: boolean) => void
  connectionType: "usb" | "rede"
  onConnectionTypeChange: (val: "usb" | "rede") => void
  paperWidth: string
  onPaperWidthChange: (val: string) => void
  compatibilityMode: string
  onCompatibilityModeChange: (val: string) => void
  increaseFont: boolean
  onIncreaseFontChange: (val: boolean) => void
  columnCount: number
  onColumnCountChange: (val: number) => void
}

function GeneralPrinterConfigCard(props: GeneralPrinterConfigProps) {
  const s = UI_STRINGS.printers
  const {
    enabled, onToggleEnabled, connectionType, onConnectionTypeChange,
    paperWidth, onPaperWidthChange, compatibilityMode, onCompatibilityModeChange,
    increaseFont, onIncreaseFontChange, columnCount, onColumnCountChange,
  } = props

  return (
    <Box bg="bg-white" border borderColor="border-border" radius="default" padding={5} w="full">
      <Stack gap={5} w="full">
        <Stack direction="row" align="center" justify="between" w="full" gap={5}>
          <Font variant="body-bold" text={s.title} />
          <Switch checked={enabled} onChange={(e: React.ChangeEvent<HTMLInputElement>) => onToggleEnabled(e.target.checked)} />
        </Stack>

        {enabled && (
          <>
            <Box h="h-[1px]" w="full" bg="bg-border" />
            <Stack gap={1} w="full">
              <Font variant="sub-tiny-bold" text={s.typeLabel} />
              <CustomSelect value={connectionType} onChange={(val) => onConnectionTypeChange(val as "usb" | "rede")}>
                <CustomSelectItem value="usb" text={s.usbOption} icon={Settings} />
                <CustomSelectItem value="rede" text={s.networkOption} icon={Settings} />
              </CustomSelect>
            </Stack>

            <Box h="h-[1px]" w="full" bg="bg-border" />
            <Stack gap={1} w="full">
              <Font variant="sub-tiny-bold" text={s.paperWidthLabel} />
              <CustomSelect value={paperWidth} onChange={onPaperWidthChange}>
                <CustomSelectItem value="58MM" text={s.width58mm} icon={Printer} />
                <CustomSelectItem value="80MM" text={s.width80mm} icon={Printer} />
              </CustomSelect>
            </Stack>

            <Stack gap={1} w="full">
              <Font variant="sub-tiny-bold" text={s.compatibilityModeLabel} />
              <CustomSelect value={compatibilityMode} onChange={onCompatibilityModeChange}>
                <CustomSelectItem value="default" text={s.disabledDefaultOption} icon={Settings} />
                <CustomSelectItem value="escpos" text={s.escposOption} icon={Settings} />
              </CustomSelect>
            </Stack>

            <Stack direction="row" align="center" gap={2.5} w="full">
              <Checkbox checked={increaseFont} onChange={(e: React.ChangeEvent<HTMLInputElement>) => onIncreaseFontChange(e.target.checked)} />
              <Font variant="body" text={s.increaseFontLabel} />
            </Stack>

            <Stack gap={2.5} w="full">
              <Stack direction="row" align="center" justify="between" w="full">
                <Font variant="body" text={s.columnsNumberLabel} />
                <Font variant="body-bold" text={columnCount.toString()} />
              </Stack>
              <Input type="range" min="20" max="60" value={columnCount} onChange={(e: React.ChangeEvent<HTMLInputElement>) => onColumnCountChange(parseInt(e.target.value, 10))} />
            </Stack>
          </>
        )}
      </Stack>
    </Box>
  )
}

function DrawerConfigCard({
  enabled,
  onToggleEnabled,
  printerModel,
  onPrinterModelChange,
  drawerCommand,
  onDrawerCommandChange,
}: {
  enabled: boolean
  onToggleEnabled: (val: boolean) => void
  printerModel: string
  onPrinterModelChange: (val: string) => void
  drawerCommand: string
  onDrawerCommandChange: (val: string) => void
}) {
  const s = UI_STRINGS.printers
  return (
    <Box bg="bg-white" border borderColor="border-border" radius="default" padding={5} w="full">
      <Stack gap={5} w="full">
        <Stack direction="row" align="center" justify="between" w="full" gap={5}>
          <Font variant="body-bold" text={s.enableDrawerToggle} />
          <Switch checked={enabled} onChange={(e: React.ChangeEvent<HTMLInputElement>) => onToggleEnabled(e.target.checked)} />
        </Stack>

        {enabled && (
          <>
            <Box h="h-[1px]" w="full" bg="bg-border" />
            <Stack gap={1} w="full">
              <Font variant="sub-tiny-bold" text={s.printerModelLabel} />
              <CustomSelect value={printerModel} onChange={onPrinterModelChange}>
                <CustomSelectItem value="custom" text={s.customOption} icon={Printer} />
                <CustomSelectItem value="bematech" text={s.bematechOption} icon={Printer} />
                <CustomSelectItem value="elgin" text={s.elginOption} icon={Printer} />
              </CustomSelect>
            </Stack>
            <Input label={s.drawerCommandLabel} placeholder={s.drawerCommandPlaceholder} value={drawerCommand} onChange={(e: React.ChangeEvent<HTMLInputElement>) => onDrawerCommandChange(e.target.value)} required />
          </>
        )}
      </Stack>
    </Box>
  )
}

export const ImpressoraSection: React.FC<ImpressoraSectionProps> = ({
  onCancel,
  setCustomBack,
  setCustomTitle,
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

  return (
    <Stack gap={5} w="full">
      <GeneralPrinterConfigCard
        enabled={habilitarImpressao}
        onToggleEnabled={setHabilitarImpressao}
        connectionType={tipoConexao}
        onConnectionTypeChange={setTipoConexao}
        paperWidth={tamanhoBobina}
        onPaperWidthChange={setTamanhoBobina}
        compatibilityMode={modoCompatibilidade}
        onCompatibilityModeChange={setModoCompatibilidade}
        increaseFont={aumentarFonte}
        onIncreaseFontChange={setAumentarFonte}
        columnCount={numeroColunas}
        onColumnCountChange={setNumeroColunas}
      />

      <DrawerConfigCard
        enabled={habilitarGaveta}
        onToggleEnabled={setHabilitarGaveta}
        printerModel={modeloImpressora}
        onPrinterModelChange={setModeloImpressora}
        drawerCommand={comandoGaveta}
        onDrawerCommandChange={setComandoGaveta}
      />

      <Box w="full" display="flex" justify="center">
        <Button type="button" variant="secondary" label={s.testPrintButton} icon={RefreshCw} onClick={() => setIsModalOpen(true)} />
      </Box>

      <FormActions confirmLabel={UI_STRINGS.pdv.cart.saveChangesButton} onConfirm={onCancel} isSubmit={false} onCancel={onCancel} />
      <PrintTestModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </Stack>
  )
}
