"use client"

/* eslint-disable max-lines-per-function */

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Grid } from "@/components/store/base/Grid"
import { Font } from "@/components/store/base/Font"
import { Button } from "@/components/store/base/Button"
import { Input } from "@/components/store/base/Input"
import { CustomSelect, CustomSelectItem } from "@/components/store/base/CustomSelect"
import { AddressList } from "@/components/store/advanced/AddressList"
import { FormActions } from "@/components/store/intermediary/FormActions"
import { ClientAddressFormModal } from "@/components/store/advanced/ClientAddressFormModal"
import { CustomerAddress } from "@/src/types/domain"
import {
  Plus,
  Mail,
  Phone,
  FileText,
  User
} from "lucide-react"
import { MobileHeaderSearch } from "@/components/store/intermediary/PdvCatalogToolbar"

interface ClientItem {
  id: string
  name: string
  document: string
  phone: string
  email: string
  type: "PF" | "PJ"
  addresses: CustomerAddress[]
}

interface ClientesSectionProps {
  onBackToDashboard?: () => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
  setCustomActions?: (actions: React.ReactNode | null) => void
  onBack?: () => void
}

export const ClientesSection: React.FC<ClientesSectionProps> = ({
  setCustomBack,
  setCustomTitle,
  setCustomActions,
  onBack,
}) => {
  const [clients, setClients] = React.useState<ClientItem[]>([
    {
      id: "1", name: "Filipe Augusto", document: "101.389.219-46", phone: "(11) 98765-4321", email: "filipe@gmail.com", type: "PF", addresses: [
        { id: "addr_1", customerId: "1", street: "Av. Paulista", number: "1000", neighborhood: "Bela Vista", city: "São Paulo", state: "SP", zipCode: "01310-100", isDefault: true, complement: "Cj 12" }
      ]
    },
    { id: "2", name: "Maria Eduarda", document: "202.489.102-55", phone: "(11) 97654-3210", email: "maria@hotmail.com", type: "PF", addresses: [] },
    {
      id: "3", name: "JS Soluções Tecnológicas", document: "12.345.678/0001-99", phone: "(11) 3210-9876", email: "contato@jssolucoes.com.br", type: "PJ", addresses: [
        { id: "addr_2", customerId: "3", street: "Rua Augusta", number: "450", neighborhood: "Consolação", city: "São Paulo", state: "SP", zipCode: "01304-000", isDefault: true, complement: "Ap 31" }
      ]
    },
  ])

  const [mode, setMode] = React.useState<"list" | "form">("list")

  const scrollPositions = React.useRef<Record<string, number>>({})

  React.useEffect(() => {
    if (typeof window === "undefined") return
    const handleScroll = () => {
      scrollPositions.current[mode] = window.scrollY
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [mode])

  React.useEffect(() => {
    if (typeof window === "undefined") return
    const savedScroll = scrollPositions.current[mode] || 0
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.scrollTo({ top: savedScroll, behavior: "instant" })
      })
    })
  }, [mode])
  const [editingClient, setEditingClient] = React.useState<ClientItem | null>(null)
  const [searchQuery, setSearchQuery] = React.useState("")

  // Form states
  const [formName, setFormName] = React.useState("")
  const [formDocument, setFormDocument] = React.useState("")
  const [formPhone, setFormPhone] = React.useState("")
  const [formEmail, setFormEmail] = React.useState("")
  const [formType, setFormType] = React.useState<"PF" | "PJ">("PF")
  const [clientAddresses, setClientAddresses] = React.useState<CustomerAddress[]>([])

  // Modal Address states
  const [isAddressModalOpen, setIsAddressModalOpen] = React.useState(false)
  const [editingAddress, setEditingAddress] = React.useState<CustomerAddress | null>(null)

  React.useEffect(() => {
    setCustomTitle?.("Clientes")
    if (mode === "form") {
      setCustomBack?.(() => () => setMode("list"))
      setCustomActions?.(null)
    } else {
      if (onBack) {
        setCustomBack?.(() => () => onBack())
      } else {
        setCustomBack?.(null)
      }
      setCustomActions?.(
        <MobileHeaderSearch
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          placeholder="Buscar por nome ou CPF/CNPJ..."
        />
      )
    }
    return () => {
      setCustomTitle?.(null)
      setCustomBack?.(null)
      setCustomActions?.(null)
    }
  }, [mode, searchQuery, setCustomBack, setCustomTitle, setCustomActions, onBack])
  const handleEdit = (client: ClientItem) => {
    setEditingClient(client)
    setFormName(client.name)
    setFormDocument(client.document)
    setFormPhone(client.phone)
    setFormEmail(client.email)
    setFormType(client.type)
    setClientAddresses(client.addresses)
    setMode("form")
  }

  const handleCreateNew = () => {
    setEditingClient(null)
    setFormName("")
    setFormDocument("")
    setFormPhone("")
    setFormEmail("")
    setFormType("PF")
    setClientAddresses([])
    setMode("form")
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingClient) {
      setClients((prev) =>
        prev.map((c) =>
          c.id === editingClient.id
            ? {
              ...c,
              name: formName,
              document: formDocument,
              phone: formPhone,
              email: formEmail,
              type: formType,
              addresses: clientAddresses
            }
            : c
        )
      )
    } else {
      const newClient: ClientItem = {
        id: Math.random().toString(),
        name: formName,
        document: formDocument,
        phone: formPhone,
        email: formEmail,
        type: formType,
        addresses: clientAddresses
      }
      setClients((prev) => [...prev, newClient])
    }

    setMode("list")
  }

  const handleAddAddress = () => {
    setEditingAddress(null)
    setIsAddressModalOpen(true)
  }

  const handleEditAddress = (addr: CustomerAddress) => {
    setEditingAddress(addr)
    setIsAddressModalOpen(true)
  }

  const handleDeleteAddress = (addr: CustomerAddress) => {
    setClientAddresses((prev) => prev.filter((a) => a.id !== addr.id))
  }

  const handleSaveAddress = (addrData: {
    zip: string
    street: string
    number: string
    complement: string
    neighborhood: string
    city: string
    state: string
  }) => {
    if (editingAddress) {
      setClientAddresses((prev) =>
        prev.map((a) =>
          a.id === editingAddress.id
            ? {
              ...a,
              street: addrData.street,
              number: addrData.number,
              complement: addrData.complement,
              neighborhood: addrData.neighborhood,
              city: addrData.city,
              state: addrData.state,
              zipCode: addrData.zip
            }
            : a
        )
      )
    } else {
      const newAddress: CustomerAddress = {
        id: Math.random().toString(),
        customerId: editingClient?.id || "temp",
        street: addrData.street,
        number: addrData.number,
        complement: addrData.complement,
        neighborhood: addrData.neighborhood,
        city: addrData.city,
        state: addrData.state,
        zipCode: addrData.zip,
        isDefault: clientAddresses.length === 0
      }
      setClientAddresses((prev) => [...prev, newAddress])
    }

    setIsAddressModalOpen(false)
  }

  const filtered = clients.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.document.includes(searchQuery)
  )

  return (
    <Stack gap={5} w="full">
      {mode === "list" ? (
        /* ================= LISTAGEM DE CLIENTES (MINIMALISTA) ================= */
        <Box position="relative" w="full">
          <Box display="flex" direction="col" w="full">
            {filtered.map((cli, idx) => (
              <Box key={cli.id}>
                <Box
                  w="full"
                  padding={2.5}
                  radius="full"
                  hoverBg="surface-sunken"
                  cursor="pointer"
                  onClick={() => handleEdit(cli)}
                >
                  <Stack direction="row" align="center" gap={2.5} w="full">
                    {/* Avatar / Foto */}
                    <Box
                      w="w-10"
                      h="h-10"
                      bg="bg-surface-sunken"
                      borderColor="border-border"
                      border={true}
                      radius="full"
                      shrink="0"
                    >
                      <Stack w="full" h="full" align="center" justify="center">
                        <Font
                          variant="body-bold"
                          color="muted"
                          text={cli.name.charAt(0).toUpperCase()}
                        />
                      </Stack>
                    </Box>

                    {/* Nome + Documento */}
                    <Stack gap={1} align="start" flex="1">
                      <Font variant="body" text={cli.name} />
                      {cli.document && (
                        <Font
                          variant="auxiliary"
                          color="muted"
                          text={cli.document}
                        />
                      )}
                    </Stack>
                  </Stack>
                </Box>
                {idx < filtered.length - 1 && (
                  <Box h="h-[1px]" w="full" bg="bg-border" />
                )}
              </Box>
            ))}
          </Box>

          {/* Botão FAB fixo no canto inferior direito */}
          <Box position="fixed" bottom={6} right={6} zIndex="50">
            <Button
              variant="secondary-pill-icon"
              icon={Plus}
              onClick={handleCreateNew}
            />
          </Box>
        </Box>
      ) : (
        /* ================= FORMULÁRIO DE CLIENTE ================= */
        <Stack gap={5} w="full">
          <Box padding={5} bg="bg-surface" radius="default" border={true} borderColor="border-border">
            <Box as="form" onSubmit={handleSave} w="full">
              <Stack gap={5}>
                <Grid cols={2} gap={5}>
                  <Input
                    label="Nome Completo / Razão Social *"
                    placeholder="Ex: João da Silva"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    required
                  />

                  <Stack gap={1} w="full">
                    <Font variant="body-sm-semibold" text="Tipo de Pessoa" />
                    <CustomSelect
                      value={formType}
                      onChange={(val) => setFormType(val as "PF" | "PJ")}
                    >
                      <CustomSelectItem value="PF" text="Pessoa Física (PF)" icon={User} />
                      <CustomSelectItem value="PJ" text="Pessoa Jurídica (PJ)" icon={User} />
                    </CustomSelect>
                  </Stack>
                </Grid>

                <Grid cols={3} gap={5}>
                  <Input
                    label={formType === "PF" ? "CPF" : "CNPJ"}
                    placeholder={formType === "PF" ? "000.000.000-00" : "00.000.000/0000-00"}
                    value={formDocument}
                    onChange={(e) => setFormDocument(e.target.value)}
                    icon={FileText}
                  />

                  <Input
                    label="Telefone / WhatsApp"
                    placeholder="Ex: (11) 99999-9999"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    icon={Phone}
                  />

                  <Input
                    label="E-mail"
                    placeholder="Ex: cliente@email.com"
                    value={formEmail}
                    type="email"
                    onChange={(e) => setFormEmail(e.target.value)}
                    icon={Mail}
                  />
                </Grid>

                <Box h="h-[1px]" bg="bg-border" w="full" />

                {/* Seção de Endereços */}
                <Stack gap={2.5} w="full">
                  <Stack direction="col" mobileDirection="row" align="start" mobileAlign="center" justify="between" w="full" gap={2.5}>
                    <Stack gap={0} align="start">
                      <Font variant="body-bold" text="Endereços de Entrega" />
                      <Font variant="auxiliary" color="muted" text="Gerencie os locais de entrega deste cliente" />
                    </Stack>
                    <Button
                      variant="outline"
                      label="Adicionar Endereço"
                      icon={Plus}
                      onClick={handleAddAddress}
                    />
                  </Stack>

                  <AddressList
                    addresses={clientAddresses}
                    onEdit={handleEditAddress}
                    onDelete={handleDeleteAddress}
                  />
                </Stack>

                <Box h="h-[1px]" bg="bg-border" w="full" />

                <FormActions
                  confirmLabel="Salvar Cadastro"
                  onConfirm={() => {}}
                  onCancel={() => setMode("list")}
                  isSubmit={true}
                />
              </Stack>
            </Box>
          </Box>

          {/* MODAL: Formulário de Endereço */}
          <ClientAddressFormModal
            isOpen={isAddressModalOpen}
            onClose={() => setIsAddressModalOpen(false)}
            onSave={handleSaveAddress}
            initialData={
              editingAddress
                ? {
                  zip: editingAddress.zipCode,
                  street: editingAddress.street,
                  number: editingAddress.number,
                  complement: editingAddress.complement || "",
                  neighborhood: editingAddress.neighborhood,
                  city: editingAddress.city,
                  state: editingAddress.state,
                }
                : null
            }
          />
        </Stack>
      )}
    </Stack>
  )
}
