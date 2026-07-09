"use client"

import * as React from "react"
import { Modal } from "@/components/store/base/Modal"
import { Form } from "@/components/store/advanced/Form"
import { Stack } from "@/components/store/base/Stack"
import { Box } from "@/components/store/base/Box"
import { Font } from "@/components/store/base/Font"
import { Input } from "@/components/store/base/Input"
import { Switch } from "@/components/store/base/Switch"
import { Plan } from "@/src/types/domain"
import { APP_FEATURES } from "@/src/constants/features"
import { CreditCard } from "lucide-react"

export type { Plan }
export { APP_FEATURES }


export interface PlanFormModalProps {
  isOpen: boolean
  onClose: () => void
  plan: Plan | null
  onSave: (name: string, price: number, features: string[]) => void
}

export const PlanFormModal: React.FC<PlanFormModalProps> = ({ isOpen, onClose, plan, onSave }) => {
  const [name, setName] = React.useState(plan ? plan.name : "")
  const [price, setPrice] = React.useState(plan ? plan.price.toString() : "")
  const [selectedFeatures, setSelectedFeatures] = React.useState<string[]>(plan ? plan.features : [])

  const handleToggleFeature = (featureId: string) => {
    setSelectedFeatures(prev => 
      prev.includes(featureId) 
        ? prev.filter(id => id !== featureId) 
        : [...prev, featureId]
    )
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    const planPrice = parseFloat(price) || 0
    onSave(name, planPrice, selectedFeatures)
    onClose()
  }

  return (
    <Form onSubmit={handleSave}>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={plan ? "Editar Plano" : "Criar Novo Plano"}
        subtitle="Preencha os dados e escolha os recursos liberados para esta assinatura."
        icon={CreditCard}
        successText={plan ? "Salvar Alterações" : "Salvar Plano"}
        isSubmit={true}
      >
        <Stack gap={5}>
          <Input 
            label="Nome do Plano" 
            placeholder="Ex: Plano Intermediário" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
          />
          <Input 
            type="number" 
            label="Preço Mensal (R$)" 
            placeholder="Ex: 99.90" 
            value={price} 
            onChange={(e) => setPrice(e.target.value)} 
            required 
          />

          <Stack gap={2.5}>
            <Font variant="body-sm-semibold" text="Módulos Inclusos" />
            <Box padding={2.5} bg="bg-background" radius="default">
              <Stack gap={2.5}>
                {APP_FEATURES.map(feat => {
                  const isChecked = selectedFeatures.includes(feat.id)
                  return (
                    <Box key={feat.id} padding={2.5} bg="bg-surface" radius="default">
                      <Stack direction="row" align="center" justify="between" gap={2.5}>
                        <Stack gap={1}>
                          <Font variant="body-sm-semibold" text={feat.name} />
                          <Font variant="sub-tiny" text={feat.description} />
                        </Stack>
                        <Switch 
                          checked={isChecked} 
                          onChange={() => handleToggleFeature(feat.id)} 
                        />
                      </Stack>
                    </Box>
                  )
                })}
              </Stack>
            </Box>
          </Stack>
        </Stack>
      </Modal>
    </Form>
  )
}
