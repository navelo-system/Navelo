"use client"

/* eslint-disable max-lines-per-function */

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Grid } from "@/components/store/base/Grid"
import { Font } from "@/components/store/base/Font"
import { Button } from "@/components/store/base/Button"
import { Input } from "@/components/store/base/Input"
import { Switch } from "@/components/store/base/Switch"
import { Checkbox } from "@/components/store/base/Checkbox"
import { CustomSelect, CustomSelectItem } from "@/components/store/base/CustomSelect"
import { Icon } from "@/components/store/base/Icon"
import { Badge } from "@/components/store/base/Badge"
import { Search, Plus, Edit2, Trash2, Printer, LayoutGrid, ChevronRight, Check } from "lucide-react"
import { PrintStatusModal } from "@/components/store/sections/pdv/modals/PrintStatusModal"

export interface PrintPointItem {
  id: string
  name: string
  serverIp: string
  port: string
  enabled: boolean
  bobbinSize: string
  increaseFont: boolean
  columns: number
  kitchenMonitorEnabled: boolean
  linkingCode: string
}

export interface PontosImpressaoSectionProps {
  onCancel: () => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
  onNavigate: (subView: string) => void
}

export const PontosImpressaoSection: React.FC<PontosImpressaoSectionProps> = ({
  onCancel,
  setCustomBack,
  setCustomTitle,
  onNavigate
}) => {
  const [points, setPoints] = React.useState<PrintPointItem[]>([
    {
      id: "1",
      name: "Ponto 1",
      serverIp: "192.168.1.101",
      port: "3030",
      enabled: true,
      bobbinSize: "80MM",
      increaseFont: false,
      columns: 48,
      kitchenMonitorEnabled: false,
      linkingCode: ""
    }
  ])

  const [mode, setMode] = React.useState<"list" | "form">("list")
  const [editingPoint, setEditingPoint] = React.useState<PrintPointItem | null>(null)
  const [searchQuery, setSearchQuery] = React.useState("")

  // Form states
  const [formName, setFormName] = React.useState("")
  const [formEnabled, setFormEnabled] = React.useState(true)
  const [formServerIp, setFormServerIp] = React.useState("")
  const [formPort, setFormPort] = React.useState("3030")
  const [formBobbinSize, setFormBobbinSize] = React.useState("80MM")
  const [formIncreaseFont, setFormIncreaseFont] = React.useState(false)
  const [formColumns, setFormColumns] = React.useState(48)
  const [formKitchenEnabled, setFormKitchenEnabled] = React.useState(false)
  const [formLinkingCode, setFormLinkingCode] = React.useState("")
  const [modalMsg, setModalMsg] = React.useState<string | null>(null)

  const handleBack = React.useCallback(() => {
    if (mode === "form") {
      setMode("list")
      setEditingPoint(null)
    } else {
      onCancel()
    }
  }, [mode, onCancel])

  React.useEffect(() => {
    setCustomBack?.(() => handleBack)
    setCustomTitle?.(mode === "form" ? (editingPoint ? "Editar ponto de impressão" : "Novo ponto de impressão") : "Pontos de impressão")

    return () => {
      setCustomBack?.(null)
      setCustomTitle?.(null)
    }
  }, [mode, editingPoint, setCustomBack, setCustomTitle, handleBack])

  const handleCreateNew = () => {
    setEditingPoint(null)
    setFormName("")
    setFormEnabled(true)
    setFormServerIp("")
    setFormPort("3030")
    setFormBobbinSize("80MM")
    setFormIncreaseFont(false)
    setFormColumns(48)
    setFormKitchenEnabled(false)
    setFormLinkingCode("")
    setMode("form")
  }

  const handleEdit = (point: PrintPointItem) => {
    setEditingPoint(point)
    setFormName(point.name)
    setFormEnabled(point.enabled)
    setFormServerIp(point.serverIp)
    setFormPort(point.port)
    setFormBobbinSize(point.bobbinSize)
    setFormIncreaseFont(point.increaseFont)
    setFormColumns(point.columns)
    setFormKitchenEnabled(point.kitchenMonitorEnabled)
    setFormLinkingCode(point.linkingCode)
    setMode("form")
  }

  const handleDelete = (id: string) => {
    setPoints((prev) => prev.filter((p) => p.id !== id))
    if (mode === "form") {
      setMode("list")
      setEditingPoint(null)
    }
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formName.trim()) return

    const pointData: Omit<PrintPointItem, "id"> = {
      name: formName,
      enabled: formEnabled,
      serverIp: formServerIp,
      port: formPort,
      bobbinSize: formBobbinSize,
      increaseFont: formIncreaseFont,
      columns: formColumns,
      kitchenMonitorEnabled: formKitchenEnabled,
      linkingCode: formLinkingCode
    }

    if (editingPoint) {
      setPoints((prev) =>
        prev.map((p) => (p.id === editingPoint.id ? { ...p, ...pointData } : p))
      )
    } else {
      setPoints((prev) => [
        ...prev,
        { id: Date.now().toString(), ...pointData }
      ])
    }

    setMode("list")
    setEditingPoint(null)
  }

  const filtered = points.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <Box position="relative" w="full">
      {mode === "list" ? (
        <Stack gap={5} w="full">
          {/* Barra de Busca e Botão de Adição no topo */}
          <Stack direction="col" mobileDirection="row" align="stretch" mobileAlign="center" gap={2.5} w="full">
            <Box flex="1" w="full">
              <Input
                placeholder="Buscar ponto de impressão..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={Search}
              />
            </Box>
            <Button
              variant="primary"
              label="Adicionar ponto"
              icon={Plus}
              onClick={handleCreateNew}
            />
          </Stack>

          {/* Listagem de Pontos de Impressão */}
          <Box
            bg="bg-white"
            border={true}
            borderColor="border-border"
            radius="default"
            w="full"
            overflow="hidden"
          >
            <Stack gap={0} w="full">
              {filtered.map((point, idx) => (
                <React.Fragment key={point.id}>
                  {idx > 0 && <Box h="h-[1px]" w="full" bg="bg-border" />}
                  <Box
                    padding={5}
                    hoverBg="primary/10"
                    w="full"
                  >
                    <Stack direction="col" mobileDirection="row" align="stretch" mobileAlign="center" justify="between" w="full" gap={2.5}>
                      <Stack direction="row" align="center" gap={5} flex="1" minW="0">
                        <Box w="w-10" h="h-10" bg="bg-brand-primary/10" radius="full" shrink="0">
                          <Stack w="full" h="full" align="center" justify="center">
                            <Font
                              variant="body-bold"
                              color="primary"
                              text={point.name.charAt(0).toUpperCase()}
                            />
                          </Stack>
                        </Box>
                        <Stack gap={1} flex="1" minW="0">
                          <Font variant="body-bold" text={point.name} align="left" />
                          <Font
                            variant="description"
                            text={`Servidor: ${point.serverIp}:${point.port}`}
                            color="muted"
                            align="left"
                          />
                          {point.enabled && (
                            <Box display="block md:hidden" w="full">
                              <Stack direction="row" justify="start" gap={0} w="full">
                                <Badge variant="success" label="habilitado" icon={Check} />
                              </Stack>
                            </Box>
                          )}
                        </Stack>
                      </Stack>

                      <Stack direction="row" align="center" gap={5} justify="between" mobileJustify="end" w="w-full md:w-auto">
                        {point.enabled && (
                          <Box display="hidden md:block">
                            <Badge variant="success" label="habilitado" icon={Check} />
                          </Box>
                        )}

                        {/* Ações de Edição/Deleção */}
                        <Stack direction="row" gap={2.5}>
                          <Button
                            variant="outline-icon-xs"
                            icon={Edit2}
                            onClick={() => handleEdit(point)}
                          />
                          <Button
                            variant="danger-icon-xs"
                            icon={Trash2}
                            onClick={() => handleDelete(point.id)}
                          />
                        </Stack>
                      </Stack>
                    </Stack>
                  </Box>
                </React.Fragment>
              ))}
            </Stack>
          </Box>
        </Stack>
      ) : (
        /* Form de Cadastro / Edição */
        <Box
          as="form"
          onSubmit={handleSave}
          w="full"
        >
          <Stack gap={5} w="full">
            {/* Card 1: Identificação */}
            <Box
              bg="bg-white"
              border={true}
              borderColor="border-border"
              radius="default"
              padding={5}
              w="full"
            >
              <Stack gap={5} w="full">
                <Font variant="body-bold" text="Identificação" />

                <Input
                  label="* Nome"
                  placeholder="Ex: Ponto 1"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  required
                />

                <Box h="h-[1px]" w="full" bg="bg-border" />

                {/* Produtos vinculados */}
                <Box
                  cursor="pointer"
                  onClick={() => onNavigate("catalogo-produtos")}
                  w="full"
                >
                  <Stack direction="row" align="center" justify="between" w="full">
                    <Stack direction="row" align="center" gap={2.5}>
                      <Icon icon={LayoutGrid} size={20} color="primary" />
                      <Stack gap={1}>
                        <Font variant="body-bold" text="Produtos" />
                        <Font variant="description" text="1 produto selecionado." color="muted" />
                      </Stack>
                    </Stack>
                    <Icon icon={ChevronRight} size={16} color="muted" />
                  </Stack>
                </Box>
              </Stack>
            </Box>

            {/* Card 2: Habilitar Impressão */}
            <Box
              bg="bg-white"
              border={true}
              borderColor="border-border"
              radius="default"
              padding={5}
              w="full"
            >
              <Stack gap={5} w="full">
                <Stack direction="row" align="center" justify="between" w="full" gap={5}>
                  <Font variant="body-bold" text="Habilitar impressão" />
                  <Switch
                    checked={formEnabled}
                    onChange={(e) => setFormEnabled(e.target.checked)}
                  />
                </Stack>

                {formEnabled && (
                  <>
                    <Box h="h-[1px]" w="full" bg="bg-border" />

                    <Grid cols={2} gap={5}>
                      <Input
                        label="* Servidor"
                        placeholder="Ex: 192.168.1.101"
                        value={formServerIp}
                        onChange={(e) => setFormServerIp(e.target.value)}
                        required
                      />

                      <Input
                        label="* Porta"
                        placeholder="Ex: 3030"
                        value={formPort}
                        onChange={(e) => setFormPort(e.target.value)}
                        required
                      />
                    </Grid>

                    <Font variant="description" text="Endereço IP da impressora." color="muted" />

                    <Stack gap={1} w="full">
                      <Font variant="sub-tiny-bold" text="Tamanho bobina" />
                      <CustomSelect
                        value={formBobbinSize}
                        onChange={(val) => setFormBobbinSize(val)}
                      >
                        <CustomSelectItem value="80MM" text="80MM" icon={Printer} />
                        <CustomSelectItem value="58MM" text="58MM" icon={Printer} />
                      </CustomSelect>
                    </Stack>

                    <Stack direction="row" align="center" gap={2.5} w="full">
                      <Checkbox
                        checked={formIncreaseFont}
                        onChange={(e) => setFormIncreaseFont(e.target.checked)}
                      />
                      <Font variant="body" text="Aumentar fonte da impressão" />
                    </Stack>

                    {/* Número de colunas */}
                    <Stack gap={2.5} w="full">
                      <Stack direction="row" align="center" justify="between" w="full">
                        <Font variant="body" text="Número de colunas" />
                        <Font variant="body-bold" text={formColumns.toString()} />
                      </Stack>
                      <Input
                        type="range"
                        min="20"
                        max="60"
                        value={formColumns}
                        onChange={(e) => setFormColumns(parseInt(e.target.value, 10))}
                      />
                    </Stack>

                    <Button
                      type="button"
                      variant="primary"
                      label="Imprimir teste"
                      onClick={() => setModalMsg("Imprimindo teste...")}
                      fullWidth
                    />
                  </>
                )}
              </Stack>
            </Box>

            {/* Card 3: Habilitar Monitor de Cozinha */}
            <Box
              bg="bg-white"
              border={true}
              borderColor="border-border"
              radius="default"
              padding={5}
              w="full"
            >
              <Stack gap={5} w="full">
                <Stack direction="row" align="center" justify="between" w="full" gap={5}>
                  <Font variant="body-bold" text="Habilitar Monitor de Cozinha" />
                  <Switch
                    checked={formKitchenEnabled}
                    onChange={(e) => setFormKitchenEnabled(e.target.checked)}
                  />
                </Stack>

                {formKitchenEnabled && (
                  <>
                    <Box h="h-[1px]" w="full" bg="bg-border" />

                    <Stack direction="row" align="end" gap={2.5} w="full">
                      <Box flex="1">
                        <Input
                          label="Código de vinculação"
                          placeholder="Digite o código..."
                          value={formLinkingCode}
                          onChange={(e) => setFormLinkingCode(e.target.value)}
                        />
                      </Box>
                      <Button
                        type="button"
                        variant="primary"
                        label="VINCULAR"
                        onClick={() => setModalMsg("Código de vinculação enviado!")}
                      />
                    </Stack>
                    <Font
                      variant="description"
                      text="Gere o código de vinculação no aplicativo 'Monitor de Cozinha'."
                      color="muted"
                    />
                  </>
                )}
              </Stack>
            </Box>

            {/* Ações de Formulário */}
            <Box paddingY={2.5} w="full">
              <Stack direction="col" mobileDirection="row" justify="between" align="stretch" mobileAlign="center" w="full" gap={2.5}>
                {editingPoint ? (
                  <Box w="w-full md:w-auto" order="2" mdOrder="1" display="flex">
                    <Button
                      type="button"
                      variant="danger"
                      label="Excluir Ponto"
                      icon={Trash2}
                      onClick={() => handleDelete(editingPoint.id)}
                    />
                  </Box>
                ) : (
                  <Box display="hidden md:block" mdOrder="1" />
                )}
                <Stack direction="col" mobileDirection="row" gap={2.5} w="w-full md:w-auto" order="1" mdOrder="2">
                  <Button
                    type="button"
                    variant="outline"
                    label="Cancelar"
                    onClick={() => setMode("list")}
                  />
                  <Button
                    type="submit"
                    variant="primary"
                    label={editingPoint ? "Salvar alterações" : "Salvar ponto"}
                  />
                </Stack>
              </Stack>
            </Box>
          </Stack>
        </Box>
      )}
      <PrintStatusModal
        isOpen={!!modalMsg}
        onClose={() => setModalMsg(null)}
        message={modalMsg || ""}
      />
    </Box>
  )
}
