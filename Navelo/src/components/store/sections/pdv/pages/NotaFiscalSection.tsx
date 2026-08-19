"use client"


import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Grid } from "@/components/store/base/Grid"
import { Font } from "@/components/store/base/Font"
import { Input } from "@/components/store/base/Input"
import { Button } from "@/components/store/base/Button"
import { FormActions } from "@/components/store/intermediary/FormActions"
import { Switch } from "@/components/store/base/Switch"
import { Icon } from "@/components/store/base/Icon"
import { CustomSelect, CustomSelectItem } from "@/components/store/base/CustomSelect"
import { EmptyState } from "@/components/store/intermediary/EmptyState"
import { UI_STRINGS } from "@/constants/strings"
import {
  Check,
  ChevronDown,
  ChevronUp,
  User,
  CreditCard,
  Plus,
  Trash2,
  FileSpreadsheet,
  Calendar
} from "lucide-react"

export interface NotaFiscalSectionProps {
  onCancel: () => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
  setCustomActions?: (actions: React.ReactNode | null) => void
}

const CustomCheckbox = ({ checked, onChange, label }: { checked: boolean, onChange: () => void, label: string }) => (
  <Box onClick={onChange} display="flex" w="full" cursor="pointer">
    <Stack direction="row" align="center" gap={2.5} w="full">
      <Box
        w="w-5"
        h="h-5"
        border={true}
        borderColor={checked ? "brand-primary" : "border"}
        bg={checked ? "bg-brand-primary" : "bg-transparent"}
        radius="default"
        display="flex"
        justify="center"
        shrink="0"
      >
        {checked && <Icon icon={Check} size={12} color="white" />}
      </Box>
      <Font variant="body-sm-medium" text={label} align="left" />
    </Stack>
  </Box>
)

