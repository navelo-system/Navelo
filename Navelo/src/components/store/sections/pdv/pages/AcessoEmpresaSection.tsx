"use client"

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Input } from "@/components/store/base/Input"
import { Button } from "@/components/store/base/Button"
import { RegistrySection } from "@/components/store/advanced/RegistrySection"
import { Building, Lock, ArrowRight } from "lucide-react"
import { useTenant } from "@/lib/context/TenantContext"
import { db, Company } from "@/lib/dal/db"
import { supabase } from "@/lib/supabase/client"
import { Tenant } from "@/src/types/domain"
import { UI_STRINGS } from "@/constants/strings"

interface AcessoEmpresaSectionProps {
  onUnlockSuccess: () => void
}

function formatCnpj(raw: string): string {
  let value = raw.replace(/\D/g, "")
  if (value.length > 14) value = value.slice(0, 14)
  let formatted = value
  if (value.length > 2) formatted = `${value.slice(0, 2)}.${value.slice(2)}`
  if (value.length > 5) formatted = `${formatted.slice(0, 6)}.${value.slice(5)}`
  if (value.length > 8) formatted = `${formatted.slice(0, 10)}/${value.slice(8)}`
  if (value.length > 12) formatted = `${formatted.slice(0, 15)}-${value.slice(12)}`
  return formatted
}

async function findOrCreateCompany(rawCnpj: string, formattedCnpj: string): Promise<Company> {
  let localCompany = await db.companies
    .filter((c) => c.id === `tenant-${rawCnpj}` || c.document === formattedCnpj || c.document === rawCnpj)
    .first()

  if (!localCompany) {
    const { data: cloudCompany } = await supabase
      .from("companies")
      .select("*")
      .or(`document.eq.${formattedCnpj},document.eq.${rawCnpj},id.eq.tenant-${rawCnpj}`)
      .maybeSingle()

    if (cloudCompany) {
      localCompany = {
        id: cloudCompany.id,
        name: cloudCompany.name,
        document: cloudCompany.document,
        email: cloudCompany.email || "",
        phone: cloudCompany.phone || "",
        primary_color: cloudCompany.primary_color,
        secondary_color: cloudCompany.secondary_color,
        logo_url: cloudCompany.logo_url,
      }
      await db.companies.put(localCompany)
    }
  }

  if (!localCompany) {
    localCompany = {
      id: `tenant-${rawCnpj}`,
      name: "Empresa Cadastrada LTDA",
      document: formattedCnpj,
      email: "",
      phone: "",
      primary_color: "#16315e",
      secondary_color: "#f97316",
    }
    await db.companies.put(localCompany)
    try {
      await supabase.from("companies").upsert({
        id: `tenant-${rawCnpj}`,
        name: "Empresa Cadastrada LTDA",
        document: formattedCnpj,
        company_id: `tenant-${rawCnpj}`,
        tenant_id: `tenant-${rawCnpj}`,
      })
    } catch {}
  }
  return localCompany
}

function CompanyLoginForm({
  cnpj,
  setCnpj,
  password,
  setPassword,
  errorMsg,
  setErrorMsg,
  isLoading,
  onSubmit,
}: {
  cnpj: string
  setCnpj: (v: string) => void
  password: string
  setPassword: (v: string) => void
  errorMsg: string
  setErrorMsg: (v: string) => void
  isLoading: boolean
  onSubmit: (e: React.FormEvent) => void
}) {
  const s = UI_STRINGS.companyAccess
  return (
    <Box as="form" onSubmit={onSubmit}>
      <Stack gap={5}>
        <Stack gap={1}>
          <Font variant="body-sm-semibold" text={s.cnpjLabel} />
          <Input
            type="text"
            value={cnpj}
            onChange={(e) => {
              setCnpj(formatCnpj(e.target.value))
              setErrorMsg("")
            }}
            placeholder={s.cnpjPlaceholder}
            icon={Building}
            required
          />
        </Stack>
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
        {errorMsg && <Font variant="body-xs-semibold" color="danger" text={errorMsg} />}
        <Button
          variant="primary"
          label={isLoading ? s.authenticatingButton : s.unlockButton}
          icon={ArrowRight}
          type="submit"
          fullWidth
        />
      </Stack>
    </Box>
  )
}

export const AcessoEmpresaSection: React.FC<AcessoEmpresaSectionProps> = ({ onUnlockSuccess }) => {
  const tenantCtx = useTenant()
  const s = UI_STRINGS.companyAccess

  const [cnpj, setCnpj] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [errorMsg, setErrorMsg] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)

  React.useEffect(() => {
    tenantCtx?.switchThemeMode("platform")
  }, [tenantCtx])

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMsg("")

    const rawCnpj = cnpj.replace(/\D/g, "")
    if (rawCnpj.length < 14) {
      setErrorMsg("Informe um CNPJ válido com 14 dígitos.")
      setIsLoading(false)
      return
    }
    if (!password.trim()) {
      setErrorMsg("Informe a senha de acesso da empresa.")
      setIsLoading(false)
      return
    }

    try {
      const localCompany = await findOrCreateCompany(rawCnpj, cnpj)
      const activeTenant: Tenant = {
        id: localCompany.id,
        corporateName: localCompany.name,
        tradingName: localCompany.name,
        cnpj: localCompany.document,
        primaryColor: localCompany.primary_color || "#16315e",
        secondaryColor: localCompany.secondary_color || "#f97316",
        isActive: true,
      }

      if (tenantCtx) {
        tenantCtx.setCurrentTenant(activeTenant)
        tenantCtx.switchThemeMode("tenant")
        if (typeof window !== "undefined") {
          localStorage.setItem("navelo_active_tenant", JSON.stringify(activeTenant))
        }
      }

      setIsLoading(false)
      onUnlockSuccess()
    } catch (err) {
      console.error("Erro ao autenticar empresa:", err)
      setErrorMsg("Falha ao autenticar empresa. Verifique os dados e tente novamente.")
      setIsLoading(false)
    }
  }

  return (
    <Box w="full" h="screen" bg="bg-slate-900">
      <Stack w="full" h="full" align="center" justify="center" gap={5}>
        <Box w="w-full max-w-[540px]">
          <Stack gap={5} w="full" align="stretch">
            <RegistrySection variant="card" title={s.systemAccessTitle} description={s.systemAccessDesc} icon={Building}>
              <CompanyLoginForm
                cnpj={cnpj}
                setCnpj={setCnpj}
                password={password}
                setPassword={setPassword}
                errorMsg={errorMsg}
                setErrorMsg={setErrorMsg}
                isLoading={isLoading}
                onSubmit={handleLoginSubmit}
              />
            </RegistrySection>
          </Stack>
        </Box>
      </Stack>
    </Box>
  )
}
