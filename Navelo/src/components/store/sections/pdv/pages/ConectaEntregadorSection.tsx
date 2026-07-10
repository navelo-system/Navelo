"use client"

/* eslint-disable max-lines-per-function */

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Input } from "@/components/store/base/Input"
import { Button } from "@/components/store/base/Button"
import { FormActions } from "@/components/store/intermediary/FormActions"
import { Switch } from "@/components/store/base/Switch"
import { Checkbox } from "@/components/store/base/Checkbox"
import { CustomSelect, CustomSelectItem } from "@/components/store/base/CustomSelect"
import { Icon } from "@/components/store/base/Icon"
import { Bike, ChevronRight, Info, Tablet } from "lucide-react"

export interface ConectaEntregadorSectionProps {
  onCancel: () => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
}

export const ConectaEntregadorSection: React.FC<ConectaEntregadorSectionProps> = ({
  onCancel,
  setCustomBack,
  setCustomTitle
}) => {
  const [enabled, setEnabled] = React.useState(true)
  const [mapsKey, setMapsKey] = React.useState("AIzaSyBaZ7fqoqJp_JUuh6Plz5eGeXpwZSKe9Fk")
  const [allowTracking, setAllowTracking] = React.useState(true)
  const [selectedDevice, setSelectedDevice] = React.useState("Dispositivo 10")

  React.useEffect(() => {
    setCustomBack?.(() => () => onCancel())
    setCustomTitle?.("Conecta Entregador")
    return () => {
      setCustomBack?.(null)
      setCustomTitle?.(null)
    }
  }, [setCustomBack, setCustomTitle, onCancel])

  const handleSave = () => {
    // Simulação de salvamento
    onCancel()
  }

  return (
    <Stack gap={5} w="full">
      {/* Card Habilitar & Entregadores */}
      <Box
        bg="bg-white"
        border={true}
        borderColor="border-border"
        radius="default"
        padding={5}
        w="full"
      >
        <Stack gap={5} w="full">
          <Stack direction="row" align="center" justify="between" w="full" gap={5}>
            <Stack gap={1}>
              <Font variant="body-bold" text="Habilitar" />
            </Stack>
            <Switch
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
            />
          </Stack>

          <Box h="h-[1px]" w="full" bg="bg-border" />

          {/* Atalho Entregadores */}
          <Box
            padding={2.5}
            w="full"
            cursor={enabled ? "pointer" : undefined}
            opacity={enabled ? "100" : "50"}
            onClick={() => {
              if (enabled) {
                // Simulação de navegação ou ação
              }
            }}
          >
            <Stack direction="row" align="center" justify="between" w="full" gap={2.5}>
              <Stack direction="row" align="center" gap={2.5}>
                <Icon icon={Bike} size={20} color="muted" />
                <Stack gap={1}>
                  <Font variant="body-bold" text="Entregadores" />
                  <Font variant="description" text="1 entregador vinculado" />
                </Stack>
              </Stack>
              <Icon icon={ChevronRight} size={20} color="muted" />
            </Stack>
          </Box>
        </Stack>
      </Box>

      {/* Card Localização em Tempo Real */}
      <Box
        bg="bg-white"
        border={true}
        borderColor="border-border"
        radius="default"
        padding={5}
        w="full"
        opacity={enabled ? "100" : "50"}
      >
        <Stack gap={5} w="full">
          <Font variant="body-bold" text="Localização do entregador em tempo real" />

          <Stack gap={2.5} w="full">
            <Input
              label="Insira sua chave de API do Google Maps"
              value={mapsKey}
              onChange={(e) => setMapsKey(e.target.value)}
              disabled={!enabled}
              placeholder="Digite a chave da API do Google Maps"
            />
            <Box>
              <Font variant="description" text="Não sabe como obter a chave? " />
              <Box
                as="span"
                cursor={enabled ? "pointer" : undefined}
                onClick={() => enabled && window.open("https://developers.google.com/maps", "_blank")}
                display="inline-flex"
              >
                <Font variant="description" color="primary" text="Clique aqui." />
              </Box>
            </Box>
          </Stack>

          <Stack direction="row" align="center" justify="between" w="full" gap={5}>
            <Box flex="1">
              <Checkbox
                label="Permitir que o consumidor acompanhe a localização do entregador em tempo real diretamente no Catálogo Online e/ou WhatsApp"
                checked={allowTracking}
                onChange={(e) => setAllowTracking(e.target.checked)}
                disabled={!enabled}
              />
            </Box>
            <Box shrink="0">
              <Icon icon={Info} size={20} color="muted" />
            </Box>
          </Stack>
        </Stack>
      </Box>

      {/* Card Sincronização */}
      <Box
        bg="bg-white"
        border={true}
        borderColor="border-border"
        radius="default"
        padding={5}
        w="full"
        opacity={enabled ? "100" : "50"}
      >
        <Stack gap={5} w="full">
          <Stack gap={1}>
            <Font variant="body-bold" text="Sincronização" />
            <Font
              variant="description"
              text="Sempre que o entregador concluir um pedido no Conecta Entregador, o status e as formas de pagamento serão atualizados automaticamente no Delivery, marcando o pedido como entregue."
            />
          </Stack>

          <Stack gap={2.5} w="full">
            <Font variant="body-bold" text="Dispositivo que receberá a atualização do aplicativo Conecta Entregador" />
            <CustomSelect
              value={selectedDevice}
              onChange={setSelectedDevice}
              disabled={!enabled}
            >
              <CustomSelectItem value="Dispositivo 10" text="Dispositivo 10" icon={Tablet} />
              <CustomSelectItem value="Dispositivo 18" text="Dispositivo 18" icon={Tablet} />
            </CustomSelect>
          </Stack>
        </Stack>
      </Box>

      {/* Botões de Ações na Base do Formulário */}
            <FormActions
        confirmLabel="Salvar alterações"
        onConfirm={handleSave}
        onCancel={onCancel}
      />
    </Stack>
  )
}
