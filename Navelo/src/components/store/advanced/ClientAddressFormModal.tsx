"use client"

/* eslint-disable max-lines-per-function, complexity */

import * as React from "react"
import { Modal } from "@/components/store/base/Modal"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Grid } from "@/components/store/base/Grid"
import { Font } from "@/components/store/base/Font"
import { Input } from "@/components/store/base/Input"
import { FormActions } from "@/components/store/intermediary/FormActions"

export interface ClientAddressFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (address: {
    zip: string
    street: string
    number: string
    complement: string
    neighborhood: string
    city: string
    state: string
  }) => void
  initialData?: {
    zip: string
    street: string
    number: string
    complement: string
    neighborhood: string
    city: string
    state: string
  } | null
}

export const ClientAddressFormModal: React.FC<ClientAddressFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [zip, setZip] = React.useState("")
  const [street, setStreet] = React.useState("")
  const [number, setNumber] = React.useState("")
  const [complement, setComplement] = React.useState("")
  const [neighborhood, setNeighborhood] = React.useState("")
  const [city, setCity] = React.useState("")
  const [state, setState] = React.useState("")

  const [prevIsOpen, setPrevIsOpen] = React.useState(isOpen)
  const [prevInitialData, setPrevInitialData] = React.useState(initialData)

  if (isOpen !== prevIsOpen || initialData !== prevInitialData) {
    setPrevIsOpen(isOpen)
    setPrevInitialData(initialData)
    if (isOpen) {
      if (initialData) {
        setZip(initialData.zip || "")
        setStreet(initialData.street || "")
        setNumber(initialData.number || "")
        setComplement(initialData.complement || "")
        setNeighborhood(initialData.neighborhood || "")
        setCity(initialData.city || "")
        setState(initialData.state || "")
      } else {
        setZip("")
        setStreet("")
        setNumber("")
        setComplement("")
        setNeighborhood("")
        setCity("")
        setState("")
      }
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      zip,
      street,
      number,
      complement,
      neighborhood,
      city,
      state,
    })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Box padding={5} bg="bg-surface" radius="default" as="form" onSubmit={handleSubmit}>
        <Stack gap={5}>
          <Font variant="h3" text={initialData ? "Editar Endereço" : "Novo Endereço"} />
          <Box h="h-[2px]" bg="bg-border" w="full" />

          <Grid cols={2} gap={5}>
            <Input
              label="CEP *"
              placeholder="00000-000"
              value={zip}
              onChange={(e) => setZip(e.target.value)}
              required
            />

            <Input
              label="Logradouro / Rua *"
              placeholder="Ex: Av. Paulista"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              required
            />

            <Input
              label="Número *"
              placeholder="Ex: 1000"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              required
            />

            <Input
              label="Complemento"
              placeholder="Ex: Ap 31, Bloco B"
              value={complement}
              onChange={(e) => setComplement(e.target.value)}
            />

            <Input
              label="Bairro *"
              placeholder="Ex: Bela Vista"
              value={neighborhood}
              onChange={(e) => setNeighborhood(e.target.value)}
              required
            />

            <Input
              label="Cidade *"
              placeholder="Ex: São Paulo"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />

            <Input
              label="Estado (UF) *"
              placeholder="Ex: SP"
              value={state}
              onChange={(e) => setState(e.target.value)}
              required
            />
          </Grid>

                <FormActions
        confirmLabel="Salvar Endereço"
        onConfirm={() => {}}
        isSubmit={true}
        onCancel={onClose}
      />
        </Stack>
      </Box>
    </Modal>
  )
}
