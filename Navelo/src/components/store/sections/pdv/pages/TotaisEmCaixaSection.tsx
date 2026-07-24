"use client"

/* eslint-disable max-lines-per-function */

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Icon } from "@/components/store/base/Icon"
import { Button } from "@/components/store/base/Button"
import { ChevronLeft, ChevronRight, ChevronDown, Info } from "lucide-react"

export interface TotaisEmCaixaSectionProps {
  onBackToDashboard?: () => void
  onBack?: () => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
  setCustomActions?: (actions: React.ReactNode | null) => void
}

interface PaymentCategory {
  id: string
  name: string
  total: string
  subItems?: Array<{ name: string; value: string; hasInfo?: boolean }>
}

export const TotaisEmCaixaSection: React.FC<TotaisEmCaixaSectionProps> = ({
  onBackToDashboard,
  onBack,
  setCustomBack,
  setCustomTitle,
  setCustomActions,
}) => {
  const [expanded, setExpanded] = React.useState<Record<string, boolean>>({
    dinheiro: true,
    credito: true,
  })

  const handleBack = onBack || onBackToDashboard
  const handleBackRef = React.useRef(handleBack)
  React.useEffect(() => {
    handleBackRef.current = handleBack
  }, [handleBack])

  React.useEffect(() => {
    setCustomTitle?.("Totais em caixa")
    setCustomBack?.(() => () => handleBackRef.current?.())
    setCustomActions?.(null)

    return () => {
      setCustomTitle?.(null)
      setCustomBack?.(null)
      setCustomActions?.(null)
    }
  }, [setCustomBack, setCustomTitle, setCustomActions])

  const toggleCategory = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const categories: PaymentCategory[] = [
    {
      id: "dinheiro",
      name: "Dinheiro",
      total: "R$ 39,00",
      subItems: [
        { name: "Negociação", value: "R$ 39,00" },
        { name: "Suprimento", value: "R$ 0,00" },
        { name: "Sangria", value: "R$ 0,00" },
      ],
    },
    {
      id: "credito",
      name: "Cartão de crédito",
      total: "R$ 6,00",
      subItems: [
        { name: "À vista", value: "R$ 0,00" },
        { name: "Parcelado", value: "R$ 0,00" },
        { name: "Indefinido", value: "R$ 6,00", hasInfo: true },
      ],
    },
    {
      id: "debito",
      name: "Cartão de débito",
      total: "R$ 0,00",
    },
    {
      id: "crediario",
      name: "Crediário",
      total: "R$ 0,00",
    },
    {
      id: "alimentacao",
      name: "Vale Alimentação",
      total: "R$ 0,00",
    },
    {
      id: "refeicao",
      name: "Vale Refeição",
      total: "R$ 0,00",
    },
    {
      id: "pix",
      name: "Pix",
      total: "R$ 0,00",
    },
    {
      id: "outros",
      name: "Outros",
      total: "R$ 0,00",
    },
  ]

  return (
    <Box w="full" flex="1" direction="col" justify="between" overflow="hidden" minH="0">
      {/* Container da Lista com Scroll Interno */}
      <Box w="full" flex="1" overflow="x-hidden y-auto" minH="0">
        <Stack gap={5} w="full">
          {/* Cabeçalho de Abertura */}
          <Box padding={1} shrink="0">
            <Font variant="body-sm-semibold" color="muted" text="Abertura: 16/06/2026 16:00" />
          </Box>

          {/* Lista de Categorias de Pagamento */}
          <Box bg="bg-surface" radius="default" border={true} borderColor="border-border">
            <Stack gap={0} w="full">
              {categories.map((cat, idx) => {
                const isExpanded = !!expanded[cat.id]
                const hasSub = Boolean(cat.subItems && cat.subItems.length > 0)
                const subItemsList = cat.subItems || []

                return (
                  <React.Fragment key={cat.id}>
                    {idx > 0 && <Box h="h-[1px]" bg="bg-border" w="full" />}
                    {/* Linha Principal */}
                    <Box
                      padding={2.5}
                      w="full"
                      cursor={hasSub ? "pointer" : undefined}
                      hoverBg={hasSub ? "surface-sunken" : undefined}
                      onClick={() => hasSub && toggleCategory(cat.id)}
                    >
                      <Stack direction="row" align="center" justify="between" w="full">
                        <Font variant="body-medium" text={cat.name} />
                        <Stack direction="row" align="center" gap={2.5}>
                          <Font variant="body-medium" text={cat.total} />
                          {hasSub ? (
                            <Icon icon={isExpanded ? ChevronDown : ChevronRight} size={16} color="primary" />
                          ) : (
                            <Icon icon={ChevronRight} size={16} color="primary" />
                          )}
                        </Stack>
                      </Stack>
                    </Box>

                    {/* Sub-itens expandidos com guia vertical */}
                    {hasSub && isExpanded && (
                      <Box paddingX={5} paddingY={2.5} bg="bg-surface">
                        <Box borderLeft={true} borderColor="border-border" paddingX={2.5}>
                          <Stack gap={2.5} w="full">
                            {subItemsList.map((sub) => (
                              <Stack key={sub.name} direction="row" justify="between" align="center" w="full">
                                <Stack direction="row" align="center" gap={1}>
                                  <Font variant="body-sm-medium" color="muted" text={sub.name} />
                                  {sub.hasInfo && <Icon icon={Info} size={14} color="muted" />}
                                </Stack>
                                <Font variant="body-sm-medium" color="muted" text={sub.value} />
                              </Stack>
                            ))}
                          </Stack>
                        </Box>
                      </Box>
                    )}
                  </React.Fragment>
                )
              })}

              {/* Linha do Total */}
              <Box h="h-[1px]" bg="bg-border" w="full" />
              <Box padding={2.5} w="full">
                <Stack direction="row" align="center" justify="between" w="full">
                  <Font variant="body-bold" text="Total" />
                  <Font variant="body-bold" text="R$ 45,00" />
                </Stack>
              </Box>
            </Stack>
          </Box>
        </Stack>
      </Box>

      {/* Controles de Paginação e Botão Fechar Caixa Fixos no Rodapé */}
      <Box w="full" shrink="0" borderTop={true} borderColor="border-border" paddingY={1} bg="bg-background">
        <Stack gap={2.5} w="full">
          <Stack direction="row" align="center" justify="between" w="full">
            <Button
              variant="outline"
              icon={ChevronLeft}
              label="Anterior"
            />
            <Button
              variant="outline"
              iconRight={ChevronRight}
              label="Próximo"
            />
          </Stack>

          <Button
            variant="primary"
            label="Fechar caixa"
            fullWidth
            onClick={handleBack}
          />
        </Stack>
      </Box>
    </Box>
  )
}
