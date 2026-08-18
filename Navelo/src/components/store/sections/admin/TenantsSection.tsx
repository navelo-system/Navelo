"use client"

/* eslint-disable max-lines-per-function, complexity */

import * as React from "react"
import { RegistrySection } from "@/components/store/advanced/RegistrySection"
import { Button } from "@/components/store/base/Button"
import { Stack } from "@/components/store/base/Stack"
import { Box } from "@/components/store/base/Box"
import { Input } from "@/components/store/base/Input"
import { Font } from "@/components/store/base/Font"
import { Badge } from "@/components/store/base/Badge"
import { Modal } from "@/components/store/base/Modal"
import { Switch } from "@/components/store/base/Switch"
import { Icon } from "@/components/store/base/Icon"
import { FilterBar } from "@/components/store/intermediary/FilterBar"
import { EmptyState } from "@/components/store/intermediary/EmptyState"
import { Form } from "@/components/store/advanced/Form"
import { CustomSelect, CustomSelectItem } from "@/components/store/base/CustomSelect"
import { Users, ArrowLeft, Plus, CreditCard, Building2, MapPin, Phone, ShieldCheck } from "lucide-react"
import { useLiveQuery } from "dexie-react-hooks"
import { db, Company } from "@/lib/dal/db"
import { mutateLocalFirst } from "@/lib/dal/sync"
import { UI_STRINGS } from "@/constants/strings"

import { TenantListTable, TenantListRow } from "@/components/store/intermediary/TenantListTable"

const INITIAL_FALLBACK_TENANTS: TenantListRow[] = [
  {
    id: "tenant-36383365000190",
    name: "NAVELO SISTEMAS LTDA",
    trade_name: "Navelo PDV",
    document: "36.383.365/0001-90",
    phone: "(33) 999565081",
    address_city: "Teófilo Otoni",
    address_state: "MG",
    plan: "Enterprise",
    status: "active",
    monthlyFee: 499.9,
  },
]

const plans = [
  { name: "Free", fee: 0 },
  { name: "Pro", fee: 149.9 },
  { name: "Enterprise", fee: 499.9 },
]

