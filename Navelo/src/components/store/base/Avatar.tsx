import * as React from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

export interface AvatarProps {
  image?: string
  fallback: string
  className?: string
}

export function Avatar({ image, fallback, className }: AvatarProps) {
  return (
    <div
      className={cn(
        "relative h-10 w-10 rounded-full bg-surface-sunken flex-shrink-0 flex items-center justify-center overflow-hidden border border-border",
        className
      )}
    >
      {image ? (
        <Image
          src={image}
          alt={fallback}
          fill
          unoptimized
          sizes="40px"
          className="object-cover"
        />
      ) : (
        <span className="text-brand-primary font-bold text-xs uppercase">
          {fallback}
        </span>
      )}
    </div>
  )
}
