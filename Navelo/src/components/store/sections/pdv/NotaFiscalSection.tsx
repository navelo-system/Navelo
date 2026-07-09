"use client"

/* eslint-disable max-lines-per-function, complexity */

import * as React from "react"
import { Box } from "../../base/Box"
import { Stack } from "../../base/Stack"
import { Grid } from "../../base/Grid"
import { Font } from "../../base/Font"
import { Input } from "../../base/Input"
import { Button } from "../../base/Button"
import { Switch } from "../../base/Switch"
import { Icon } from "../../base/Icon"
import { CustomSelect, CustomSelectItem } from "../../base/CustomSelect"
import { EmptyState } from "../../intermediary/EmptyState"
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
  <Box as="button" type="button" onClick={onChange} display="flex" w="full" cursor="pointer">
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
      <Font variant="body-sm-medium" text={label} />
    </Stack>
  </Box>
)

export const NotaFiscalSection: React.FC<NotaFiscalSectionProps> = ({
  onCancel,
  setCustomBack,
  setCustomTitle,
  setCustomActions
}) => {
  // Main settings
  const [emitirNotas, setEmitirNotas] = React.useState(false)
  const [certificadoNome] = React.useState("")
  const [qrCode, setQrCode] = React.useState("CSC Padrão")
  
  const [serieNfce, setSerieNfce] = React.useState("0")
  const [ultimoNfce, setUltimoNfce] = React.useState("0")
  const [serieNfe, setSerieNfe] = React.useState("0")
  const [ultimoNfe, setUltimoNfe] = React.useState("0")
  const [regimeTributario, setRegimeTributario] = React.useState("Simples Nacional")
  
  const [homologacao, setHomologacao] = React.useState(false)
  const [danfeComprovante, setDanfeComprovante] = React.useState(false)
  const [emitirAutomatico, setEmitirAutomatico] = React.useState(false)
  
  const [motivoCancelamento, setMotivoCancelamento] = React.useState("Operação cancelada pelo cliente")
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
    setCustomTitle?.("Nota fiscal")
    setCustomActions?.(null)

    return () => {
      setCustomBack?.(null)
      setCustomTitle?.(null)
      setCustomActions?.(null)
    }
  }, [setCustomBack, setCustomTitle, setCustomActions, onCancel])

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
          <Stack direction="row" align="center" justify="between" w="full" gap={5}>
            <Stack gap={1}>
              <Font variant="body-bold" text="Habilitar emissão de notas" />
              <Font variant="description" text="Ative para realizar a emissão de cupons e notas fiscais de venda" />
            </Stack>
            <Switch checked={emitirNotas} onChange={() => setEmitirNotas(!emitirNotas)} />
          </Stack>
        </Box>

        {emitirNotas && (
          <Stack gap={5} w="full">
            {/* Certificado digital */}
            <Input
              label="Certificado digital (arquivo .pfx) *"
              value={certificadoNome || "Nenhum certificado selecionado"}
              disabled
              iconRight={Calendar}
            />

            {/* QR Code */}
            <Stack gap={1} w="full">
              <Font variant="body-sm-semibold" text="QR Code *" />
              <CustomSelect value={qrCode} onChange={setQrCode}>
                <CustomSelectItem value="CSC Padrão" text="CSC Padrão" icon={FileSpreadsheet} />
                <CustomSelectItem value="Outros" text="Outros" icon={FileSpreadsheet} />
              </CustomSelect>
            </Stack>

            {/* Série/Número NFC-e */}
            <Stack gap={2.5} w="full">
              <Font variant="body-bold" text="Série/Número NFC-e (Utilize uma configuração única para cada dispositivo)" />
              <Grid cols={2} gap={5}>
                <Input
                  label="Série NFC-e *"
                  value={serieNfce}
                  onChange={(e) => setSerieNfce(e.target.value)}
                  type="number"
                />
                <Input
                  label="Último número NFC-e *"
                  value={ultimoNfce}
                  onChange={(e) => setUltimoNfce(e.target.value)}
                  type="number"
                />
              </Grid>
            </Stack>

            {/* Série/Número NF-e */}
            <Stack gap={2.5} w="full">
              <Font variant="body-bold" text="Série/Número NF-e (Utilize uma configuração única para cada dispositivo)" />
              <Grid cols={2} gap={5}>
                <Input
                  label="Série NF-e *"
                  value={serieNfe}
                  onChange={(e) => setSerieNfe(e.target.value)}
                  type="number"
                />
                <Input
                  label="Último número NF-e *"
                  value={ultimoNfe}
                  onChange={(e) => setUltimoNfe(e.target.value)}
                  type="number"
                />
              </Grid>
            </Stack>

            {/* Regime Tributário */}
            <Stack gap={1} w="full">
              <Font variant="body-sm-semibold" text="Regime Tributário *" />
              <CustomSelect value={regimeTributario} onChange={setRegimeTributario}>
                <CustomSelectItem value="Simples Nacional" text="Simples Nacional" icon={FileSpreadsheet} />
                <CustomSelectItem value="Lucro Presumido" text="Lucro Presumido" icon={FileSpreadsheet} />
                <CustomSelectItem value="Lucro Real" text="Lucro Real" icon={FileSpreadsheet} />
              </CustomSelect>
            </Stack>

            {/* Checkbox Homologação */}
            <CustomCheckbox
              checked={homologacao}
              onChange={() => setHomologacao(!homologacao)}
              label="Ambiente de homologação"
            />
          </Stack>
        )}

        {/* Outras opções de configuração */}
        <CustomCheckbox
          checked={danfeComprovante}
          onChange={() => setDanfeComprovante(!danfeComprovante)}
          label="Imprimir comprovante não fiscal após a DANFE"
        />

        <CustomCheckbox
          checked={emitirAutomatico}
          onChange={() => setEmitirAutomatico(!emitirAutomatico)}
          label="Emitir NF-e automaticamente para pessoa jurídica (CNPJ)"
        />

        <Box w="full">
          <Input
            label="Motivo de cancelamento *"
            value={motivoCancelamento}
            onChange={(e) => setMotivoCancelamento(e.target.value)}
          />
        </Box>

        <Box w="full">
          <Input
            label="Informações adicionais"
            value={infosAdicionais}
            placeholder="Informações adicionais"
            onChange={(e) => setInfosAdicionais(e.target.value)}
          />
        </Box>

        {/* CPF/CNPJ autorizada a obter o XML Accordion */}
        <Box border={true} borderColor="border-border" radius="default" overflow="hidden">
          <Box
            as="button"
            type="button"
            onClick={() => setXmlAccordionOpen(!xmlAccordionOpen)}
            padding={5}
            bg="bg-surface"
            cursor="pointer"
            w="full"
          >
            <Stack direction="row" align="center" justify="between" w="full" gap={5}>
              <Stack direction="row" align="center" gap={2.5}>
                <Icon icon={User} size={18} color="muted" />
                <Font variant="body-bold" text="CPF/CNPJ autorizada a obter o XML" />
              </Stack>
              <Icon icon={xmlAccordionOpen ? ChevronUp : ChevronDown} size={18} color="muted" />
            </Stack>
          </Box>
          
          {xmlAccordionOpen && (
            <Box padding={5} borderStyle="solid" border={true} borderColor="border-border">
              <Stack gap={2.5} w="full">
                {authorizedCpfCnpj.length === 0 ? (
                  <EmptyState
                    title="Nenhum documento autorizado"
                    subtitle="Adicione um CPF ou CNPJ para permitir download do XML"
                  />
                ) : (
                  <Stack gap={1} w="full">
                    {authorizedCpfCnpj.map((item, idx) => (
                      <Stack key={idx} direction="row" align="center" justify="between" w="full" gap={2.5}>
                        <Font variant="body" text={item} />
                        <Button
                          variant="outline"
                          label="Remover"
                          icon={Trash2}
                          onClick={() => handleRemoveCpfCnpj(idx)}
                        />
                      </Stack>
                    ))}
                  </Stack>
                )}

                {showAddCpfCnpjInput ? (
                  <Stack direction="row" gap={2.5} align="center" w="full">
                    <Box flex="1">
                      <Input
                        placeholder="CPF ou CNPJ"
                        value={newCpfCnpj}
                        onChange={(e) => setNewCpfCnpj(e.target.value)}
                      />
                    </Box>
                    <Button variant="primary" label="Adicionar" onClick={handleAddCpfCnpj} />
                    <Button variant="outline" label="Cancelar" onClick={() => setShowAddCpfCnpjInput(false)} />
                  </Stack>
                ) : (
                  <Box display="flex">
                    <Button
                      variant="outline"
                      label="CPF/CNPJ autorizado"
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
            as="button"
            type="button"
            onClick={() => setPosAccordionOpen(!posAccordionOpen)}
            padding={5}
            bg="bg-surface"
            cursor="pointer"
            w="full"
          >
            <Stack direction="row" align="center" justify="between" w="full" gap={5}>
              <Stack direction="row" align="center" gap={2.5}>
                <Icon icon={CreditCard} size={18} color="muted" />
                <Font variant="body-bold" text="Informações POS" />
              </Stack>
              <Icon icon={posAccordionOpen ? ChevronUp : ChevronDown} size={18} color="muted" />
            </Stack>
          </Box>
          
          {posAccordionOpen && (
            <Box padding={5} borderStyle="solid" border={true} borderColor="border-border">
              <Stack gap={5} w="full">
                <Font
                  variant="description"
                  text="Este recurso solicitará o preenchimento das informações de POS ao finalizar a venda."
                />
                
                <Stack direction="row" align="center" justify="between" w="full" gap={5}>
                  <Font variant="body" text="Habilitar" />
                  <Switch checked={posEnabled} onChange={() => setPosEnabled(!posEnabled)} />
                </Stack>

                {posEnabled && (
                  <Stack gap={5} w="full">
                    <Stack gap={2.5} w="full">
                      <Font variant="body-bold" text="Campos obrigatórios:" />
                      <CustomCheckbox
                        checked={posInstituicao}
                        onChange={() => setPosInstituicao(!posInstituicao)}
                        label="Instituição financeira"
                      />
                      <CustomCheckbox
                        checked={posBandeira}
                        onChange={() => setPosBandeira(!posBandeira)}
                        label="Bandeira do cartão"
                      />
                      <CustomCheckbox
                        checked={posAutorizacao}
                        onChange={() => setPosAutorizacao(!posAutorizacao)}
                        label="Número de autorização"
                      />
                    </Stack>

                    <Stack gap={2.5} w="full">
                      <Font variant="body-bold" text="Instituições financeiras:" />
                      {posInstituicoes.length > 0 && (
                        <Stack gap={1} w="full">
                          {posInstituicoes.map((inst, idx) => (
                            <Stack key={idx} direction="row" align="center" justify="between" w="full" gap={2.5}>
                              <Font variant="body" text={inst} />
                              <Button
                                variant="outline"
                                label="Remover"
                                icon={Trash2}
                                onClick={() => handleRemoveInstituicao(idx)}
                              />
                            </Stack>
                          ))}
                        </Stack>
                      )}

                      {showAddInstituicaoInput ? (
                        <Stack direction="row" gap={2.5} align="center" w="full">
                          <Box flex="1">
                            <Input
                              placeholder="Nome da instituição"
                              value={newInstituicao}
                              onChange={(e) => setNewInstituicao(e.target.value)}
                            />
                          </Box>
                          <Button variant="primary" label="Adicionar" onClick={handleAddInstituicao} />
                          <Button variant="outline" label="Cancelar" onClick={() => setShowAddInstituicaoInput(false)} />
                        </Stack>
                      ) : (
                        <Box display="flex">
                          <Button
                            variant="outline"
                            label="Adicionar instituição financeira"
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
        <Box paddingY={2.5} w="full">
          <Stack direction="row" justify="end" gap={2.5} w="full">
            <Button variant="outline" label="Cancelar" onClick={onCancel} />
            <Button type="button" variant="primary" label="Salvar alterações" onClick={handleSave} />
          </Stack>
        </Box>
      </Stack>
    </Box>
  )
}
