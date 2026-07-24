import * as React from "react"

export interface ColorDotProps {
  color: string
  size?: "sm" | "md" | "lg"
}

export const ColorDot: React.FC<ColorDotProps> = ({ color, size = "md" }) => {
  const sizeClasses = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-7 h-7",
  }

  return (
    <div
      className={`rounded-full shrink-0 ${sizeClasses[size]}`}
      style={{ backgroundColor: color }}
    />
  )
}
