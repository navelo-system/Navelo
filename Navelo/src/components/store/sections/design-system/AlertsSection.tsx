import * as React from "react"
import { RegistrySection } from "@/components/store/advanced/RegistrySection"
import { Stack } from "@/components/store/base/Stack"
import { Alert } from "@/components/store/intermediary/Alert"
import { Bell } from "lucide-react"

export const AlertsSection: React.FC = () => {
  return (
    <RegistrySection
      title="Alertas e Feedbacks"
      description="Mensagens de sistema integradas ao contexto da página."
      icon={Bell}
    >
      <Stack gap={5}>
        <Alert variant="info" title="Nova atualização" description="O PDV foi atualizado para a versão 2.4.5." />
        <Alert variant="success" title="Caixa aberto" description="O turno da manhã foi iniciado com sucesso." />
        <Alert variant="warning" title="Sem conexão" description="Você está operando no modo offline. As vendas serão sincronizadas em breve." />
        <Alert variant="danger" title="Erro na emissão" description="A SEFAZ rejeitou o documento. Verifique as configurações tributárias." />
      </Stack>
    </RegistrySection>
  )
}
