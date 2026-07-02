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
      <Grid cols={2} gap={5}>
        <Stack gap={5}>
          <Button variant="outline-success" label="Soft Success" />
          <Button variant="outline-success-pill" label="Pill Success" />
        </Stack>
        <Stack gap={5}>
          <Button variant="outline-danger" label="Soft Danger" />
          <Button variant="outline-danger-pill" label="Pill Danger" />
        </Stack>
      </Grid>

      <Box padding={5} bg="bg-surface" radius="default" className="mt-5">
        <Stack gap={5}>
          <Stack direction="row" gap={5} wrap>
            <Button variant="outline-success" label="Salvar" icon={Check} />
            <Button variant="outline-danger" label="Excluir" iconRight={Trash} />
            <Button variant="outline-success" label="Aprovar" icon={Check} iconRight={ArrowRight} />
            <Button variant="outline-danger" label="Bloquear" icon={Trash} iconRight={ArrowRight} />
          </Stack>
          <Stack direction="row" gap={5} wrap>
            <Button variant="outline-success-pill" label="Salvar" icon={Check} />
            <Button variant="outline-danger-pill" label="Excluir" iconRight={Trash} />
            <Button variant="outline-success-pill" label="Aprovar" icon={Check} iconRight={ArrowRight} />
            <Button variant="outline-danger-pill" label="Bloquear" icon={Trash} iconRight={ArrowRight} />
          </Stack>
        </Stack>
      </Box>
    </RegistrySection>
  )
}
