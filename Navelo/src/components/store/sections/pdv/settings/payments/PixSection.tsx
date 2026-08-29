"use client"

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Form } from "@/components/store/base/Form"
import { Input } from "@/components/store/base/Input"
import { Button } from "@/components/store/base/Button"
import { Switch } from "@/components/store/base/Switch"
import { Warning } from "@/components/store/base/Warning"
import { CustomSelect, CustomSelectItem } from "@/components/store/base/CustomSelect"
import { CircularIcon } from "@/components/store/intermediary/CircularIcon"
import { DiscardChangesModal } from "@/components/store/advanced/DiscardChangesModal"
import {
  PixSettings,
  PixKeyType,
  loadPixSettings,
  savePixSettings,
  PIX_SETTINGS_EVENT,
} from "@/lib/sync/pixSettings"
import { maskCpfCnpj, maskPhone } from "@/lib/masks"
import { db } from "@/lib/dal/db"
import { useLiveQuery } from "dexie-react-hooks"
import { ShoppingBasket, Store, Info, Key, Check } from "lucide-react"
import { UI_STRINGS } from "@/constants/strings"

export interface PixSectionProps {
  onCancel: () => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
  setCustomActions?: (actions: React.ReactNode | null) => void
}

function isSettingsDirty(current: PixSettings, initial: PixSettings): boolean {
  return JSON.stringify(current) !== JSON.stringify(initial)
}

function getPlaceholderForType(type: PixKeyType): string {
  switch (type) {
    case "CPF/CNPJ":
      return "000.000.000-00 ou 00.000.000/0000-00"
    case "Telefone":
      return "(00) 00000-0000"
    case "E-mail":
      return "exemplo@empresa.com.br"
    case "Chave Aleatória":
      return "00000000-0000-0000-0000-000000000000"
    default:
      return "Informe sua chave Pix"
  }
}

