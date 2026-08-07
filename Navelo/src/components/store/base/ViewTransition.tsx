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
 * ViewTransition — envolve uma view e aplica transição suave de entrada por opacidade
 * toda vez que `viewKey` muda. Usa opacidade pura (sem transform no container root)
 * para garantir que elementos position: fixed (como FABs) permaneçam perfeitamente
 * ancorados na tela durante a transição sem causar glitches.
 */
export const ViewTransition: React.FC<ViewTransitionProps> = ({ children, viewKey, className, flex, direction, minH, overflow }) => {
  const [isActive, setIsActive] = React.useState(false)

  React.useEffect(() => {
    setIsActive(false)
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
    transition: isActive ? "opacity 0.22s cubic-bezier(0.16, 1, 0.3, 1)" : "none",
    width: "100%",
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
    >
      {children}
    </div>
  )
}
