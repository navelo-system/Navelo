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
import { Checkbox } from "@/components/store/base/Checkbox"
import { CustomSelect, CustomSelectItem } from "@/components/store/base/CustomSelect"
import { EmptyState } from "@/components/store/intermediary/EmptyState"
import { UI_STRINGS } from "@/constants/strings"
import {
  ChevronDown,
  ChevronUp,
  User,
  CreditCard,
  Plus,
  Trash2,
  FileSpreadsheet,
  Calendar,
} from "lucide-react"

export interface NotaFiscalSectionProps {
  onCancel: () => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
  setCustomActions?: (actions: React.ReactNode | null) => void
}

function CheckboxOption({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <Stack direction="row" align="center" gap={2.5} w="full" cursor="pointer" onClick={() => onChange(!checked)}>
      <Checkbox checked={checked} onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.checked)} />
      <Font variant="body-sm-medium" text={label} align="left" />
    </Stack>
  )
}

function FiscalEmissionSettingsCard({
  emitirNotas, setEmitirNotas,
  certificadoNome,
  qrCode, setQrCode,
  serieNfce, setSerieNfce,
  ultimoNfce, setUltimoNfce,
  serieNfe, setSerieNfe,
  ultimoNfe, setUltimoNfe,
  regimeTributario, setRegimeTributario,
  homologacao, setHomologacao,
}: {
  emitirNotas: boolean; setEmitirNotas: (v: boolean) => void
  certificadoNome: string
  qrCode: string; setQrCode: (v: string) => void
  serieNfce: string; setSerieNfce: (v: string) => void
  ultimoNfce: string; setUltimoNfce: (v: string) => void
  serieNfe: string; setSerieNfe: (v: string) => void
  ultimoNfe: string; setUltimoNfe: (v: string) => void
  regimeTributario: string; setRegimeTributario: (v: string) => void
  homologacao: boolean; setHomologacao: (v: boolean) => void
}) {
  const s = UI_STRINGS.fiscal
  return (
    <Box border borderColor="border-border" padding={5} radius="default" bg="bg-surface">
      <Stack gap={5} w="full">
        <Stack direction="col-reverse" mobileDirection="row" align="start" mobileAlign="center" justify="between" w="full" gap={5}>
          <Stack gap={1}>
            <Font variant="body-bold" text={s.enableEmissionToggle} align="left" />
            <Font variant="description" text={s.enableEmissionDesc} align="left" />
          </Stack>
          <Switch checked={emitirNotas} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmitirNotas(e.target.checked)} />
        </Stack>

        {emitirNotas && (
          <Stack gap={5} w="full">
            <Input label={s.digitalCertTitle} value={certificadoNome || UI_STRINGS.common.notSelected} disabled iconRight={Calendar} />
            <Stack gap={1} w="full">
              <Font variant="body-sm-semibold" text={s.cscTokenLabel} />
              <CustomSelect value={qrCode} onChange={setQrCode}>
                <CustomSelectItem value="CSC Padrão" text={s.defaultCscOption} icon={FileSpreadsheet} />
                <CustomSelectItem value="Outros" text={UI_STRINGS.common.all} icon={FileSpreadsheet} />
              </CustomSelect>
            </Stack>
            <Stack gap={2.5} w="full">
              <Font variant="body-bold" text={s.nfceTitle} />
              <Grid cols={2} gap={5}>
                <Input label={s.serieLabel} value={serieNfce} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSerieNfce(e.target.value)} type="number" />
                <Input label={s.nextNumberLabel} value={ultimoNfce} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUltimoNfce(e.target.value)} type="number" />
              </Grid>
            </Stack>
            <Stack gap={2.5} w="full">
              <Font variant="body-bold" text={s.nfeTitle} />
              <Grid cols={2} gap={5}>
                <Input label={s.nfeSerieLabel} value={serieNfe} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSerieNfe(e.target.value)} type="number" />
                <Input label={s.nfeNextNumberLabel} value={ultimoNfe} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUltimoNfe(e.target.value)} type="number" />
              </Grid>
            </Stack>
            <Stack gap={1} w="full">
              <Font variant="body-sm-semibold" text={s.taxRegimeLabel} />
              <CustomSelect value={regimeTributario} onChange={setRegimeTributario}>
                <CustomSelectItem value="Simples Nacional" text={s.simplesNacionalOption} icon={FileSpreadsheet} />
                <CustomSelectItem value="Lucro Presumido" text={s.lucroPresumidoOption} icon={FileSpreadsheet} />
                <CustomSelectItem value="Lucro Real" text={s.lucroRealOption} icon={FileSpreadsheet} />
              </CustomSelect>
            </Stack>
            <CheckboxOption checked={homologacao} onChange={setHomologacao} label={s.homologationOption} />
          </Stack>
        )}
      </Stack>
    </Box>
  )
}

