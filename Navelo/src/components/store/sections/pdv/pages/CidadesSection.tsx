"use client"

/* eslint-disable max-lines-per-function */

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Button } from "@/components/store/base/Button"
import { Input } from "@/components/store/base/Input"
import { CustomSelect, CustomSelectItem } from "@/components/store/base/CustomSelect"
import { Search, Plus, Edit2, Trash2, MapPin, Globe } from "lucide-react"

export interface CityItem {
  id: string
  name: string
  uf: string
}

export interface CidadesSectionProps {
  onCancel: () => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
}

const BRAZIL_UFS = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO",
  "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI",
  "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"
]

export const CidadesSection: React.FC<CidadesSectionProps> = ({
  onCancel,
  setCustomBack,
  setCustomTitle
}) => {
  const [cities, setCities] = React.useState<CityItem[]>([
    { id: "1", name: "Abadia de Goiás", uf: "GO" },
    { id: "2", name: "Abadia dos Dourados", uf: "MG" },
    { id: "3", name: "Abadiânia", uf: "GO" },
    { id: "4", name: "Abaeté", uf: "MG" },
    { id: "5", name: "Abaetetuba", uf: "PA" },
    { id: "6", name: "Abaiara", uf: "CE" },
    { id: "7", name: "Abaira", uf: "BA" },
    { id: "8", name: "Abaré", uf: "BA" },
    { id: "9", name: "Abatiá", uf: "PR" },
    { id: "10", name: "Abdon Batista", uf: "SC" }
  ])

  const [mode, setMode] = React.useState<"list" | "form">("list")
  const [editingCity, setEditingCity] = React.useState<CityItem | null>(null)
  const [searchQuery, setSearchQuery] = React.useState("")

  // Form states
  const [formName, setFormName] = React.useState("")
  const [formUf, setFormUf] = React.useState("GO")

  const handleBack = React.useCallback(() => {
    if (mode === "form") {
      setMode("list")
      setEditingCity(null)
    } else {
      onCancel()
    }
  }, [mode, onCancel])

  React.useEffect(() => {
    setCustomBack?.(() => handleBack)
    setCustomTitle?.(mode === "form" ? (editingCity ? "Editar Cidade" : "Nova Cidade") : "Cidades")

    return () => {
      setCustomBack?.(null)
      setCustomTitle?.(null)
    }
  }, [mode, editingCity, setCustomBack, setCustomTitle, handleBack])

  const handleCreateNew = () => {
    setEditingCity(null)
    setFormName("")
    setFormUf("GO")
    setMode("form")
  }

  const handleEdit = (city: CityItem) => {
    setEditingCity(city)
    setFormName(city.name)
    setFormUf(city.uf)
    setMode("form")
  }

  const handleDelete = (id: string) => {
    setCities((prev) => prev.filter((c) => c.id !== id))
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formName.trim()) return

    if (editingCity) {
      setCities((prev) =>
        prev.map((c) =>
          c.id === editingCity.id
            ? { ...c, name: formName, uf: formUf }
            : c
        )
      )
    } else {
      const newCity: CityItem = {
        id: Date.now().toString(),
        name: formName,
        uf: formUf
      }
      setCities((prev) => [...prev, newCity])
    }

    setMode("list")
    setEditingCity(null)
  }

  const filtered = cities.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.uf.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <Box position="relative" w="full">
      {mode === "list" ? (
        <Stack gap={5} w="full">
          {/* Barra de Busca e Botão de Adição no topo */}
          <Stack direction="col" mobileDirection="row" align="stretch" mobileAlign="center" gap={5} w="full">
            <Box flex="1">
              <Input
                placeholder="Buscar por cidade ou UF..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={Search}
              />
            </Box>
            <Button
              variant="primary"
              label="Adicionar cidade"
              icon={Plus}
              onClick={handleCreateNew}
            />
          </Stack>

          {/* Listagem de Cidades */}
          <Box
            bg="bg-white"
            border={true}
            borderColor="border-border"
            radius="default"
            w="full"
            overflow="hidden"
          >
            <Stack gap={0} w="full">
              {filtered.map((city, idx) => (
                <React.Fragment key={city.id}>
                  {idx > 0 && <Box h="h-[1px]" w="full" bg="bg-border" />}
                  <Box
                    padding={5}
                    hoverBg="primary/10"
                    w="full"
                  >
                    <Stack direction="row" align="center" justify="between" w="full" gap={5}>
                      <Stack gap={1} flex="1">
                        <Font variant="body-bold" text={city.name} />
                        <Font
                          variant="description"
                          text={city.uf}
                          color="muted"
                        />
                      </Stack>

                      {/* Ações de Edição/Deleção */}
                      <Stack direction="row" gap={2.5} justify="end">
                        <Button
                          variant="outline-icon-xs"
                          icon={Edit2}
                          onClick={() => handleEdit(city)}
                        />
                        <Button
                          variant="danger-icon-xs"
                          icon={Trash2}
                          onClick={() => handleDelete(city.id)}
                        />
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
          bg="bg-white"
          border={true}
          borderColor="border-border"
          radius="default"
          padding={5}
          w="full"
        >
          <Stack gap={5} w="full">
            <Input
              label="* Nome da Cidade"
              placeholder="Ex: Goiânia"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              icon={MapPin}
              required
            />

            <Stack gap={1} w="full">
              <Font variant="sub-tiny-bold" text="* Estado / UF" />
              <CustomSelect
                value={formUf}
                onChange={(val) => setFormUf(val)}
              >
                {BRAZIL_UFS.map((uf) => (
                  <CustomSelectItem key={uf} value={uf} text={uf} icon={Globe} />
                ))}
              </CustomSelect>
            </Stack>

            {/* Ações de Formulário */}
            <Box paddingY={2.5} w="full">
              <Stack direction="row" justify="end" gap={2.5} w="full">
                <Button
                  type="button"
                  variant="outline"
                  label="Cancelar"
                  onClick={() => setMode("list")}
                />
                <Button
                  type="submit"
                  variant="primary"
                  label={editingCity ? "Salvar alterações" : "Salvar cidade"}
                />
              </Stack>
            </Box>
          </Stack>
        </Box>
      )}
    </Box>
  )
}
