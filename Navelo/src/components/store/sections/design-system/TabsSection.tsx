import * as React from "react"
import { RegistrySection } from "@/components/store/advanced/RegistrySection"
import { Stack } from "@/components/store/base/Stack"
import { Box } from "@/components/store/base/Box"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/store/base/Tabs"
import { Font } from "@/components/store/base/Font"
import { Input } from "@/components/store/base/Input"
import { Button } from "@/components/store/base/Button"
import { Layers, Clock } from "lucide-react"
import { EmptyState } from "@/components/store/intermediary/EmptyState"

export const TabsSection: React.FC = () => {
  return (
    <RegistrySection
      title="Navegação (Tabs)"
      description="Abas para alternar contextos sem recarregar a página."
      icon={Layers}
    >
      <Stack gap={5}>
        <Box padding={5} bg="bg-surface" radius="default">
          <Tabs defaultValue="geral">
            <TabsList>
              <TabsTrigger value="geral">Geral</TabsTrigger>
              <TabsTrigger value="permissoes">Permissões</TabsTrigger>
              <TabsTrigger value="historico">Histórico</TabsTrigger>
            </TabsList>
            
            <TabsContent value="geral">
              <Stack gap={5}>
                <Font variant="h4" text="Configurações Gerais" />
                <Input label="Nome" placeholder="Ex: Maria" />
                <Button variant="primary" label="Salvar Alterações" />
              </Stack>
            </TabsContent>
            
            <TabsContent value="permissoes">
              <Stack gap={5}>
                <Font variant="h4" text="Controle de Acesso" />
                <Font variant="description" text="Defina o que este usuário pode ver ou alterar." />
              </Stack>
            </TabsContent>

            <TabsContent value="historico">
              <Stack gap={5}>
                <EmptyState
                  icon={Clock}
                  title="Nenhuma atividade"
                  subtitle="As atividades recentes aparecerão aqui."
                />
              </Stack>
            </TabsContent>
          </Tabs>
        </Box>
      </Stack>
    </RegistrySection>
  )
}
