"use client"

/* eslint-disable max-lines-per-function */

import * as React from "react"
import { Modal } from "@/components/store/base/Modal"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Grid } from "@/components/store/base/Grid"
import { Font } from "@/components/store/base/Font"
import { Button } from "@/components/store/base/Button"
import { Settings, RotateCcw } from "lucide-react"

export interface ThemeColors {
  primary: string
  primaryFg: string
  secondary: string
  secondaryFg: string
  foreground: string
  textSecondary: string
  textMuted: string
}

export const DEFAULT_THEME: ThemeColors = {
  primary: "#16315e",
  primaryFg: "#f97316",
  secondary: "#f97316",
  secondaryFg: "#16315e",
  foreground: "#0f172a",
  textSecondary: "#475569",
  textMuted: "#64748b",
}

export const PRESET_THEMES: { name: string; colors: ThemeColors }[] = [
  {
    name: "Navelo Padrão",
    colors: DEFAULT_THEME,
  },
  {
    name: "Dark Luxe",
    colors: {
      primary: "#0f172a",
      primaryFg: "#38bdf8",
      secondary: "#38bdf8",
      secondaryFg: "#0f172a",
      foreground: "#f8fafc",
      textSecondary: "#cbd5e1",
      textMuted: "#94a3b8",
    },
  },
  {
    name: "Emerald Mint",
    colors: {
      primary: "#065f46",
      primaryFg: "#a7f3d0",
      secondary: "#10b981",
      secondaryFg: "#064e3b",
      foreground: "#022c22",
      textSecondary: "#047857",
      textMuted: "#059669",
    },
  },
  {
    name: "Royal Violet",
    colors: {
      primary: "#4c1d95",
      primaryFg: "#c084fc",
      secondary: "#a855f7",
      secondaryFg: "#3b0764",
      foreground: "#1e1b4b",
      textSecondary: "#6b21a8",
      textMuted: "#7e22ce",
    },
  },
  {
    name: "Sunset Crimson",
    colors: {
      primary: "#9f1239",
      primaryFg: "#fecdd3",
      secondary: "#f43f5e",
      secondaryFg: "#4c0519",
      foreground: "#4c0519",
      textSecondary: "#881337",
      textMuted: "#9f1239",
    },
  },
]

export function applyThemeColors(colors: ThemeColors) {
  if (typeof document === "undefined") return
  const root = document.documentElement
  root.style.setProperty("--brand-primary", colors.primary)
  root.style.setProperty("--brand-primary-fg", colors.primaryFg)
  root.style.setProperty("--brand-secondary", colors.secondary)
  root.style.setProperty("--brand-secondary-fg", colors.secondaryFg)
  root.style.setProperty("--brand-accent", colors.secondary)
  root.style.setProperty("--foreground", colors.foreground)
  root.style.setProperty("--text-secondary", colors.textSecondary)
  root.style.setProperty("--text-muted", colors.textMuted)
}

export function loadSavedTheme(): ThemeColors {
  if (typeof window === "undefined") return DEFAULT_THEME
  try {
    const saved = localStorage.getItem("navelo_custom_theme")
    if (saved) {
      return { ...DEFAULT_THEME, ...JSON.parse(saved) }
    }
  } catch {
    // fallback
  }
  return DEFAULT_THEME
}

export interface ThemeCustomizerModalProps {
  isOpen: boolean
  onClose: () => void
}

