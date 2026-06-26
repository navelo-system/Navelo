import * as React from "react"
import Image from "next/image"

export interface LogoProps {
  variant?: "default" | "inverse" | "icon"
  width?: number
  height?: number
}

export function Logo({ variant = "default", width, height }: LogoProps) {
  let src = "/logo-default.svg"
  let defaultWidth = 120
  let defaultHeight = 30

  if (variant === "inverse") {
    src = "/logo-inverse.svg"
  } else if (variant === "icon") {
    src = "/logo-icon.svg"
    defaultWidth = 40
    defaultHeight = 40
  }

  return (
    <Image 
      src={src} 
      alt={`Navelo Logo ${variant}`} 
      width={width || defaultWidth} 
      height={height || defaultHeight} 
      priority
    />
  )
}
