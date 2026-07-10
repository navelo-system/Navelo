"use client"

/* eslint-disable max-lines-per-function */

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Grid } from "@/components/store/base/Grid"
import { Font } from "@/components/store/base/Font"
import { Button } from "@/components/store/base/Button"
import { Input } from "@/components/store/base/Input"
import { Search, Plus, Edit2, Trash2, Building, ShieldCheck, CreditCard, Phone, MapPin } from "lucide-react"

export interface SupplierItem {
  id: string
  tradeName: string      // Nome fantasia
  companyName: string    // Razão social
  document: string       // CPF/CNPJ
  stateRegistration: string // IE
  phone: string
  address: {
    cep: string
    street: string
    number: string
    complement: string
    neighborhood: string
    city: string
  }
}

export interface FornecedoresSectionProps {
  onCancel: () => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
}

export const FornecedoresSection: React.FC<FornecedoresSectionProps> = ({
  onCancel,
  setCustomBack,
  setCustomTitle
}) => {
  const [suppliers, setSuppliers] = React.useState<SupplierItem[]>([
    {
      id: "1",
      tradeName: "teste",
      companyName: "teste ltda",
      document: "38.383.365/0001-90",
      stateRegistration: "",
      phone: "",
      address: {
        cep: "",
        street: "",
        number: "",
        complement: "",
        neighborhood: "",
        city: ""
      }
    }
  ])

  const [mode, setMode] = React.useState<"list" | "form">("list")
  const [editingSupplier, setEditingSupplier] = React.useState<SupplierItem | null>(null)
  const [searchQuery, setSearchQuery] = React.useState("")

  // Form states
  const [formTradeName, setFormTradeName] = React.useState("")
  const [formCompanyName, setFormCompanyName] = React.useState("")
  const [formDocument, setFormDocument] = React.useState("")
  const [formStateRegistration, setFormStateRegistration] = React.useState("")
  const [formPhone, setFormPhone] = React.useState("")
  const [formCep, setFormCep] = React.useState("")
  const [formStreet, setFormStreet] = React.useState("")
  const [formNumber, setFormNumber] = React.useState("")
  const [formComplement, setFormComplement] = React.useState("")
  const [formNeighborhood, setFormNeighborhood] = React.useState("")
  const [formCity, setFormCity] = React.useState("")

  const handleBack = React.useCallback(() => {
    if (mode === "form") {
      setMode("list")
      setEditingSupplier(null)
    } else {
      onCancel()
    }
  }, [mode, onCancel])

  React.useEffect(() => {
    setCustomBack?.(() => handleBack)
    setCustomTitle?.(mode === "form" ? (editingSupplier ? "Editar Fornecedor" : "Novo Fornecedor") : "Fornecedores")

    return () => {
      setCustomBack?.(null)
      setCustomTitle?.(null)
    }
  }, [mode, editingSupplier, setCustomBack, setCustomTitle, handleBack])

  const handleCreateNew = () => {
    setEditingSupplier(null)
    setFormTradeName("")
    setFormCompanyName("")
    setFormDocument("")
    setFormStateRegistration("")
    setFormPhone("")
    setFormCep("")
    setFormStreet("")
    setFormNumber("")
    setFormComplement("")
    setFormNeighborhood("")
    setFormCity("")
    setMode("form")
  }

  const handleEdit = (supplier: SupplierItem) => {
    setEditingSupplier(supplier)
    setFormTradeName(supplier.tradeName)
    setFormCompanyName(supplier.companyName)
    setFormDocument(supplier.document)
    setFormStateRegistration(supplier.stateRegistration)
    setFormPhone(supplier.phone)
    setFormCep(supplier.address.cep)
    setFormStreet(supplier.address.street)
    setFormNumber(supplier.address.number)
    setFormComplement(supplier.address.complement)
    setFormNeighborhood(supplier.address.neighborhood)
    setFormCity(supplier.address.city)
    setMode("form")
  }

  const handleDelete = (id: string) => {
    setSuppliers((prev) => prev.filter((s) => s.id !== id))
    if (mode === "form") {
      setMode("list")
      setEditingSupplier(null)
    }
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formTradeName.trim() || !formCompanyName.trim() || !formDocument.trim()) return

    const supplierData: Omit<SupplierItem, "id"> = {
      tradeName: formTradeName,
      companyName: formCompanyName,
      document: formDocument,
      stateRegistration: formStateRegistration,
      phone: formPhone,
      address: {
        cep: formCep,
        street: formStreet,
        number: formNumber,
        complement: formComplement,
        neighborhood: formNeighborhood,
        city: formCity
      }
    }

    if (editingSupplier) {
      setSuppliers((prev) =>
        prev.map((s) => (s.id === editingSupplier.id ? { ...s, ...supplierData } : s))
      )
    } else {
      setSuppliers((prev) => [
        ...prev,
        { id: Date.now().toString(), ...supplierData }
      ])
    }

    setMode("list")
    setEditingSupplier(null)
  }

  const filtered = suppliers.filter(
    (s) =>
      s.tradeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.document.includes(searchQuery)
  )

  return (
    <Box position="relative" w="full">
      {mode === "list" ? (
        <Stack gap={5} w="full">
          {/* Barra de Busca e Botão de Adição no topo */}
          <Stack direction="col" mobileDirection="row" align="stretch" mobileAlign="center" gap={5} w="full">
            <Box flex="1">
              <Input
                placeholder="Buscar por fornecedor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={Search}
              />
            </Box>
            <Button
              variant="primary"
              label="Adicionar fornecedor"
              icon={Plus}
              onClick={handleCreateNew}
            />
          </Stack>

          {/* Listagem de Fornecedores */}
          <Box
            bg="bg-white"
            border={true}
            borderColor="border-border"
            radius="default"
            w="full"
            overflow="hidden"
          >
            <Stack gap={0} w="full">
              {filtered.map((supplier, idx) => (
                <React.Fragment key={supplier.id}>
                  {idx > 0 && <Box h="h-[1px]" w="full" bg="bg-border" />}
                  <Box
                    padding={5}
                    hoverBg="primary/10"
                    w="full"
                  >
                    <Stack direction="row" align="center" justify="between" w="full" gap={5}>
                      <Stack direction="row" align="center" gap={5} flex="1">
                        <Box w="w-10" h="h-10" bg="bg-brand-primary/10" radius="full">
                          <Stack w="full" h="full" align="center" justify="center">
                            <Font
                              variant="body-bold"
                              color="primary"
                              text={supplier.tradeName.charAt(0).toUpperCase()}
                            />
                          </Stack>
                        </Box>
                        <Stack gap={1}>
                          <Font variant="body-bold" text={supplier.tradeName} />
                          <Font variant="description" text={supplier.document} color="muted" />
                        </Stack>
                      </Stack>

                      {/* Ações de Edição/Deleção */}
                      <Stack direction="row" gap={2.5} justify="end">
                        <Button
                          variant="outline-icon-xs"
                          icon={Edit2}
                          onClick={() => handleEdit(supplier)}
                        />
                        <Button
                          variant="danger-icon-xs"
                          icon={Trash2}
                          onClick={() => handleDelete(supplier.id)}
                        />
                      </Stack>
                    </Stack>
                  </Box>
                </React.Fragment>
              ))}
            </Stack>
          </Box>
        </Stack>
      ) : (
        /* Form de Cadastro / Edição */
        <Box
          as="form"
          onSubmit={handleSave}
          bg="bg-white"
          border={true}
          borderColor="border-border"
          radius="default"
          padding={5}
          w="full"
        >
          <Stack gap={5} w="full">
            <Grid cols={2} gap={5}>
              <Input
                label="* Nome fantasia"
                placeholder="Ex: Autopeças do Vale"
                value={formTradeName}
                onChange={(e) => setFormTradeName(e.target.value)}
                icon={Building}
                required
              />

              <Input
                label="* Razão social"
                placeholder="Ex: Autopeças do Vale Ltda"
                value={formCompanyName}
                onChange={(e) => setFormCompanyName(e.target.value)}
                icon={ShieldCheck}
                required
              />

              <Input
                label="* CPF/CNPJ"
                placeholder="Ex: 00.000.000/0000-00"
                value={formDocument}
                onChange={(e) => setFormDocument(e.target.value)}
                icon={CreditCard}
                required
              />

              <Input
                label="IE (Inscrição Estadual)"
                placeholder="Isento ou número..."
                value={formStateRegistration}
                onChange={(e) => setFormStateRegistration(e.target.value)}
                icon={ShieldCheck}
              />

              <Input
                label="Telefone"
                placeholder="Ex: (11) 99999-9999"
                value={formPhone}
                onChange={(e) => setFormPhone(e.target.value)}
                icon={Phone}
              />
            </Grid>

            {/* Seção de Endereço */}
            <Stack gap={2.5} w="full">
              <Box paddingY={2.5}>
                <Font variant="body-bold" text="Endereço" />
              </Box>

              <Grid cols={2} gap={5}>
                <Input
                  label="CEP"
                  placeholder="Ex: 01001-000"
                  value={formCep}
                  onChange={(e) => setFormCep(e.target.value)}
                  icon={MapPin}
                />

                <Input
                  label="Logradouro"
                  placeholder="Ex: Rua das Flores"
                  value={formStreet}
                  onChange={(e) => setFormStreet(e.target.value)}
                  icon={MapPin}
                />

                <Input
                  label="Número"
                  placeholder="Ex: 123"
                  value={formNumber}
                  onChange={(e) => setFormNumber(e.target.value)}
                />

                <Input
                  label="Complemento"
                  placeholder="Ex: Sala 4"
                  value={formComplement}
                  onChange={(e) => setFormComplement(e.target.value)}
                />

                <Input
                  label="Bairro"
                  placeholder="Ex: Centro"
                  value={formNeighborhood}
                  onChange={(e) => setFormNeighborhood(e.target.value)}
                  icon={MapPin}
                />

                <Input
                  label="Cidade"
                  placeholder="Ex: São Paulo"
                  value={formCity}
                  onChange={(e) => setFormCity(e.target.value)}
                  icon={MapPin}
                />
              </Grid>
            </Stack>

            {/* Ações de Formulário */}
            <Box paddingY={2.5} w="full">
              <Stack direction="row" justify="between" align="center" w="full">
                {editingSupplier ? (
                  <Button
                    type="button"
                    variant="danger"
                    label="Excluir Fornecedor"
                    icon={Trash2}
                    onClick={() => handleDelete(editingSupplier.id)}
                  />
                ) : (
                  <Box />
                )}
                <Stack direction="row" gap={2.5}>
                  <Button
                    type="button"
                    variant="outline"
                    label="Cancelar"
                    onClick={() => setMode("list")}
                  />
                  <Button
                    type="submit"
                    variant="primary"
                    label={editingSupplier ? "Salvar alterações" : "Salvar fornecedor"}
                  />
                </Stack>
              </Stack>
            </Box>
          </Stack>
        </Box>
      )}
    </Box>
  )
}
