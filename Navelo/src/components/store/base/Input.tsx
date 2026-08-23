import * as React from "react"
import { cn } from "@/lib/utils"
import { Font } from "./Font"
import { Stack } from "./Stack"
import { LucideIcon, Eye, EyeOff, Calendar } from "lucide-react"
import { maskCPF, maskCNPJ, maskPhone, maskDate, maskCEP, maskCpfCnpj, maskCurrency, maskPercent } from "@/lib/masks"
import { DatePickerModal } from "./DatePickerModal"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: "default" | "cpf" | "cnpj" | "cpf-cnpj" | "phone" | "date" | "cep" | "email" | "image-upload" | "outlined-label" | "outlined-label-centered" | "bordered" | "textarea" | "currency" | "percent"
  mask?: "cpf" | "cnpj" | "cpf-cnpj" | "phone" | "date" | "cep" | "currency" | "percent"
  hasError?: boolean
  label?: string
  description?: string
  error?: string
  icon?: LucideIcon
  iconRight?: LucideIcon
  onIconRightClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  rows?: number
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant = "default", mask, hasError, label, description, error, icon: IconComponent, iconRight: IconRightComponent, onIconRightClick, rows, onChange, onClick, ...props }, ref) => {
    
    const [showPassword, setShowPassword] = React.useState(false)
    const [isDatePickerOpen, setIsDatePickerOpen] = React.useState(false)
    const internalRef = React.useRef<HTMLInputElement | null>(null)
    const isPassword = type === "password"

    const activeMask = mask || (variant === "currency" || variant === "percent" || variant === "cpf" || variant === "cnpj" || variant === "cpf-cnpj" || variant === "phone" || variant === "date" || variant === "cep" ? variant : undefined)
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (activeMask === "cpf") e.target.value = maskCPF(e.target.value)
      else if (activeMask === "cnpj") e.target.value = maskCNPJ(e.target.value)
      else if (activeMask === "cpf-cnpj") e.target.value = maskCpfCnpj(e.target.value)
      else if (activeMask === "phone") e.target.value = maskPhone(e.target.value)
      else if (activeMask === "date") e.target.value = maskDate(e.target.value)
      else if (activeMask === "cep") e.target.value = maskCEP(e.target.value)
      else if (activeMask === "currency") e.target.value = maskCurrency(e.target.value)
      else if (activeMask === "percent") e.target.value = maskPercent(e.target.value)
      
      onChange?.(e)
    }

    const inputType = isPassword 
      ? (showPassword ? "text" : "password") 
      : (variant === "date" ? "text" : variant === "email" ? "email" : type)
    const placeholder = 
      variant === "date" && !props.placeholder ? "DD/MM/AAAA"
      : (activeMask === "currency") && !props.placeholder ? "R$ 0,00"
      : (activeMask === "percent") && !props.placeholder ? "% 0,00"
      : props.placeholder

    if (variant === "textarea") {
      const textareaElement = (
        <textarea
          placeholder={placeholder}
          rows={rows || 4}
          onChange={onChange as unknown as React.ChangeEventHandler<HTMLTextAreaElement>}
          className={cn(
            "flex w-full rounded-[5px] border-2 border-border bg-white p-3.5 text-sm text-foreground placeholder:text-text-muted focus:outline-none focus:border-brand-primary disabled:cursor-not-allowed disabled:opacity-50 transition-colors resize-none",
            (hasError || error) && "border-brand-danger focus:border-brand-danger",
            className
          )}
          ref={ref as unknown as React.Ref<HTMLTextAreaElement>}
          {...(props as unknown as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      )

      if (!label && !description && !error) {
        return textareaElement
      }

      return (
        <Stack gap={2.5} className="w-full">
          {(label || description) && (
            <Stack gap={1}>
              {label && <Font variant="sub-tiny-bold" text={label} />}
              {description && <Font variant="description" text={description} />}
            </Stack>
          )}
          {textareaElement}
          {error && <Font variant="auxiliary" color="danger" text={error} />}
        </Stack>
      )
    }

    if (variant === "image-upload") {
      const dropzoneElement = (
        <label className={cn(
          "relative flex flex-col items-center justify-center w-full min-h-[120px] rounded-[5px] border-2 border-dashed border-brand-primary/30 bg-brand-primary/10 text-brand-primary hover:bg-brand-primary/20 transition-colors cursor-pointer focus-within:outline-none focus-within:border-brand-primary",
          (hasError || error) && "border-brand-danger text-brand-danger focus-within:border-brand-danger",
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

    const isOutlined = variant === "outlined-label" || variant === "outlined-label-centered"
    const isCentered = variant === "outlined-label-centered"
    const isBordered = variant === "bordered"

    const inputElement = (
      <div className={cn(
        "relative flex items-center w-full",
        isOutlined && "rounded-[5px] border-2 border-border bg-white px-3 py-2.5 mt-2 transition-colors focus-within:border-brand-primary",
        isBordered && "rounded-[5px] border-2 border-border bg-surface px-5 py-2 min-h-[40px] transition-colors focus-within:border-brand-primary"
      )}>
        {isOutlined && label && (
          <span className={cn(
            "absolute -top-2.5 px-1 bg-white text-xs font-normal text-text-muted z-10 leading-none pointer-events-none whitespace-nowrap select-none",
            isCentered ? "left-1/2 -translate-x-1/2" : "left-2.5"
          )}>
            {label}
          </span>
        )}
        {IconComponent && (
          <div className={cn("absolute flex items-center justify-center pointer-events-none text-text-muted", (isOutlined || isBordered) ? "left-3" : "left-1")}>
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
            isOutlined
              ? cn(
                  "flex h-6 w-full rounded-none border-0 bg-transparent px-1 text-sm text-foreground placeholder:text-text-muted focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50",
                  isCentered && "text-center"
                )
              : isBordered
              ? "flex h-6 w-full rounded-none border-0 bg-transparent px-0 text-sm text-foreground placeholder:text-text-muted focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50"
              : "flex h-10 w-full rounded-none border-0 border-b-2 border-b-border bg-transparent px-1 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-text-muted focus:outline-none focus:border-b-brand-primary focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
            IconComponent && (isBordered ? "pl-7" : isOutlined ? "pl-7" : "pl-7"),
            (EffectiveIconRight || isPassword) && "pr-7",
            (hasError || error) && (isOutlined || isBordered ? "border-brand-danger" : "border-b-brand-danger focus:border-b-brand-danger"),
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
              } else if (onIconRightClick) {
                onIconRightClick(e)
              }
            }}
            className={cn(
              "absolute flex items-center justify-center text-text-muted hover:text-foreground focus:outline-none",
              (isOutlined || isBordered) ? "right-3" : "right-1",
              (isPassword || variant === "date" || Boolean(onIconRightClick)) ? "cursor-pointer" : "pointer-events-none"
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

    if (isBordered || isOutlined || (!label && !description && !error)) {
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
