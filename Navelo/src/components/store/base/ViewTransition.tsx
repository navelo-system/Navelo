/* eslint-disable react-hooks/set-state-in-effect */
"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface ViewTransitionProps {
  children: React.ReactNode
  viewKey: string
  className?: string
  flex?: "1" | "auto" | "none"
  direction?: "col" | "row"
  minH?: "0" | "full"
  overflow?: "hidden" | "auto" | "x-hidden y-auto"
}

/**
 * ViewTransition — envolve uma view e aplica animação de entrada (pop + fade)
 * toda vez que `viewKey` muda. Usa double requestAnimationFrame para garantir
 * que o browser pinte o estado inicial antes de animar.
 */
export const ViewTransition: React.FC<ViewTransitionProps> = ({ children, viewKey, className, flex, direction, minH, overflow }) => {
  const [isActive, setIsActive] = React.useState(false)
  const [animDone, setAnimDone] = React.useState(false)

  React.useEffect(() => {
    setIsActive(false)
    setAnimDone(false)
    let raf2: number
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        setIsActive(true)
      })
    })
    return () => {
      cancelAnimationFrame(raf1)
      if (raf2) cancelAnimationFrame(raf2)
    }
  }, [viewKey])

  const style: React.CSSProperties = {
    opacity: isActive ? 1 : 0,
    transform: animDone
      ? undefined
      : (isActive ? "scale(1) translateY(0)" : "scale(0.98) translateY(6px)"),
    transition: (isActive && !animDone)
      ? "opacity 0.24s cubic-bezier(0.16, 1, 0.3, 1), transform 0.28s cubic-bezier(0.16, 1, 0.3, 1)"
      : "none",
    width: "100%"
  }

  return (
    <div
      style={style}
      className={cn(
        flex === "1" && "flex-1 flex flex-col min-h-0",
        flex === "auto" && "flex-auto",
        flex === "none" && "flex-none",
        direction === "col" && "flex flex-col",
        direction === "row" && "flex flex-row",
        minH === "0" && "min-h-0",
        minH === "full" && "min-h-full",
        overflow === "hidden" && "overflow-hidden",
        overflow === "auto" && "overflow-auto",
        overflow === "x-hidden y-auto" && "overflow-x-hidden overflow-y-auto",
        className
      )}
      onTransitionEnd={(e) => {
        if (e.propertyName === "transform" && isActive) {
          setAnimDone(true)
        }
      }}
    >
      {children}
    </div>
  )
}

