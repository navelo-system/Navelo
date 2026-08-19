"use client"

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

const DEFAULT_PLANS = [
  { name: "Free", fee: 0 },
  { name: "Pro", fee: 149.9 },
  { name: "Enterprise", fee: 499.9 },
]

interface TenantFormData {
  name: string
  tradeName: string
  document: string
  stateRegistration: string
  phone: string
  email: string
  cep: string
  street: string
  number: string
  complement: string
  neighborhood: string
  city: string
  state: string
  selectedPlan: string
  isActive: boolean
}

function TenantIdentificationFields({ form, setForm }: { form: TenantFormData; setForm: React.Dispatch<React.SetStateAction<TenantFormData>> }) {
  const tStrings = UI_STRINGS.admin.tenants
  return (
    <Stack gap={2.5}>
      <Stack direction="row" align="center" gap={2.5}>
        <Icon icon={Building2} size={16} color="primary" />
        <Font variant="body-bold" text={tStrings.companyIdentification} />
      </Stack>
      <Input label={tStrings.companyNameRequired} placeholder={tStrings.companyNamePlaceholder} value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required />
      <Input label={tStrings.companyTradeName} placeholder={tStrings.companyTradeNamePlaceholder} value={form.tradeName} onChange={(e) => setForm((p) => ({ ...p, tradeName: e.target.value }))} />
      <Stack direction="col" mobileDirection="row" gap={2.5}>
        <Box flex="1">
          <Input label={tStrings.cnpjCpfRequired} mask="cpf-cnpj" placeholder={tStrings.cnpjCpfPlaceholder} value={form.document} onChange={(e) => setForm((p) => ({ ...p, document: e.target.value }))} required />
        </Box>
        <Box flex="1">
          <Input label={tStrings.stateRegistration} placeholder={tStrings.stateRegistrationPlaceholder} value={form.stateRegistration} onChange={(e) => setForm((p) => ({ ...p, stateRegistration: e.target.value }))} />
        </Box>
      </Stack>
    </Stack>
  )
}

function TenantContactAndAddressFields({ form, setForm }: { form: TenantFormData; setForm: React.Dispatch<React.SetStateAction<TenantFormData>> }) {
  const tStrings = UI_STRINGS.admin.tenants
  return (
    <>
      <Stack gap={2.5}>
        <Stack direction="row" align="center" gap={2.5}>
          <Icon icon={Phone} size={16} color="primary" />
          <Font variant="body-bold" text={tStrings.commercialContact} />
        </Stack>
        <Stack direction="col" mobileDirection="row" gap={2.5}>
          <Box flex="1">
            <Input label={tStrings.phoneWhatsapp} mask="phone" placeholder={UI_STRINGS.common.phonePlaceholder} value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} />
          </Box>
          <Box flex="1">
            <Input label={tStrings.contactEmail} type="email" placeholder={tStrings.contactEmailPlaceholder} value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} />
          </Box>
        </Stack>
      </Stack>
      <Box h="h-[1px]" w="full" bg="bg-border" />
      <Stack gap={2.5}>
        <Stack direction="row" align="center" gap={2.5}>
          <Icon icon={MapPin} size={16} color="primary" />
          <Font variant="body-bold" text={tStrings.commercialAddress} />
        </Stack>
        <Stack direction="col" mobileDirection="row" gap={2.5}>
          <Box flex="1">
            <Input label={tStrings.cepLabel} mask="cep" placeholder={tStrings.cepPlaceholder} value={form.cep} onChange={(e) => setForm((p) => ({ ...p, cep: e.target.value }))} />
          </Box>
          <Box flex="1">
            <Input label={tStrings.streetLabel} placeholder={tStrings.streetPlaceholder} value={form.street} onChange={(e) => setForm((p) => ({ ...p, street: e.target.value }))} />
          </Box>
        </Stack>
        <Stack direction="col" mobileDirection="row" gap={2.5}>
          <Box flex="1">
            <Input label={tStrings.numberLabel} placeholder={tStrings.numberPlaceholder} value={form.number} onChange={(e) => setForm((p) => ({ ...p, number: e.target.value }))} />
          </Box>
          <Box flex="1">
            <Input label={tStrings.complementLabel} placeholder={tStrings.complementPlaceholder} value={form.complement} onChange={(e) => setForm((p) => ({ ...p, complement: e.target.value }))} />
          </Box>
        </Stack>
        <Stack direction="col" mobileDirection="row" gap={2.5}>
          <Box flex="1">
            <Input label={tStrings.neighborhoodLabel} placeholder={tStrings.neighborhoodPlaceholder} value={form.neighborhood} onChange={(e) => setForm((p) => ({ ...p, neighborhood: e.target.value }))} />
          </Box>
          <Box flex="1">
            <Input label={tStrings.cityLabel} placeholder={tStrings.cityPlaceholder} value={form.city} onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))} />
          </Box>
          <Box flex="1">
            <Input label={tStrings.ufLabel} placeholder={tStrings.ufPlaceholder} maxLength={2} value={form.state} onChange={(e) => setForm((p) => ({ ...p, state: e.target.value.toUpperCase() }))} />
          </Box>
        </Stack>
      </Stack>
    </>
  )
}

