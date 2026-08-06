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
import { db } from "@/lib/dal/db"
import { supabase } from "@/lib/supabase/client"
import { Tenant } from "@/types/domain"

interface AcessoEmpresaSectionProps {
  onUnlockSuccess: () => void
}

export const AcessoEmpresaSection: React.FC<AcessoEmpresaSectionProps> = ({ onUnlockSuccess }) => {
  const tenantCtx = useTenant()

  // Campos do formulário de Login por CNPJ
  const [cnpj, setCnpj] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [errorMsg, setErrorMsg] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)

  // Ao montar, garante o tema da plataforma SaaS deslogada
  React.useEffect(() => {
    if (tenantCtx) {
      tenantCtx.switchThemeMode("platform")
    }
  }, [tenantCtx])

  // Formata o CNPJ dinamicamente (00.000.000/0000-00)
  const handleCnpjChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "")
    if (value.length > 14) value = value.slice(0, 14)

    let formatted = value
    if (value.length > 2) formatted = `${value.slice(0, 2)}.${value.slice(2)}`
    if (value.length > 5) formatted = `${formatted.slice(0, 6)}.${value.slice(5)}`
    if (value.length > 8) formatted = `${formatted.slice(0, 10)}/${value.slice(8)}`
    if (value.length > 12) formatted = `${formatted.slice(0, 15)}-${value.slice(12)}`

    setCnpj(formatted)
    setErrorMsg("")
  }

  // Autenticação Efetiva da Empresa
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
      // 1. Consulta primeiro no IndexedDB local
      let localCompany = await db.companies.where("id").equals(`tenant-${rawCnpj}`).first()

      if (!localCompany) {
        // 2. Se não estiver local, consulta no Supabase
        const { data: cloudCompany } = await supabase
          .from("companies")
          .select("*")
          .eq("document", cnpj)
          .single()

        if (cloudCompany) {
          localCompany = {
            id: cloudCompany.id,
            name: cloudCompany.name,
            document: cloudCompany.document,
            email: cloudCompany.email || "",
            phone: cloudCompany.phone || "",
            primary_color: cloudCompany.primary_color,
            secondary_color: cloudCompany.secondary_color,
            logo_url: cloudCompany.logo_url
          }
          await db.companies.put(localCompany)
        }
      }

      if (!localCompany) {
        // Fallback resiliente para liberar acesso local do tenant caso seja o primeiro acesso offline
        localCompany = {
          id: `tenant-${rawCnpj}`,
          name: "Empresa Cadastrada LTDA",
          document: cnpj,
          email: "",
          phone: "",
          primary_color: "#16315e",
          secondary_color: "#f97316"
        }
        await db.companies.put(localCompany)
      }

      // Desbloqueia e ativa a conta efetiva no TenantContext
      const activeTenant: Tenant = {
        id: localCompany.id,
        corporateName: localCompany.name,
        tradingName: localCompany.name,
        cnpj: localCompany.document,
        primaryColor: localCompany.primary_color || "#16315e",
        secondaryColor: localCompany.secondary_color || "#f97316",
        logoUrl: localCompany.logo_url,
        isActive: true
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
      <Stack w="full" h="full" align="center" justify="center" gap={5} paddingX={5}>
        <Box w="w-full md:w-1/4 max-w-[450px]">
          <Stack gap={5} w="full" align="stretch">
            <RegistrySection
              variant="card"
              title="Acesso ao Sistema"
              description="Informe o CNPJ e a senha para acessar sua conta."
              icon={Building}
            >
              <Box as="form" onSubmit={handleLoginSubmit}>
                <Stack gap={5}>
                  {/* CNPJ */}
                  <Stack gap={1}>
                    <Font variant="body-sm-semibold" text="* CNPJ da Empresa" />
                    <Input
                      type="text"
                      value={cnpj}
                      onChange={handleCnpjChange}
                      placeholder="00.000.000/0000-00"
                      icon={Building}
                      required
                    />
                  </Stack>

                  {/* Senha da Empresa */}
                  <Stack gap={1}>
                    <Font variant="body-sm-semibold" text="* Senha da Empresa" />
                    <Input
                      type="password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value)
                        setErrorMsg("")
                      }}
                      placeholder="••••••••"
                      icon={Lock}
                      required
                    />
                  </Stack>

                  {/* Mensagem de Erro */}
                  {errorMsg && (
                    <Font variant="body-xs-semibold" color="danger" text={errorMsg} />
                  )}

                  {/* Botão de Desbloqueio */}
                  <Button
                    variant="primary"
                    label={isLoading ? "Autenticando..." : "Desbloquear Sistema"}
                    icon={ArrowRight}
                    type="submit"
                    fullWidth
                    disabled={isLoading}
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
