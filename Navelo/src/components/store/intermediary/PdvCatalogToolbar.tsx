"use client"

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Button } from "@/components/store/base/Button"
import { Input } from "@/components/store/base/Input"
import { ViewModeToggle } from "@/components/store/intermediary/ViewModeToggle"
import { Search, Camera, ShoppingCart, X } from "lucide-react"
import { ProductBarcodeScannerModal } from "@/components/store/sections/pdv/modals/ProductBarcodeScannerModal"

const SEARCH_ANIMATION_MS = 200

export interface PdvCatalogToolbarProps {
  searchQuery: string
  onSearchQueryChange: (value: string) => void
  viewMode: "grade" | "lista"
  onViewModeChange: (mode: "grade" | "lista") => void
  onOpenCart: () => void
  onBarcodeScanned: (code: string) => void
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
  const [searchMounted, setSearchMounted] = React.useState(false)
  const [searchAnimation, setSearchAnimation] = React.useState<"search-expand-in" | "search-collapse-out">("search-expand-in")
  const [isScannerOpen, setIsScannerOpen] = React.useState(false)
  const searchInputRef = React.useRef<HTMLInputElement>(null)
  const searchExitTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  const openSearch = () => {
    if (searchExitTimerRef.current) {
      clearTimeout(searchExitTimerRef.current)
      searchExitTimerRef.current = null
    }
    setSearchMounted(true)
    setSearchAnimation("search-expand-in")
    setIsSearchOpen(true)
  }

  const closeSearch = () => {
    setIsSearchOpen(false)
    setSearchAnimation("search-collapse-out")
    searchExitTimerRef.current = setTimeout(() => {
      setSearchMounted(false)
      searchExitTimerRef.current = null
    }, SEARCH_ANIMATION_MS)
  }

  React.useEffect(() => {
    if (!isSearchOpen) return
    const timer = setTimeout(() => searchInputRef.current?.focus(), SEARCH_ANIMATION_MS)
    return () => clearTimeout(timer)
  }, [isSearchOpen])

  React.useEffect(() => {
    return () => {
      if (searchExitTimerRef.current) {
        clearTimeout(searchExitTimerRef.current)
      }
    }
  }, [])

  return (
    <>
      <Box position="relative" w="full" h="h-10">
        <Box
          w="full"
          transition="opacity"
          opacity={isSearchOpen ? "0" : "100"}
          className={isSearchOpen ? "pointer-events-none" : undefined}
        >
          <Stack direction="row" align="center" justify="between" w="full" gap={2.5}>
            <Stack direction="row" align="center" gap={2.5}>
              <Button
                variant="secondary-pill-icon"
                icon={Search}
                onClick={openSearch}
              />
              <Button
                variant="secondary-pill-icon"
                icon={Camera}
                onClick={() => setIsScannerOpen(true)}
              />
            </Stack>

            <Stack direction="row" align="center" gap={2.5}>
              <ViewModeToggle value={viewMode} onChange={onViewModeChange} />
              <Button
                variant="secondary-pill-icon"
                icon={ShoppingCart}
                onClick={onOpenCart}
              />
            </Stack>
          </Stack>
        </Box>

        {searchMounted && (
          <Box
            position="absolute"
            top={0}
            left={0}
            right={0}
            w="full"
            h="h-10"
            animation={searchAnimation}
          >
            <Stack direction="row" align="center" gap={2.5} w="full">
              <Box flex="1" padding={0}>
                <Input
                  ref={searchInputRef}
                  placeholder="Pesquisar produto pelo nome..."
                  value={searchQuery}
                  onChange={(e) => onSearchQueryChange(e.target.value)}
                  icon={Search}
                />
              </Box>
              <Button
                variant="outline-pill-icon-xs"
                icon={X}
                onClick={closeSearch}
              />
            </Stack>
          </Box>
        )}
      </Box>

      <ProductBarcodeScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScan={onBarcodeScanned}
      />
    </>
  )
}
