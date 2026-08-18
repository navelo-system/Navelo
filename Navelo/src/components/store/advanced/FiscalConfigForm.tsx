"use client"

/* eslint-disable complexity, max-lines-per-function */

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Grid } from "@/components/store/base/Grid"
import { Font } from "@/components/store/base/Font"
import { Input } from "@/components/store/base/Input"
import { Button } from "@/components/store/base/Button"
import { CustomSelect, CustomSelectItem } from "@/components/store/base/CustomSelect"
import { FileSpreadsheet, Globe, Check } from "lucide-react"
import { UI_STRINGS } from "@/constants/strings"

export interface FiscalConfigData {
  csosn: string
  reduction: number
  aliquot: number
  pisCofinsCst: string
}

export interface FiscalConfigFormProps {
  initialData?: FiscalConfigData | null
  onCancel: () => void
  onSave: (data: FiscalConfigData) => void
}

export const FiscalConfigForm: React.FC<FiscalConfigFormProps> = ({
  initialData,
  onSave,
}) => {
  const f = UI_STRINGS.fiscal
  const [csosn, setCsosn] = React.useState(initialData?.csosn || "500")
  const [reduction, setReduction] = React.useState(initialData?.reduction?.toString() || "0")
  const [aliquot, setAliquot] = React.useState(initialData?.aliquot?.toString() || "0")
  const [pisCofinsCst, setPisCofinsCst] = React.useState(initialData?.pisCofinsCst || "99")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      csosn,
      reduction: parseFloat(reduction) || 0,
      aliquot: parseFloat(aliquot) || 0,
      pisCofinsCst,
    })
  }

  return (
    <Box as="form" onSubmit={handleSubmit} w="full">
      <Stack gap={5} w="full">
        {/* Cabeçalho do Sub-Formulário */}
        <Stack direction="row" align="center" justify="between" w="full" gap={2.5}>
          <Stack direction="row" align="center" gap={2.5}>
            <Stack gap={1}>
              <Font variant="h3" text={f.defaultFiscalConfigTitle} />
              <Font variant="description" text={f.defaultFiscalConfigDesc} />
            </Stack>
          </Stack>
          <Button
            variant="primary"
            label={f.saveDefaultsButton}
            icon={Check}
            type="submit"
          />
        </Stack>

        {/* Mensagem Informativa */}
        <Box padding={5} bg="bg-brand-primary/10" radius="default" border={true} borderColor="border-brand-primary/30">
          <Font
            variant="body"
            color="primary"
            text={f.defaultFiscalConfigNotice}
          />
        </Box>

        {/* Parâmetros Fiscais */}
        <Box padding={5} bg="bg-surface" radius="default" border={true} borderColor="border-border">
          <Grid cols={2} gap={5}>
            <Stack gap={1}>
              <Font variant="body-sm-semibold" text={f.csosnIcmsRequired} />
              <CustomSelect value={csosn} onChange={setCsosn}>
                <CustomSelectItem value="101" text={f.csosn101} icon={FileSpreadsheet} />
                <CustomSelectItem value="102" text={f.csosn102} icon={FileSpreadsheet} />
                <CustomSelectItem value="500" text={f.csosn500} icon={FileSpreadsheet} />
              </CustomSelect>
            </Stack>

            <Input
              label={f.reductionBaseLabel}
              placeholder="0,00"
              value={reduction}
              onChange={(e) => setReduction(e.target.value)}
            />

            <Input
              label={f.aliquotIcmsLabel}
              placeholder="0,00"
              value={aliquot}
              onChange={(e) => setAliquot(e.target.value)}
            />

            <Stack gap={1}>
              <Font variant="body-sm-semibold" text={f.cstPisCofinsRequired} />
              <CustomSelect value={pisCofinsCst} onChange={setPisCofinsCst}>
                <CustomSelectItem value="01" text={f.pis01} icon={Globe} />
                <CustomSelectItem value="49" text={f.pis49} icon={Globe} />
                <CustomSelectItem value="99" text={f.pis99} icon={Globe} />
              </CustomSelect>
            </Stack>
          </Grid>
        </Box>
      </Stack>
    </Box>
  )
}
