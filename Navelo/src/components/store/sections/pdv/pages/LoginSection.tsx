"use client"

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
import { useOperators, db, User as DalUser } from "@/lib/dal"
import { UserRole, User, Tenant } from "@/src/types/domain"
import { ROLE_CAN_LOGIN } from "@/lib/permissions"
import { UI_STRINGS } from "@/constants/strings"

interface LoginSectionProps {
  onLoginSuccess: (operatorName: string) => void
  onSwitchTenant?: () => void
}

interface OperatorOption {
  id: string
  name: string
  role: string
  password?: string
}

const DEFAULT_OPERATORS: OperatorOption[] = [
  { id: "def-0", name: "Administrador", role: "ADMIN", password: "123456789" },
]

function useLoginOperatorsSeed(tenantId: string) {
  React.useEffect(() => {
    async function seedOperators() {
      if (!tenantId) return
      try {
        const count = await db.users.where("company_id").equals(tenantId).or("tenant_id").equals(tenantId).count()
        if (count === 0) {
          await db.users.put({
            id: `user-admin-${tenantId}`, company_id: tenantId, tenant_id: tenantId,
            name: "Administrador", email: `admin@${tenantId}.app`, role: "ADMIN",
            password: "123456789", active: true,
          })
        }
      } catch (err) {
        console.error("Erro ao inicializar administrador local:", err)
      }
    }
    seedOperators()
  }, [tenantId])
}

function resolveOperatorIcon(role: string) {
  if (role === "ADMIN") return ShieldCheck
  if (role === "TOTEM") return Tv
  return UserIcon
}

function mapToOperatorOptions(dbOperators?: DalUser[]): OperatorOption[] {
  const rawList: OperatorOption[] = (dbOperators && dbOperators.length > 0)
    ? dbOperators.map((u) => ({ id: u.id, name: u.name, role: u.role, password: u.password }))
    : DEFAULT_OPERATORS
  return rawList.filter((u) => ROLE_CAN_LOGIN[u.role] !== false)
}

function createTenantSessionUser(currentOp: OperatorOption, tenantToUse: Tenant): User {
  return {
    id: currentOp.id,
    name: currentOp.name,
    email: `${currentOp.name.toLowerCase().replace(/\s+/g, ".")}@navelo.app`,
    passwordHash: currentOp.password || "",
    role: (UserRole[currentOp.role as keyof typeof UserRole]) || UserRole.CASHIER,
    tenantId: tenantToUse.id,
  }
}

interface LoginFormCardProps {
  selectedUser: string
  setSelectedUser: (u: string) => void
  password: string
  setPassword: (p: string) => void
  errorMsg: string
  setErrorMsg: (e: string) => void
  message: string
  setMessage: (m: string) => void
  operatorOptions: OperatorOption[]
  activeTenant: Tenant | null | undefined
  onSwitchTenant?: () => void
  onSubmit: (e: React.FormEvent) => void
}

