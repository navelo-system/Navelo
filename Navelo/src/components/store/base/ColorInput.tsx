import * as React from "react"

export interface ColorInputProps {
  value: string
  onChange: (val: string) => void
}

export const ColorInput: React.FC<ColorInputProps> = ({ value, onChange }) => {
  return (
    <input
      type="color"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-7 h-7 rounded-full cursor-pointer border border-slate-300 p-0 bg-transparent shrink-0"
    />
  )
}
