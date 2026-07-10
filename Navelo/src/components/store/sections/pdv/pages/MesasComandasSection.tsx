"use client"

/* eslint-disable max-lines-per-function */

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Switch } from "@/components/store/base/Switch"
import { Checkbox } from "@/components/store/base/Checkbox"
import { Input } from "@/components/store/base/Input"
import { Icon } from "@/components/store/base/Icon"
import { CustomSelect, CustomSelectItem } from "@/components/store/base/CustomSelect"
import { ClipboardList, Coins, ChevronRight, LayoutGrid } from "lucide-react"

export interface MesasComandasSectionProps {
  onCancel: () => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
  onNavigate: (subView: string) => void
}

export const MesasComandasSection: React.FC<MesasComandasSectionProps> = ({
  onCancel,
  setCustomBack,
  setCustomTitle,
  onNavigate
}) => {
  const [enabled, setEnabled] = React.useState(true)
  const [tipoAtendimento, setTipoAtendimento] = React.useState<"mesas" | "comandas">("comandas")
  const [limitarConsumo, setLimitarConsumo] = React.useState(false)
  const [limiteValor, setLimiteValor] = React.useState("0,00")

  React.useEffect(() => {
    setCustomBack?.(() => () => onCancel())
    setCustomTitle?.("Mesas e comandas")
    return () => {
      setCustomBack?.(null)
      setCustomTitle?.(null)
    }
  }, [setCustomBack, setCustomTitle, onCancel])

  return (
    <Stack gap={5} w="full">
      {/* Card 1: Habilitação e Tipo */}
      <Box
        bg="bg-white"
        border={true}
        borderColor="border-border"
        radius="default"
        overflow="hidden"
        w="full"
      >
        {/* Linha Habilitar */}
        <Box padding={5} w="full">
          <Stack direction="row" align="center" justify="between" w="full" gap={5}>
            <Stack gap={1} flex="1">
              <Font variant="body-bold" text="Habilitar" />
              <Font
                variant="description"
                text="Será possível definir Mesas ou Comandas e suas numerações, com um novo módulo na tela inicial para lançar e controlar pedidos."
                color="muted"
              />
            </Stack>
            <Switch
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
            />
          </Stack>
        </Box>

        {enabled && (
          <>
            <Box h="h-[1px]" w="full" bg="bg-border" />

            {/* Tipo de atendimento */}
            <Box padding={5} w="full">
              <Stack gap={2.5} w="full">
                <Font variant="description" text="Tipo de atendimento" color="muted" />
                <CustomSelect
                  value={tipoAtendimento}
                  onChange={(val: string) => setTipoAtendimento(val as "mesas" | "comandas")}
                  disabled={!enabled}
                >
                  <CustomSelectItem value="mesas" text="Mesas" icon={LayoutGrid} />
                  <CustomSelectItem value="comandas" text="Comandas" icon={ClipboardList} />
                </CustomSelect>
              </Stack>
            </Box>

            <Box h="h-[1px]" w="full" bg="bg-border" />

            {/* Configurar comandas */}
            <Box
              padding={5}
              cursor="pointer"
              hoverBg="primary/10"
              onClick={() => onNavigate("configurar-comandas")}
              w="full"
            >
              <Stack direction="row" align="center" justify="between" w="full" gap={5}>
                <Stack direction="row" align="center" gap={2.5}>
                  <Icon icon={ClipboardList} size={20} color="primary" />
                  <Font variant="body-bold" text={tipoAtendimento === "mesas" ? "Configurar mesas" : "Configurar comandas"} />
                </Stack>
                <Icon icon={ChevronRight} size={16} color="muted" />
              </Stack>
            </Box>

            <Box h="h-[1px]" w="full" bg="bg-border" />

            {/* Configurar taxas de serviço */}
            <Box
              padding={5}
              cursor="pointer"
              hoverBg="primary/10"
              onClick={() => onNavigate("taxas-servico")}
              w="full"
            >
              <Stack direction="row" align="center" justify="between" w="full" gap={5}>
                <Stack direction="row" align="center" gap={2.5}>
                  <Icon icon={Coins} size={20} color="primary" />
                  <Font variant="body-bold" text="Configurar taxas de serviço" />
                </Stack>
                <Icon icon={ChevronRight} size={16} color="muted" />
              </Stack>
            </Box>
          </>
        )}
      </Box>

      {enabled && (
        <>
          {/* Card 2: Opções */}
          <Box
            bg="bg-white"
            border={true}
            borderColor="border-border"
            radius="default"
            padding={5}
            w="full"
          >
            <Stack gap={5} w="full">
              <Font variant="body-bold" text="Opções" />

              {/* Limitar consumo */}
              <Stack direction="row" align="start" gap={2.5} w="full">
                <Checkbox
                  checked={limitarConsumo}
                  onChange={(e) => setLimitarConsumo(e.target.checked)}
                />
                <Stack gap={2.5} flex="1">
                  <Font variant="body-bold" text="Limitar consumo por atendimento" />
                  
                  {/* Input Limite de Consumo */}
                  <Box opacity={limitarConsumo ? "100" : "50"} w="full">
                    <Stack direction="row" gap={5} w="full">
                      {/* Linha vertical de recuo */}
                      <Box w="w-[2px]" bg="bg-border" shrink="0" />
                      <Stack gap={1} flex="1">
                        <Input
                          label="Limite de consumo"
                          placeholder="R$ 0,00"
                          value={limiteValor}
                          onChange={(e) => setLimiteValor(e.target.value)}
                          disabled={!limitarConsumo}
                        />
                        <Font
                          variant="description"
                          text="Ao ultrapassar o limite, será necessária autorização de administrador."
                          color="muted"
                        />
                      </Stack>
                    </Stack>
                  </Box>
                </Stack>
              </Stack>
            </Stack>
          </Box>
        </>
      )}
    </Stack>
  )
}
