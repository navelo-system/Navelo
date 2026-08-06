"use client"

/* eslint-disable max-lines-per-function, complexity */

import * as React from "react"
import { Modal } from "@/components/store/base/Modal"
import { Stack } from "@/components/store/base/Stack"
import { Grid } from "@/components/store/base/Grid"
import { Input } from "@/components/store/base/Input"
import { Form } from "@/components/store/base/Form"
import { MapPin } from "lucide-react"

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
  const [referencePoint, setReferencePoint] = React.useState("")

  React.useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setName(initialData.name || "")
        setZip(initialData.zip || "")
        setStreet(initialData.street || "")
        setNumber(initialData.number || "")
        setComplement(initialData.complement || "")
        setNeighborhood(initialData.neighborhood || "")
        setCity(initialData.city || "")
        setReferencePoint(initialData.reference_point || "")
      } else {
        setName("")
        setZip("")
        setStreet("")
        setNumber("")
        setComplement("")
        setNeighborhood("")
        setCity("")
        setReferencePoint("")
      }
    }
  }, [isOpen, initialData])

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!name.trim()) return

    onSave({
      id: initialData?.id,
      name: name.trim(),
      zip: zip.trim(),
      street: street.trim(),
      number: number.trim(),
      complement: complement.trim(),
      neighborhood: neighborhood.trim(),
      city: city.trim(),
      reference_point: referencePoint.trim(),
    })

    onClose()
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={initialData ? "Editar Endereço" : "Dados do endereço"}
        subtitle="Preencha as informações do endereço para entregas."
        icon={MapPin}
        successText={initialData ? "Salvar" : "Adicionar"}
        isSubmit={true}
      >
        <Stack gap={2.5}>
          {/* 1. * Nome do Endereço */}
          <Input
            label="* Nome do Endereço"
            placeholder="Ex: Casa, Trabalho"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          {/* 2. CEP */}
          <Grid cols={2} gap={2.5}>
            <Input
              label="CEP"
              variant="cep"
              placeholder="00000-000"
              value={zip}
              onChange={(e) => setZip(e.target.value)}
            />
          </Grid>

          {/* 3. Logradouro */}
          <Input
            label="Logradouro"
            placeholder="Rua, Avenida..."
            value={street}
            onChange={(e) => setStreet(e.target.value)}
          />

          {/* 4. Número e Complemento */}
          <Grid cols={2} gap={2.5}>
            <Input
              label="Número"
              placeholder="Ex: 123"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
            />
            <Input
              label="Complemento"
              placeholder="Apto, Bloco..."
              value={complement}
              onChange={(e) => setComplement(e.target.value)}
            />
          </Grid>

          {/* 5. Bairro */}
          <Input
            label="Bairro"
            placeholder="Nome do bairro"
            value={neighborhood}
            onChange={(e) => setNeighborhood(e.target.value)}
          />

          {/* 6. * Cidade */}
          <Input
            label="* Cidade"
            placeholder="Nome da cidade"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />

          {/* 7. Ponto de referência */}
          <Input
            label="Ponto de referência"
            placeholder="Próximo a..."
            value={referencePoint}
            onChange={(e) => setReferencePoint(e.target.value)}
          />
        </Stack>
      </Modal>
    </Form>
  )
}
