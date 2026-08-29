import * as React from "react"
import { cn } from "@/lib/utils"
import { ChevronDown, LucideIcon } from "lucide-react"
import { UI_STRINGS } from "@/constants/strings"

export interface CustomSelectItemProps {
  value: string
  text: string
  icon?: LucideIcon
  onClick?: () => void
}

interface CustomSelectContextType {
  selectedValue?: string
  onSelect: (value: string) => void
}

const CustomSelectContext = React.createContext<CustomSelectContextType | null>(null)

export const CustomSelectItem: React.FC<CustomSelectItemProps> = ({
  value,
  text,
  icon: IconComponent,
  onClick,
}) => {
  const context = React.useContext(CustomSelectContext)
  if (!context) {
    throw new Error("CustomSelectItem must be used within a CustomSelect")
  }
  const isActive = context.selectedValue === value

  const handleClick = () => {
    context.onSelect(value)
    if (onClick) onClick()
  }

  return (
    <button
      type="button"
      role="option"
      aria-selected={isActive}
      onClick={handleClick}
      className={cn(
        "flex w-full items-center gap-2.5 px-5 py-2.5 text-sm text-left text-foreground transition-colors hover:bg-surface-sunken",
        isActive && "bg-brand-primary/10 text-brand-primary font-semibold"
      )}
    >
      {IconComponent && <IconComponent size={16} className="shrink-0" />}
      <span>{text}</span>
    </button>
  )
}
CustomSelectItem.displayName = "CustomSelectItem"

export interface CustomSelectProps {
  children?: React.ReactNode
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
  hasError?: boolean
  id?: string
  emptyText?: string
  emptyIcon?: LucideIcon
  variant?: "default" | "outlined-label"
  label?: string
}

export const CustomSelect = React.forwardRef<HTMLDivElement, CustomSelectProps>(
  (
    {
      children,
      value,
      onChange,
      placeholder = "Selecione...",
      disabled,
      hasError,
      id,
      emptyText,
      emptyIcon: EmptyIcon,
      variant = "default",
      label,
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = React.useState(false)
    const containerRef = React.useRef<HTMLDivElement>(null)

    // Close on outside click
    React.useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          setIsOpen(false)
        }
      }
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const handleSelect = (optionValue: string) => {
      onChange?.(optionValue)
      setIsOpen(false)
    }

    const childrenArray = React.Children.toArray(children) as React.ReactElement<CustomSelectItemProps>[]

    const selectedChild = childrenArray.find(
      (child) => React.isValidElement(child) && child.props.value === value
    )

    const SelectedIcon = selectedChild ? selectedChild.props.icon : null
    const selectedLabel = selectedChild ? selectedChild.props.text : placeholder

    const isOutlined = variant === "outlined-label"

    const triggerNode = (
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          "flex w-full items-center justify-between text-sm text-foreground transition-colors focus:outline-none",
          isOutlined
            ? "px-2.5 py-1 min-h-[36px] bg-transparent border-none shadow-none"
            : "min-h-[40px] rounded-[5px] border-2 border-border bg-surface px-5 py-2 focus:border-brand-primary",
          !isOutlined && hasError && "border-brand-danger focus:border-brand-danger",
          !isOutlined && isOpen && "border-brand-primary"
        )}
      >
        <span className="flex items-center gap-2.5 text-left">
          {SelectedIcon && <SelectedIcon size={16} className="text-brand-primary shrink-0" />}
          <span className={cn(!selectedChild && "text-text-muted")}>
            {selectedLabel}
          </span>
        </span>
        <span
          className={cn(
            "ml-2.5 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        >
          <ChevronDown size={16} />
        </span>
      </button>
    )

    return (
      <CustomSelectContext.Provider value={{ selectedValue: value, onSelect: handleSelect }}>
        <div
          ref={(node) => {
            containerRef.current = node
            if (typeof ref === "function") ref(node)
            else if (ref) ref.current = node
          }}
          id={id}
          className={cn(
            "relative w-full select-none",
            disabled && "pointer-events-none opacity-50"
          )}
        >
          {/* Trigger */}
          {isOutlined ? (
            <div
              className={cn(
                "relative flex items-center w-full rounded-[5px] border-2 bg-white px-3 py-1.5 mt-2 transition-colors focus-within:border-brand-primary",
                hasError ? "border-brand-danger" : isOpen ? "border-brand-primary" : "border-border"
              )}
            >
              {label && (
                <span className="absolute -top-2.5 left-2.5 px-1 bg-white text-xs font-normal text-text-muted z-10 leading-none pointer-events-none select-none">
                  {label}
                </span>
              )}
              {triggerNode}
            </div>
          ) : (
            triggerNode
          )}

          {/* Dropdown */}
          {isOpen && (
            <div
              role="listbox"
              className={cn(
                "absolute z-50 mt-1 w-full rounded-[5px] border-2 border-border bg-surface shadow-lg overflow-hidden"
              )}
            >
              <div className="max-h-60 overflow-y-auto">
                {childrenArray.length > 0 ? (
                  children
                ) : (
                  <div className="flex items-center justify-center gap-2.5 px-5 py-5 text-sm text-text-muted">
                    {EmptyIcon && <EmptyIcon size={16} className="shrink-0 text-text-muted" />}
                    <span>{emptyText || UI_STRINGS.common.noResultsFound}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </CustomSelectContext.Provider>
    )
  }
)
CustomSelect.displayName = "CustomSelect"
