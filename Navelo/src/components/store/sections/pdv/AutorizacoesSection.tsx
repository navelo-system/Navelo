"use client"

/* eslint-disable max-lines-per-function */

import * as React from "react"
import { Box } from "../../base/Box"
import { Stack } from "../../base/Stack"
import { Font } from "../../base/Font"
import { Input } from "../../base/Input"
import { Button } from "../../base/Button"
import { Icon } from "../../base/Icon"
import { Switch } from "../../base/Switch"
import { X, CheckCircle, Search } from "lucide-react"
import { EmptyState } from "../../intermediary/EmptyState"

export interface AutorizacoesSectionProps {
  onCancel: () => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
}

const CustomCheckbox = ({ checked, onChange, label }: { checked: boolean, onChange: () => void, label: string }) => (
  <Stack direction="col" mobileDirection="row" gap={2.5} className="md:gap-5" align="start" mobileAlign="center" justify="start" mobileJustify="between" w="full">
    <Box className="order-2 md:order-1">
      <Font variant="body-sm-medium" text={label} align="left" />
    </Box>
    <Box className="order-1 md:order-2">
      <Switch checked={checked} onChange={onChange} />
    </Box>
  </Stack>
)

export const AutorizacoesSection: React.FC<AutorizacoesSectionProps> = ({
  onCancel,
  setCustomBack,
  setCustomTitle
}) => {
  const [period, setPeriod] = React.useState("Hoje")
  const [dateStart, setDateStart] = React.useState("08/07/2026 00:00")
  const [dateEnd, setDateEnd] = React.useState("08/07/2026 23:59")
  const [operator, setOperator] = React.useState("")
  const [authorizer, setAuthorizer] = React.useState("")
  const [device, setDevice] = React.useState("")
  const [showDenied, setShowDenied] = React.useState(false)

  React.useEffect(() => {
    setCustomBack?.(() => () => onCancel())
    setCustomTitle?.("Registro de autorizações")
    return () => {
      setCustomBack?.(null)
      setCustomTitle?.(null)
    }
  }, [setCustomBack, setCustomTitle, onCancel])

  return (
    <Stack direction="col" className="lg:flex-row" gap={5} w="full" align="stretch">
      {/* Painel Principal (Esquerda) */}
      <Box
        flex="1"
        bg="bg-white"
        border={true}
        borderColor="border-border"
        radius="default"
        padding={5}
      >
        <EmptyState
          icon={Search}
          title="Nenhum registro encontrado."
          subtitle="Tente ajustar os filtros ao lado."
        />
      </Box>

      {/* Painel de Filtros (Direita) */}
      <Box
        w="full"
        className="lg:w-80"
        bg="bg-white"
        border={true}
        borderColor="border-border"
        radius="default"
        padding={5}
        shrink="0"
      >
        <Stack gap={5} w="full">
          <Font variant="body-bold" text="Filtros" />

          {/* Período */}
          <Stack gap={2.5} w="full">
            <Font variant="sub-tiny-bold" text="Período" />
            <Stack direction="row" wrap gap={2.5} w="full">
              {["Hoje", "7D", "1M", "3M", "6M", "1A"].map((p) => {
                const isActive = period === p
                return (
                  <Box
                    key={p}
                    as="button"
                    type="button"
                    onClick={() => setPeriod(p)}
                    bg={isActive ? "bg-brand-primary" : "bg-transparent"}
                    border={true}
                    borderColor={isActive ? "brand-primary" : "border"}
                    radius="default"
                    paddingX={2.5}
                    paddingY={1}
                    cursor="pointer"
                  >
                    <Font
                      variant="body-xs-semibold"
                      color={isActive ? "white" : "foreground"}
                      text={p}
                    />
                  </Box>
                )
              })}
            </Stack>
          </Stack>

          {/* Inicial e Final Inputs */}
          <Stack gap={2.5} w="full">
            <Input
              label="Inicial"
              value={dateStart}
              onChange={(e) => setDateStart(e.target.value)}
              iconRight={X}
            />
            <Input
              label="Final"
              value={dateEnd}
              onChange={(e) => setDateEnd(e.target.value)}
              iconRight={X}
            />
          </Stack>

          {/* Demais Inputs */}
          <Stack gap={2.5} w="full">
            <Input
              label="Operador"
              placeholder="Operador"
              value={operator}
              onChange={(e) => setOperator(e.target.value)}
            />
            <Input
              label="Autorizador"
              placeholder="Autorizador"
              value={authorizer}
              onChange={(e) => setAuthorizer(e.target.value)}
            />
            <Input
              label="Dispositivo"
              placeholder="Dispositivo"
              value={device}
              onChange={(e) => setDevice(e.target.value)}
            />
          </Stack>

          {/* Checkbox */}
          <CustomCheckbox
            checked={showDenied}
            onChange={() => setShowDenied(!showDenied)}
            label="Mostrar tentativas de autorização negadas"
          />

          {/* Botão Filtrar */}
          <Box paddingY={2.5} w="full">
            <Button
              variant="primary"
              label="Filtrar"
              fullWidth
            />
          </Box>
        </Stack>
      </Box>
    </Stack>
  )
}
