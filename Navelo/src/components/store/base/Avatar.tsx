import * as React from "react"
import Image from "next/image"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export interface AvatarProps {
  image?: string
  fallback?: string
  icon?: LucideIcon
  variant?: "primary" | "secondary"
  className?: string
}

export function Avatar({
  image,
  fallback = "",
  icon: IconComponent,
  variant = "primary",
  className,
}: AvatarProps) {
  const isSecondary = variant === "secondary"
  const themeClasses = isSecondary
    ? "bg-brand-secondary/10 border-brand-secondary/30 text-brand-secondary"
    : "bg-brand-primary/10 border-brand-primary/30 text-brand-primary"

  return (
    <div
      className={cn(
        "relative h-10 w-10 rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden border",
        themeClasses,
        className
      )}
    >
      {image ? (
        <Image
          src={image}
          alt={fallback || "Avatar"}
          fill
          unoptimized
          sizes="40px"
          className="object-cover"
        />
      ) : IconComponent ? (
        <IconComponent size={20} />
      ) : (
        <span className="font-bold text-xs uppercase">
          {fallback}
        </span>
      )}
    </div>
  )
}