export const ThemeCustomizerModal: React.FC<ThemeCustomizerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [colors, setColors] = React.useState<ThemeColors>(loadSavedTheme)

  React.useEffect(() => {
    if (isOpen) {
      applyThemeColors(loadSavedTheme())
    }
  }, [isOpen])

  const handleColorChange = (key: keyof ThemeColors, value: string) => {
    const next = { ...colors, [key]: value }
    setColors(next)
    applyThemeColors(next)
    try {
      localStorage.setItem("navelo_custom_theme", JSON.stringify(next))
    } catch {
      // ignore
    }
  }

  const handleApplyPreset = (preset: ThemeColors) => {
    setColors(preset)
    applyThemeColors(preset)
    try {
      localStorage.setItem("navelo_custom_theme", JSON.stringify(preset))
    } catch {
      // ignore
    }
  }

  const handleResetDefault = () => {
    setColors(DEFAULT_THEME)
    applyThemeColors(DEFAULT_THEME)
    try {
      localStorage.removeItem("navelo_custom_theme")
    } catch {
      // ignore
    }
  }

  const fields: { key: keyof ThemeColors; label: string; description: string }[] = [
    { key: "primary", label: "Cor Primária", description: "Headers, destaques e navegação" },
    { key: "primaryFg", label: "Sobreposição da Primária", description: "Texto/Ícones sobre o fundo primário" },
    { key: "secondary", label: "Cor Secundária", description: "Ações principais e badges" },
    { key: "secondaryFg", label: "Sobreposição da Secundária", description: "Texto/Ícones sobre a cor secundária" },
    { key: "foreground", label: "Texto Principal", description: "Títulos e textos correntes" },
    { key: "textSecondary", label: "Texto Secundário", description: "Subtítulos e descrições" },
    { key: "textMuted", label: "Texto Suave", description: "Legendas e placeholders" },
  ]

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Personalizar Cores do Tema"
      subtitle="Ajuste as cores do PDV em tempo real"
      icon={Settings}
      successText="Concluído"
      onSuccess={onClose}
      showCancelButton={false}
    >
      <Stack gap={5} w="full">
        {/* Paletas Prontas (Presets) */}
        <Stack gap={2.5} w="full">
          <Font variant="body-bold" text="Paletas Prontas" />
          <Grid cols={3} gap={2.5}>
            {PRESET_THEMES.map((p) => {
              const isActive =
                colors.primary === p.colors.primary &&
                colors.secondary === p.colors.secondary
              return (
                <Box
                  key={p.name}
                  padding={2.5}
                  radius="lg"
                  border={true}
                  borderColor={isActive ? "border-brand-primary" : "border-border"}
                  bg="bg-surface"
                  cursor="pointer"
                  onClick={() => handleApplyPreset(p.colors)}
                  interactive
                >
                  <Stack gap={1} align="center">
                    <Stack direction="row" gap={1} align="center">
                      <Box
                        w="w-4"
                        h="h-4"
                        radius="full"
                        customStyle={{ backgroundColor: p.colors.primary }}
                      />
                      <Box
                        w="w-4"
                        h="h-4"
                        radius="full"
                        customStyle={{ backgroundColor: p.colors.secondary }}
                      />
                    </Stack>
                    <Font variant="auxiliary" text={p.name} align="center" />
                  </Stack>
                </Box>
              )
            })}
          </Grid>
        </Stack>

        <Box h="h-[1px]" bg="bg-border" w="full" />

        {/* Seletores Individuais de Cor */}
        <Stack gap={2.5} w="full">
          <Font variant="body-bold" text="Personalização Fina" />
          <Grid cols={2} gap={2.5}>
            {fields.map((f) => (
              <Box
                key={f.key}
                padding={2.5}
                bg="bg-surface-sunken"
                radius="lg"
                border={true}
                borderColor="border-border"
              >
                <Stack gap={1} w="full">
                  <Stack direction="row" align="center" justify="between" w="full">
                    <Font variant="body-sm-semibold" text={f.label} />
                    <Box
                      as="input"
                      type="color"
                      value={colors[f.key]}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleColorChange(f.key, e.target.value)}
                      w="w-7"
                      h="h-7"
                      radius="full"
                      cursor="pointer"
                      border={true}
                      borderColor="border-border"
                      bg="bg-transparent"
                      padding={0}
                    />
                  </Stack>
                  <Stack direction="row" align="center" justify="between" w="full">
                    <Font variant="auxiliary" color="muted" text={f.description} />
                    <Box
                      as="input"
                      type="text"
                      value={colors[f.key]}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleColorChange(f.key, e.target.value)}
                      w="w-20"
                      radius="default"
                      border={true}
                      borderColor="border-border"
                      bg="bg-white"
                      paddingX={1}
                      paddingY={1}
                    />
                  </Stack>
                </Stack>
              </Box>
            ))}
          </Grid>
        </Stack>

        {/* Restaurar Padrão */}
        <Box paddingY={2.5} w="full">
          <Button
            variant="outline"
            label="Restaurar Cores Padrão"
            icon={RotateCcw}
            onClick={handleResetDefault}
            fullWidth
          />
        </Box>
      </Stack>
    </Modal>
  )
}
