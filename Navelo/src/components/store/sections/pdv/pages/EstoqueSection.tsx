"use client"

/* eslint-disable max-lines-per-function */

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Icon } from "@/components/store/base/Icon"
import { Button } from "@/components/store/base/Button"
import { Input } from "@/components/store/base/Input"
import { InventoryAuditTable } from "@/components/store/advanced/InventoryAuditTable"
import { InvoicesTable } from "@/components/store/advanced/InvoicesTable"
import { ManualMovementForm } from "@/components/store/advanced/ManualMovementForm"
import {
  ChevronRight,
  ClipboardList,
  FileText,
  PlusCircle,
  Upload,
  Check,
  Search
} from "lucide-react"

interface EstoqueSectionProps {
  onBackToDashboard: () => void
  setCustomBack?: (cb: (() => void) | null) => void
}

export const EstoqueSection: React.FC<EstoqueSectionProps> = ({
  setCustomBack
}) => {
  const [estoqueView, setEstoqueView] = React.useState<"menu" | "balanco" | "notas" | "entrada_manual">("menu")

  const scrollPositions = React.useRef<Record<string, number>>({})

  React.useEffect(() => {
    if (typeof window === "undefined") return
    const handleScroll = () => {
      scrollPositions.current[estoqueView] = window.scrollY
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [estoqueView])

  React.useEffect(() => {
    if (typeof window === "undefined") return
    const savedScroll = scrollPositions.current[estoqueView] || 0
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.scrollTo({ top: savedScroll, behavior: "instant" })
      })
    })
  }, [estoqueView])

  // Mock de dados para o Balanço
  const [balancoProducts, setBalancoProducts] = React.useState([
    { id: "1", name: "ÁGUA MINERAL SEM GÁS", category: "Bebidas", systemStock: 15, counted: "" },
    { id: "2", name: "ÁGUA COM GÁS", category: "Bebidas", systemStock: 2, counted: "" },
    { id: "3", name: "REFRIGERANTE LATA", category: "Bebidas", systemStock: -3, counted: "" },
    { id: "5", name: "HAMBÚRGUER CLÁSSICO", category: "Lanches", systemStock: 10, counted: "" },
    { id: "6", name: "BATATA FRITA GRANDE", category: "Acompanhamentos", systemStock: 20, counted: "" },
  ])

  // Mock de dados para as Notas Fiscais
  const [invoices] = React.useState([
    { id: "1", number: "000.124.982", supplier: "Distribuidora de Bebidas Aliança Ltda", value: 1250.00, key: "3526 0712 3456 7800 0190 5500 1000 0123 4510 0234 5678", status: "Importada" },
    { id: "2", number: "000.125.102", supplier: "Hortifruti Central de Alimentos", value: 480.90, key: "3526 0798 7654 3200 0180 5500 1000 0123 4510 0234 1122", status: "Processando" },
  ])

  const [successMsg, setSuccessMsg] = React.useState("")
  const [invoiceSearchQuery, setInvoiceSearchQuery] = React.useState("")

  React.useEffect(() => {
    if (estoqueView !== "menu") {
      setCustomBack?.(() => () => {
        setSuccessMsg("")
        setEstoqueView("menu")
      })
    } else {
      setCustomBack?.(null)
    }
    return () => setCustomBack?.(null)
  }, [estoqueView, setCustomBack])
  const handleSaveBalanco = (updatedProducts: typeof balancoProducts) => {
    setBalancoProducts(updatedProducts)
    setSuccessMsg("Balanço de estoque salvo com sucesso!")
    setEstoqueView("menu")
  }

  const handleUploadXml = () => {
    setSuccessMsg("Upload de XML de nota fiscal realizado com sucesso (Simulado).")
  }

  const handleSaveManualMovement = (data: { productId: string; type: string; qty: string; reason: string }) => {
    setSuccessMsg(`Movimentação manual registrada: ${data.type} de ${data.qty} unidades para o produto selecionado.`)
    setEstoqueView("menu")
  }

  const filteredInvoices = invoices.filter((inv) =>
    inv.number.toLowerCase().includes(invoiceSearchQuery.toLowerCase()) ||
    inv.supplier.toLowerCase().includes(invoiceSearchQuery.toLowerCase())
  )

  return (
    <Stack gap={5} w="full">
      {successMsg && (
        <Box padding={2.5} bg="bg-brand-success/10" radius="default" w="full">
          <Stack direction="row" align="center" gap={2.5}>
            <Icon icon={Check} size={16} color="success" />
            <Font variant="body-xs-semibold" color="success" text={successMsg} />
          </Stack>
        </Box>
      )}

      {estoqueView === "menu" && (
        /* ================= MENU PRINCIPAL DO ESTOQUE ================= */
        <Stack gap={5} w="full">
          {/* Balanço de estoque */}
          <Box
            as="button"
            onClick={() => {
              setSuccessMsg("")
              setEstoqueView("balanco")
            }}
            padding={5}
            bg="bg-surface"
            radius="default"
            border={true}
            borderColor="border-border"
            w="full"
            hoverBg="surface-sunken"
          >
            <Stack direction="row" align="center" justify="between" w="full" gap={5}>
              <Stack direction="col" mobileDirection="row" align="start" mobileAlign="center" gap={5} flex="1">
                <Icon icon={ClipboardList} variant="circular-secondary" />
                <Stack gap={1} align="start" w="full">
                  <Font variant="body-bold" text="Balanço de Estoque" align="left" />
                  <Font variant="auxiliary" color="muted" text="Realizar auditoria e contagem física dos produtos na prateleira" align="left" />
                </Stack>
              </Stack>
              <Icon icon={ChevronRight} size={20} color="muted" />
            </Stack>
          </Box>

          {/* Notas Fiscais */}
          <Box
            as="button"
            onClick={() => {
              setSuccessMsg("")
              setEstoqueView("notas")
            }}
            padding={5}
            bg="bg-surface"
            radius="default"
            border={true}
            borderColor="border-border"
            w="full"
            hoverBg="surface-sunken"
          >
            <Stack direction="row" align="center" justify="between" w="full" gap={5}>
              <Stack direction="col" mobileDirection="row" align="start" mobileAlign="center" gap={5} flex="1">
                <Icon icon={FileText} variant="circular-secondary" />
                <Stack gap={1} align="start" w="full">
                  <Font variant="body-bold" text="Notas Fiscais (XML)" align="left" />
                  <Font variant="auxiliary" color="muted" text="Importar notas de compra para dar entrada no estoque e cadastrar fornecedores" align="left" />
                </Stack>
              </Stack>
              <Icon icon={ChevronRight} size={20} color="muted" />
            </Stack>
          </Box>

          {/* Entrada Manual */}
          <Box
            as="button"
            onClick={() => {
              setSuccessMsg("")
              setEstoqueView("entrada_manual")
            }}
            padding={5}
            bg="bg-surface"
            radius="default"
            border={true}
            borderColor="border-border"
            w="full"
            hoverBg="surface-sunken"
          >
            <Stack direction="row" align="center" justify="between" w="full" gap={5}>
              <Stack direction="col" mobileDirection="row" align="start" mobileAlign="center" gap={5} flex="1">
                <Icon icon={PlusCircle} variant="circular-secondary" />
                <Stack gap={1} align="start" w="full">
                  <Font variant="body-bold" text="Entrada / Saída Manual" align="left" />
                  <Font variant="auxiliary" color="muted" text="Lançar perdas, quebras, consumo interno ou ajustes de inventário avulsos" align="left" />
                </Stack>
              </Stack>
              <Icon icon={ChevronRight} size={20} color="muted" />
            </Stack>
          </Box>
        </Stack>
      )}

      {estoqueView === "balanco" && (
        /* ================= SUB-SEÇÃO: BALANÇO DE ESTOQUE ================= */
        <Box padding={5} bg="bg-surface" radius="default" border={true} borderColor="border-border">
          <InventoryAuditTable
            products={balancoProducts}
            onCancel={() => setEstoqueView("menu")}
            onSave={handleSaveBalanco}
          />
        </Box>
      )}

      {estoqueView === "notas" && (
        /* ================= SUB-SEÇÃO: NOTAS FISCAIS ================= */
        <Box padding={5} bg="bg-surface" radius="default" border={true} borderColor="border-border">
          <Stack gap={5}>
            <Stack direction="col" mobileDirection="row" align="stretch" mobileAlign="center" justify="between" w="full" gap={2.5}>
              <Box flex="1" w="full">
                <Input
                  placeholder="Buscar por número ou fornecedor..."
                  value={invoiceSearchQuery}
                  onChange={(e) => setInvoiceSearchQuery(e.target.value)}
                  icon={Search}
                />
              </Box>
              <Button
                variant="primary"
                label="Importar XML"
                icon={Upload}
                onClick={handleUploadXml}
              />
            </Stack>
            <InvoicesTable invoices={filteredInvoices} />
          </Stack>
        </Box>
      )}

      {estoqueView === "entrada_manual" && (
        /* ================= SUB-SEÇÃO: ENTRADA MANUAL ================= */
        <Box padding={5} bg="bg-surface" radius="default" border={true} borderColor="border-border">
          <ManualMovementForm
            products={balancoProducts}
            onCancel={() => setEstoqueView("menu")}
            onSubmit={handleSaveManualMovement}
          />
        </Box>
      )}
    </Stack>
  )
}
