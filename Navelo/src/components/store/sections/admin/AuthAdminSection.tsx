import * as React from "react"
import { RegistrySection } from "@/components/store/advanced/RegistrySection"
import { Box } from "@/components/store/base/Box"
import { Grid } from "@/components/store/base/Grid"
import { Form } from "@/components/store/advanced/Form"
import { Input } from "@/components/store/base/Input"
import { Button } from "@/components/store/base/Button"
import { Stack } from "@/components/store/base/Stack"
import { ShieldAlert, Mail, Lock } from "lucide-react"

export const AuthAdminSection: React.FC = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Mock login redirect
    window.location.href = "/admin"
  }

  return (
    <Stack h="h-[calc(100vh-40px)]" justify="center" w="full">
      <Grid cols={3} gap={5}>
      <Box />
      <RegistrySection
        variant="card"
        title="Autenticação Administrativa"
        description="Insira suas credenciais de super-admin"
        icon={ShieldAlert}
      >
        <Form onSubmit={handleSubmit}>
          <Input label="E-mail" placeholder="admin@navelo.com" icon={Mail} required />
          <Input label="Senha" type="password" placeholder="••••••••" icon={Lock} required />
          <Button variant="primary" label="Acessar plataforma" fullWidth />
        </Form>
      </RegistrySection>
      <Box />
    </Grid>
    </Stack>
  )
}
