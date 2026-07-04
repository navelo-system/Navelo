import * as React from "react"
import { RegistrySection } from "@/components/store/advanced/RegistrySection"
import { Grid } from "@/components/store/base/Grid"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Switch } from "@/components/store/base/Switch"
import { CustomSelect, CustomSelectItem } from "@/components/store/base/CustomSelect"
import { ToggleLeft, Monitor, Tablet, Smartphone } from "lucide-react"

export const SwitchesSection: React.FC = () => {
  const [selectedTerminal, setSelectedTerminal] = React.useState("1")

  return (
    <RegistrySection
      title="Seletores e Switches"
      description="Controles rápidos de formulários e painéis de configuração."
      icon={ToggleLeft}
    >
      <Grid cols={2} gap={5}>
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
            <CustomSelect
              value={selectedTerminal}
              onChange={setSelectedTerminal}
              placeholder="Selecione o terminal..."
            >
              <CustomSelectItem value="1" text="Caixa Principal (Frente)" icon={Monitor} />
              <CustomSelectItem value="2" text="Terminal Autoatendimento 1" icon={Tablet} />
              <CustomSelectItem value="3" text="Mobile Garçom" icon={Smartphone} />
            </CustomSelect>
          </Stack>
        </Stack>
      </Grid>
    </RegistrySection>
  )
}
