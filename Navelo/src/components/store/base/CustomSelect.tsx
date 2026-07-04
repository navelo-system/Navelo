import * as React from "react"
import { cn } from "@/lib/utils"
import { ChevronDown, LucideIcon } from "lucide-react"

export interface CustomSelectItemProps {
  value: string
  text: string
  icon: LucideIcon
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
      <IconComponent size={16} className="shrink-0" />
      <span>{text}</span>
    </button>
  )
}
CustomSelectItem.displayName = "CustomSelectItem"

export interface CustomSelectProps {
  children: React.ReactElement<CustomSelectItemProps> | React.ReactElement<CustomSelectItemProps>[]
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
  hasError?: boolean
  id?: string
}

export const CustomSelect = React.forwardRef<HTMLDivElement, CustomSelectProps>(
  ({ children, value, onChange, placeholder = "Selecione...", disabled, hasError, id }, ref) => {
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

    // Validate that all children are CustomSelectItem components
    React.Children.forEach(children, (child) => {
      if (React.isValidElement(child)) {
        if (child.type !== CustomSelectItem) {
          throw new Error("CustomSelect only accepts CustomSelectItem as children")
        }
      } else {
        throw new Error("Invalid child detected in CustomSelect. Only CustomSelectItem is allowed.")
      }
    })

    const selectedChild = childrenArray.find(
      (child) => React.isValidElement(child) && child.props.value === value
    )

    const SelectedIcon = selectedChild ? selectedChild.props.icon : null
    const selectedLabel = selectedChild ? selectedChild.props.text : placeholder

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
          <button
            type="button"
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            onClick={() => setIsOpen((prev) => !prev)}
            className={cn(
              "flex h-10 w-full items-center justify-between rounded-[5px] border-2 border-border bg-surface px-5 py-0 text-sm text-foreground transition-colors focus:outline-none focus:border-brand-primary",
              hasError && "border-brand-danger focus:border-brand-danger",
              isOpen && "border-brand-primary"
            )}
          >
            <span className="flex items-center gap-2.5">
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

          {/* Dropdown */}
          {isOpen && (
            <div
              role="listbox"
              className={cn(
                "absolute z-50 mt-1 w-full rounded-[5px] border-2 border-border bg-surface shadow-lg overflow-hidden"
              )}
            >
              <div className="max-h-60 overflow-y-auto">
                {children}
              </div>
            </div>
          )}
        </div>
      </CustomSelectContext.Provider>
    )
  }
)
CustomSelect.displayName = "CustomSelect"