function XmlAuthorizedCpfCnpjAccordion({
  authorizedList,
  onAdd,
  onRemove,
}: {
  authorizedList: string[]
  onAdd: (doc: string) => void
  onRemove: (idx: number) => void
}) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [showInput, setShowInput] = React.useState(false)
  const [newDoc, setNewDoc] = React.useState("")
  const s = UI_STRINGS.fiscal

  const handleConfirm = () => {
    if (newDoc.trim()) {
      onAdd(newDoc.trim())
      setNewDoc("")
      setShowInput(false)
    }
  }

  return (
    <Box border borderColor="border-border" radius="default" overflow="hidden">
      <Box onClick={() => setIsOpen(!isOpen)} padding={5} bg="bg-surface" cursor="pointer" w="full">
        <Stack direction="col" mobileDirection="row" align="center" justify="between" w="full" gap={2.5}>
          <Stack direction="col" mobileDirection="row" align="center" gap={2.5}>
            <Icon icon={User} size={18} color="muted" />
            <Font variant="body-bold" text={s.cpfCnpjAuthorizedTitle} align="center" />
          </Stack>
          <Icon icon={isOpen ? ChevronUp : ChevronDown} size={18} color="muted" />
        </Stack>
      </Box>
      {isOpen && (
        <Box padding={5} borderTop borderColor="border-border">
          <Stack gap={2.5} w="full">
            {authorizedList.length === 0 ? (
              <EmptyState icon={User} title={s.noAuthorizedDocTitle} subtitle={s.noAuthorizedDocSubtitle} />
            ) : (
              <Stack gap={1} w="full">
                {authorizedList.map((item, idx) => (
                  <Stack key={item} direction="row" align="center" justify="between" w="full" gap={2.5}>
                    <Font variant="body" text={item} />
                    <Button variant="secondary" label={UI_STRINGS.common.delete} icon={Trash2} onClick={() => onRemove(idx)} />
                  </Stack>
                ))}
              </Stack>
            )}
            {showInput ? (
              <Stack direction="col" mobileDirection="row" gap={2.5} align="stretch" mobileAlign="center" w="full">
                <Box flex="1">
                  <Input placeholder={s.documentLabel} value={newDoc} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewDoc(e.target.value)} />
                </Box>
                <Button variant="primary" label={UI_STRINGS.common.confirm} onClick={handleConfirm} />
                <Button variant="ghost" label={UI_STRINGS.common.cancel} onClick={() => setShowInput(false)} />
              </Stack>
            ) : (
              <Box display="flex">
                <Button variant="secondary" label={s.addCpfCnpjAuthorizedButton} icon={Plus} onClick={() => setShowInput(true)} />
              </Box>
            )}
          </Stack>
        </Box>
      )}
    </Box>
  )
}

