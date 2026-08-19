"use client"

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Button } from "@/components/store/base/Button"
import { Input } from "@/components/store/base/Input"
import { CustomSelect, CustomSelectItem } from "@/components/store/base/CustomSelect"
import { Plus, Edit2, MapPin, Globe } from "lucide-react"
import { MobileHeaderSearch } from "@/components/store/intermediary/PdvCatalogToolbar"
import { FormActions } from "@/components/store/intermediary/FormActions"
import { UI_STRINGS } from "@/constants/strings"

interface CityItem {
  id: string
  name: string
  uf: string
}

export interface CidadesSectionProps {
  onCancel: () => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
  setCustomActions?: (actions: React.ReactNode | null) => void
}

const BRAZIL_UFS = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO",
  "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI",
  "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"
]

const INITIAL_CITIES: CityItem[] = [
  { id: "1", name: "Abadia de Goiás", uf: "GO" },
  { id: "2", name: "Abadia dos Dourados", uf: "MG" },
  { id: "3", name: "Abadiânia", uf: "GO" },
  { id: "4", name: "Abaeté", uf: "MG" },
  { id: "5", name: "Abaetetuba", uf: "PA" },
  { id: "6", name: "Abaiara", uf: "CE" },
  { id: "7", name: "Abaira", uf: "BA" },
  { id: "8", name: "Abaré", uf: "BA" },
  { id: "9", name: "Abatiá", uf: "PR" },
  { id: "10", name: "Abdon Batista", uf: "SC" },
]

function CityListCard({
  cities,
  onEdit,
  onDelete,
}: {
  cities: CityItem[]
  onEdit: (city: CityItem) => void
  onDelete: (id: string) => void
}) {
  const s = UI_STRINGS.cities
  return (
    <Box bg="bg-white" border borderColor="border-border" radius="default" w="full" overflow="hidden">
      <Stack gap={0} w="full">
        {cities.map((city, idx) => (
          <React.Fragment key={city.id}>
            {idx > 0 && <Box h="h-[1px]" w="full" bg="bg-border" />}
            <Box padding={5} hoverBg="primary/10" w="full">
              <Stack direction="row" align="center" justify="between" w="full" gap={5}>
                <Stack gap={1} flex="1">
                  <Font variant="body-bold" text={city.name} />
                  <Font variant="description" text={city.uf} color="muted" />
                </Stack>
                <Stack direction="row" gap={2.5} justify="end">
                  <Button variant="primary-xs" icon={Edit2} onClick={() => onEdit(city)} />
                  <Button
                    variant="danger-icon-xs-confirm"
                    confirmTitle={s.deleteCityConfirmTitle}
                    confirmSubtitle={s.deleteCityConfirmSubtitle}
                    confirmParagraph={s.deleteCityConfirmParagraph}
                    onConfirm={() => onDelete(city.id)}
                  />
                </Stack>
              </Stack>
            </Box>
          </React.Fragment>
        ))}
      </Stack>
    </Box>
  )
}

function CityFormCard({
  editingCity,
  formName,
  setFormName,
  formUf,
  setFormUf,
  onSubmit,
  onCancel,
}: {
  editingCity: CityItem | null
  formName: string
  setFormName: (v: string) => void
  formUf: string
  setFormUf: (v: string) => void
  onSubmit: (e: React.FormEvent) => void
  onCancel: () => void
}) {
  const s = UI_STRINGS.cities
  return (
    <Box as="form" onSubmit={onSubmit} bg="bg-white" border borderColor="border-border" radius="default" padding={5} w="full">
      <Stack gap={5} w="full">
        <Input label={s.cityNameLabel} placeholder={s.cityNamePlaceholder} value={formName} onChange={(e) => setFormName(e.target.value)} icon={MapPin} required />
        <Stack gap={1} w="full">
          <Font variant="sub-tiny-bold" text={s.stateUfLabel} />
          <CustomSelect value={formUf} onChange={setFormUf}>
            {BRAZIL_UFS.map((uf) => (
              <CustomSelectItem key={uf} value={uf} text={uf} icon={Globe} />
            ))}
          </CustomSelect>
        </Stack>
        <FormActions confirmLabel={editingCity ? UI_STRINGS.common.save : s.saveCityButton} onConfirm={() => {}} onCancel={onCancel} isSubmit={true} />
      </Stack>
    </Box>
  )
}

export const CidadesSection: React.FC<CidadesSectionProps> = ({
  onCancel,
  setCustomBack,
  setCustomTitle,
  setCustomActions,
}) => {
  const s = UI_STRINGS.cities
  const [cities, setCities] = React.useState<CityItem[]>(INITIAL_CITIES)
  const [mode, setMode] = React.useState<"list" | "form">("list")
  const [editingCity, setEditingCity] = React.useState<CityItem | null>(null)
  const [searchQuery, setSearchQuery] = React.useState("")
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
    setCustomTitle?.(mode === "form" ? (editingCity ? s.editCityTitle : s.newCityTitle) : s.title)
    if (mode === "list") {
      setCustomActions?.(
        <MobileHeaderSearch searchQuery={searchQuery} onSearchQueryChange={setSearchQuery} placeholder={s.searchPlaceholder} />
      )
    } else {
      setCustomActions?.(null)
    }
    return () => {
      setCustomBack?.(null)
      setCustomTitle?.(null)
      setCustomActions?.(null)
    }
  }, [mode, editingCity, searchQuery, setCustomBack, setCustomTitle, setCustomActions, handleBack, s.editCityTitle, s.newCityTitle, s.title, s.searchPlaceholder])

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formName.trim()) return
    if (editingCity) {
      setCities((prev) => prev.map((c) => (c.id === editingCity.id ? { ...c, name: formName, uf: formUf } : c)))
    } else {
      setCities((prev) => [...prev, { id: Date.now().toString(), name: formName, uf: formUf }])
    }
    setMode("list")
    setEditingCity(null)
  }

  const filtered = cities.filter(
    (c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.uf.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <Box position="relative" w="full">
      {mode === "list" ? (
        <Stack gap={5} w="full">
          <Stack direction="row" align="center" justify="end" w="full">
            <Button variant="primary" label={s.addCityButton} icon={Plus} onClick={() => { setEditingCity(null); setFormName(""); setFormUf("GO"); setMode("form") }} />
          </Stack>
          <CityListCard
            cities={filtered}
            onEdit={(city) => { setEditingCity(city); setFormName(city.name); setFormUf(city.uf); setMode("form") }}
            onDelete={(id) => setCities((prev) => prev.filter((c) => c.id !== id))}
          />
        </Stack>
      ) : (
        <CityFormCard
          editingCity={editingCity}
          formName={formName} setFormName={setFormName}
          formUf={formUf} setFormUf={setFormUf}
          onSubmit={handleSave} onCancel={() => setMode("list")}
        />
      )}
    </Box>
  )
}