function TenantPlanFields({ form, setForm }: { form: TenantFormData; setForm: React.Dispatch<React.SetStateAction<TenantFormData>> }) {
  const tStrings = UI_STRINGS.admin.tenants
  return (
    <Stack gap={2.5}>
      <Stack direction="row" align="center" gap={2.5}>
        <Icon icon={ShieldCheck} size={16} color="primary" />
        <Font variant="body-bold" text={tStrings.licenseAndStatus} />
      </Stack>
      <Stack gap={2.5}>
        <Badge variant="ghost" label={tStrings.billingPlanBadge} />
        <CustomSelect value={form.selectedPlan} onChange={(v) => setForm((p) => ({ ...p, selectedPlan: v }))}>
          {DEFAULT_PLANS.map((p) => (
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
        <Switch checked={form.isActive} onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))} />
      </Stack>
    </Stack>
  )
}

function NewTenantModal({
  isOpen,
  onClose,
  onSubmit,
}: {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: TenantFormData) => Promise<void>
}) {
  const tStrings = UI_STRINGS.admin.tenants
  const [form, setForm] = React.useState<TenantFormData>({
    name: "", tradeName: "", document: "", stateRegistration: "", phone: "", email: "",
    cep: "", street: "", number: "", complement: "", neighborhood: "", city: "", state: "",
    selectedPlan: "Pro", isActive: true,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.document.trim()) return
    await onSubmit(form)
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={tStrings.newCompanyModalTitle}
        subtitle={tStrings.newCompanyModalSubtitle}
        icon={Building2}
        successText={tStrings.saveCompanyButton}
        isSubmit
      >
        <Box maxH="max-h-[70vh]" overflow="auto">
          <Stack gap={5}>
            <TenantIdentificationFields form={form} setForm={setForm} />
            <Box h="h-[1px]" w="full" bg="bg-border" />
            <TenantContactAndAddressFields form={form} setForm={setForm} />
            <Box h="h-[1px]" w="full" bg="bg-border" />
            <TenantPlanFields form={form} setForm={setForm} />
          </Stack>
        </Box>
      </Modal>
    </Form>
  )
}

const cleanStr = (v?: string) => {
  const trimmed = v?.trim()
  return trimmed ? trimmed : undefined
}

async function persistNewCompany(form: TenantFormData) {
  const rawDoc = form.document.replace(/\D/g, "")
  const companyId = `tenant-${rawDoc || crypto.randomUUID().slice(0, 8)}`
  const trimmedName = form.name.trim()
  const newCompany: Company = {
    id: companyId,
    company_id: companyId,
    tenant_id: companyId,
    name: trimmedName,
    trade_name: cleanStr(form.tradeName) || trimmedName,
    document: form.document.trim(),
    state_registration: cleanStr(form.stateRegistration),
    phone: form.phone.trim(),
    email: form.email.trim(),
    address_cep: cleanStr(form.cep),
    address_street: cleanStr(form.street),
    address_number: cleanStr(form.number),
    address_complement: cleanStr(form.complement),
    address_neighborhood: cleanStr(form.neighborhood),
    address_city: cleanStr(form.city),
    address_state: cleanStr(form.state),
    plan: form.selectedPlan,
    status: form.isActive ? "active" : "inactive",
    created_at: new Date().toISOString(),
  }
  try {
    await db.companies.put(newCompany)
    await mutateLocalFirst("companies", newCompany, "INSERT")
  } catch (err) {
    console.warn("[TenantsSection] Erro ao persistir empresa no sync:", err)
  }
}

export function TenantsSection() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const tStrings = UI_STRINGS.admin.tenants

  const dbCompanies = useLiveQuery(async () => await db.companies.toArray(), [])

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

  const filteredTenants = tenants.filter((t) => {
    const term = searchQuery.toLowerCase()
    return (
      (t.name || "").toLowerCase().includes(term) ||
      (t.trade_name || "").toLowerCase().includes(term) ||
      (t.document || "").includes(term) ||
      (t.address_city || "").toLowerCase().includes(term)
    )
  })

  return (
    <>
      <Stack direction="row" align="start">
        <Button variant="ghost" label={tStrings.backButton} icon={ArrowLeft} onClick={() => { window.location.href = "/admin" }} />
      </Stack>

      <RegistrySection
        title={tStrings.tenantsListTitle}
        description={tStrings.tenantsListDescription}
        icon={Users}
        action={<Button variant="primary" label={tStrings.newCompanyButton} icon={Plus} onClick={() => setIsModalOpen(true)} />}
      >
        <Stack gap={5}>
          <FilterBar searchPlaceholder={tStrings.searchTenantsPlaceholder} onSearch={setSearchQuery} />
          {filteredTenants.length === 0 ? (
            <EmptyState icon={Users} title={tStrings.emptyCompaniesTitle} subtitle={tStrings.emptyCompaniesSubtitle} />
          ) : (
            <TenantListTable tenants={filteredTenants} />
          )}
        </Stack>
      </RegistrySection>

      {isModalOpen && (
        <NewTenantModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={async (data) => {
            await persistNewCompany(data)
            setIsModalOpen(false)
          }}
        />
      )}
    </>
  )
}