function PosInstitutionsListCard({
  posInstituicoes,
  onAddInstituicao,
  onRemoveInstituicao,
}: {
  posInstituicoes: string[]
  onAddInstituicao: (inst: string) => void
  onRemoveInstituicao: (idx: number) => void
}) {
  const [showInput, setShowInput] = React.useState(false)
  const [newInst, setNewInst] = React.useState("")
  const s = UI_STRINGS.fiscal

  const handleConfirm = () => {
    if (newInst.trim()) {
      onAddInstituicao(newInst.trim())
      setNewInst("")
      setShowInput(false)
    }
  }

  return (
    <Stack gap={2.5} w="full">
      <Font variant="body-bold" text={s.financialInstitutionsTitle} />
      {posInstituicoes.length > 0 && (
        <Stack gap={1} w="full">
          {posInstituicoes.map((inst, idx) => (
            <Stack key={inst} direction="row" align="center" justify="between" w="full" gap={2.5}>
              <Font variant="body" text={inst} />
              <Button variant="secondary" label={UI_STRINGS.common.delete} icon={Trash2} onClick={() => onRemoveInstituicao(idx)} />
            </Stack>
          ))}
        </Stack>
      )}
      {showInput ? (
        <Stack direction="col" mobileDirection="row" gap={2.5} align="stretch" mobileAlign="center" w="full">
          <Box flex="1">
            <Input placeholder={s.institutionPlaceholder} value={newInst} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewInst(e.target.value)} />
          </Box>
          <Button variant="primary" label={UI_STRINGS.common.confirm} onClick={handleConfirm} />
          <Button variant="ghost" label={UI_STRINGS.common.cancel} onClick={() => setShowInput(false)} />
        </Stack>
      ) : (
        <Box display="flex">
          <Button variant="secondary" label={s.addInstitutionButton} icon={Plus} onClick={() => setShowInput(true)} />
        </Box>
      )}
    </Stack>
  )
}

function PosInfoSettingsAccordion({
  posEnabled, setPosEnabled,
  posInstituicao, setPosInstituicao,
  posBandeira, setPosBandeira,
  posAutorizacao, setPosAutorizacao,
  posInstituicoes, onAddInstituicao, onRemoveInstituicao,
}: {
  posEnabled: boolean; setPosEnabled: (v: boolean) => void
  posInstituicao: boolean; setPosInstituicao: (v: boolean) => void
  posBandeira: boolean; setPosBandeira: (v: boolean) => void
  posAutorizacao: boolean; setPosAutorizacao: (v: boolean) => void
  posInstituicoes: string[]
  onAddInstituicao: (inst: string) => void
  onRemoveInstituicao: (idx: number) => void
}) {
  const [isOpen, setIsOpen] = React.useState(false)
  const s = UI_STRINGS.fiscal

  return (
    <Box border borderColor="border-border" radius="default" overflow="hidden">
      <Box onClick={() => setIsOpen(!isOpen)} padding={5} bg="bg-surface" cursor="pointer" w="full">
        <Stack direction="col" mobileDirection="row" align="center" justify="between" w="full" gap={2.5}>
          <Stack direction="col" mobileDirection="row" align="center" gap={2.5}>
            <Icon icon={CreditCard} size={18} color="muted" />
            <Font variant="body-bold" text={s.posInfoTitle} align="center" />
          </Stack>
          <Icon icon={isOpen ? ChevronUp : ChevronDown} size={18} color="muted" />
        </Stack>
      </Box>
      {isOpen && (
        <Box padding={5} borderTop borderColor="border-border">
          <Stack gap={5} w="full">
            <Font variant="description" text={s.posInfoDesc} />
            <Stack direction="row" align="center" justify="between" w="full" gap={5}>
              <Font variant="body" text={s.enablePosToggle} />
              <Switch checked={posEnabled} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPosEnabled(e.target.checked)} />
            </Stack>
            {posEnabled && (
              <Stack gap={5} w="full">
                <Stack gap={2.5} w="full">
                  <Font variant="body-bold" text={s.requiredFieldsTitle} />
                  <CheckboxOption checked={posInstituicao} onChange={setPosInstituicao} label={s.posInstitutionLabel} />
                  <CheckboxOption checked={posBandeira} onChange={setPosBandeira} label={s.posCardBrandLabel} />
                  <CheckboxOption checked={posAutorizacao} onChange={setPosAutorizacao} label={s.posAuthNumberLabel} />
                </Stack>
                <PosInstitutionsListCard
                  posInstituicoes={posInstituicoes}
                  onAddInstituicao={onAddInstituicao}
                  onRemoveInstituicao={onRemoveInstituicao}
                />
              </Stack>
            )}
          </Stack>
        </Box>
      )}
    </Box>
  )
}