export function TenantsSection() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const tStrings = UI_STRINGS.admin.tenants

  // Consulta em tempo real das empresas no Dexie
  const dbCompanies = useLiveQuery(async () => {
    return await db.companies.toArray()
  }, [])

  // Form State Completo
  const [name, setName] = React.useState("")
  const [tradeName, setTradeName] = React.useState("")
  const [document, setDocument] = React.useState("")
  const [stateRegistration, setStateRegistration] = React.useState("")
  const [phone, setPhone] = React.useState("")
  const [email, setEmail] = React.useState("")

  // Endereço
  const [cep, setCep] = React.useState("")
  const [street, setStreet] = React.useState("")
  const [number, setNumber] = React.useState("")
  const [complement, setComplement] = React.useState("")
  const [neighborhood, setNeighborhood] = React.useState("")
  const [city, setCity] = React.useState("")
  const [state, setState] = React.useState("")

  // Plano e Status
  const [selectedPlan, setSelectedPlan] = React.useState("Pro")
  const [isActive, setIsActive] = React.useState(true)

  const tenants: TenantListRow[] = React.useMemo(() => {
    if (dbCompanies && dbCompanies.length > 0) {
      return dbCompanies.map((c: Company) => ({
        id: c.id,
        name: c.name,
        trade_name: c.trade_name || c.name,
        document: c.document,
        phone: c.phone,
        address_city: c.address_city,
        address_state: c.address_state,
        plan: c.plan || "Pro",
        status: c.status || "active",
        monthlyFee: c.plan === "Enterprise" ? 499.9 : c.plan === "Free" ? 0 : 149.9,
      }))
    }
    return INITIAL_FALLBACK_TENANTS
  }, [dbCompanies])

  const handleCreateTenant = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !document.trim()) return

    const rawDoc = document.replace(/\D/g, "")
    const companyId = `tenant-${rawDoc || crypto.randomUUID().slice(0, 8)}`

    const newCompany: Company = {
      id: companyId,
      company_id: companyId,
      tenant_id: companyId,
      name: name.trim(),
      trade_name: tradeName.trim() || name.trim(),
      document: document.trim(),
      state_registration: stateRegistration.trim() || undefined,
      phone: phone.trim(),
      email: email.trim(),
      address_cep: cep.trim() || undefined,
      address_street: street.trim() || undefined,
      address_number: number.trim() || undefined,
      address_complement: complement.trim() || undefined,
      address_neighborhood: neighborhood.trim() || undefined,
      address_city: city.trim() || undefined,
      address_state: state.trim() || undefined,
      plan: selectedPlan,
      status: isActive ? "active" : "inactive",
      created_at: new Date().toISOString(),
    }

    try {
      await db.companies.put(newCompany)
      await mutateLocalFirst("companies", newCompany, "INSERT")
    } catch (err) {
      console.warn("[TenantsSection] Erro ao persistir empresa no sync:", err)
    }

    setIsModalOpen(false)

    // Reset Form
    setName("")
    setTradeName("")
    setDocument("")
    setStateRegistration("")
    setPhone("")
    setEmail("")
    setCep("")
    setStreet("")
    setNumber("")
    setComplement("")
    setNeighborhood("")
    setCity("")
    setState("")
    setSelectedPlan("Pro")
    setIsActive(true)
  }

  const filteredTenants = tenants.filter(t => {
    const term = searchQuery.toLowerCase()
    const matchName = (t.name || "").toLowerCase().includes(term)
    const matchTrade = (t.trade_name || "").toLowerCase().includes(term)
    const matchDoc = (t.document || "").includes(term)
    const matchCity = (t.address_city || "").toLowerCase().includes(term)
    return matchName || matchTrade || matchDoc || matchCity
  })

  return (
    <>
      <Stack direction="row" align="start">
        <Button
          variant="ghost"
          label={tStrings.backButton}
          icon={ArrowLeft}
          onClick={() => (window.location.href = "/admin")}
        />
      </Stack>

      <RegistrySection
        title={tStrings.tenantsListTitle}
        description={tStrings.tenantsListDescription}
        icon={Users}
        action={
          <Button
            variant="primary"
            label={tStrings.newCompanyButton}
            icon={Plus}
            onClick={() => setIsModalOpen(true)}
          />
        }
      >
        <Stack gap={5}>
          <FilterBar
            searchPlaceholder={tStrings.searchTenantsPlaceholder}
            onSearch={setSearchQuery}
          />

          {filteredTenants.length === 0 ? (
            <EmptyState
              icon={Users}
              title={tStrings.emptyCompaniesTitle}
              subtitle={tStrings.emptyCompaniesSubtitle}
            />
          ) : (
            <TenantListTable tenants={filteredTenants} />
          )}
        </Stack>
      </RegistrySection>

      {isModalOpen && (
        <Form onSubmit={handleCreateTenant}>
          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title={tStrings.newCompanyModalTitle}
            subtitle={tStrings.newCompanyModalSubtitle}
            icon={Building2}
            successText={tStrings.saveCompanyButton}
            isSubmit
          >
            <Box maxH="max-h-[70vh]" overflow="auto">
              <Stack gap={5}>
                {/* 1. DADOS DE IDENTIFICAÇÃO */}
                <Stack gap={2.5}>
                  <Stack direction="row" align="center" gap={2.5}>
                    <Icon icon={Building2} size={16} color="primary" />
                    <Font variant="body-bold" text={tStrings.companyIdentification} />
                  </Stack>
                  <Input
                    label={tStrings.companyNameRequired}
                    placeholder={tStrings.companyNamePlaceholder}
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                  />
                  <Input
                    label={tStrings.companyTradeName}
                    placeholder={tStrings.companyTradeNamePlaceholder}
                    value={tradeName}
                    onChange={e => setTradeName(e.target.value)}
                  />
                  <Stack direction="col" mobileDirection="row" gap={2.5}>
                    <Box flex="1">
                      <Input
                        label={tStrings.cnpjCpfRequired}
                        mask="cpf-cnpj"
                        placeholder={tStrings.cnpjCpfPlaceholder}
                        value={document}
                        onChange={e => setDocument(e.target.value)}
                        required
                      />
                    </Box>
                    <Box flex="1">
                      <Input
                        label={tStrings.stateRegistration}
                        placeholder={tStrings.stateRegistrationPlaceholder}
                        value={stateRegistration}
                        onChange={e => setStateRegistration(e.target.value)}
                      />
                    </Box>
                  </Stack>
                </Stack>

                <Box h="h-[1px]" w="full" bg="bg-border" />

                {/* 2. CONTATO */}
                <Stack gap={2.5}>
                  <Stack direction="row" align="center" gap={2.5}>
                    <Icon icon={Phone} size={16} color="primary" />
                    <Font variant="body-bold" text={tStrings.commercialContact} />
                  </Stack>
                  <Stack direction="col" mobileDirection="row" gap={2.5}>
                    <Box flex="1">
                      <Input
                        label={tStrings.phoneWhatsapp}
                        mask="phone"
                        placeholder={UI_STRINGS.common.phonePlaceholder}
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                      />
                    </Box>
                    <Box flex="1">
                      <Input
                        label={tStrings.contactEmail}
                        type="email"
                        placeholder={tStrings.contactEmailPlaceholder}
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                      />
                    </Box>
                  </Stack>
                </Stack>

                <Box h="h-[1px]" w="full" bg="bg-border" />

                {/* 3. ENDEREÇO COMPLETO */}
                <Stack gap={2.5}>
                  <Stack direction="row" align="center" gap={2.5}>
                    <Icon icon={MapPin} size={16} color="primary" />
                    <Font variant="body-bold" text={tStrings.commercialAddress} />
                  </Stack>
                  <Stack direction="col" mobileDirection="row" gap={2.5}>
                    <Box flex="1">
                      <Input
                        label={tStrings.cepLabel}
                        mask="cep"
                        placeholder={tStrings.cepPlaceholder}
                        value={cep}
                        onChange={e => setCep(e.target.value)}
                      />
                    </Box>
                    <Box flex="1">
                      <Input
                        label={tStrings.streetLabel}
                        placeholder={tStrings.streetPlaceholder}
                        value={street}
                        onChange={e => setStreet(e.target.value)}
                      />
                    </Box>
                  </Stack>
                  <Stack direction="col" mobileDirection="row" gap={2.5}>
                    <Box flex="1">
                      <Input
                        label={tStrings.numberLabel}
                        placeholder={tStrings.numberPlaceholder}
                        value={number}
                        onChange={e => setNumber(e.target.value)}
                      />
                    </Box>
                    <Box flex="1">
                      <Input
                        label={tStrings.complementLabel}
                        placeholder={tStrings.complementPlaceholder}
                        value={complement}
                        onChange={e => setComplement(e.target.value)}
                      />
                    </Box>
                  </Stack>
                  <Stack direction="col" mobileDirection="row" gap={2.5}>
                    <Box flex="1">
                      <Input
                        label={tStrings.neighborhoodLabel}
                        placeholder={tStrings.neighborhoodPlaceholder}
                        value={neighborhood}
                        onChange={e => setNeighborhood(e.target.value)}
                      />
                    </Box>
                    <Box flex="1">
                      <Input
                        label={tStrings.cityLabel}
                        placeholder={tStrings.cityPlaceholder}
                        value={city}
                        onChange={e => setCity(e.target.value)}
                      />
                    </Box>
                    <Box flex="1">
                      <Input
                        label={tStrings.ufLabel}
                        placeholder={tStrings.ufPlaceholder}
                        maxLength={2}
                        value={state}
                        onChange={e => setState(e.target.value.toUpperCase())}
                      />
                    </Box>
                  </Stack>
                </Stack>

                <Box h="h-[1px]" w="full" bg="bg-border" />

                {/* 4. PLANO E LICENÇA */}
                <Stack gap={2.5}>
                  <Stack direction="row" align="center" gap={2.5}>
                    <Icon icon={ShieldCheck} size={16} color="primary" />
                    <Font variant="body-bold" text={tStrings.licenseAndStatus} />
                  </Stack>
                  <Stack gap={2.5}>
                    <Badge variant="ghost" label={tStrings.billingPlanBadge} />
                    <CustomSelect value={selectedPlan} onChange={setSelectedPlan}>
                      {plans.map(p => (
                        <CustomSelectItem
                          key={p.name}
                          value={p.name}
                          text={`${p.name} (${p.fee === 0 ? "Grátis" : `R$ ${p.fee.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}/mês`})`}
                          icon={CreditCard}
                        />
                      ))}
                    </CustomSelect>
                  </Stack>

                  <Stack direction="row" align="center" justify="between">
                    <Badge variant="ghost" label={tStrings.initialStatusBadge} />
                    <Switch
                      checked={isActive}
                      onChange={e => setIsActive(e.target.checked)}
                    />
                  </Stack>
                </Stack>
              </Stack>
            </Box>
          </Modal>
        </Form>
      )}
    </>
  )
}
