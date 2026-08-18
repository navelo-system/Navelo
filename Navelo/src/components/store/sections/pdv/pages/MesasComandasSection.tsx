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
import { UI_STRINGS } from "@/constants/strings"

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
  const s = UI_STRINGS.tables

  React.useEffect(() => {
    setCustomBack?.(() => () => onCancel())
    setCustomTitle?.(s.title)
    return () => {
      setCustomBack?.(null)
      setCustomTitle?.(null)
    }
  }, [setCustomBack, setCustomTitle, onCancel, s.title])

  return (
    <Box flex="1" minH="0" h="full" overflowY="auto" w="full">
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
                <Font variant="body-bold" text={s.title} />
                <Font
                  variant="description"
                  text={s.disableNotice}
                  color="muted"
                />
              </Stack>
              <Switch checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />
            </Stack>
          </Box>

          {enabled && (
            <>
              <Box h="h-[1px]" w="full" bg="bg-border" />
              {/* Opções Tipo Atendimento */}
              <Box padding={5} w="full">
                <Stack gap={2.5} w="full">
                  <CustomSelect
                    placeholder={s.serviceTypePlaceholder}
                    value={tipoAtendimento}
                    onChange={(val) => setTipoAtendimento(val as "mesas" | "comandas")}
                  >
                    <CustomSelectItem value="comandas" text={s.bothTablesTabsOption} icon={ClipboardList} />
                    <CustomSelectItem value="mesas" text={s.tablesOnlyOption} icon={LayoutGrid} />
                  </CustomSelect>
                </Stack>
              </Box>
            </>
          )}
        </Box>

        {enabled && (
          <>
            {/* Card 2: Links Rápidos de Navegação */}
            <Box
              bg="bg-white"
              border={true}
              borderColor="border-border"
              radius="default"
              overflow="hidden"
              w="full"
            >
              <Box
                padding={5}
                cursor="pointer"
                hoverBg="primary/10"
                onClick={() => onNavigate("configurar-comandas")}
                w="full"
              >
                <Stack direction="row" align="center" justify="between" w="full" gap={5}>
                  <Stack direction="row" align="center" gap={2.5} flex="1">
                    <Icon icon={ClipboardList} size={20} color="primary" />
                    <Font variant="body-bold" text={UI_STRINGS.tabsConfig.title} />
                  </Stack>
                  <Icon icon={ChevronRight} size={20} color="muted" />
                </Stack>
              </Box>

              <Box h="h-[1px]" w="full" bg="bg-border" />

              <Box
                padding={5}
                cursor="pointer"
                hoverBg="primary/10"
                onClick={() => onNavigate("taxas-servico")}
                w="full"
              >
                <Stack direction="row" align="center" justify="between" w="full" gap={5}>
                  <Stack direction="row" align="center" gap={2.5} flex="1">
                    <Icon icon={Coins} size={20} color="primary" />
                    <Font variant="body-bold" text={UI_STRINGS.fees.serviceFeeTitle} />
                  </Stack>
                  <Icon icon={ChevronRight} size={20} color="muted" />
                </Stack>
              </Box>
            </Box>

            {/* Card 3: Regras de Consumo */}
            <Box
              bg="bg-white"
              border={true}
              borderColor="border-border"
              radius="default"
              padding={5}
              w="full"
            >
              <Stack gap={5} w="full">
                <Font variant="body-bold" text={s.consumptionRulesTitle} />

                <Stack direction="row" align="start" gap={2.5} w="full">
                  <Checkbox
                    checked={limitarConsumo}
                    onChange={(e) => setLimitarConsumo(e.target.checked)}
                  />
                  <Stack gap={2.5} flex="1">
                    <Font variant="body-bold" text={s.limitConsumptionCheckboxLabel} />
                    
                    {/* Input Limite de Consumo */}
                    <Box opacity={limitarConsumo ? "100" : "50"} w="full">
                      <Stack direction="row" gap={5} w="full">
                        {/* Linha vertical de recuo */}
                        <Box w="w-[2px]" bg="bg-border" shrink="0" />
                        <Stack gap={1} flex="1">
                          <Input
                            label={s.consumptionLimitLabel}
                            placeholder={UI_STRINGS.deliveryFees.valuePlaceholder}
                            value={limiteValor}
                            onChange={(e) => setLimiteValor(e.target.value)}
                            disabled={!limitarConsumo}
                          />
                          <Font
                            variant="description"
                            text={s.consumptionLimitDesc}
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
    </Box>
  )
}
