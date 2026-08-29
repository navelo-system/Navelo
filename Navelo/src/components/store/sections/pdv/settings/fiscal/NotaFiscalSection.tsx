"use client"

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Grid } from "@/components/store/base/Grid"
import { Font } from "@/components/store/base/Font"
import { Input } from "@/components/store/base/Input"
import { Button } from "@/components/store/base/Button"
import { Switch } from "@/components/store/base/Switch"
import { Checkbox } from "@/components/store/base/Checkbox"
import { CustomSelect, CustomSelectItem } from "@/components/store/base/CustomSelect"
import { Modal } from "@/components/store/base/Modal"
import { Form } from "@/components/store/advanced/Form"
import { DiscardChangesModal } from "@/components/store/advanced/DiscardChangesModal"
import { EmptyState } from "@/components/store/intermediary/EmptyState"
import { UI_STRINGS } from "@/constants/strings"
import {
  DeviceFiscalSettings,
  PosInstituicao,
  loadDeviceFiscalSettings,
  saveDeviceFiscalSettings,
} from "@/lib/sync/deviceFiscalSettings"
import {
  Plus,
  Trash2,
  Check,
  CreditCard,
  QrCode as QrCodeIcon,
  FileSpreadsheet,
  FileText,
} from "lucide-react"

export interface NotaFiscalSectionProps {
  onCancel: () => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
  setCustomActions?: (actions: React.ReactNode | null) => void
}

function isValidCpf(cpf: string): boolean {
  const digits = cpf.replace(/\D/g, "")
  if (digits.length !== 11) return false
  if (/^(\d)\1+$/.test(digits)) return false

  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += Number(digits.charAt(i)) * (10 - i)
  }
  let rev = 11 - (sum % 11)
  if (rev === 10 || rev === 11) rev = 0
  if (rev !== Number(digits.charAt(9))) return false

  sum = 0
  for (let i = 0; i < 10; i++) {
    sum += Number(digits.charAt(i)) * (11 - i)
  }
  rev = 11 - (sum % 11)
  if (rev === 10 || rev === 11) rev = 0
  return rev === Number(digits.charAt(10))
}

function isValidCnpj(cnpj: string): boolean {
  const digits = cnpj.replace(/\D/g, "")
  if (digits.length !== 14) return false
  if (/^(\d)\1+$/.test(digits)) return false

  let size = digits.length - 2
  let numbers = digits.substring(0, size)
  const sumDigits = digits.substring(size)
  let sum = 0
  let pos = size - 7

  for (let i = size; i >= 1; i--) {
    sum += Number(numbers.charAt(size - i)) * pos--
    if (pos < 2) pos = 9
  }

  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11)
  if (result !== Number(sumDigits.charAt(0))) return false

  size = size + 1
  numbers = digits.substring(0, size)
  sum = 0
  pos = size - 7

  for (let i = size; i >= 1; i--) {
    sum += Number(numbers.charAt(size - i)) * pos--
    if (pos < 2) pos = 9
  }

  result = sum % 11 < 2 ? 0 : 11 - (sum % 11)
  return result === Number(sumDigits.charAt(1))
}

function isValidCpfOrCnpj(doc: string): boolean {
  const digits = doc.replace(/\D/g, "")
  if (digits.length === 11) return isValidCpf(digits)
  if (digits.length === 14) return isValidCnpj(digits)
  return false
}

