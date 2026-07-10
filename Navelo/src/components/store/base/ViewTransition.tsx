/* eslint-disable react-hooks/set-state-in-effect */
"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface ViewTransitionProps {
  children: React.ReactNode
  viewKey: string
  className?: string
}

/**
 * ViewTransition — envolve uma view e aplica animação de entrada (pop + fade)
 * toda vez que `viewKey` muda. Usa double requestAnimationFrame para garantir
 * que o browser pinte o estado inicial antes de animar.
 *
 * Uso:
 *   <ViewTransition viewKey={currentView}>
 *     {children}
 *   </ViewTransition>
 */
export const ViewTransition: React.FC<ViewTransitionProps> = ({ children, viewKey, className }) => {
  const [isActive, setIsActive] = React.useState(false)
  // animDone: quando true, remove o transform para eliminar o stacking context
  // que impediria elementos position:fixed (modais) de cobrirem a viewport inteira
  const [animDone, setAnimDone] = React.useState(false)

  React.useEffect(() => {
    setIsActive(false)
    setAnimDone(false)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsActive(true)
      })
    })
  }, [viewKey])

  const style: React.CSSProperties = {
    opacity: isActive ? 1 : 0,
    // Remove transform quando animação completa — scale(1) e sem transform são
    // visualmente idênticos, mas sem transform não há stacking context
    transform: animDone ? undefined : (isActive ? "scale(1) translateY(0)" : "scale(0.97) translateY(6px)"),
    transition: (isActive && !animDone)
      ? "opacity 0.22s ease, transform 0.28s cubic-bezier(0.34, 1.2, 0.64, 1)"
      : "none",
    width: "100%"
  }

  return (
    <div
      style={style}
      className={cn(className)}
      onTransitionEnd={(e) => {
        // Garante que só processa quando a transição principal (transform) completou
        if (e.propertyName === "transform" && isActive) {
          setAnimDone(true)
        }
      }}
    >
      {children}
    </div>
  )
}
