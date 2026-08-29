"use client"

import * as React from "react"
import { Modal } from "@/components/store/base/Modal"
import { Stack } from "@/components/store/base/Stack"
import { Grid } from "@/components/store/base/Grid"
import { Input } from "@/components/store/base/Input"
import { Form } from "@/components/store/base/Form"
import { MapPin } from "lucide-react"
import { UI_STRINGS } from "@/constants/strings"

export interface AddressFormData {
  id?: string
  name: string
  zip: string
  street: string
  number: string
  complement?: string
  neighborhood: string
  city: string
  reference_point?: string
}

export interface ClientAddressFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (address: AddressFormData) => void
  initialData?: AddressFormData | null
}

function resolveInitialAddressData(data?: AddressFormData | null) {
  if (!data) {
    return { name: "", zip: "", street: "", number: "", complement: "", neighborhood: "", city: "" }
  }
  return {
    name: data.name || "",
    zip: data.zip || "",
    street: data.street || "",
    number: data.number || "",
    complement: data.complement || "",
    neighborhood: data.neighborhood || "",
    city: data.city || "",
  }
}

function useAddressFormFields(isOpen: boolean, initialData?: AddressFormData | null) {
  const init = resolveInitialAddressData(initialData)
  const [name, setName] = React.useState(init.name)
  const [zip, setZip] = React.useState(init.zip)
  const [street, setStreet] = React.useState(init.street)
  const [number, setNumber] = React.useState(init.number)
  const [complement, setComplement] = React.useState(init.complement)
  const [neighborhood, setNeighborhood] = React.useState(init.neighborhood)
  const [city, setCity] = React.useState(init.city)
  const [prevIsOpen, setPrevIsOpen] = React.useState(isOpen)
  const [prevData, setPrevData] = React.useState(initialData)

  if (isOpen !== prevIsOpen || initialData !== prevData) {
    setPrevIsOpen(isOpen)
    setPrevData(initialData)
    if (isOpen) {
      const next = resolveInitialAddressData(initialData)
      setName(next.name)
      setZip(next.zip)
      setStreet(next.street)
      setNumber(next.number)
      setComplement(next.complement)
      setNeighborhood(next.neighborhood)
      setCity(next.city)
    }
  }

  const handleZipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setZip(val)
    const cleanZip = val.replace(/\D/g, "")
    if (cleanZip.length === 8) {
      fetch(`https://viacep.com.br/ws/${cleanZip}/json/`)
        .then((res) => res.json())
        .then((data) => {
          if (!data.erro) {
            if (data.logradouro) setStreet(data.logradouro)
            if (data.bairro) setNeighborhood(data.bairro)
            if (data.localidade) {
              setCity(data.uf ? `${data.localidade} - ${data.uf}` : data.localidade)
            }
          }
        })
        .catch((err) => console.error("Erro ao buscar CEP:", err))
    }
  }

  return {
    name, setName,
    zip, handleZipChange,
    street, setStreet,
    number, setNumber,
    complement, setComplement,
    neighborhood, setNeighborhood,
    city, setCity,
  }
}

interface AddressModalInputsProps {
  fields: ReturnType<typeof useAddressFormFields>
}

function AddressModalInputs({ fields }: AddressModalInputsProps) {
  const cust = UI_STRINGS.customers
  return (
    <Stack gap={2.5}>
      <Grid cols={2} gap={2.5}>
        <Input
          label={cust.addressNameLabel}
          placeholder={cust.addressNamePlaceholder}
          value={fields.name}
          onChange={(e) => fields.setName(e.target.value)}
          required
        />
        <Input
          label={cust.cepLabel}
          variant="cep"
          placeholder={cust.cepPlaceholder}
          value={fields.zip}
          onChange={fields.handleZipChange}
        />
      </Grid>
      <Input
        label={cust.streetLabel}
        placeholder={cust.streetPlaceholder}
        value={fields.street}
        onChange={(e) => fields.setStreet(e.target.value)}
      />
      <Grid cols={2} gap={2.5}>
        <Input
          label={cust.numberLabel}
          placeholder={cust.numberPlaceholder}
          value={fields.number}
          onChange={(e) => fields.setNumber(e.target.value)}
        />
        <Input
          label={cust.complementLabel}
          placeholder={cust.complementPlaceholder}
          value={fields.complement}
          onChange={(e) => fields.setComplement(e.target.value)}
        />
      </Grid>
      <Input
        label={cust.neighborhoodLabel}
        placeholder={cust.neighborhoodPlaceholder}
        value={fields.neighborhood}
        onChange={(e) => fields.setNeighborhood(e.target.value)}
      />
      <Input
        label={cust.cityLabel}
        placeholder={cust.cityPlaceholder}
        value={fields.city}
        onChange={(e) => fields.setCity(e.target.value)}
        required
      />
    </Stack>
  )
}

export function ClientAddressFormModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: ClientAddressFormModalProps) {
  const fields = useAddressFormFields(isOpen, initialData)
  const cust = UI_STRINGS.customers
  const common = UI_STRINGS.common

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    onSave({
      id: initialData?.id,
      name: fields.name.trim() || "Principal",
      zip: fields.zip.trim(),
      street: fields.street.trim(),
      number: fields.number.trim() || "S/N",
      complement: fields.complement.trim(),
      neighborhood: fields.neighborhood.trim(),
      city: fields.city.trim(),
      reference_point: initialData?.reference_point,
    })
    onClose()
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={initialData ? cust.addressModalTitleEdit : cust.addressModalTitleNew}
        successText={initialData ? common.save : cust.addButton}
        isSubmit={true}
        onSuccess={handleSubmit}
      >
        <AddressModalInputs fields={fields} />
      </Modal>
    </Form>
  )
}
