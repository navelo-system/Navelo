"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface TabsContextValue {
  value: string
  onValueChange: (value: string) => void
}

const TabsContext = React.createContext<TabsContextValue | null>(null)

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  className?: string
  children: React.ReactNode
}

export function Tabs({
  value,
  defaultValue = "",
  onValueChange,
  className,
  children,
  ...props
}: TabsProps) {
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue)
  const isControlled = value !== undefined
  const currentTab = isControlled ? value : uncontrolledValue

  const handleValueChange = React.useCallback(
    (newValue: string) => {
      if (!isControlled) {
        setUncontrolledValue(newValue)
      }
      onValueChange?.(newValue)
    },
    [isControlled, onValueChange]
  )

  const contextValue = React.useMemo(
    () => ({ value: currentTab, onValueChange: handleValueChange }),
    [currentTab, handleValueChange]
  )

  return (
    <TabsContext.Provider value={contextValue}>
      <div className={cn("flex flex-col w-full", className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  )
}

export interface TabsListProps
  extends React.HTMLAttributes<HTMLDivElement> {
  grid?: boolean
  cols?: 2 | 3 | 4 | 5
}

export const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(
  ({ className, grid, cols, ...props }, ref) => {
    const gridColsMap: Record<number, string> = {
      2: "grid-cols-2",
      3: "grid-cols-3",
      4: "grid-cols-4",
      5: "grid-cols-5",
    }
    const gridClass = grid
      ? `grid w-full gap-2.5 ${gridColsMap[cols ?? 3] ?? "grid-cols-3"}`
      : "flex flex-wrap w-full items-center justify-start gap-2.5"

    return <div ref={ref} className={cn(gridClass, className)} {...props} />
  }
)
TabsList.displayName = "TabsList"

export interface TabsTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string
  fullWidth?: boolean
}

export const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ className, value, fullWidth, ...props }, ref) => {
    const context = React.useContext(TabsContext)
    if (!context) throw new Error("TabsTrigger must be used within Tabs")

    const isActive = context.value === value

    return (
      <button
        ref={ref}
        type="button"
        role="tab"
        aria-selected={isActive}
        data-state={isActive ? "active" : "inactive"}
        onClick={() => context.onValueChange(value)}
        className={cn(
          "shrink-0 inline-flex items-center justify-center whitespace-nowrap rounded-[20px] px-4 py-1.5 text-sm font-normal ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          isActive
            ? "bg-brand-primary text-brand-secondary"
            : "bg-brand-secondary/10 text-brand-primary hover:bg-brand-secondary/20",
          fullWidth && "w-full",
          className
        )}
        {...props}
      />
    )
  }
)
TabsTrigger.displayName = "TabsTrigger"

export interface TabsContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  value: string
}

export const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  ({ className, value, ...props }, ref) => {
    const context = React.useContext(TabsContext)
    if (!context) throw new Error("TabsContent must be used within Tabs")

    if (context.value !== value) return null

    return (
      <div
        ref={ref}
        role="tabpanel"
        data-state="active"
        className={cn(
          "mt-5 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2",
          className
        )}
        {...props}
      />
    )
  }
)
TabsContent.displayName = "TabsContent"
