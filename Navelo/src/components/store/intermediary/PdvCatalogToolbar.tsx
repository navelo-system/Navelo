"use client"

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Button } from "@/components/store/base/Button"
import { Input } from "@/components/store/base/Input"
import { ViewModeToggle } from "@/components/store/intermediary/ViewModeToggle"
import { Search, Camera, ShoppingCart, X } from "lucide-react"
import { ProductBarcodeScannerModal } from "@/components/store/sections/pdv/modals/ProductBarcodeScannerModal"
import { UI_STRINGS } from "@/constants/strings"

const SEARCH_ANIMATION_MS = 200

export interface PdvCatalogToolbarProps {
  searchQuery: string
  onSearchQueryChange: (value: string) => void
  viewMode: "grade" | "lista"
  onViewModeChange: (mode: "grade" | "lista") => void
  onOpenCart: () => void
  onBarcodeScanned: (code: string) => void
}

export interface MobileHeaderSearchProps {
  searchQuery: string
  onSearchQueryChange: (value: string) => void
  placeholder?: string
  children?: React.ReactNode
}

interface ExpandableSearchOverlayProps {
  isOpen: boolean
  placeholder: string
  searchQuery: string
  onSearchQueryChange: (value: string) => void
  onClose: () => void
}

function ExpandableSearchOverlay({
  isOpen,
  placeholder,
  searchQuery,
  onSearchQueryChange,
  onClose,
}: ExpandableSearchOverlayProps) {
  const searchInputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    if (!isOpen) return
    const timer = setTimeout(() => searchInputRef.current?.focus(), SEARCH_ANIMATION_MS)
    return () => clearTimeout(timer)
  }, [isOpen])

  if (!isOpen) return null

  return (
    <Box
      position="absolute"
      top={0}
      left={0}
      right={0}
      w="full"
      h="h-10"
      bg="bg-background"
      animation="search-expand-in"
      zIndex="20"
    >
      <Stack direction="row" align="center" gap={2.5} w="full">
        <Box flex="1" padding={0} minW="min-w-0">
          <Input
            ref={searchInputRef}
            placeholder={placeholder}
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            icon={Search}
          />
        </Box>
        <Box shrink="0">
          <Button variant="secondary-pill-icon" icon={X} onClick={onClose} />
        </Box>
      </Stack>
    </Box>
  )
}

export const MobileHeaderSearch: React.FC<MobileHeaderSearchProps> = ({
  searchQuery,
  onSearchQueryChange,
  placeholder = "Pesquisar...",
  children,
}) => {
  const [isSearchOpen, setIsSearchOpen] = React.useState(false)

  return (
    <Box position="relative" w="full" h="h-10">
      <Box
        w="full"
        transition="opacity"
        opacity={isSearchOpen ? "0" : "100"}
        pointerEvents={isSearchOpen ? "none" : "auto"}
      >
        <Stack direction="row" align="center" justify="end" w="full" gap={2.5}>
          <Button
            variant="secondary-pill-icon"
            icon={Search}
            onClick={() => setIsSearchOpen(true)}
          />
          {children}
        </Stack>
      </Box>

      <ExpandableSearchOverlay
        isOpen={isSearchOpen}
        placeholder={placeholder}
        searchQuery={searchQuery}
        onSearchQueryChange={onSearchQueryChange}
        onClose={() => setIsSearchOpen(false)}
      />
    </Box>
  )
}

export const PdvCatalogToolbar: React.FC<PdvCatalogToolbarProps> = ({
  searchQuery,
  onSearchQueryChange,
  viewMode,
  onViewModeChange,
  onOpenCart,
  onBarcodeScanned,
}) => {
  const [isSearchOpen, setIsSearchOpen] = React.useState(false)
  const [isScannerOpen, setIsScannerOpen] = React.useState(false)

  return (
    <>
      <Box position="relative" w="full" h="h-10">
        <Box
          w="full"
          transition="opacity"
          opacity={isSearchOpen ? "0" : "100"}
          pointerEvents={isSearchOpen ? "none" : "auto"}
        >
          <Stack direction="row" align="center" justify="between" w="full" gap={2.5}>
            <Stack direction="row" align="center" gap={2.5}>
              <ViewModeToggle value={viewMode} onChange={onViewModeChange} />
            </Stack>

            <Stack direction="row" align="center" gap={2.5}>
              <Box display="block md:hidden">
                <Button
                  variant="secondary-pill-icon"
                  icon={Camera}
                  onClick={() => setIsScannerOpen(true)}
                />
              </Box>
              <Box display="block md:hidden">
                <Button
                  variant="secondary-pill-icon"
                  icon={ShoppingCart}
                  onClick={onOpenCart}
                />
              </Box>
            </Stack>
          </Stack>
        </Box>

        <ExpandableSearchOverlay
          isOpen={isSearchOpen}
          placeholder={UI_STRINGS.pdv.catalog.searchProductsPlaceholder}
          searchQuery={searchQuery}
          onSearchQueryChange={onSearchQueryChange}
          onClose={() => setIsSearchOpen(false)}
        />
      </Box>

      <ProductBarcodeScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScan={onBarcodeScanned}
      />
    </>
  )
}
