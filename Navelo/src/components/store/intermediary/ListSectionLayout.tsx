"use client"

/* eslint-disable max-lines-per-function */

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Button } from "@/components/store/base/Button"
import { EmptyState } from "@/components/store/intermediary/EmptyState"
import { MobileHeaderSearch } from "@/components/store/intermediary/PdvCatalogToolbar"
import { Plus, FolderOpen, type LucideIcon } from "lucide-react"

export interface ListSectionLayoutProps<T> {
  title: string
  items: T[]
  searchPlaceholder?: string
  searchFilterFn: (item: T, query: string) => boolean
  onAdd?: () => void
  renderItem: (item: T, idx: number) => React.ReactNode
  getItemKey?: (item: T, idx: number) => string | number

  // Empty State Customization
  emptyIcon?: LucideIcon
  emptyTitle?: string
  emptySubtitle?: string

  // Header Injection Handlers
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
  setCustomActions?: (actions: React.ReactNode | null) => void
  onBackToDashboard?: () => void
}

export function ListSectionLayout<T>({
  title,
  items,
  searchPlaceholder = "Buscar...",
  searchFilterFn,
  onAdd,
  renderItem,
  getItemKey,
  emptyIcon = FolderOpen,
  emptyTitle = "Nenhum item encontrado",
  emptySubtitle = "Tente pesquisar por outro termo ou adicione um novo registro.",
  setCustomBack,
  setCustomTitle,
  setCustomActions,
  onBackToDashboard
}: ListSectionLayoutProps<T>) {
  const [searchQuery, setSearchQuery] = React.useState("")

  const setCustomBackRef = React.useRef(setCustomBack)
  const setCustomTitleRef = React.useRef(setCustomTitle)
  const setCustomActionsRef = React.useRef(setCustomActions)
  const onBackToDashboardRef = React.useRef(onBackToDashboard)

  React.useEffect(() => {
    setCustomBackRef.current = setCustomBack
    setCustomTitleRef.current = setCustomTitle
    setCustomActionsRef.current = setCustomActions
    onBackToDashboardRef.current = onBackToDashboard
  }, [setCustomBack, setCustomTitle, setCustomActions, onBackToDashboard])

  React.useEffect(() => {
    setCustomTitleRef.current?.(title)
    if (onBackToDashboardRef.current) {
      const cb = onBackToDashboardRef.current
      setCustomBackRef.current?.(() => cb)
    } else {
      setCustomBackRef.current?.(null)
    }

    setCustomActionsRef.current?.(
      <MobileHeaderSearch
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        placeholder={searchPlaceholder}
      />
    )

    return () => {
      setCustomBackRef.current?.(null)
      setCustomTitleRef.current?.(null)
      setCustomActionsRef.current?.(null)
    }
  }, [title, searchQuery, searchPlaceholder])

  const filteredItems = React.useMemo(() => {
    if (!searchQuery.trim()) return items
    return items.filter(item => searchFilterFn(item, searchQuery))
  }, [items, searchQuery, searchFilterFn])

  return (
    <Box flex="1" minH="0" h="full" overflowY="auto" w="full" position="relative">
      <Stack gap={5} w="full">
        {filteredItems.length > 0 ? (
          <Box display="flex" direction="col" w="full">
            {filteredItems.map((item, idx) => (
              <Box key={getItemKey ? getItemKey(item, idx) : idx}>
                {renderItem(item, idx)}
                {idx < filteredItems.length - 1 && (
                  <Box h="h-[2px]" w="full" bg="bg-border" />
                )}
              </Box>
            ))}
          </Box>
        ) : (
          <EmptyState
            icon={emptyIcon}
            title={emptyTitle}
            subtitle={emptySubtitle}
          />
        )}

        {onAdd && (
          <Box className="fab-fixed-bottom-right">
            <Button
              variant="secondary-pill-icon"
              icon={Plus}
              onClick={onAdd}
              type="button"
            />
          </Box>
        )}
      </Stack>
    </Box>
  )
}
