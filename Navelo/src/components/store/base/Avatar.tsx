import * as React from "react"
import { cn } from "@/lib/utils"

export interface AvatarProps {
  image?: string
  fallback: string
  className?: string
}

export function Avatar({ image, fallback, className }: AvatarProps) {
  return (
    <div className={cn("h-10 w-10 rounded-full bg-surface-sunken flex-shrink-0 flex items-center justify-center overflow-hidden border border-border", className)}>
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image} alt={fallback} className="h-full w-full object-cover" />
      ) : (
        <span className="text-brand-primary font-bold text-xs uppercase">
          {fallback}
        </span>
      )}
    </div>
  )
}
