import * as React from "react"
import { RegistrySection } from "@/components/store/advanced/RegistrySection"
import { Grid } from "@/components/store/base/Grid"
import { Box } from "@/components/store/base/Box"
import { Form } from "@/components/store/advanced/Form"
import { Input } from "@/components/store/base/Input"
import { Button } from "@/components/store/base/Button"
import { Keyboard, Mail, Lock } from "lucide-react"

export const AuthSection: React.FC = () => {
  return (
    <RegistrySection
      title="Autenticação"
      description="Padrões de formulários para controle de acesso."
      icon={Keyboard}
    >
      <Grid cols={3} gap={5}>
        <Box padding={5} bg="bg-surface" border borderColor="border-border" radius="default">
          <Form label="Entrar no Painel" description="Insira suas credenciais">
            <Input label="E-mail" placeholder="admin@navelo.com" icon={Mail} />
            <Input label="Senha" type="password" placeholder="••••••••" icon={Lock} />
            <Button variant="primary" label="Acessar conta" fullWidth />
          </Form>
        </Box>

        <Box padding={5} bg="bg-surface" border borderColor="border-border" radius="default">
          <Form label="Criar sua Conta" description="Registre seu estabelecimento">
            <Input label="Nome Fantasia" placeholder="Meu Restaurante" />
            <Input label="E-mail" placeholder="contato@empresa.com" icon={Mail} />
            <Button variant="primary" label="Cadastrar estabelecimento" fullWidth />
          </Form>
        </Box>

        <Box padding={5} bg="bg-surface" border borderColor="border-border" radius="default">
          <Form label="Recuperar Senha" description="Enviaremos um link de acesso">
            <Input label="E-mail" placeholder="admin@navelo.com" icon={Mail} />
            <Button variant="primary" label="Enviar link" fullWidth />
          </Form>
        </Box>
      </Grid>
    </RegistrySection>
  )
}
