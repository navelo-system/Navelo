import * as React from "react"
import { RegistrySection } from "@/components/store/advanced/RegistrySection"
import { Grid } from "@/components/store/base/Grid"
import { Stack } from "@/components/store/base/Stack"
import { Box } from "@/components/store/base/Box"
import { Button } from "@/components/store/base/Button"
import { MousePointerClick, Check, Trash, ArrowRight } from "lucide-react"

export const SemanticActionsSection: React.FC = () => {
  return (
    <RegistrySection
      title="Ações Semânticas"
      description="Botões de estado (sucesso e perigo) com estilo outline e cores inalteráveis."
      icon={MousePointerClick}
    >
      <Box padding={5} bg="bg-surface" radius="default">
        <Grid cols={2} gap={5}>
          <Stack gap={5}>
            <Button variant="success" label="Solid Success" />
            <Button variant="success-pill" label="Pill Success" />
          </Stack>
          <Stack gap={5}>
            <Button variant="danger" label="Solid Danger" />
            <Button variant="danger-pill" label="Pill Danger" />
          </Stack>
        </Grid>
      </Box>

      <Box padding={5} bg="bg-surface" radius="default">
        <Stack gap={5}>
          <Stack direction="row" gap={5} wrap>
            <Button variant="success" label="Salvar" icon={Check} />
            <Button variant="danger" label="Excluir" iconRight={Trash} />
            <Button variant="success" label="Aprovar" icon={Check} iconRight={ArrowRight} />
            <Button variant="danger" label="Bloquear" icon={Trash} iconRight={ArrowRight} />
          </Stack>
          <Stack direction="row" gap={5} wrap>
            <Button variant="success-pill" label="Salvar" icon={Check} />
            <Button variant="danger-pill" label="Excluir" iconRight={Trash} />
            <Button variant="success-pill" label="Aprovar" icon={Check} iconRight={ArrowRight} />
            <Button variant="danger-pill" label="Bloquear" icon={Trash} iconRight={ArrowRight} />
          </Stack>
        </Stack>
      </Box>
    </RegistrySection>
  )
}