function CheckboxOption({
  checked,
  onChange,
  label,
  disabled = false,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label: string
  disabled?: boolean
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

function isSettingsDirty(current: DeviceFiscalSettings, initial: DeviceFiscalSettings): boolean {
  return JSON.stringify(current) !== JSON.stringify(initial)
}

export const NotaFiscalSection: React.FC<NotaFiscalSectionProps> = ({
  onCancel,
  setCustomBack,
  setCustomTitle,
  setCustomActions,
}) => {
  const [initialSettings, setInitialSettings] = React.useState<DeviceFiscalSettings>(loadDeviceFiscalSettings)
  const [draft, setDraft] = React.useState<DeviceFiscalSettings>(initialSettings)
  const [isDiscardModalOpen, setIsDiscardModalOpen] = React.useState(false)

  // Modal dialog states: CPF/CNPJ
  const [isCpfModalOpen, setIsCpfModalOpen] = React.useState(false)
  const [newCpfValue, setNewCpfValue] = React.useState("")
  const [cpfError, setCpfError] = React.useState<string | undefined>()

  // Modal dialog states: Instituição
  const [isInstModalOpen, setIsInstModalOpen] = React.useState(false)
  const [newInstName, setNewInstName] = React.useState("")
  const [newInstCnpj, setNewInstCnpj] = React.useState("")
  const [newInstDefault, setNewInstDefault] = React.useState(false)
  const [instNameError, setInstNameError] = React.useState<string | undefined>()
  const [instCnpjError, setInstCnpjError] = React.useState<string | undefined>()

  const certInputRef = React.useRef<HTMLInputElement>(null)

  const isDirty = React.useMemo(() => isSettingsDirty(draft, initialSettings), [draft, initialSettings])

  const setField = <K extends keyof DeviceFiscalSettings>(key: K, value: DeviceFiscalSettings[K]) => {
    setDraft((prev) => ({ ...prev, [key]: value }))
  }

  const handleBack = React.useCallback(() => {
    if (isDirty) {
      setIsDiscardModalOpen(true)
    } else {
      onCancel()
    }
  }, [isDirty, onCancel])

  const handleSave = React.useCallback(() => {
    saveDeviceFiscalSettings(draft)
    setInitialSettings(draft)
    onCancel()
  }, [draft, onCancel])

  React.useEffect(() => {
    setCustomTitle?.("Nota fiscal")
    setCustomBack?.(() => handleBack)
    setCustomActions?.(
      <Button
        variant="primary-pill-icon"
        icon={Check}
        onClick={handleSave}
      />
    )
    return () => {
      setCustomBack?.(null)
      setCustomTitle?.(null)
      setCustomActions?.(null)
    }
  }, [setCustomBack, setCustomTitle, setCustomActions, handleBack, handleSave])

  const handleCertChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => {
      setDraft((prev) => ({
        ...prev,
        certificadoNome: file.name,
        certificadoBase64: reader.result as string,
      }))
    }
    reader.readAsDataURL(file)
  }

  const handleConfirmAddCpf = () => {
    const trimmed = newCpfValue.trim()
    if (!trimmed) {
      setCpfError("Informe o CPF ou CNPJ.")
      return
    }
    if (!isValidCpfOrCnpj(trimmed)) {
      setCpfError("Documento inválido. Verifique os números digitados.")
      return
    }
    setCpfError(undefined)
    setDraft((prev) => ({
      ...prev,
      authorizedCpfCnpj: [...prev.authorizedCpfCnpj, trimmed],
    }))
    setNewCpfValue("")
    setIsCpfModalOpen(false)
  }

  const handleRemoveDoc = (index: number) => {
    setDraft((prev) => ({
      ...prev,
      authorizedCpfCnpj: prev.authorizedCpfCnpj.filter((_, i) => i !== index),
    }))
  }

  const handleConfirmAddInst = () => {
    let hasError = false
    const trimmedName = newInstName.trim()
    const trimmedCnpj = newInstCnpj.trim()

    if (!trimmedName) {
      setInstNameError("Informe o nome da instituição.")
      hasError = true
    } else {
      setInstNameError(undefined)
    }

    if (!trimmedCnpj) {
      setInstCnpjError("Informe o CNPJ da instituição.")
      hasError = true
    } else if (!isValidCnpj(trimmedCnpj)) {
      setInstCnpjError("CNPJ inválido. Verifique os dígitos.")
      hasError = true
    } else {
      setInstCnpjError(undefined)
    }

    if (hasError) return

    const newInst: PosInstituicao = {
      name: trimmedName,
      cnpj: trimmedCnpj,
      isDefault: newInstDefault,
    }

    setDraft((prev) => {
      const list = newInstDefault
        ? prev.posInstituicoes.map((it) => ({ ...it, isDefault: false }))
        : [...prev.posInstituicoes]
      return {
        ...prev,
        posInstituicoes: [...list, newInst],
      }
    })

    setNewInstName("")
    setNewInstCnpj("")
    setNewInstDefault(false)
    setInstNameError(undefined)
    setInstCnpjError(undefined)
    setIsInstModalOpen(false)
  }

  const handleRemoveInst = (index: number) => {
    setDraft((prev) => ({
      ...prev,
      posInstituicoes: prev.posInstituicoes.filter((_, i) => i !== index),
    }))
  }

  const isEmissionDisabled = !draft.emitirNotas
  const isPosFieldsDisabled = isEmissionDisabled || !draft.posEnabled

  return (
    <>
      <Box bg="bg-white" border borderColor="border-border" radius="default" padding={5} w="full">
        <Stack gap={12} w="full">
          {/* 1. Switch Topo: Habilitar emissão de notas */}
          <Stack direction="row" align="center" gap={2.5} w="full">
            <Switch
              checked={draft.emitirNotas}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setField("emitirNotas", e.target.checked)
              }
            />
            <Font variant="body-medium" text={UI_STRINGS.fiscal.enableEmissionToggle} align="left" />
          </Stack>

          {/* 2. Formulário Fiscal Coeso */}
          <Form onSubmit={(e) => { e.preventDefault(); handleSave() }}>
            <Stack gap={2.5} w="full">
              {/* Certificado digital (.pfx) */}
              <Box position="relative" w="full">
                <Box
                  as="input"
                  type="file"
                  ref={certInputRef as any}
                  accept=".pfx,.p12"
                  disabled={isEmissionDisabled}
                  display="hidden"
                  onChange={handleCertChange}
                />
                <Box
                  cursor={isEmissionDisabled ? undefined : "pointer"}
                  onClick={() => {
                    if (!isEmissionDisabled) certInputRef.current?.click()
                  }}
                  w="full"
                >
                  <Input
                    variant="outlined-label"
                    label={UI_STRINGS.fiscal.digitalCertTitle}
                    placeholder={UI_STRINGS.common.notSelected}
                    value={draft.certificadoNome || UI_STRINGS.common.notSelected}
                    readOnly
                    disabled={isEmissionDisabled}
                  />
                </Box>
              </Box>

              {/* QR Code */}
              <Stack gap={1} w="full">
                <Font
                  variant="sub-tiny-bold"
                  color={isEmissionDisabled ? "muted" : "foreground"}
                  text={"QR Code"}
                />
                <CustomSelect
                  value={draft.qrCode}
                  disabled={isEmissionDisabled}
                  onChange={(v) => setField("qrCode", v)}
                >
                  {/* eslint-disable-next-line no-restricted-syntax */}
                  <CustomSelectItem value="Versão 2.0" text="Versão 2.0" icon={QrCodeIcon} />
                  {/* eslint-disable-next-line no-restricted-syntax */}
                  <CustomSelectItem value="Versão 3.0" text="Versão 3.0" icon={QrCodeIcon} />
                </CustomSelect>
              </Stack>

              {/* Série / Número NFC-e */}
              <Grid cols={2} gap={2.5}>
                <Input
                  variant="outlined-label"
                  label={UI_STRINGS.fiscal.serieLabel}
                  placeholder="0"
                  value={draft.serieNfce}
                  disabled={isEmissionDisabled}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setField("serieNfce", e.target.value)
                  }
                  type="number"
                />
                <Input
                  variant="outlined-label"
                  label={UI_STRINGS.fiscal.nextNumberLabel}
                  placeholder="0"
                  value={draft.ultimoNfce}
                  disabled={isEmissionDisabled}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setField("ultimoNfce", e.target.value)
                  }
                  type="number"
                />
              </Grid>

              {/* Série / Número NF-e */}
              <Grid cols={2} gap={2.5}>
                <Input
                  variant="outlined-label"
                  label={UI_STRINGS.fiscal.nfeSerieLabel}
                  placeholder="0"
                  value={draft.serieNfe}
                  disabled={isEmissionDisabled}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setField("serieNfe", e.target.value)
                  }
                  type="number"
                />
                <Input
                  variant="outlined-label"
                  label={UI_STRINGS.fiscal.nfeNextNumberLabel}
                  placeholder="0"
                  value={draft.ultimoNfe}
                  disabled={isEmissionDisabled}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setField("ultimoNfe", e.target.value)
                  }
                  type="number"
                />
              </Grid>

              {/* Regime Tributário */}
              <Stack gap={1} w="full">
                <Font
                  variant="sub-tiny-bold"
                  color={isEmissionDisabled ? "muted" : "foreground"}
                  text={UI_STRINGS.fiscal.taxRegimeLabel}
                />
                <CustomSelect
                  value={draft.regimeTributario}
                  disabled={isEmissionDisabled}
                  onChange={(v) => setField("regimeTributario", v)}
                >
                  <CustomSelectItem value="Simples Nacional" text={UI_STRINGS.fiscal.simplesNacionalOption} icon={FileSpreadsheet} />
                  <CustomSelectItem value="MEI" text={UI_STRINGS.fiscal.simplesNacionalOption} icon={FileSpreadsheet} />
                </CustomSelect>
              </Stack>

              {/* Checkboxes de opções gerais */}
              <Stack gap={2.5} w="full">
                <CheckboxOption
                  checked={draft.homologacao}
                  disabled={isEmissionDisabled}
                  onChange={(v) => setField("homologacao", v)}
                  label={UI_STRINGS.fiscal.homologationOption}
                />
                <CheckboxOption
                  checked={draft.imprimirComprovanteNaoFiscal}
                  disabled={isEmissionDisabled}
                  onChange={(v) => setField("imprimirComprovanteNaoFiscal", v)}
                  label={UI_STRINGS.fiscal.printNonFiscalAfterDanfe}
                />
                <CheckboxOption
                  checked={draft.emitirNfeAutomaticoCnpj}
                  disabled={isEmissionDisabled}
                  onChange={(v) => setField("emitirNfeAutomaticoCnpj", v)}
                  label={UI_STRINGS.fiscal.autoIssueToggle}
                />
              </Stack>

              {/* Motivo de cancelamento */}
              <Box w="full">
                <Input
                  variant="outlined-label"
                  label={UI_STRINGS.fiscal.cancelReasonLabel}
                  placeholder={UI_STRINGS.fiscal.defaultCancelReason}
                  value={draft.motivoCancelamento}
                  disabled={isEmissionDisabled}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setField("motivoCancelamento", e.target.value)
                  }
                />
              </Box>

              {/* Informações adicionais */}
              <Box w="full">
                <Input
                  variant="outlined-label"
                  label={UI_STRINGS.fiscal.additionalInfoLabel}
                  placeholder={UI_STRINGS.fiscal.additionalInfoLabel}
                  value={draft.informacoesAdicionais}
                  disabled={isEmissionDisabled}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setField("informacoesAdicionais", e.target.value)
                  }
                />
              </Box>
            </Stack>
          </Form>

          {/* 3. Seção CPF/CNPJ autorizado a obter o XML (Sempre Exposta) */}
          <Stack gap={5} w="full">
            <Font
              variant="h4"
              color={isEmissionDisabled ? "muted" : "foreground"}
              text={UI_STRINGS.fiscal.cpfCnpjAuthorizedTitle}
              align="left"
            />

            <Stack gap={5} w="full">
              {draft.authorizedCpfCnpj.length === 0 ? (
                <EmptyState
                  icon={FileText}
                  title={UI_STRINGS.fiscal.noAuthorizedDocTitle}
                  subtitle={UI_STRINGS.fiscal.noAuthorizedDocSubtitle}
                />
              ) : (
                <Stack gap={2.5} w="full">
                  {draft.authorizedCpfCnpj.map((doc, idx) => (
                    <Box
                      key={`${doc}-${idx}`}
                      padding={2.5}
                      bg="surface-sunken"
                      radius="default"
                      w="full"
                    >
                      <Stack direction="row" align="center" justify="between" w="full">
                        <Font variant="body-sm-medium" text={doc} />
                        <Button
                          variant="ghost"
                          icon={Trash2}
                          disabled={isEmissionDisabled}
                          onClick={() => handleRemoveDoc(idx)}
                        />
                      </Stack>
                    </Box>
                  ))}
                </Stack>
              )}

              <Box display="flex">
                <Button
                  variant="secondary"
                  label={UI_STRINGS.fiscal.cpfCnpjAuthorizedTitle}
                  icon={Plus}
                  disabled={isEmissionDisabled}
                  onClick={() => {
                    setNewCpfValue("")
                    setCpfError(undefined)
                    setIsCpfModalOpen(true)
                  }}
                />
              </Box>
            </Stack>
          </Stack>

          {/* 4. Seção Informações POS (Sempre Exposta) */}
          <Stack gap={5} w="full">
            <Font
              variant="h4"
              color={isEmissionDisabled ? "muted" : "foreground"}
              text={UI_STRINGS.fiscal.posInfoTitle}
              align="left"
            />

            <Font
              variant="description"
              text={UI_STRINGS.fiscal.posInfoDesc}
              align="left"
            />

            <Stack direction="row" align="center" gap={2.5} w="full">
              <Switch
                checked={draft.posEnabled}
                disabled={isEmissionDisabled}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setField("posEnabled", e.target.checked)
                }
              />
              <Font
                variant="body-sm-medium"
                color={isEmissionDisabled ? "muted" : "foreground"}
                text={UI_STRINGS.fiscal.enablePosToggle}
                align="left"
              />
            </Stack>

            <Stack gap={5} w="full">
              <Stack gap={2.5} w="full">
                <Font
                  variant="body-bold"
                  color={isPosFieldsDisabled ? "muted" : "foreground"}
                  text={UI_STRINGS.fiscal.requiredFieldsTitle}
                  align="left"
                />
                <CheckboxOption
                  checked={draft.posObrigatorioInstituicao}
                  disabled={isPosFieldsDisabled}
                  onChange={(v) => setField("posObrigatorioInstituicao", v)}
                  label={UI_STRINGS.fiscal.posInstitutionLabel}
                />
                <CheckboxOption
                  checked={draft.posObrigatorioBandeira}
                  disabled={isPosFieldsDisabled}
                  onChange={(v) => setField("posObrigatorioBandeira", v)}
                  label={UI_STRINGS.fiscal.posCardBrandLabel}
                />
                <CheckboxOption
                  checked={draft.posObrigatorioAutorizacao}
                  disabled={isPosFieldsDisabled}
                  onChange={(v) => setField("posObrigatorioAutorizacao", v)}
                  label={UI_STRINGS.fiscal.posAuthNumberLabel}
                />
              </Stack>

              <Stack gap={2.5} w="full">
                <Font
                  variant="body-bold"
                  color={isPosFieldsDisabled ? "muted" : "foreground"}
                  text={UI_STRINGS.fiscal.financialInstitutionsTitle}
                  align="left"
                />
                {draft.posInstituicoes.length === 0 ? (
                  <EmptyState
                    icon={CreditCard}
                    title={UI_STRINGS.fiscal.noInstitutionsTitle}
                    subtitle={UI_STRINGS.fiscal.noInstitutionsSubtitle}
                  />
                ) : (
                  <Stack gap={2.5} w="full">
                    {draft.posInstituicoes.map((inst, idx) => (
                      <Box
                        key={`${inst.name}-${inst.cnpj}-${idx}`}
                        padding={2.5}
                        bg="surface-sunken"
                        radius="default"
                        w="full"
                      >
                        <Stack direction="row" align="center" justify="between" w="full">
                          <Stack gap={1} align="start">
                            <Font variant="body-sm-medium" text={inst.name} />
                            <Font variant="description" text={`CNPJ: ${inst.cnpj}${inst.isDefault ? " (Padrão)" : ""}`} />
                          </Stack>
                          <Button
                            variant="ghost"
                            icon={Trash2}
                            disabled={isPosFieldsDisabled}
                            onClick={() => handleRemoveInst(idx)}
                          />
                        </Stack>
                      </Box>
                    ))}
                  </Stack>
                )}

                <Box display="flex">
                  <Button
                    variant="secondary"
                    label={UI_STRINGS.fiscal.addInstitutionButton}
                    icon={Plus}
                    disabled={isPosFieldsDisabled}
                    onClick={() => {
                      setNewInstName("")
                      setNewInstCnpj("")
                      setNewInstDefault(false)
                      setInstNameError(undefined)
                      setInstCnpjError(undefined)
                      setIsInstModalOpen(true)
                    }}
                  />
                </Box>
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </Box>

      {/* Modal: CPF/CNPJ Autorizado */}
      <Modal
        isOpen={isCpfModalOpen}
        onClose={() => {
          setIsCpfModalOpen(false)
          setCpfError(undefined)
        }}
        title={UI_STRINGS.fiscal.cpfCnpjAuthorizedTitle}
        cancelText="Cancelar"
        successText="Confirmar"
        showCancelButton
        onSuccess={handleConfirmAddCpf}
      >
        <Input
          variant="outlined-label"
          mask="cpf-cnpj"
          label={UI_STRINGS.fiscal.documentLabel}
          /* eslint-disable-next-line no-restricted-syntax */
          placeholder="000.000.000-00 ou 00.000.000/0000-00"
          value={newCpfValue}
          error={cpfError}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setNewCpfValue(e.target.value)
            if (cpfError) setCpfError(undefined)
          }}
        />
      </Modal>

      {/* Modal: Instituição Financeira */}
      <Modal
        isOpen={isInstModalOpen}
        onClose={() => {
          setIsInstModalOpen(false)
          setInstNameError(undefined)
          setInstCnpjError(undefined)
        }}
        title={UI_STRINGS.fiscal.posInstitutionLabel}
        cancelText="Cancelar"
        successText="Confirmar"
        showCancelButton
        onSuccess={handleConfirmAddInst}
      >
        <Stack gap={2.5} w="full">
          <Input
            variant="outlined-label"
            label={UI_STRINGS.settings.usuarios.nameLabel}
            placeholder={UI_STRINGS.fiscal.institutionPlaceholder}
            value={newInstName}
            error={instNameError}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setNewInstName(e.target.value)
              if (instNameError) setInstNameError(undefined)
            }}
          />
          <Input
            variant="outlined-label"
            mask="cnpj"
            label={UI_STRINGS.fiscal.documentLabel}
            placeholder={"00.000.000/0000-00"}
            value={newInstCnpj}
            error={instCnpjError}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setNewInstCnpj(e.target.value)
              if (instCnpjError) setInstCnpjError(undefined)
            }}
          />
          <CheckboxOption
            checked={newInstDefault}
            onChange={setNewInstDefault}
            /* eslint-disable-next-line no-restricted-syntax */
            label="Usar como padrão"
          />
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
