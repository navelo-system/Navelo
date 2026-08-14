"use client"

/* eslint-disable max-lines-per-function */

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
              onChange={handleZipChange}
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
        </Stack>
      </Modal>
    </Form>
  )
}
