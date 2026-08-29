"use client"

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Input } from "@/components/store/base/Input"
import { Button } from "@/components/store/base/Button"
import { Switch } from "@/components/store/base/Switch"
import { Checkbox } from "@/components/store/base/Checkbox"
import { Icon } from "@/components/store/base/Icon"
import { Modal } from "@/components/store/base/Modal"
import { Warning } from "@/components/store/base/Warning"
import { CircularIcon } from "@/components/store/intermediary/CircularIcon"
import { DiscardChangesModal } from "@/components/store/advanced/DiscardChangesModal"
import {
  ContaDigitalSettings,
  loadContaDigitalSettings,
  saveContaDigitalSettings,
  CONTA_DIGITAL_SETTINGS_EVENT,
} from "@/lib/sync/contaDigitalSettings"
import { validateAsaasKey } from "@/lib/services/asaasService"
import {
  ShoppingBasket,
  Store,
  Package,
  Smartphone,
  ExternalLink,
  Clipboard,
  Check,
  KeyRound,
  LucideIcon,
} from "lucide-react"
import { UI_STRINGS } from "@/constants/strings"

export interface ContaDigitalSectionProps {
  onCancel: () => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
  setCustomActions?: (actions: React.ReactNode | null) => void
}

function isSettingsDirty(current: ContaDigitalSettings, initial: ContaDigitalSettings): boolean {
  return JSON.stringify(current) !== JSON.stringify(initial)
}

function ChannelCard({
  icon,
  title,
  subtitle,
  children,
}: {
  icon: LucideIcon
  title: string
  subtitle: string
  children: React.ReactNode
}) {
  return (
    <Box bg="bg-white" border borderColor="border-border" radius="default" padding={5} w="full">
      <Stack gap={5} w="full">
        <Stack direction="row" align="center" gap={2.5} w="full">
          <CircularIcon icon={icon} size={20} />
          <Stack gap={1}>
            <Font variant="body-bold" text={title} align="left" />
            <Font variant="description" text={subtitle} align="left" color="muted" />
          </Stack>
        </Stack>

        <Stack gap={2.5} w="full">
          {children}
        </Stack>
      </Stack>
    </Box>
  )
}

function ChannelCheckbox({
  label,
  checked,
  disabled,
  onChange,
}: {
  label: string
  checked: boolean
  disabled?: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <Stack
      direction="row"
      align="center"
      gap={2.5}
      w="full"
      cursor={disabled ? undefined : "pointer"}
      onClick={() => {
        if (!disabled) onChange(!checked)
      }}
    >
      <Checkbox
        checked={checked}
        disabled={disabled}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          if (!disabled) onChange(e.target.checked)
        }}
      />
      <Font
        variant="body-sm-medium"
        color={disabled ? "muted" : "foreground"}
        text={label}
        align="left"
      />
    </Stack>
  )
}