function LoginFormCard(p: LoginFormCardProps) {
  const s = UI_STRINGS.auth
  return (
    <RegistrySection
      variant="card"
      title={p.activeTenant?.tradingName || p.activeTenant?.corporateName || s.title}
      description={p.activeTenant?.cnpj ? `CNPJ: ${p.activeTenant.cnpj}` : ""}
      icon={UserIcon}
    >
      <Box as="form" onSubmit={p.onSubmit}>
        <Stack gap={5}>
          <Stack gap={1}>
            <Font variant="body-sm-semibold" text={s.operatorRoleLabel} />
            <CustomSelect value={p.selectedUser} onChange={(val) => { p.setSelectedUser(val); p.setErrorMsg("") }} placeholder={s.selectOperatorPlaceholder}>
              {p.operatorOptions.map((op) => (
                <CustomSelectItem key={op.id} value={op.name} text={op.name} icon={resolveOperatorIcon(op.role)} />
              ))}
            </CustomSelect>
          </Stack>
          <Stack gap={1}>
            <Font variant="body-sm-semibold" text={s.passwordLabel} />
            <Input type="password" value={p.password} onChange={(e) => { p.setPassword(e.target.value); p.setErrorMsg("") }} placeholder={s.passwordPlaceholder} icon={Lock} required />
          </Stack>
          {p.errorMsg && <Font variant="body-xs-semibold" color="danger" text={p.errorMsg} />}
          {p.message && <Font variant="body-xs-semibold" color="success" text={p.message} />}
          <Stack
            direction="col"
            mobileDirection="row"
            justify="center"
            mobileJustify="between"
            align="center"
            mobileAlign="center"
            w="full"
            gap={2.5}
          >
            <Button variant="ghost" label={s.forgotPasswordButton} onClick={() => p.setMessage("Simulado: Instruções enviadas ao e-mail cadastrado.")} />
            {p.onSwitchTenant && <Button variant="ghost" icon={Building} label={s.switchCnpjButton} onClick={p.onSwitchTenant} />}
          </Stack>
          <Button variant="primary" label={s.loginButton} type="submit" fullWidth />
        </Stack>
      </Box>
    </RegistrySection>
  )
}

export const LoginSection: React.FC<LoginSectionProps> = ({ onLoginSuccess, onSwitchTenant }) => {
  const tenantCtx = useTenant()
  const activeTenant = tenantCtx?.currentTenant
  const tenantId = activeTenant?.id || "demo-tenant"
  const dbOperators = useOperators(tenantId)

  const [selectedUser, setSelectedUser] = React.useState("Administrador")
  const [password, setPassword] = React.useState("")
  const [errorMsg, setErrorMsg] = React.useState("")
  const [message, setMessage] = React.useState("")

  React.useEffect(() => {
    if (tenantCtx && activeTenant) tenantCtx.switchThemeMode("tenant")
  }, [tenantCtx, activeTenant])

  useLoginOperatorsSeed(tenantId)

  const operatorOptions = React.useMemo(() => mapToOperatorOptions(dbOperators), [dbOperators])

  const effectiveSelectedUser = React.useMemo(() => {
    if (operatorOptions.length > 0 && !operatorOptions.some((o) => o.name === selectedUser)) {
      return operatorOptions[0].name
    }
    return selectedUser
  }, [operatorOptions, selectedUser])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg("")
    setMessage("")

    const currentOp = operatorOptions.find((o) => o.name === effectiveSelectedUser) || operatorOptions[0]
    const expectedPassword = currentOp?.password || "123456789"

    if (password !== expectedPassword && password !== "123456789") {
      setErrorMsg("Senha do operador incorreta. Digite '123456789'.")
      return
    }

    const tenantToUse: Tenant = activeTenant || {
      id: "tenant-demo-001", corporateName: "Empresa Demonstração LTDA", tradingName: "Navelo Store",
      cnpj: "00.000.000/0001-91", primaryColor: "#16315e", secondaryColor: "#f97316", isActive: true,
    }

    const userToLogin = createTenantSessionUser(currentOp, tenantToUse)
    if (tenantCtx) tenantCtx.loginTenantSession(userToLogin, tenantToUse)
    onLoginSuccess(currentOp.name)
  }

  return (
    <Box w="full" h="screen" bg="bg-slate-900">
      <Stack w="full" h="full" align="center" justify="center" gap={5}>
        <Box w="w-full max-w-[540px]">
          <Stack gap={5} w="full" align="stretch">
            <LoginFormCard
              selectedUser={effectiveSelectedUser} setSelectedUser={setSelectedUser}
              password={password} setPassword={setPassword}
              errorMsg={errorMsg} setErrorMsg={setErrorMsg}
              message={message} setMessage={setMessage}
              operatorOptions={operatorOptions} activeTenant={activeTenant}
              onSwitchTenant={onSwitchTenant} onSubmit={handleSubmit}
            />
          </Stack>
        </Box>
      </Stack>
    </Box>
  )
}
