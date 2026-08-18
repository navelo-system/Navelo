"use client"

/* eslint-disable max-lines-per-function */

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

export const ClientAddressFormModal: React.FC<ClientAddressFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [name, setName] = React.useState("")
  const [zip, setZip] = React.useState("")
  const [street, setStreet] = React.useState("")
  const [number, setNumber] = React.useState("")
  const [complement, setComplement] = React.useState("")
  const [neighborhood, setNeighborhood] = React.useState("")
  const [city, setCity] = React.useState("")
  const cust = UI_STRINGS.customers
  const common = UI_STRINGS.common

  React.useEffect(() => {
    if (isOpen) {
      if (initialData) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setName(initialData.name || "")
        setZip(initialData.zip || "")
        setStreet(initialData.street || "")
        setNumber(initialData.number || "")
        setComplement(initialData.complement || "")
        setNeighborhood(initialData.neighborhood || "")
        setCity(initialData.city || "")
      } else {
        setName("")
        setZip("")
        setStreet("")
        setNumber("")
        setComplement("")
        setNeighborhood("")
        setCity("")
      }
    }
  }, [isOpen, initialData])

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
              const formattedCity = data.uf ? `${data.localidade} - ${data.uf}` : data.localidade
              setCity(formattedCity)
            }
          }
        })
        .catch((err) => console.error("Erro ao buscar CEP:", err))
    }
  }

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault()

    const finalName = name.trim() || "Principal"

    onSave({
      id: initialData?.id,
      name: finalName,
      zip: zip.trim(),
      street: street.trim(),
      number: number.trim() || "S/N",
      complement: complement.trim(),
      neighborhood: neighborhood.trim(),
      city: city.trim(),
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
        subtitle={cust.addressModalSubtitle}
        icon={MapPin}
        successText={initialData ? common.save : cust.addButton}
        isSubmit={true}
        onSuccess={handleSubmit}
      >
        <Stack gap={2.5}>
          {/* 1. * Nome do Endereço */}
          <Input
            label={cust.addressNameLabel}
            placeholder={cust.addressNamePlaceholder}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          {/* 2. CEP */}
          <Grid cols={2} gap={2.5}>
            <Input
              label={cust.cepLabel}
              variant="cep"
              placeholder={cust.cepPlaceholder}
              value={zip}
              onChange={handleZipChange}
            />
          </Grid>

          {/* 3. Logradouro */}
          <Input
            label={cust.streetLabel}
            placeholder={cust.streetPlaceholder}
            value={street}
            onChange={(e) => setStreet(e.target.value)}
          />

          {/* 4. Número e Complemento */}
          <Grid cols={2} gap={2.5}>
            <Input
              label={cust.numberLabel}
              placeholder={cust.numberPlaceholder}
              value={number}
              onChange={(e) => setNumber(e.target.value)}
            />
            <Input
              label={cust.complementLabel}
              placeholder={cust.complementPlaceholder}
              value={complement}
              onChange={(e) => setComplement(e.target.value)}
            />
          </Grid>

          {/* 5. Bairro */}
          <Input
            label={cust.neighborhoodLabel}
            placeholder={cust.neighborhoodPlaceholder}
            value={neighborhood}
            onChange={(e) => setNeighborhood(e.target.value)}
          />

          {/* 6. * Cidade */}
          <Input
            label={cust.cityLabel}
            placeholder={cust.cityPlaceholder}
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
        </Stack>
      </Modal>
    </Form>
  )
}