export const ContaDigitalSection: React.FC<ContaDigitalSectionProps> = ({
  onCancel,
  setCustomBack,
  setCustomTitle,
  setCustomActions,
}) => {
  const [initialSettings, setInitialSettings] = React.useState<ContaDigitalSettings>(loadContaDigitalSettings)
  const [draft, setDraft] = React.useState<ContaDigitalSettings>(initialSettings)
  const [isDiscardModalOpen, setIsDiscardModalOpen] = React.useState(false)

  // Modal: Ativar Conta Digital
  const [isActivationModalOpen, setIsActivationModalOpen] = React.useState(false)
  const [apiKeyDraft, setApiKeyDraft] = React.useState("")
  const [apiKeyError, setApiKeyError] = React.useState<string | undefined>()
  const [isValidating, setIsValidating] = React.useState(false)

  const isDirty = React.useMemo(() => isSettingsDirty(draft, initialSettings), [draft, initialSettings])
  const s = UI_STRINGS.digitalAccount

  // Sincronização reativa de eventos
  React.useEffect(() => {
    const handleSync = () => {
      const fresh = loadContaDigitalSettings()
      setInitialSettings(fresh)
      setDraft((prev) => (isSettingsDirty(prev, initialSettings) ? prev : fresh))
    }
    window.addEventListener(CONTA_DIGITAL_SETTINGS_EVENT, handleSync)
    return () => {
      window.removeEventListener(CONTA_DIGITAL_SETTINGS_EVENT, handleSync)
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
    saveContaDigitalSettings(draft)
    setInitialSettings(draft)
    onCancel()
  }, [draft, onCancel])

  const handleBackRef = React.useRef(handleBack)
  handleBackRef.current = handleBack
  const handleSaveRef = React.useRef(handleSave)
  handleSaveRef.current = handleSave

  React.useEffect(() => {
    setCustomBack?.(() => () => handleBackRef.current())
    setCustomTitle?.(s.title)
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
  }, [setCustomBack, setCustomTitle, setCustomActions, s.title])

  const handleToggleEnable = (enabled: boolean) => {
    if (enabled && !draft.apiKey) {
      setApiKeyDraft("")
      setApiKeyError(undefined)
      setIsActivationModalOpen(true)
    } else {
      setDraft((prev) => ({ ...prev, enabled }))
    }
  }

  const handleOpenConfigApiKey = () => {
    setApiKeyDraft(draft.apiKey || "")
    setApiKeyError(undefined)
    setIsActivationModalOpen(true)
  }

  const handleConfirmActivation = async () => {
    const trimmed = apiKeyDraft.trim()
    if (!trimmed) {
      setApiKeyError("Informe a Chave de API do Asaas.")
      return
    }
    setApiKeyError(undefined)
    setIsValidating(true)

    const result = await validateAsaasKey(trimmed)
    setIsValidating(false)

    if (!result.ok) {
      setApiKeyError(result.error || "Chave de API inválida ou sem permissão no Asaas.")
      return
    }

    setDraft((prev) => ({
      ...prev,
      enabled: true,
      apiKey: trimmed,
      environment: result.environment || (trimmed.startsWith("$aact_hmlg_") ? "sandbox" : "production"),
    }))
    setIsActivationModalOpen(false)
  }

  const handlePasteClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText()
      if (text) {
        setApiKeyDraft(text.trim())
        if (apiKeyError) setApiKeyError(undefined)
      }
    } catch {
      // Fallback
    }
  }

  const isChannelDisabled = !draft.enabled

  return (
    <>
      <Box flex="1" minH="0" h="full" overflowY="auto" w="full">
        <Stack gap={5} w="full">
          {/* 1. Card Topo: Habilitar e Acesso à Plataforma */}
          <Box bg="bg-white" border borderColor="border-border" radius="default" padding={5} w="full">
            <Stack gap={5} w="full">
              <Stack direction="row" align="center" justify="between" w="full" gap={2.5}>
                <Stack direction="row" align="center" gap={2.5}>
                  <Switch
                    checked={draft.enabled}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleToggleEnable(e.target.checked)
                    }
                  />
                  <Stack gap={1}>
                    <Font variant="body-bold" text={s.enableToggle} align="left" />
                    <Font variant="description" text={s.enableDesc} align="left" color="muted" />
                  </Stack>
                </Stack>

                {draft.apiKey && (
                  <Button
                    variant="ghost"
                    icon={KeyRound}
                    label="Alterar chave"
                    onClick={handleOpenConfigApiKey}
                  />
                )}
              </Stack>

              <Warning
                variant="info"
                icon={ExternalLink}
                title={
                  draft.enabled && draft.environment === "sandbox"
                    ? "Painel do Asaas (Sandbox)"
                    : "Painel do Asaas"
                }
                text="Acesse o painel web para consultar extratos, transferências e chaves de API."
                textButton="Acessar"
                onClick={() => {
                  window.open(
                    draft.environment === "sandbox"
                      ? "https://sandbox.asaas.com"
                      : "https://www.asaas.com",
                    "_blank"
                  )
                }}
              />
            </Stack>
          </Box>

          {/* 2. Card Caixa */}
          <ChannelCard
            icon={ShoppingBasket}
            title={s.cashierCardTitle}
            subtitle={s.cashierCardDesc}
          >
            <ChannelCheckbox
              label={s.pixLabel}
              checked={draft.caixaPix}
              disabled={isChannelDisabled}
              onChange={(v) => setDraft((prev) => ({ ...prev, caixaPix: v }))}
            />
          </ChannelCard>

          {/* 3. Card Catálogo Online */}
          <ChannelCard
            icon={Store}
            title={s.catalogCardTitle}
            subtitle={s.catalogCardDesc}
          >
            <ChannelCheckbox
              label={s.cardLabel}
              checked={draft.catalogoCartao}
              disabled={isChannelDisabled}
              onChange={(v) => setDraft((prev) => ({ ...prev, catalogoCartao: v }))}
            />
            <ChannelCheckbox
              label={s.pixLabel}
              checked={draft.catalogoPix}
              disabled={isChannelDisabled}
              onChange={(v) => setDraft((prev) => ({ ...prev, catalogoPix: v }))}
            />
          </ChannelCard>

          {/* 4. Card Conecta Entregador */}
          <ChannelCard
            icon={Package}
            title={s.driverCardTitle}
            subtitle={s.driverCardDesc}
          >
            <ChannelCheckbox
              label={s.pixLabel}
              checked={draft.entregadorPix}
              disabled={isChannelDisabled}
              onChange={(v) => setDraft((prev) => ({ ...prev, entregadorPix: v }))}
            />
          </ChannelCard>

          {/* 5. Card Autoatendimento */}
          <ChannelCard
            icon={Smartphone}
            title={s.selfServiceCardTitle}
            subtitle={s.selfServiceCardDesc}
          >
            <ChannelCheckbox
              label={s.pixLabel}
              checked={draft.autoatendimentoPix}
              disabled={isChannelDisabled}
              onChange={(v) => setDraft((prev) => ({ ...prev, autoatendimentoPix: v }))}
            />
          </ChannelCard>
        </Stack>
      </Box>

      {/* Modal: Ativar Conta Digital */}
      <Modal
        isOpen={isActivationModalOpen}
        onClose={() => {
          if (!isValidating) {
            setIsActivationModalOpen(false)
            setApiKeyError(undefined)
          }
        }}
        title="Ativar Conta Digital (Asaas)"
        cancelText="Cancelar"
        successText={isValidating ? "Validando..." : "Concluir"}
        showCancelButton
        onSuccess={handleConfirmActivation}
      >
        <Stack gap={5} w="full">
          {/* Caixa de Benefícios e Instruções */}
          <Box bg="surface-sunken" radius="default" w="full">
            <Stack gap={2.5} w="full">
              <Font
                variant="body-sm-medium"
                text="Integre sua conta do Asaas para receber pagamentos online via Pix e Cartão no Caixa, Catálogo e Conecta Entregador."
                align="left"
              />
              <Font variant="body-sm-medium" text="Como obter sua Chave de API:" align="left" />
              <Stack gap={1} w="full">
                <Font variant="description" text="1. Acesse o painel em https://www.asaas.com" align="left" />
                <Font variant="description" text="2. Vá em Configurações da Conta > Integrações > Chaves de API." align="left" />
                <Font variant="description" text="3. Clique em 'Gerar nova chave' e copie o código gerado." align="left" />
              </Stack>
            </Stack>
          </Box>

          {/* Links e QR Code de Registro */}
          <Stack gap={2.5} align="center" w="full">
            <Font variant="body-sm-medium" text="Acesse o link abaixo para abrir o Asaas." align="center" />
            <Box
              cursor="pointer"
              onClick={() => window.open("https://www.asaas.com", "_blank")}
            >
              <Font
                variant="body-sm-semibold"
                color="primary"
                text="https://www.asaas.com"
                align="center"
              />
            </Box>

            <Font variant="description" color="muted" text="Ou escaneie o QR Code para acessar pelo celular." align="center" />

            {/* QR Code Ilustrativo / Vetorial */}
            <Box
              bg="bg-white"
              border
              borderColor="border-border"
              padding={2.5}
              radius="default"
              display="flex"
              justify="center"
              align="center"
            >
              <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* QR Code pattern */}
                <rect width="120" height="120" fill="white" />
                {/* Top-Left Finder */}
                <rect x="10" y="10" width="30" height="30" fill="black" />
                <rect x="15" y="15" width="20" height="20" fill="white" />
                <rect x="20" y="20" width="10" height="10" fill="black" />
                {/* Top-Right Finder */}
                <rect x="80" y="10" width="30" height="30" fill="black" />
                <rect x="85" y="15" width="20" height="20" fill="white" />
                <rect x="90" y="20" width="10" height="10" fill="black" />
                {/* Bottom-Left Finder */}
                <rect x="10" y="80" width="30" height="30" fill="black" />
                <rect x="15" y="85" width="20" height="20" fill="white" />
                <rect x="20" y="90" width="10" height="10" fill="black" />
                {/* Data bits */}
                <rect x="48" y="12" width="6" height="6" fill="black" />
                <rect x="60" y="12" width="6" height="6" fill="black" />
                <rect x="48" y="24" width="6" height="6" fill="black" />
                <rect x="66" y="24" width="6" height="6" fill="black" />
                <rect x="12" y="48" width="6" height="6" fill="black" />
                <rect x="24" y="48" width="6" height="6" fill="black" />
                <rect x="36" y="48" width="6" height="6" fill="black" />
                <rect x="48" y="48" width="12" height="12" fill="black" />
                <rect x="66" y="48" width="6" height="6" fill="black" />
                <rect x="78" y="48" width="6" height="6" fill="black" />
                <rect x="90" y="48" width="6" height="6" fill="black" />
                <rect x="102" y="48" width="6" height="6" fill="black" />
                <rect x="12" y="60" width="6" height="6" fill="black" />
                <rect x="30" y="60" width="6" height="6" fill="black" />
                <rect x="48" y="66" width="6" height="6" fill="black" />
                <rect x="60" y="60" width="12" height="12" fill="black" />
                <rect x="84" y="66" width="6" height="6" fill="black" />
                <rect x="96" y="60" width="12" height="6" fill="black" />
                <rect x="48" y="84" width="6" height="6" fill="black" />
                <rect x="60" y="84" width="6" height="6" fill="black" />
                <rect x="72" y="84" width="12" height="6" fill="black" />
                <rect x="90" y="84" width="6" height="6" fill="black" />
                <rect x="102" y="84" width="6" height="6" fill="black" />
                <rect x="48" y="96" width="12" height="12" fill="black" />
                <rect x="66" y="96" width="6" height="6" fill="black" />
                <rect x="78" y="96" width="6" height="6" fill="black" />
                <rect x="90" y="96" width="18" height="6" fill="black" />
                <rect x="90" y="108" width="6" height="6" fill="black" />
                <rect x="102" y="108" width="6" height="6" fill="black" />
              </svg>
            </Box>
          </Stack>

          {/* Campo de Código de Ativação / Chave com Botão Externo */}
          <Stack gap={2.5} w="full">
            <Font
              variant="description"
              text="Cole a Chave de API gerada no Asaas para concluir a ativação."
              align="left"
            />
            <Stack direction="row" align="center" gap={2.5} w="full">
              <Box flex="1">
                <Input
                  variant="outlined-label"
                  label="* Chave de API do Asaas"
                  placeholder="Ex: $aact_prod_... ou $aact_hmlg_..."
                  value={apiKeyDraft}
                  error={apiKeyError}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setApiKeyDraft(e.target.value)
                    if (apiKeyError) setApiKeyError(undefined)
                  }}
                  disabled={isValidating}
                />
              </Box>
              <Button
                variant="secondary-icon"
                icon={Clipboard}
                onClick={handlePasteClipboard}
                title="Colar"
                disabled={isValidating}
              />
            </Stack>
          </Stack>
        </Stack>
      </Modal>

      {/* Modal de Descarte */}
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
