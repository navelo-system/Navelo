import * as React from "react"
import { RegistrySection } from "@/components/store/advanced/RegistrySection"
import { Grid } from "@/components/store/base/Grid"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Switch } from "@/components/store/base/Switch"
import { Select } from "@/components/store/base/Select"
import { ToggleLeft } from "lucide-react"

export const SwitchesSection: React.FC = () => {
  return (
    <RegistrySection
      title="Seletores e Switches"
      description="Controles rápidos de formulários e painéis de configuração."
      icon={ToggleLeft}
    >
      <Grid cols={2} gap={12.5}>
        <Stack gap={5}>
          <Stack direction="row" gap={5} align="center" justify="between">
            <Stack gap={1}>
              <Font variant="body-semibold" text="Modo Noturno" />
              <Font variant="description" text="Alterar esquema de cores do PDV" />
            </Stack>
            <Switch defaultChecked />
          </Stack>

          <Stack direction="row" gap={5} align="center" justify="between">
            <Stack gap={1}>
              <Font variant="body-semibold" text="Impressão Automática" />
              <Font variant="description" text="Imprimir NFC-e ao fechar pedido" />
            </Stack>
            <Switch />
          </Stack>
        </Stack>

        <Stack gap={5}>
          <Stack gap={2.5}>
            <Font variant="sub-tiny" text="Ponto de Venda" />
            <Select>
              <option value="1">Caixa Principal (Frente)</option>
              <option value="2">Terminal Autoatendimento 1</option>
              <option value="3">Mobile Garçom</option>
            </Select>
          </Stack>
        </Stack>
      </Grid>
    </RegistrySection>
  )
}
