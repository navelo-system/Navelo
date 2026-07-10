"use client"

/* eslint-disable max-lines-per-function */

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Switch } from "@/components/store/base/Switch"
import { Button } from "@/components/store/base/Button"
import { FormActions } from "@/components/store/intermediary/FormActions"
import { Warning } from "@/components/store/base/Warning"
import { Grid } from "@/components/store/base/Grid"
import { QrCodeSvg } from "@/components/store/base/QrCodeSvg"
import { Check } from "lucide-react"

export interface WhatsAppSectionProps {
  onCancel: () => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
}

export const WhatsAppSection: React.FC<WhatsAppSectionProps> = ({
  onCancel,
  setCustomBack,
  setCustomTitle
}) => {
  const [enabled, setEnabled] = React.useState(true)

  React.useEffect(() => {
    setCustomBack?.(() => () => onCancel())
    setCustomTitle?.("WhatsApp")
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
            <Stack gap={1}>
              <Font variant="body-bold" text="Habilitar" />
              <Font
                variant="description"
                text="Ative esta opção para enviar notificações automáticas para os clientes."
                color="muted"
              />
            </Stack>
            <Switch
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
            />
          </Stack>

          {enabled && (
            <>
              <Warning
                variant="success"
                icon={Check}
                title="WhatsApp habilitado"
                text="Siga as instruções abaixo para conectar seu WhatsApp e habilitar o envio automático de mensagens."
              />

              {/* Instruções de Conexão + QR Code */}
              <Box
                border={true}
                borderColor="border-border"
                radius="default"
                padding={5}
                w="full"
              >
                <Grid cols={2} gap={5} w="full">
                  {/* Lado esquerdo: Passos */}
                  <Stack gap={5}>
                    <Font variant="body-bold" text="Conecte seu WhatsApp" />
                    <Stack gap={2.5}>
                      <Stack direction="row" gap={2.5} align="start">
                        <Box
                          bg="bg-brand-primary/10"
                          radius="full"
                          w="w-6"
                          h="h-6"
                          shrink="0"
                        >
                          <Stack align="center" justify="center" h="full" w="full" gap={0}>
                            <Font variant="sub-tiny-bold" text="1" color="primary" />
                          </Stack>
                        </Box>
                        <Font variant="body" text="Abra o WhatsApp no seu celular" />
                      </Stack>

                      <Stack direction="row" gap={2.5} align="start">
                        <Box
                          bg="bg-brand-primary/10"
                          radius="full"
                          w="w-6"
                          h="h-6"
                          shrink="0"
                        >
                          <Stack align="center" justify="center" h="full" w="full" gap={0}>
                            <Font variant="sub-tiny-bold" text="2" color="primary" />
                          </Stack>
                        </Box>
                        <Font variant="body" text="Toque em Menu (três pontos) ou Configurações" />
                      </Stack>

                      <Stack direction="row" gap={2.5} align="start">
                        <Box
                          bg="bg-brand-primary/10"
                          radius="full"
                          w="w-6"
                          h="h-6"
                          shrink="0"
                        >
                          <Stack align="center" justify="center" h="full" w="full" gap={0}>
                            <Font variant="sub-tiny-bold" text="3" color="primary" />
                          </Stack>
                        </Box>
                        <Font variant="body" text='Selecione "Dispositivos conectados"' />
                      </Stack>

                      <Stack direction="row" gap={2.5} align="start">
                        <Box
                          bg="bg-brand-primary/10"
                          radius="full"
                          w="w-6"
                          h="h-6"
                          shrink="0"
                        >
                          <Stack align="center" justify="center" h="full" w="full" gap={0}>
                            <Font variant="sub-tiny-bold" text="4" color="primary" />
                          </Stack>
                        </Box>
                        <Font variant="body" text='Toque em "Conectar um dispositivo"' />
                      </Stack>

                      <Stack direction="row" gap={2.5} align="start">
                        <Box
                          bg="bg-brand-primary/10"
                          radius="full"
                          w="w-6"
                          h="h-6"
                          shrink="0"
                        >
                          <Stack align="center" justify="center" h="full" w="full" gap={0}>
                            <Font variant="sub-tiny-bold" text="5" color="primary" />
                          </Stack>
                        </Box>
                        <Font variant="body" text="Aponte a câmera para o QR Code exibido na tela" />
                      </Stack>
                    </Stack>
                  </Stack>

                  {/* Lado direito: QR Code SVG */}
                  <Box
                    padding={2.5}
                    border={true}
                    borderColor="border-border"
                    radius="default"
                    bg="bg-white"
                    w="w-[180px]"
                    h="h-[180px]"
                    shrink="0"
                  >
                    <Stack align="center" justify="center" h="full" w="full" gap={0}>
                      <QrCodeSvg width={140} height={140} />
                    </Stack>
                  </Box>
                </Grid>
              </Box>
            </>
          )}
        </Stack>
      </Box>

      <FormActions
        confirmLabel="Salvar alterações"
        onConfirm={handleSave}
        onCancel={onCancel}
      />
    </Stack>
  )
}
