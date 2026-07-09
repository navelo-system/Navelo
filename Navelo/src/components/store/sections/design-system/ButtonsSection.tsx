import * as React from "react"
import { RegistrySection } from "@/components/store/advanced/RegistrySection"
import { Grid } from "@/components/store/base/Grid"
import { Stack } from "@/components/store/base/Stack"
import { Box } from "@/components/store/base/Box"
import { Button } from "@/components/store/base/Button"
import { MousePointerClick, Zap, Settings, Info, Tags, Check, Trash, Bot, ArrowRight } from "lucide-react"

export const ButtonsSection: React.FC = () => {
  return (
    <RegistrySection
      title="Ações Principais (Call to Action)"
      description="Variantes de botões com controle restrito de borda e tamanho fluído."
      icon={MousePointerClick}
    >
      <Box padding={5} bg="bg-surface" radius="default">
        <Grid cols={6} gap={5}>
          <Stack gap={5}>
            <Button variant="primary" label="Primary Action" />
            <Button variant="primary-pill" label="Pill Primary" />
          </Stack>
          <Stack gap={5}>
            <Button variant="secondary" label="Secondary Action" />
            <Button variant="secondary-pill" label="Pill Secondary" />
          </Stack>
          <Stack gap={5}>
            <Button variant="primary" label="Solid Primary" />
            <Button variant="primary-pill" label="Pill Primary" />
          </Stack>
          <Stack gap={5}>
            <Button variant="secondary" label="Solid Secondary" />
            <Button variant="secondary-pill" label="Pill Secondary" />
          </Stack>
          <Stack gap={5}>
            <Button variant="outline" label="Outline Action" />
            <Button variant="outline-pill" label="Pill Outline" />
          </Stack>
          <Stack gap={5}>
            <Stack direction="row" gap={2.5} wrap>
              <Button variant="primary-pill-icon" icon={MousePointerClick} />
              <Button variant="secondary-pill-icon" icon={Zap} />
              <Button variant="success-pill-icon" icon={Check} />
              <Button variant="danger-pill-icon" icon={Trash} />
              <Button variant="outline-pill-icon" icon={Settings} />
            </Stack>
          </Stack>
        </Grid>
      </Box>

      <Stack gap={5}>
        <Box padding={5} bg="bg-surface" radius="default">
        <Stack gap={5}>
          <Stack direction="row" gap={5} wrap>
            <Button variant="outline" label="Botão com Ícone" icon={Bot} />
            <Button variant="primary" label="Avançar Passo" iconRight={ArrowRight} />
            <Button variant="secondary" label="Gerar Relatório IA" icon={Bot} iconRight={ArrowRight} />

            <Button variant="primary" label="Primary" icon={Bot} />
            <Button variant="primary" label="Primary" iconRight={ArrowRight} />
            <Button variant="primary" label="Primary" icon={Bot} iconRight={ArrowRight} />

            <Button variant="secondary" label="Secondary" icon={Bot} />
            <Button variant="secondary" label="Secondary" iconRight={ArrowRight} />
            <Button variant="secondary" label="Secondary" icon={Bot} iconRight={ArrowRight} />
          </Stack>
          <Stack direction="row" gap={5} wrap>
            <Button variant="outline-pill" label="Botão com Ícone Pill" icon={Bot} />
            <Button variant="primary-pill" label="Avançar Passo Pill" iconRight={ArrowRight} />
            <Button variant="secondary-pill" label="Gerar Relatório IA Pill" icon={Bot} iconRight={ArrowRight} />

            <Button variant="primary-pill" label="Primary Pill" icon={Bot} />
            <Button variant="primary-pill" label="Primary Pill" iconRight={ArrowRight} />
            <Button variant="primary-pill" label="Primary Pill" icon={Bot} iconRight={ArrowRight} />

            <Button variant="secondary-pill" label="Secondary Pill" icon={Bot} />
            <Button variant="secondary-pill" label="Secondary Pill" iconRight={ArrowRight} />
            <Button variant="secondary-pill" label="Secondary Pill" icon={Bot} iconRight={ArrowRight} />
          </Stack>
        </Stack>
      </Box>
      </Stack>
    </RegistrySection>
  )
}
