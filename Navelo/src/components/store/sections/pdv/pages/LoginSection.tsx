"use client"

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Input } from "@/components/store/base/Input"
import { Button } from "@/components/store/base/Button"
import { CustomSelect, CustomSelectItem } from "@/components/store/base/CustomSelect"
import { RegistrySection } from "@/components/store/advanced/RegistrySection"
import { User, Lock } from "lucide-react"

interface LoginSectionProps {
  onLoginSuccess: (operatorName: string) => void
}

export const LoginSection: React.FC<LoginSectionProps> = ({ onLoginSuccess }) => {
  const [selectedUser, setSelectedUser] = React.useState("Administrador")
  const [password, setPassword] = React.useState("")
  const [message, setMessage] = React.useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onLoginSuccess(selectedUser)
  }

  return (
    <Box w="full" h="screen" bg="bg-slate-900">
      <Stack w="full" h="full" align="center" justify="center" gap={5} paddingX={5}>
        <Box w="w-full md:w-1/4 max-w-[450px]">
          <Stack gap={5} w="full" align="stretch">
            <RegistrySection
              variant="card"
              title="Olá!"
              description="Escolha um usuário."
              icon={User}
            >
              <Box as="form" onSubmit={handleSubmit}>
                <Stack gap={5}>
                  {/* Selecione o Usuário */}
                  <Stack gap={1}>
                    <Font variant="body-sm-semibold" text="Usuário" />
                    <CustomSelect
                      value={selectedUser}
                      onChange={(val) => setSelectedUser(val)}
                      placeholder="Selecione o usuário"
                    >
                      <CustomSelectItem value="Administrador" text="Administrador" icon={User} />
                      <CustomSelectItem value="Caixa Principal" text="Caixa Principal" icon={User} />
                      <CustomSelectItem value="Atendente Salão" text="Atendente Salão" icon={User} />
                    </CustomSelect>
                  </Stack>

                  {/* Senha */}
                  <Stack gap={1}>
                    <Font variant="body-sm-semibold" text="* Senha" />
                    <Input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      icon={Lock}
                      required
                    />
                  </Stack>

                  {/* Mensagem de Feedback */}
                  {message && (
                    <Font variant="body-xs-semibold" color="success" text={message} />
                  )}

                  {/* Links de navegação secundária */}
                  <Stack direction="row" justify="between" w="full" gap={2.5}>
                    <Box as="button" type="button" onClick={() => setMessage("Simulado: Instruções enviadas ao e-mail cadastrado.")}>
                      <Font variant="auxiliary" color="muted" text="Esquecer senha" />
                    </Box>
                    <Box as="button" type="button" onClick={() => setMessage("Simulado: Contate o suporte para redefinir sua senha.")}>
                      <Font variant="auxiliary" color="muted" text="Redefinir senha" />
                    </Box>
                  </Stack>

                  {/* Botão de Entrar */}
                  <Button
                    variant="primary"
                    label="Entrar"
                    type="submit"
                    fullWidth
                  />
                </Stack>
              </Box>
            </RegistrySection>
          </Stack>
        </Box>
      </Stack>
    </Box>
  )
}