export const NotaFiscalSection: React.FC<NotaFiscalSectionProps> = ({
  onCancel,
  setCustomBack,
  setCustomTitle,
  setCustomActions,
}) => {
  const s = UI_STRINGS.fiscal
  const [emitirNotas, setEmitirNotas] = React.useState(false)
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
  const [authorizedCpfCnpj, setAuthorizedCpfCnpj] = React.useState<string[]>([])
  const [posEnabled, setPosEnabled] = React.useState(false)
  const [posInstituicao, setPosInstituicao] = React.useState(false)
  const [posBandeira, setPosBandeira] = React.useState(false)
  const [posAutorizacao, setPosAutorizacao] = React.useState(false)
  const [posInstituicoes, setPosInstituicoes] = React.useState<string[]>([])

  React.useEffect(() => {
    setCustomBack?.(() => () => onCancel())
    setCustomTitle?.(s.title)
    setCustomActions?.(null)
    return () => { setCustomBack?.(null); setCustomTitle?.(null); setCustomActions?.(null) }
  }, [setCustomBack, setCustomTitle, setCustomActions, onCancel, s.title])

  return (
    <Box bg="bg-white" border borderColor="border-border" radius="default" padding={5} w="full">
      <Stack gap={5} w="full">
        <FiscalEmissionSettingsCard
          emitirNotas={emitirNotas} setEmitirNotas={setEmitirNotas}
          certificadoNome="" qrCode={qrCode} setQrCode={setQrCode}
          serieNfce={serieNfce} setSerieNfce={setSerieNfce}
          ultimoNfce={ultimoNfce} setUltimoNfce={setUltimoNfce}
          serieNfe={serieNfe} setSerieNfe={setSerieNfe}
          ultimoNfe={ultimoNfe} setUltimoNfe={setUltimoNfe}
          regimeTributario={regimeTributario} setRegimeTributario={setRegimeTributario}
          homologacao={homologacao} setHomologacao={setHomologacao}
        />

        <CheckboxOption checked={danfeComprovante} onChange={setDanfeComprovante} label={s.printNonFiscalAfterDanfe} />
        <CheckboxOption checked={emitirAutomatico} onChange={setEmitirAutomatico} label={s.autoIssueToggle} />

        <Box w="full">
          <Input label={s.cancelReasonLabel} value={motivoCancelamento} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMotivoCancelamento(e.target.value)} />
        </Box>
        <Box w="full">
          <Input label={s.additionalInfoLabel} value={infosAdicionais} placeholder={s.additionalInfoLabel} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInfosAdicionais(e.target.value)} />
        </Box>

        <XmlAuthorizedCpfCnpjAccordion
          authorizedList={authorizedCpfCnpj}
          onAdd={(doc) => setAuthorizedCpfCnpj((prev) => [...prev, doc])}
          onRemove={(idx) => setAuthorizedCpfCnpj((prev) => prev.filter((_, i) => i !== idx))}
        />

        <PosInfoSettingsAccordion
          posEnabled={posEnabled} setPosEnabled={setPosEnabled}
          posInstituicao={posInstituicao} setPosInstituicao={setPosInstituicao}
          posBandeira={posBandeira} setPosBandeira={setPosBandeira}
          posAutorizacao={posAutorizacao} setPosAutorizacao={setPosAutorizacao}
          posInstituicoes={posInstituicoes}
          onAddInstituicao={(inst) => setPosInstituicoes((prev) => [...prev, inst])}
          onRemoveInstituicao={(idx) => setPosInstituicoes((prev) => prev.filter((_, i) => i !== idx))}
        />

        <FormActions confirmLabel={UI_STRINGS.pdv.cart.saveChangesButton} onConfirm={onCancel} onCancel={onCancel} />
      </Stack>
    </Box>
  )
}
