"use client"

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Input } from "@/components/store/base/Input"
import { Button } from "@/components/store/base/Button"
import { User, MapPin } from "lucide-react"

export interface DeliveryFormProps {
  onSubmit: (data: { clientName: string; address: string; total: number }) => void
}

export const DeliveryForm: React.FC<DeliveryFormProps> = ({ onSubmit }) => {
  const [clientName, setClientName] = React.useState("")
  const [address, setAddress] = React.useState("")
  const [total, setTotal] = React.useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!clientName || !address || !total) return
    onSubmit({
      clientName,
      address,
      total: parseFloat(total) || 0,
    })
    setClientName("")
    setAddress("")
    setTotal("")
  }

  return (
    <Box as="form" onSubmit={handleSubmit}>
      <Stack gap={2.5}>
        <Input
          placeholder="Nome do cliente"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          icon={User}
          required
        />
        <Input
          placeholder="Endereço de entrega"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          icon={MapPin}
          required
        />
        <Input
          placeholder="Valor total (R$)"
          value={total}
          onChange={(e) => setTotal(e.target.value)}
          required
        />
        <Button variant="primary" label="Lançar Pedido" type="submit" fullWidth />
      </Stack>
    </Box>
  )
}
