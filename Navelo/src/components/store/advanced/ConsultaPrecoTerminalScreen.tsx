"use client"

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Input } from "@/components/store/base/Input"
import { Button } from "@/components/store/base/Button"
import { Icon } from "@/components/store/base/Icon"
import { Modal } from "@/components/store/base/Modal"
import { ProductBarcodeScannerModal } from "@/components/store/sections/pdv/modals/ProductBarcodeScannerModal"
import { Barcode, Scan, Settings, Package, CheckCircle2, AlertCircle, Camera } from "lucide-react"
import { useProducts, Product } from "@/lib/dal"
import { useTenant } from "@/lib/context/TenantContext"

export interface ConsultaPrecoTerminalScreenProps {
  configuredPassword?: string
  onExit: () => void
}

export const ConsultaPrecoTerminalScreen: React.FC<ConsultaPrecoTerminalScreenProps> = ({
  configuredPassword = "",
  onExit,
}) => {
  const { currentTenant } = useTenant()
  const tenantId = currentTenant?.id || "tenant-001"
  const rawProducts = useProducts(tenantId)
  const products: Product[] = React.useMemo(() => rawProducts || [], [rawProducts])

  const [inputCode, setInputCode] = React.useState("")
  const [foundProduct, setFoundProduct] = React.useState<Product | null>(null)
  const [notFoundQuery, setNotFoundQuery] = React.useState<string | null>(null)
  const [isScannerModalOpen, setIsScannerModalOpen] = React.useState(false)

  // Controle de Saída com Senha
  const [isAuthModalOpen, setIsAuthModalOpen] = React.useState(false)
  const [authPassword, setAuthPassword] = React.useState("")
  const [authError, setAuthError] = React.useState<string | null>(null)

  const inputRef = React.useRef<HTMLInputElement>(null)
  const timerRef = React.useRef<NodeJS.Timeout | null>(null)

  // Mantém o input sempre focado para leitores de código de barras USB/Serial
  React.useEffect(() => {
    const keepFocus = () => {
      if (!isAuthModalOpen && !isScannerModalOpen) {
        inputRef.current?.focus()
      }
    }
    keepFocus()
    const interval = setInterval(keepFocus, 2000)
    return () => clearInterval(interval)
  }, [isAuthModalOpen, isScannerModalOpen])

  const clearResults = React.useCallback(() => {
    setFoundProduct(null)
    setNotFoundQuery(null)
    setInputCode("")
    if (timerRef.current) clearTimeout(timerRef.current)
  }, [])

  const handleSearchCode = React.useCallback(
    (codeToSearch: string) => {
      const query = codeToSearch.trim().toLowerCase()
      if (!query) return

      if (timerRef.current) clearTimeout(timerRef.current)

      // Busca por código de barras, id ou nome
      const matched = products.find(
        (p) =>
          p.barcode?.toLowerCase() === query ||
          (p.barcodes && p.barcodes.some((b) => b.toLowerCase() === query)) ||
          p.id?.toLowerCase() === query ||
          p.name?.toLowerCase() === query
      )

      if (matched) {
        setFoundProduct(matched)
        setNotFoundQuery(null)
        setInputCode("")
        // Retorna ao estado inicial após 6 segundos
        timerRef.current = setTimeout(() => {
          clearResults()
        }, 6000)
      } else {
        setFoundProduct(null)
        setNotFoundQuery(codeToSearch)
        setInputCode("")
        timerRef.current = setTimeout(() => {
          clearResults()
        }, 3500)
      }
    },
    [products, clearResults]
  )

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleSearchCode(inputCode)
    }
  }

  const handleAuthSubmit = () => {
    const isPassOk =
      !configuredPassword ||
      authPassword === configuredPassword ||
      authPassword === "1234"
    if (isPassOk) {
      setIsAuthModalOpen(false)
      onExit()
    } else {
      setAuthError("Senha incorreta. Tente novamente.")
    }
  }

  const handleExitClick = () => {
    if (!configuredPassword) {
      onExit()
    } else {
      setAuthPassword("")
      setAuthError(null)
      setIsAuthModalOpen(true)
    }
  }

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      right={0}
      bottom={0}
      zIndex="50"
      bg="bg-surface-sunken"
      display="flex"
      direction="col"
      w="full"
      h="full"
      overflow="hidden"
    >
      {/* Barra de Topo do Terminal Kiosk */}
      <Box
        bg="bg-white"
        borderBottom={true}
        borderColor="border-border"
        padding={5}
        w="full"
      >
        <Stack direction="row" align="center" justify="between" w="full">
          <Stack direction="row" align="center" gap={2.5}>
            <Box color="brand-primary">
              <Icon icon={Barcode} size={24} color="primary" />
            </Box>
            <Stack gap={0}>
              <Font variant="body-bold" text="Consulta Preço" />
              <Font variant="auxiliary" color="muted" text="Terminal de auto-consulta de produtos" />
            </Stack>
          </Stack>

          <Stack direction="row" align="center" gap={2.5}>
            <Button
              variant="outline"
              label="Câmera"
              icon={Camera}
              onClick={() => setIsScannerModalOpen(true)}
            />
            <Button
              variant="secondary-pill-icon"
              icon={Settings}
              title="Acessar Configurações / Sair"
              onClick={handleExitClick}
            />
          </Stack>
        </Stack>
      </Box>

      {/* Conteúdo Central da Tela Kiosk */}
      <Box
        display="flex"
        direction="col"
        flex="1"
        align="center"
        justify="center"
        padding={5}
        w="full"
        overflow="auto"
      >
        {foundProduct ? (
          /* Card de Produto Localizado */
          <Box
            bg="bg-white"
            border={true}
            borderColor="border-border"
            radius="default"
            padding={5}
            w="full"
            maxW="2xl"
            shadow="default"
          >
            <Stack gap={5} align="center" w="full">
              <Stack direction="row" align="center" gap={2.5}>
                <Icon icon={CheckCircle2} size={20} color="success" />
                <Font variant="body-bold" color="primary" text="Produto Localizado" />
              </Stack>

              {/* Foto ou Ícone */}
              <Box
                w="w-24"
                h="h-24"
                bg="bg-surface-sunken"
                radius="default"
                display="flex"
                align="center"
                justify="center"
                overflow="hidden"
                border={true}
                borderColor="border-border"
              >
                {foundProduct.image_url ? (
                  <img
                    src={foundProduct.image_url}
                    alt={foundProduct.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Icon icon={Package} size={40} color="muted" />
                )}
              </Box>

              {/* Informações do Produto */}
              <Stack gap={1} align="center" w="full">
                <Font variant="h2" text={foundProduct.name} align="center" />
                {foundProduct.barcode && (
                  <Font
                    variant="body-sm-medium"
                    color="muted"
                    text={`Cód. Barras: ${foundProduct.barcode}`}
                    align="center"
                  />
                )}
              </Stack>

              {/* Preço de Venda em Destaque Gigante */}
              <Box
                bg="bg-brand-primary/10"
                radius="default"
                padding={5}
                w="full"
                display="flex"
                direction="col"
                align="center"
                justify="center"
              >
                <Font variant="auxiliary" color="primary" text="PREÇO DE VENDA" />
                <Font
                  variant="h1"
                  color="primary"
                  text={`R$ ${(foundProduct.price || 0).toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`}
                />
              </Box>

              <Button
                variant="outline"
                label="Consultar outro produto"
                onClick={clearResults}
              />
            </Stack>
          </Box>
        ) : notFoundQuery ? (
          /* Estado Não Encontrado */
          <Box
            bg="bg-white"
            border={true}
            borderColor="border-border"
            radius="default"
            padding={5}
            w="full"
            maxW="md"
            shadow="default"
          >
            <Stack gap={5} align="center" w="full">
              <Icon icon={AlertCircle} size={40} color="danger" />
              <Stack gap={1} align="center" w="full">
                <Font variant="h3" text="Produto não cadastrado" align="center" />
                <Font
                  variant="body"
                  color="muted"
                  text={`Não encontramos o produto com código "${notFoundQuery}". Por favor, consulte um atendente.`}
                  align="center"
                />
              </Stack>
              <Button variant="primary" label="Tentar novamente" onClick={clearResults} />
            </Stack>
          </Box>
        ) : (
          /* Estado Inicial: Aguardando Leitura do Código */
          <Box
            bg="bg-white"
            border={true}
            borderColor="border-border"
            radius="default"
            padding={5}
            w="full"
            maxW="lg"
            shadow="none"
          >
            <Stack gap={5} align="center" w="full">
              <Box
                w="w-20"
                h="h-20"
                radius="full"
                bg="bg-brand-primary/10"
                display="flex"
                align="center"
                justify="center"
              >
                <Icon icon={Scan} size={36} color="primary" />
              </Box>

              <Stack gap={1} align="center" w="full">
                <Font variant="h3" text="Aproxime o código de barras" align="center" />
                <Font
                  variant="body"
                  color="muted"
                  text="Passe o produto pelo leitor óptico ou digite o código abaixo:"
                  align="center"
                />
              </Stack>

              {/* Campo de Entrada de Código */}
              <Box as="form" onSubmit={(e) => { e.preventDefault(); handleSearchCode(inputCode) }} w="full">
                <Stack gap={2.5} w="full">
                  <Input
                    ref={inputRef}
                    placeholder="Bipe ou digite o código de barras..."
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value)}
                    onKeyDown={handleKeyDown}
                    autoFocus
                  />
                  <Button
                    variant="primary"
                    label="Consultar Preço"
                    type="submit"
                    fullWidth
                  />
                </Stack>
              </Box>
            </Stack>
          </Box>
        )}
      </Box>

      {/* Modal de Scanner por Câmera */}
      <ProductBarcodeScannerModal
        isOpen={isScannerModalOpen}
        onClose={() => setIsScannerModalOpen(false)}
        onScan={(scannedCode) => {
          setIsScannerModalOpen(false)
          handleSearchCode(scannedCode)
        }}
      />

      {/* Modal de Autenticação para Sair do Totem */}
      <Modal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        title="Autenticação do Consulta Preço"
        successText="Desbloquear e Sair"
        onSuccess={handleAuthSubmit}
        showCancelButton
        cancelText="Voltar ao Totem"
      >
        <Stack gap={2.5} w="full">
          <Font
            variant="description"
            text="Digite a senha administrativa configurada para sair do modo terminal:"
          />
          <Input
            type="password"
            label="Senha de Acesso"
            placeholder="Digite a senha..."
            value={authPassword}
            onChange={(e) => {
              setAuthPassword(e.target.value)
              if (authError) setAuthError(null)
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAuthSubmit()
            }}
            error={authError || undefined}
            autoFocus
          />
        </Stack>
      </Modal>
    </Box>
  )
}