export const PixSection: React.FC<PixSectionProps> = ({
  onCancel,
  setCustomBack,
  setCustomTitle,
  setCustomActions,
}) => {
  const company = useLiveQuery(() => db.companies.toCollection().first())
  const [initialSettings, setInitialSettings] = React.useState<PixSettings>(loadPixSettings)
  const [draft, setDraft] = React.useState<PixSettings>(initialSettings)
  const [isDiscardModalOpen, setIsDiscardModalOpen] = React.useState(false)
  const [prevCompany, setPrevCompany] = React.useState<any>(null)

  // Pré-preenchimento inteligente caso o usuário ainda não tenha configurado
  if (company && company !== prevCompany) {
    setPrevCompany(company)
    const isClean = !draft.pixKey && !draft.beneficiaryName && !draft.beneficiaryCity
    if (isClean) {
      const prefilled: PixSettings = {
        ...draft,
        pixKey: company.document ? maskCpfCnpj(company.document) : "",
        beneficiaryName: (company.trade_name || company.name || "").slice(0, 25),
        beneficiaryCity: (company.address_city || "").slice(0, 15),
      }
      setInitialSettings(prefilled)
      setDraft(prefilled)
    }
  }

  const isDirty = React.useMemo(() => isSettingsDirty(draft, initialSettings), [draft, initialSettings])

  // Sincronização reativa de eventos
  React.useEffect(() => {
    const handleSync = () => {
      const fresh = loadPixSettings()
      setInitialSettings(fresh)
      setDraft((prev) => (isSettingsDirty(prev, initialSettings) ? prev : fresh))
    }
    window.addEventListener(PIX_SETTINGS_EVENT, handleSync)
    return () => {
      window.removeEventListener(PIX_SETTINGS_EVENT, handleSync)
    }
  }, [initialSettings])

  const handleBack = React.useCallback(() => {
    if (isDirty) {
      setIsDiscardModalOpen(true)
    } else {
      onCancel()
    }
  }, [isDirty, onCancel])

  const handleSave = React.useCallback(() => {
    savePixSettings(draft)
    setInitialSettings(draft)
    onCancel()
  }, [draft, onCancel])

  const handleBackRef = React.useRef(handleBack)
  const handleSaveRef = React.useRef(handleSave)

  React.useEffect(() => {
    handleBackRef.current = handleBack
    handleSaveRef.current = handleSave
  }, [handleBack, handleSave])

  // Injetar Botão Voltar e Botão Salvar (com variante primary-pill-icon no cabeçalho)
  React.useEffect(() => {
    setCustomBack?.(() => () => handleBackRef.current())
    setCustomTitle?.("Pix")
    setCustomActions?.(
      <Button
        variant="primary-pill-icon"
        icon={Check}
        onClick={() => handleSaveRef.current()}
      />
    )
    return () => {
      setCustomBack?.(null)
      setCustomTitle?.(null)
      setCustomActions?.(null)
    }
  }, [setCustomBack, setCustomTitle, setCustomActions])

  const handleKeyTypeChange = (newType: PixKeyType) => {
    setDraft((prev) => ({
      ...prev,
      keyType: newType,
    }))
  }

  const handlePixKeyChange = (val: string) => {
    let formatted = val
    if (draft.keyType === "CPF/CNPJ") {
      formatted = maskCpfCnpj(val)
    } else if (draft.keyType === "Telefone") {
      formatted = maskPhone(val)
    } else if (draft.keyType === "Chave Aleatória") {
      formatted = val.slice(0, 36)
    }
    setDraft((prev) => ({ ...prev, pixKey: formatted }))
  }

  return (
    <>
      <Box flex="1" minH="0" h="full" overflowY="auto" w="full">
        <Stack gap={5} w="full">
          {/* Card 1: QR Code Pix (Canais) */}
          <Box bg="bg-white" border borderColor="border-border" radius="default" padding={5} w="full">
            <Stack gap={5} w="full">
              <Stack gap={1} w="full">
                <Font variant="body-bold" text="QR Code Pix" align="left" />
                <Font
                  variant="description"
                  text="Quando habilitado, o sistema apresentará o QR Code da chave Pix na finalização da compra."
                  align="left"
                  color="muted"
                />
              </Stack>

              <Stack gap={2.5} w="full">
                {/* Item Caixa */}
                <Stack direction="row" align="center" justify="between" w="full" gap={5}>
                  <Stack direction="row" align="center" gap={2.5}>
                    <CircularIcon icon={ShoppingBasket} variant="secondary" size={20} />
                    <Font variant="body-sm-medium" text="Caixa" align="left" />
                  </Stack>
                  <Switch
                    checked={draft.caixaEnabled}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setDraft((prev) => ({ ...prev, caixaEnabled: e.target.checked }))
                    }
                  />
                </Stack>

                {/* Item Catálogo Online */}
                <Stack direction="row" align="center" justify="between" w="full" gap={5}>
                  <Stack direction="row" align="center" gap={2.5}>
                    <CircularIcon icon={Store} variant="secondary" size={20} />
                    <Font variant="body-sm-medium" text="Catálogo Online" align="left" />
                  </Stack>
                  <Switch
                    checked={draft.catalogoEnabled}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setDraft((prev) => ({ ...prev, catalogoEnabled: e.target.checked }))
                    }
                  />
                </Stack>
              </Stack>
            </Stack>
          </Box>

          {/* Card 2: Dados da Chave e Beneficiário */}
          <Box bg="bg-white" border borderColor="border-border" radius="default" padding={5} w="full">
            <Stack gap={5} w="full">
              {/* Banner Informativo Oficial do Design System */}
              <Warning
                variant="info"
                icon={Info}
                title="Atenção"
                text="A confirmação de pagamento deve ser feita por ferramenta própria da sua instituição financeira."
              />

              {/* Formulário com Gap Padronizado 2.5 */}
              <Form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSave()
                }}
              >
                <Stack gap={2.5} w="full">
                  {/* Tipo de Chave */}
                  <Stack gap={1} w="full">
                    <Font variant="body-sm-medium" text="Tipo de chave" align="left" />
                    <CustomSelect
                      value={draft.keyType}
                      onChange={(val) => handleKeyTypeChange(val as PixKeyType)}
                    >
                      <CustomSelectItem value="CPF/CNPJ" text="CPF/CNPJ" icon={Key} />
                      <CustomSelectItem value="Telefone" text="Telefone" icon={Key} />
                      <CustomSelectItem value="E-mail" text="E-mail" icon={Key} />
                      <CustomSelectItem value="Chave Aleatória" text="Chave Aleatória" icon={Key} />
                    </CustomSelect>
                  </Stack>

                  {/* Chave Pix Dinâmica */}
                  <Input
                    variant="outlined-label"
                    label="* Chave pix"
                    placeholder={getPlaceholderForType(draft.keyType)}
                    value={draft.pixKey}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handlePixKeyChange(e.target.value)
                    }
                  />

                  {/* Nome do Beneficiário com Contador Interno Centralizado */}
                  <Box position="relative" w="full" display="flex" align="center">
                    <Input
                      variant="outlined-label"
                      label="* Nome do beneficiário"
                      placeholder="Nome do titular da conta"
                      maxLength={25}
                      value={draft.beneficiaryName}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setDraft((prev) => ({
                          ...prev,
                          beneficiaryName: e.target.value.slice(0, 25),
                        }))
                      }
                    />
                    <Box
                      position="absolute"
                      right="16px"
                      pointerEvents="none"
                      zIndex="20"
                      display="flex"
                      align="center"
                    >
                      <Font
                        variant="description"
                        text={`${draft.beneficiaryName.length}/25`}
                        color="muted"
                      />
                    </Box>
                  </Box>

                  {/* Cidade do Beneficiário com Contador Interno Centralizado */}
                  <Box position="relative" w="full" display="flex" align="center">
                    <Input
                      variant="outlined-label"
                      label="* Cidade do beneficiário"
                      placeholder="Cidade da conta bancária"
                      maxLength={15}
                      value={draft.beneficiaryCity}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setDraft((prev) => ({
                          ...prev,
                          beneficiaryCity: e.target.value.slice(0, 15),
                        }))
                      }
                    />
                    <Box
                      position="absolute"
                      right="16px"
                      pointerEvents="none"
                      zIndex="20"
                      display="flex"
                      align="center"
                    >
                      <Font
                        variant="description"
                        text={`${draft.beneficiaryCity.length}/15`}
                        color="muted"
                      />
                    </Box>
                  </Box>

                  {/* Informação Adicional */}
                  <Input
                    variant="outlined-label"
                    label="Informação adicional"
                    placeholder="Informação adicional (opcional)"
                    value={draft.additionalInfo}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setDraft((prev) => ({ ...prev, additionalInfo: e.target.value }))
                    }
                  />
                </Stack>
              </Form>
            </Stack>
          </Box>
        </Stack>
      </Box>

      {/* Modal de Descarte de Alterações */}
      <DiscardChangesModal
        isOpen={isDiscardModalOpen}
        onClose={() => setIsDiscardModalOpen(false)}
        onConfirmDiscard={() => {
          setIsDiscardModalOpen(false)
          onCancel()
        }}
      />
    </>
  )
}
