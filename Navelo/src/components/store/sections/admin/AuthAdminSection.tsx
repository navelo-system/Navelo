import * as React from "react"
import { RegistrySection } from "@/components/store/advanced/RegistrySection"
import { Box } from "@/components/store/base/Box"
import { Grid } from "@/components/store/base/Grid"
import { Form } from "@/components/store/advanced/Form"
import { Input } from "@/components/store/base/Input"
import { Button } from "@/components/store/base/Button"
import { Stack } from "@/components/store/base/Stack"
import { ShieldAlert, Mail, Lock } from "lucide-react"
import { UI_STRINGS } from "@/constants/strings"

export const AuthAdminSection: React.FC = () => {
  const a = UI_STRINGS.admin.auth

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
        title={a.title}
        description={a.description}
        icon={ShieldAlert}
      >
        <Form onSubmit={handleSubmit}>
          <Input label={a.emailLabel} placeholder={a.emailPlaceholder} icon={Mail} required />
          <Input label={a.passwordLabel} type="password" placeholder={a.passwordPlaceholder} icon={Lock} required />
          <Button variant="primary" label={a.submitButton} fullWidth />
        </Form>
      </RegistrySection>
      <Box />
    </Grid>
    </Stack>
  )
}