export const NotaFiscalSection: React.FC<NotaFiscalSectionProps> = ({
  onCancel,
  setCustomBack,
  setCustomTitle,
  setCustomActions
}) => {
  const s = UI_STRINGS.fiscal

  // Main settings
  const [emitirNotas, setEmitirNotas] = React.useState(false)
  const [certificadoNome] = React.useState("")
  const [qrCode, setQrCode] = React.useState<string>(s.defaultCscOption)
  
  const [serieNfce, setSerieNfce] = React.useState("0")
  const [ultimoNfce, setUltimoNfce] = React.useState("0")
  const [serieNfe, setSerieNfe] = React.useState("0")
  const [ultimoNfe, setUltimoNfe] = React.useState("0")
  const [regimeTributario, setRegimeTributario] = React.useState<string>(s.simplesNacionalOption)
  
  const [homologacao, setHomologacao] = React.useState(false)
  const [danfeComprovante, setDanfeComprovante] = React.useState(false)
  const [emitirAutomatico, setEmitirAutomatico] = React.useState(false)
  
  const [motivoCancelamento, setMotivoCancelamento] = React.useState<string>(s.defaultCancelReason)
  const [infosAdicionais, setInfosAdicionais] = React.useState("")

  // Accordion states
  const [xmlAccordionOpen, setXmlAccordionOpen] = React.useState(false)
  const [posAccordionOpen, setPosAccordionOpen] = React.useState(false)

  // Sub-lists
  const [authorizedCpfCnpj, setAuthorizedCpfCnpj] = React.useState<string[]>([])
  const [newCpfCnpj, setNewCpfCnpj] = React.useState("")
  const [showAddCpfCnpjInput, setShowAddCpfCnpjInput] = React.useState(false)

  const [posEnabled, setPosEnabled] = React.useState(false)
  const [posInstituicao, setPosInstituicao] = React.useState(false)
  const [posBandeira, setPosBandeira] = React.useState(false)
  const [posAutorizacao, setPosAutorizacao] = React.useState(false)

  const [posInstituicoes, setPosInstituicoes] = React.useState<string[]>([])
  const [newInstituicao, setNewInstituicao] = React.useState("")
  const [showAddInstituicaoInput, setShowAddInstituicaoInput] = React.useState(false)

  const handleSave = React.useCallback(() => {
    // Apenas simulação de salvamento
    onCancel()
  }, [onCancel])

  // Setup global header
  React.useEffect(() => {
    setCustomBack?.(() => () => onCancel())
    setCustomTitle?.(s.title)
    setCustomActions?.(null)

    return () => {
      setCustomBack?.(null)
      setCustomTitle?.(null)
      setCustomActions?.(null)
    }
  }, [setCustomBack, setCustomTitle, setCustomActions, onCancel, s.title])

  const handleAddCpfCnpj = () => {
    if (newCpfCnpj.trim()) {
      setAuthorizedCpfCnpj((prev) => [...prev, newCpfCnpj.trim()])
      setNewCpfCnpj("")
      setShowAddCpfCnpjInput(false)
    }
  }

  const handleRemoveCpfCnpj = (index: number) => {
    setAuthorizedCpfCnpj((prev) => prev.filter((_, idx) => idx !== index))
  }

  const handleAddInstituicao = () => {
    if (newInstituicao.trim()) {
      setPosInstituicoes((prev) => [...prev, newInstituicao.trim()])
      setNewInstituicao("")
      setShowAddInstituicaoInput(false)
    }
  }

  const handleRemoveInstituicao = (index: number) => {
    setPosInstituicoes((prev) => prev.filter((_, idx) => idx !== index))
  }

  return (
    <Box
      bg="bg-white"
      border={true}
      borderColor="border-border"
      radius="default"
      padding={5}
      w="full"
    >
      <Stack gap={5} w="full">
        {/* Toggle Habilitar emissão */}
        <Box border={true} borderColor="border-border" padding={5} radius="default" bg="bg-surface">
          <Stack direction="col-reverse" mobileDirection="row" align="start" mobileAlign="center" justify="between" w="full" gap={5}>
            <Stack gap={1}>
              <Font variant="body-bold" text={s.enableEmissionToggle} align="left" />
              <Font variant="description" text={s.enableEmissionDesc} align="left" />
            </Stack>
            <Switch checked={emitirNotas} onChange={() => setEmitirNotas(!emitirNotas)} />
          </Stack>
        </Box>

        {emitirNotas && (
          <Stack gap={5} w="full">
            {/* Certificado digital */}
            <Input
              label={s.digitalCertTitle}
              value={certificadoNome || UI_STRINGS.common.notSelected}
              disabled
              iconRight={Calendar}
            />

            {/* QR Code */}
            <Stack gap={1} w="full">
              <Font variant="body-sm-semibold" text={s.cscTokenLabel} />
              <CustomSelect value={qrCode} onChange={setQrCode}>
                <CustomSelectItem value="CSC Padrão" text={s.defaultCscOption} icon={FileSpreadsheet} />
                <CustomSelectItem value="Outros" text={UI_STRINGS.common.all} icon={FileSpreadsheet} />
              </CustomSelect>
            </Stack>

            {/* Série/Número NFC-e */}
            <Stack gap={2.5} w="full">
              <Font variant="body-bold" text={s.nfceTitle} />
              <Grid cols={2} gap={5}>
                <Input
                  label={s.serieLabel}
                  value={serieNfce}
                  onChange={(e) => setSerieNfce(e.target.value)}
                  type="number"
                />
                <Input
                  label={s.nextNumberLabel}
                  value={ultimoNfce}
                  onChange={(e) => setUltimoNfce(e.target.value)}
                  type="number"
                />
              </Grid>
            </Stack>

            {/* Série/Número NF-e */}
            <Stack gap={2.5} w="full">
              <Font variant="body-bold" text={s.nfeTitle} />
              <Grid cols={2} gap={5}>
                <Input
                  label={s.nfeSerieLabel}
                  value={serieNfe}
                  onChange={(e) => setSerieNfe(e.target.value)}
                  type="number"
                />
                <Input
                  label={s.nfeNextNumberLabel}
                  value={ultimoNfe}
                  onChange={(e) => setUltimoNfe(e.target.value)}
                  type="number"
                />
              </Grid>
            </Stack>

            {/* Regime Tributário */}
            <Stack gap={1} w="full">
              <Font variant="body-sm-semibold" text={s.taxRegimeLabel} />
              <CustomSelect value={regimeTributario} onChange={setRegimeTributario}>
                <CustomSelectItem value="Simples Nacional" text={s.simplesNacionalOption} icon={FileSpreadsheet} />
                <CustomSelectItem value="Lucro Presumido" text={s.lucroPresumidoOption} icon={FileSpreadsheet} />
                <CustomSelectItem value="Lucro Real" text={s.lucroRealOption} icon={FileSpreadsheet} />
              </CustomSelect>
            </Stack>

            {/* Checkbox Homologação */}
            <CustomCheckbox
              checked={homologacao}
              onChange={() => setHomologacao(!homologacao)}
              label={s.homologationOption}
            />
          </Stack>
        )}

        {/* Outras opções de configuração */}
        <CustomCheckbox
          checked={danfeComprovante}
          onChange={() => setDanfeComprovante(!danfeComprovante)}
          label={s.printNonFiscalAfterDanfe}
        />

        <CustomCheckbox
          checked={emitirAutomatico}
          onChange={() => setEmitirAutomatico(!emitirAutomatico)}
          label={s.autoIssueToggle}
        />

        <Box w="full">
          <Input
            label={s.cancelReasonLabel}
            value={motivoCancelamento}
            onChange={(e) => setMotivoCancelamento(e.target.value)}
          />
        </Box>

        <Box w="full">
          <Input
            label={s.additionalInfoLabel}
            value={infosAdicionais}
            placeholder={s.additionalInfoLabel}
            onChange={(e) => setInfosAdicionais(e.target.value)}
          />
        </Box>

        {/* CPF/CNPJ autorizada a obter o XML Accordion */}
        <Box border={true} borderColor="border-border" radius="default" overflow="hidden">
          <Box
            onClick={() => setXmlAccordionOpen(!xmlAccordionOpen)}
            padding={5}
            bg="bg-surface"
            cursor="pointer"
            w="full"
          >
            <Stack direction="col" mobileDirection="row" align="center" justify="between" w="full" gap={2.5}>
              <Stack direction="col" mobileDirection="row" align="center" gap={2.5}>
                <Icon icon={User} size={18} color="muted" />
                <Font variant="body-bold" text={s.cpfCnpjAuthorizedTitle} align="center" />
              </Stack>
              <Icon icon={xmlAccordionOpen ? ChevronUp : ChevronDown} size={18} color="muted" />
            </Stack>
          </Box>
          
          {xmlAccordionOpen && (
            <Box padding={5} borderTop={true} borderColor="border-border">
              <Stack gap={2.5} w="full">
                {authorizedCpfCnpj.length === 0 ? (
                  <EmptyState
                    icon={User}
                    title={s.noAuthorizedDocTitle}
                    subtitle={s.noAuthorizedDocSubtitle}
                  />
                ) : (
                  <Stack gap={1} w="full">
                    {authorizedCpfCnpj.map((item, idx) => (
                      <Stack key={idx} direction="row" align="center" justify="between" w="full" gap={2.5}>
                        <Font variant="body" text={item} />
                        <Button
                          variant="outline"
                          label={UI_STRINGS.common.delete}
                          icon={Trash2}
                          onClick={() => handleRemoveCpfCnpj(idx)}
                        />
                      </Stack>
                    ))}
                  </Stack>
                )}

                {showAddCpfCnpjInput ? (
                  <Stack direction="col" mobileDirection="row" gap={2.5} align="stretch" mobileAlign="center" w="full">
                    <Box flex="1">
                      <Input
                        placeholder={s.documentLabel}
                        value={newCpfCnpj}
                        onChange={(e) => setNewCpfCnpj(e.target.value)}
                      />
                    </Box>
                    <Button variant="primary" label={UI_STRINGS.common.confirm} onClick={handleAddCpfCnpj} />
                    <Button variant="ghost" label={UI_STRINGS.common.cancel} onClick={() => setShowAddCpfCnpjInput(false)} />
                  </Stack>
                ) : (
                  <Box display="flex">
                    <Button
                      variant="outline"
                      label={s.addCpfCnpjAuthorizedButton}
                      icon={Plus}
                      onClick={() => setShowAddCpfCnpjInput(true)}
                    />
                  </Box>
                )}
              </Stack>
            </Box>
          )}
        </Box>

        {/* Informações POS Accordion */}
        <Box border={true} borderColor="border-border" radius="default" overflow="hidden">
          <Box
            onClick={() => setPosAccordionOpen(!posAccordionOpen)}
            padding={5}
            bg="bg-surface"
            cursor="pointer"
            w="full"
          >
            <Stack direction="col" mobileDirection="row" align="center" justify="between" w="full" gap={2.5}>
              <Stack direction="col" mobileDirection="row" align="center" gap={2.5}>
                <Icon icon={CreditCard} size={18} color="muted" />
                <Font variant="body-bold" text={s.posInfoTitle} align="center" />
              </Stack>
              <Icon icon={posAccordionOpen ? ChevronUp : ChevronDown} size={18} color="muted" />
            </Stack>
          </Box>
          
          {posAccordionOpen && (
            <Box padding={5} borderTop={true} borderColor="border-border">
              <Stack gap={5} w="full">
                <Font
                  variant="description"
                  text={s.posInfoDesc}
                />
                
                <Stack direction="row" align="center" justify="between" w="full" gap={5}>
                  <Font variant="body" text={s.enablePosToggle} />
                  <Switch checked={posEnabled} onChange={() => setPosEnabled(!posEnabled)} />
                </Stack>

                {posEnabled && (
                  <Stack gap={5} w="full">
                    <Stack gap={2.5} w="full">
                      <Font variant="body-bold" text={s.requiredFieldsTitle} />
                      <CustomCheckbox
                        checked={posInstituicao}
                        onChange={() => setPosInstituicao(!posInstituicao)}
                        label={s.posInstitutionLabel}
                      />
                      <CustomCheckbox
                        checked={posBandeira}
                        onChange={() => setPosBandeira(!posBandeira)}
                        label={s.posCardBrandLabel}
                      />
                      <CustomCheckbox
                        checked={posAutorizacao}
                        onChange={() => setPosAutorizacao(!posAutorizacao)}
                        label={s.posAuthNumberLabel}
                      />
                    </Stack>

                    <Stack gap={2.5} w="full">
                      <Font variant="body-bold" text={s.financialInstitutionsTitle} />
                      {posInstituicoes.length > 0 && (
                        <Stack gap={1} w="full">
                          {posInstituicoes.map((inst, idx) => (
                            <Stack key={idx} direction="row" align="center" justify="between" w="full" gap={2.5}>
                              <Font variant="body" text={inst} />
                              <Button
                                variant="outline"
                                label={UI_STRINGS.common.delete}
                                icon={Trash2}
                                onClick={() => handleRemoveInstituicao(idx)}
                              />
                            </Stack>
                          ))}
                        </Stack>
                      )}

                      {showAddInstituicaoInput ? (
                        <Stack direction="col" mobileDirection="row" gap={2.5} align="stretch" mobileAlign="center" w="full">
                          <Box flex="1">
                            <Input
                              placeholder={s.institutionPlaceholder}
                              value={newInstituicao}
                              onChange={(e) => setNewInstituicao(e.target.value)}
                            />
                          </Box>
                          <Button variant="primary" label={UI_STRINGS.common.confirm} onClick={handleAddInstituicao} />
                          <Button variant="ghost" label={UI_STRINGS.common.cancel} onClick={() => setShowAddInstituicaoInput(false)} />
                        </Stack>
                      ) : (
                        <Box display="flex">
                          <Button
                            variant="outline"
                            label={s.addInstitutionButton}
                            icon={Plus}
                            onClick={() => setShowAddInstituicaoInput(true)}
                          />
                        </Box>
                      )}
                    </Stack>
                  </Stack>
                )}
              </Stack>
            </Box>
          )}
        </Box>

        {/* Botões de Ações na Base do Formulário */}
        <FormActions
          confirmLabel={UI_STRINGS.pdv.cart.saveChangesButton}
          onConfirm={handleSave}
          onCancel={onCancel}
        />
      </Stack>
    </Box>
  )
}
