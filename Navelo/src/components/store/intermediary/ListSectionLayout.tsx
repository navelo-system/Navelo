"use client"

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
  emptyIcon?: LucideIcon
  emptyTitle?: string
  emptySubtitle?: string
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
  setCustomActions?: (actions: React.ReactNode | null) => void
  onBackToDashboard?: () => void
}

interface ItemsListContainerProps<T> {
  items: T[]
  renderItem: (item: T, idx: number) => React.ReactNode
  getItemKey?: (item: T, idx: number) => string | number
  emptyIcon: LucideIcon
  emptyTitle: string
  emptySubtitle: string
}

function ItemsListContainer<T>({
  items,
  renderItem,
  getItemKey,
  emptyIcon,
  emptyTitle,
  emptySubtitle,
}: ItemsListContainerProps<T>) {
  if (items.length === 0) {
    return (
      <EmptyState
        icon={emptyIcon}
        title={emptyTitle}
        subtitle={emptySubtitle}
      />
    )
  }

  return (
    <Box display="flex" direction="col" w="full">
      {items.map((item, idx) => (
        <Box key={getItemKey ? getItemKey(item, idx) : idx}>
          {renderItem(item, idx)}
          {idx < items.length - 1 && (
            <Box h="h-[2px]" w="full" bg="bg-border" />
          )}
        </Box>
      ))}
    </Box>
  )
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
  onBackToDashboard,
}: ListSectionLayoutProps<T>) {
  const [searchQuery, setSearchQuery] = React.useState("")

  const onBackToDashboardRef = React.useRef(onBackToDashboard)
  const setCustomBackRef = React.useRef(setCustomBack)
  const setCustomTitleRef = React.useRef(setCustomTitle)
  const setCustomActionsRef = React.useRef(setCustomActions)

  React.useEffect(() => {
    onBackToDashboardRef.current = onBackToDashboard
    setCustomBackRef.current = setCustomBack
    setCustomTitleRef.current = setCustomTitle
    setCustomActionsRef.current = setCustomActions
  })

  React.useEffect(() => {
    return () => {
      setCustomBackRef.current?.(null)
      setCustomTitleRef.current?.(null)
      setCustomActionsRef.current?.(null)
    }
  }, [])

  React.useEffect(() => {
    setCustomTitleRef.current?.(title)
    if (onBackToDashboardRef.current) {
      setCustomBackRef.current?.(() => onBackToDashboardRef.current!)
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
  }, [title, searchQuery, searchPlaceholder])

  const filteredItems = React.useMemo(() => {
    if (!searchQuery.trim()) return items
    return items.filter((item) => searchFilterFn(item, searchQuery))
  }, [items, searchQuery, searchFilterFn])

  return (
    <Box flex="1" minH="0" h="full" overflowY="auto" w="full" position="relative">
      <Stack gap={5} w="full">
        <ItemsListContainer
          items={filteredItems}
          renderItem={renderItem}
          getItemKey={getItemKey}
          emptyIcon={emptyIcon}
          emptyTitle={emptyTitle}
          emptySubtitle={emptySubtitle}
        />

        {onAdd && (
          <Box position="fixed" bottom="24px" right="24px" zIndex="30">
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
