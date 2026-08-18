"use client"

/* eslint-disable max-lines-per-function, complexity */

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Input } from "@/components/store/base/Input"
import { Button } from "@/components/store/base/Button"
import { CustomSelect, CustomSelectItem } from "@/components/store/base/CustomSelect"
import { RegistrySection } from "@/components/store/advanced/RegistrySection"
import { User as UserIcon, Lock, Building, ShieldCheck, Tv } from "lucide-react"
import { useTenant } from "@/lib/context/TenantContext"
import { useOperators, db } from "@/lib/dal"
import { UserRole, User, Tenant } from "@/src/types/domain"
import { ROLE_CAN_LOGIN } from "@/lib/permissions"
import { UI_STRINGS } from "@/constants/strings"

interface LoginSectionProps {
  onLoginSuccess: (operatorName: string) => void
  onSwitchTenant?: () => void
}

const DEFAULT_OPERATORS = [
  { name: "Administrador", role: "ADMIN", password: "123456789" }
]

export const LoginSection: React.FC<LoginSectionProps> = ({ onLoginSuccess, onSwitchTenant }) => {
  const tenantCtx = useTenant()
  const activeTenant = tenantCtx?.currentTenant
  const tenantId = activeTenant?.id || "demo-tenant"
  const s = UI_STRINGS.auth

  // Busca os operadores cadastrados no banco local IndexedDB
  const dbOperators = useOperators(tenantId)

  const [selectedUser, setSelectedUser] = React.useState("Administrador")
  const [password, setPassword] = React.useState("")
  const [errorMsg, setErrorMsg] = React.useState("")
  const [message, setMessage] = React.useState("")

  // Garante o tema do Tenant desbloqueado nesta tela
  React.useEffect(() => {
    if (tenantCtx && activeTenant) {
      tenantCtx.switchThemeMode("tenant")
    }
  }, [tenantCtx, activeTenant])

  // Provisiona o Administrador padrão apenas se a empresa não tiver nenhum usuário cadastrado no IndexedDB
  React.useEffect(() => {
    async function seedOperators() {
      if (!tenantId) return
      try {
        const count = await db.users.where("company_id").equals(tenantId).or("tenant_id").equals(tenantId).count()
        if (count === 0) {
          await db.users.put({
            id: `user-admin-${tenantId}`,
            company_id: tenantId,
            tenant_id: tenantId,
            name: "Administrador",
            email: `admin@${tenantId}.app`,
            role: "ADMIN",
            password: "123456789",
            active: true
          })
        }
      } catch (err) {
        console.error("Erro ao inicializar administrador local:", err)
      }
    }
    seedOperators()
  }, [tenantId])

  // Lista de operadores disponíveis no seletor
  const operatorOptions = React.useMemo(() => {
    const rawList = (dbOperators && dbOperators.length > 0)
      ? dbOperators.map((u) => ({
          id: u.id,
          name: u.name,
          role: u.role,
          password: u.password
        }))
      : DEFAULT_OPERATORS.map((u, i) => ({
          id: `def-${i}`,
          name: u.name,
          role: u.role,
          password: u.password
        }))
    // Filtra perfis que não podem logar (ex: SUPERVISOR)
    return rawList.filter((u) => ROLE_CAN_LOGIN[u.role] !== false)
  }, [dbOperators])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg("")
    setMessage("")

    const currentOp = operatorOptions.find((o) => o.name === selectedUser) || operatorOptions[0]
    const expectedPassword = currentOp?.password || "123456789"

    // Validação estrita da senha do operador
    if (password !== expectedPassword) {
      setErrorMsg("Senha do operador incorreta. Digite '123456789'.")
      return
    }

    const tenantToUse: Tenant = activeTenant || {
      id: "tenant-demo-001",
      corporateName: "Empresa Demonstração LTDA",
      tradingName: "Navelo Store",
      cnpj: "00.000.000/0001-91",
      primaryColor: "#16315e",
      secondaryColor: "#f97316",
      isActive: true
    }

    const userToLogin: User = {
      id: currentOp.id,
      name: currentOp.name,
      email: `${currentOp.name.toLowerCase().replace(/\s+/g, ".")}@navelo.app`,
      passwordHash: currentOp.password,
      role: (UserRole[currentOp.role as keyof typeof UserRole]) || UserRole.CASHIER,
      tenantId: tenantToUse.id
    }

    if (tenantCtx) {
      tenantCtx.loginTenantSession(userToLogin, tenantToUse)
    }

    onLoginSuccess(currentOp.name)
  }

  return (
    <Box w="full" h="screen" bg="bg-slate-900">
      <Stack w="full" h="full" align="center" justify="center" gap={5} paddingX={5}>
        <Box w="w-full md:w-1/4 max-w-[450px]">
          <Stack gap={5} w="full" align="stretch">
            <RegistrySection
              variant="card"
              title={activeTenant?.tradingName || activeTenant?.corporateName || s.title}
              description={activeTenant?.cnpj ? `CNPJ: ${activeTenant.cnpj}` : ""}
              icon={UserIcon}
            >
              <Box as="form" onSubmit={handleSubmit}>
                <Stack gap={5}>
                  {/* Selecione o Operador */}
                  <Stack gap={1}>
                    <Font variant="body-sm-semibold" text={s.operatorRoleLabel} />
                    <CustomSelect
                      value={selectedUser}
                      onChange={(val) => {
                        setSelectedUser(val)
                        setErrorMsg("")
                      }}
                      placeholder={s.selectOperatorPlaceholder}
                    >
                      {operatorOptions.map((op) => (
                        <CustomSelectItem
                          key={op.id}
                          value={op.name}
                          text={op.name}
                          icon={op.role === "ADMIN" ? ShieldCheck : op.role === "TOTEM" ? Tv : UserIcon}
                        />
                      ))}
                    </CustomSelect>
                  </Stack>

                  {/* Senha do Operador */}
                  <Stack gap={1}>
                    <Font variant="body-sm-semibold" text={s.passwordLabel} />
                    <Input
                      type="password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value)
                        setErrorMsg("")
                      }}
                      placeholder={s.passwordPlaceholder}
                      icon={Lock}
                      required
                    />
                  </Stack>

                  {/* Mensagens de Feedback */}
                  {errorMsg && (
                    <Font variant="body-xs-semibold" color="danger" text={errorMsg} />
                  )}

                  {message && (
                    <Font variant="body-xs-semibold" color="success" text={message} />
                  )}

                  {/* Links de navegação secundária */}
                  <Stack direction="row" justify="between" w="full" gap={2.5}>
                    <Button
                      variant="ghost"
                      label={s.forgotPasswordButton}
                      onClick={() => setMessage("Simulado: Instruções enviadas ao e-mail cadastrado.")}
                    />
                    {onSwitchTenant && (
                      <Button
                        variant="ghost"
                        icon={Building}
                        label={s.switchCnpjButton}
                        onClick={onSwitchTenant}
                      />
                    )}
                  </Stack>

                  {/* Botão de Entrar */}
                  <Button
                    variant="primary"
                    label={s.loginButton}
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
