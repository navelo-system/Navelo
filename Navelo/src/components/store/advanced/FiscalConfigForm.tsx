"use client"

/* eslint-disable complexity */

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Grid } from "@/components/store/base/Grid"
import { Font } from "@/components/store/base/Font"
import { Input } from "@/components/store/base/Input"
import { Button } from "@/components/store/base/Button"
import { CustomSelect, CustomSelectItem } from "@/components/store/base/CustomSelect"
import { FileSpreadsheet, Globe, Check } from "lucide-react"

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
              <Font variant="h3" text="Configuração fiscal padrão" />
              <Font variant="description" text="Defina os impostos herdados pelos produtos configurados como padrão" />
            </Stack>
          </Stack>
          <Button
            variant="primary"
            label="Salvar Padrões"
            icon={Check}
            type="submit"
          />
        </Stack>

        {/* Mensagem Informativa */}
        <Box padding={5} bg="bg-brand-primary/10" radius="default" border={true} borderColor="border-brand-primary/30">
          <Font
            variant="body"
            color="primary"
            text="Os parâmetros definidos abaixo serão aplicados automaticamente para qualquer produto que tiver as opções de utilizar ICMS ou PIS/COFINS padrão marcadas em seu formulário de cadastro."
          />
        </Box>

        {/* Parâmetros Fiscais */}
        <Box padding={5} bg="bg-surface" radius="default" border={true} borderColor="border-border">
          <Grid cols={2} gap={5}>
            <Stack gap={1}>
              <Font variant="body-sm-semibold" text="CSOSN ICMS *" />
              <CustomSelect value={csosn} onChange={setCsosn}>
                <CustomSelectItem value="101" text="101 - Simples Nacional sem permissão de crédito" icon={FileSpreadsheet} />
                <CustomSelectItem value="102" text="102 - Simples Nacional sem permissão de crédito (outros)" icon={FileSpreadsheet} />
                <CustomSelectItem value="500" text="500 - ICMS cobrado anteriormente por substituição tributária (substituído)" icon={FileSpreadsheet} />
              </CustomSelect>
            </Stack>

            <Input
              label="Redução da base de cálculo efetiva (%)"
              placeholder="0,00"
              value={reduction}
              onChange={(e) => setReduction(e.target.value)}
            />

            <Input
              label="Alíquota do ICMS efetiva (%)"
              placeholder="0,00"
              value={aliquot}
              onChange={(e) => setAliquot(e.target.value)}
            />

            <Stack gap={1}>
              <Font variant="body-sm-semibold" text="CST PIS/COFINS *" />
              <CustomSelect value={pisCofinsCst} onChange={setPisCofinsCst}>
                <CustomSelectItem value="01" text="01 - Operação Tributável com Alíquota Básica" icon={Globe} />
                <CustomSelectItem value="49" text="49 - Outras Operações de Saída" icon={Globe} />
                <CustomSelectItem value="99" text="99 - Outras Operações" icon={Globe} />
              </CustomSelect>
            </Stack>
          </Grid>
        </Box>
      </Stack>
    </Box>
  )
}
