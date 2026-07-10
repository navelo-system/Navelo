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
import { ClientAddressFormModal } from "@/components/store/advanced/ClientAddressFormModal"
import { CustomerAddress } from "@/src/types/domain"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/store/base/Table"
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Mail,
  Phone,
  FileText,
  User
} from "lucide-react"

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
  onBackToDashboard: () => void
  setCustomBack?: (cb: (() => void) | null) => void
}

export const ClientesSection: React.FC<ClientesSectionProps> = ({
  setCustomBack
}) => {
  const [clients, setClients] = React.useState<ClientItem[]>([
    { id: "1", name: "Filipe Augusto", document: "101.389.219-46", phone: "(11) 98765-4321", email: "filipe@gmail.com", type: "PF", addresses: [
      { id: "addr_1", customerId: "1", street: "Av. Paulista", number: "1000", neighborhood: "Bela Vista", city: "São Paulo", state: "SP", zipCode: "01310-100", isDefault: true, complement: "Cj 12" }
    ] },
    { id: "2", name: "Maria Eduarda", document: "202.489.102-55", phone: "(11) 97654-3210", email: "maria@hotmail.com", type: "PF", addresses: [] },
    { id: "3", name: "JS Soluções Tecnológicas", document: "12.345.678/0001-99", phone: "(11) 3210-9876", email: "contato@jssolucoes.com.br", type: "PJ", addresses: [
      { id: "addr_2", customerId: "3", street: "Rua Augusta", number: "450", neighborhood: "Consolação", city: "São Paulo", state: "SP", zipCode: "01304-000", isDefault: true, complement: "Ap 31" }
    ] },
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
    if (mode === "form") {
      setCustomBack?.(() => () => setMode("list"))
    } else {
      setCustomBack?.(null)
    }
    return () => setCustomBack?.(null)
  }, [mode, setCustomBack])
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

  const handleDelete = (id: string) => {
    setClients((prev) => prev.filter((c) => c.id !== id))
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
        /* ================= LISTAGEM DE CLIENTES ================= */
        <Box padding={5} bg="bg-surface" radius="default" border={true} borderColor="border-border">
          <Stack gap={5} w="full">
            <Stack direction="col" mobileDirection="row" gap={2.5} align="stretch" mobileAlign="center" w="full">
              <Box flex="1" w="full">
                <Input
                  placeholder="Buscar por nome ou CPF/CNPJ..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  icon={Search}
                />
              </Box>
              <Button
                variant="primary"
                label="Novo Cliente"
                icon={Plus}
                onClick={handleCreateNew}
              />
            </Stack>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead text="Cliente / Razão Social" />
                  <TableHead text="Tipo" />
                  <TableHead text="CPF / CNPJ" />
                  <TableHead text="Telefone" />
                  <TableHead text="E-mail" />
                  <TableHead text="Endereços" />
                  <TableHead text="Ações" align="right" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((cli) => (
                  <TableRow key={cli.id}>
                    <TableCell fontWeight="bold">
                      <Stack direction="row" align="center" gap={2.5}>
                        <Box w="w-8" h="h-8" bg="bg-brand-primary/10" radius="full">
                          <Stack w="full" h="full" align="center" justify="center">
                            <Font variant="body-sm-semibold" color="primary" text={cli.name.charAt(0).toUpperCase()} />
                          </Stack>
                        </Box>
                        <Font variant="body-bold" text={cli.name} />
                      </Stack>
                    </TableCell>
                    <TableCell>{cli.type === "PF" ? "Pessoa Física" : "Pessoa Jurídica"}</TableCell>
                    <TableCell>{cli.document || "Não informado"}</TableCell>
                    <TableCell>{cli.phone || "Não informado"}</TableCell>
                    <TableCell>{cli.email || "Não informado"}</TableCell>
                    <TableCell>{cli.addresses.length} cadastrados</TableCell>
                    <TableCell align="right" w="w-24">
                      <Stack direction="row" gap={2.5} justify="end">
                        <Button
                          variant="outline-sm"
                          icon={Edit2}
                          onClick={() => handleEdit(cli)}
                        />
                        <Button
                          variant="danger-sm"
                          icon={Trash2}
                          onClick={() => handleDelete(cli.id)}
                        />
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Stack>
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
                  <Stack direction="row" align="center" justify="between" w="full" gap={5}>
                    <Stack gap={0} align="start">
                      <Font variant="body-bold" text="Endereços de Entrega" />
                      <Font variant="auxiliary" color="muted" text="Gerencie os locais de entrega deste cliente" />
                    </Stack>
                    <Button
                      variant="outline-sm"
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

                <Stack direction="row" justify="end" gap={2.5} w="full">
                  <Button
                    variant="outline"
                    label="Cancelar"
                    onClick={() => setMode("list")}
                  />
                  <Button
                    variant="primary"
                    label="Salvar Cadastro"
                    type="submit"
                  />
                </Stack>
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
