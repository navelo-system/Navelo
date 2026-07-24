import * as React from "react"
import { cn } from "@/lib/utils"
import { Font } from "./Font"
import { Stack } from "./Stack"
import { LucideIcon, Eye, EyeOff, Calendar } from "lucide-react"
import { maskCPF, maskCNPJ, maskPhone, maskDate, maskCEP } from "@/lib/masks"
import { DatePickerModal } from "./DatePickerModal"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: "default" | "cpf" | "cnpj" | "phone" | "date" | "cep" | "email" | "image-upload"
  hasError?: boolean
  label?: string
  description?: string
  error?: string
  icon?: LucideIcon
  iconRight?: LucideIcon
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant = "default", hasError, label, description, error, icon: IconComponent, iconRight: IconRightComponent, onChange, onClick, ...props }, ref) => {
    
    const [showPassword, setShowPassword] = React.useState(false)
    const [isDatePickerOpen, setIsDatePickerOpen] = React.useState(false)
    const internalRef = React.useRef<HTMLInputElement | null>(null)
    const isPassword = type === "password"

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (variant === "cpf") e.target.value = maskCPF(e.target.value)
      else if (variant === "cnpj") e.target.value = maskCNPJ(e.target.value)
      else if (variant === "phone") e.target.value = maskPhone(e.target.value)
      else if (variant === "date") e.target.value = maskDate(e.target.value)
      else if (variant === "cep") e.target.value = maskCEP(e.target.value)
      
      onChange?.(e)
    }

    const inputType = isPassword 
      ? (showPassword ? "text" : "password") 
      : (variant === "date" ? "text" : variant === "email" ? "email" : type)
    const placeholder = variant === "date" && !props.placeholder ? "DD/MM/AAAA" : props.placeholder

    if (variant === "image-upload") {
      const dropzoneElement = (
        <label className={cn(
          "relative flex flex-col items-center justify-center w-full min-h-[120px] rounded-[5px] border-2 border-dashed border-brand-primary/30 bg-brand-primary/10 text-brand-primary hover:bg-brand-primary/20 transition-colors cursor-pointer focus-within:outline-none focus-within:border-brand-primary",
          (hasError || error) && "border-red-500 text-red-500 focus-within:border-red-500",
          className
        )}>
          <input type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer outline-none" onChange={onChange} ref={ref} {...props} />
          <Stack gap={2.5} align="center">
            {IconComponent && <IconComponent size={24} className="text-brand-primary" />}
            {placeholder && <Font variant="description" color="inherit" text={placeholder} />}
          </Stack>
        </label>
      )

      if (!label && !description && !error) {
        return dropzoneElement
      }

      return (
        <Stack gap={2.5} className="w-full">
          {(label || description) && (
            <Stack gap={1}>
              {label && <Font variant="sub-tiny-bold" text={label} />}
              {description && <Font variant="description" text={description} />}
            </Stack>
          )}
          {dropzoneElement}
          {error && <Font variant="auxiliary" color="danger" text={error} />}
        </Stack>
      )
    }

    const EffectiveIconRight = variant === "date" ? (IconRightComponent || Calendar) : IconRightComponent
    const currentVal = String(props.value ?? props.defaultValue ?? "")

    const handleSelectDateFromModal = (formattedDate: string) => {
      const targetInput = internalRef.current
      if (targetInput) {
        targetInput.value = formattedDate
      }
      const syntheticEvent = {
        target: { value: formattedDate },
        currentTarget: { value: formattedDate },
      } as React.ChangeEvent<HTMLInputElement>
      onChange?.(syntheticEvent)
    }

    const inputElement = (
      <div className="relative flex items-center w-full">
        {IconComponent && (
          <div className="absolute left-1 flex items-center justify-center pointer-events-none text-text-muted">
            <IconComponent size={16} />
          </div>
        )}
        <input
          type={inputType}
          placeholder={placeholder}
          onChange={handleChange}
          onClick={(e) => {
            if (variant === "date") {
              setIsDatePickerOpen(true)
            }
            onClick?.(e)
          }}
          className={cn(
            "flex h-10 w-full rounded-none border-0 border-b-2 border-b-border bg-transparent px-1 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-text-muted focus:outline-none focus:border-b-brand-primary focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
            IconComponent && "pl-7",
            (EffectiveIconRight || isPassword) && "pr-7",
            (hasError || error) && "border-b-red-500 focus:border-b-red-500",
            className
          )}
          ref={(node) => {
            internalRef.current = node
            if (typeof ref === "function") ref(node)
            else if (ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = node
          }}
          {...props}
        />
        {(EffectiveIconRight || isPassword) && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              if (isPassword) {
                setShowPassword(prev => !prev)
              } else if (variant === "date") {
                setIsDatePickerOpen(true)
              }
            }}
            className={cn(
              "absolute right-1 flex items-center justify-center text-text-muted hover:text-foreground focus:outline-none",
              (isPassword || variant === "date") ? "cursor-pointer" : "pointer-events-none"
            )}
          >
            {isPassword ? (
              showPassword ? <EyeOff size={16} /> : <Eye size={16} />
            ) : (
              EffectiveIconRight && <EffectiveIconRight size={16} />
            )}
          </button>
        )}

        {variant === "date" && (
          <DatePickerModal
            isOpen={isDatePickerOpen}
            onClose={() => setIsDatePickerOpen(false)}
            initialDateString={currentVal}
            onSelectDate={handleSelectDateFromModal}
          />
        )}
      </div>
    )

    if (!label && !description && !error) {
      return inputElement
    }

    return (
      <Stack gap={2.5} className="w-full">
        {(label || description) && (
          <Stack gap={1}>
            {label && <Font variant="sub-tiny-bold" text={label} />}
            {description && <Font variant="description" text={description} />}
          </Stack>
        )}
        {inputElement}
        {error && <Font variant="auxiliary" color="danger" text={error} />}
      </Stack>
    )
  }
)
Input.displayName = "Input"
