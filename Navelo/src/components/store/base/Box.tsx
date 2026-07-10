import * as React from "react"
import { cn } from "@/lib/utils"

type PaddingToken = 5 | 12 | 2.5 | 1 | 0
type WidthToken = "full" | "screen" | "auto" | "fit-content" | "1/2" | "2/3" | "1/4"
type HeightToken = "full" | "screen" | "auto" | "fit-content"

export interface BoxProps extends Omit<React.AllHTMLAttributes<HTMLElement>, "as"> {
  as?: React.ElementType
  padding?: PaddingToken
  paddingX?: PaddingToken
  paddingY?: PaddingToken
  bg?: string
  bgGradient?: "fade-up"
  w?: WidthToken | string
  h?: HeightToken | string
  display?: "hidden lg:flex" | "flex" | "block" | "inline-flex" | "hidden" | "block md:hidden" | "hidden md:block"
  direction?: "col" | "row"
  justify?: "between" | "center" | "start" | "end"
  radius?: "default" | "full" | "none" | "lg"
  border?: boolean
  borderTop?: boolean
  borderBottom?: boolean
  borderLeft?: boolean
  borderRight?: boolean

  borderColor?: string
  overflow?: "hidden" | "auto" | "x-hidden y-auto"
  hoverBg?: "surface-sunken" | "primary/10" | "secondary/10"
  cursor?: "pointer"
  flex?: "1" | "auto" | "none"
  position?: "relative" | "absolute" | "fixed" | "sticky"
  top?: string | number
  left?: string | number
  right?: string | number
  bottom?: string | number
  zIndex?: "0" | "10" | "20" | "30" | "40" | "50" | "auto"
  pointerEvents?: "none" | "auto"
  minW?: string
  objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down"
  borderStyle?: "solid" | "dashed"
  shadow?: "default" | "inner" | "none"
  transition?: "all" | "opacity" | "transform" | "none"
  opacity?: "0" | "25" | "50" | "75" | "100"
  maxH?: "0" | "96" | "full" | "screen" | "fit-content"
  shrink?: "0" | "1"
  animation?: "slide-in-right" | "slide-out-right" | "slide-up" | "slide-down" | "search-expand-in" | "search-collapse-out"
  order?: "1" | "2"
  mdOrder?: "1" | "2"
}

const paddingMap: Record<string, string> = {
  "5": "p-6",
  "12": "p-12",
  "2.5": "p-2.5",
  "1": "p-1",
  "0": "p-0",
}

const paddingXMap: Record<string, string> = {
  "5": "px-6",
  "12": "px-12",
  "2.5": "px-2.5",
  "1": "px-1",
  "0": "px-0",
}

const paddingYMap: Record<string, string> = {
  "5": "py-6",
  "12": "py-12",
  "2.5": "py-2.5",
  "1": "py-1",
  "0": "py-0",
}

const widthMap: Record<string, string> = {
  "full": "w-full",
  "screen": "w-screen",
  "auto": "w-auto",
  "fit-content": "w-fit",
  "1/2": "w-1/2",
  "2/3": "w-2/3",
  "1/4": "w-1/4",
}

const heightMap: Record<string, string> = {
  "full": "h-full",
  "screen": "h-screen",
  "auto": "h-auto",
  "fit-content": "h-fit",
}

const displayMap = {
  "hidden lg:flex": "hidden lg:flex",
  "flex": "flex",
  "block": "block",
  "inline-flex": "inline-flex",
  "hidden": "hidden",
  "block md:hidden": "block md:hidden",
  "hidden md:block": "hidden md:block",
}

const directionMap = {
  "col": "flex-col",
  "row": "flex-row",
}

const justifyMap = {
  "between": "justify-between",
  "center": "justify-center",
  "start": "justify-start",
  "end": "justify-end",
}

const radiusMap = {
  "default": "rounded-[10px]",
  "full": "rounded-full",
  "none": "rounded-none",
  "lg": "rounded-[16px]",
}

const orderMap = {
  "1": "order-1",
  "2": "order-2",
}

const mdOrderMap = {
  "1": "md:order-1",
  "2": "md:order-2",
}

const overflowMap = {
  "hidden": "overflow-hidden",
  "auto": "overflow-auto",
  "x-hidden y-auto": "overflow-x-hidden overflow-y-auto"
}

const hoverBgMap = {
  "surface-sunken": "hover:bg-surface-sunken transition-colors",
  "primary/10": "hover:bg-brand-primary/10 transition-colors",
  "secondary/10": "hover:bg-brand-secondary/10 transition-colors"
}

const flexMap = {
  "1": "flex-1",
  "auto": "flex-auto",
  "none": "flex-none",
}

const zIndexMap = {
  "0": "z-0",
  "10": "z-10",
  "20": "z-20",
  "30": "z-30",
  "40": "z-40",
  "50": "z-50",
  "auto": "z-auto",
}

export const Box = React.forwardRef<HTMLElement, BoxProps>(
  ({ 
    as: Component = "div",
    className, padding, paddingX, paddingY, bg, bgGradient, w, h, 
    display, direction, justify, radius, border,
    borderTop, borderBottom, borderLeft, borderRight,
    borderColor, 
    borderStyle, shadow, transition, opacity, maxH, animation,
    overflow, hoverBg, cursor, flex, position, top, left, right, bottom, zIndex, pointerEvents, minW, objectFit, shrink,
    order, mdOrder, ...props 
  }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn(
          padding !== undefined && paddingMap[String(padding)],
          paddingX !== undefined && paddingXMap[String(paddingX)],
          paddingY !== undefined && paddingYMap[String(paddingY)],
          w && (widthMap[w] || w),
          h && (heightMap[h] || h),
          display && displayMap[display],
          direction && directionMap[direction],
          justify && justifyMap[justify],
          radius && radiusMap[radius],
          border && "border-2",
          borderTop && "border-t-2",
          borderBottom && "border-b-2",
          borderLeft && "border-l-2",
          borderRight && "border-r-2",
          order && orderMap[order],
          mdOrder && mdOrderMap[mdOrder],

          borderStyle === "dashed" && "border-dashed",
          borderStyle === "solid" && "border-solid",
          shadow === "default" && "shadow-md",
          shadow === "inner" && "shadow-inner",
          borderColor,
          overflow && overflowMap[overflow],
          hoverBg && hoverBgMap[hoverBg],
          cursor === "pointer" && "cursor-pointer",
          flex && flexMap[flex],
          position,
          zIndex && zIndexMap[zIndex],
          minW,
          objectFit && {
            "contain": "object-contain",
            "cover": "object-cover",
            "fill": "object-fill",
            "none": "object-none",
            "scale-down": "object-scale-down"
          }[objectFit],
          transition && {
            "all": "transition-all duration-300",
            "opacity": "transition-opacity duration-300",
            "transform": "transition-transform duration-300",
            "none": "transition-none"
          }[transition],
          opacity && {
            "0": "opacity-0",
            "25": "opacity-25",
            "50": "opacity-50",
            "75": "opacity-75",
            "100": "opacity-100",
          }[opacity],
          maxH && {
            "0": "max-h-0",
            "96": "max-h-[384px]",
            "full": "max-h-full",
            "screen": "max-h-screen",
            "fit-content": "max-h-fit"
          }[maxH],
          shrink && { "0": "shrink-0", "1": "shrink" }[shrink],
          bg,
          className
        )}
        style={{
          top: top !== undefined ? top : undefined,
          left: left !== undefined ? left : undefined,
          right: right !== undefined ? right : undefined,
          bottom: bottom !== undefined ? bottom : undefined,
          pointerEvents,
          background: bgGradient === "fade-up"
            ? "linear-gradient(to top, var(--background) 0%, var(--background) 45%, transparent 100%)"
            : undefined,
          animation: animation === "slide-in-right"
            ? "slide-in-right 0.28s cubic-bezier(0.4, 0, 0.2, 1) forwards"
            : animation === "slide-out-right"
            ? "slide-out-right 0.24s cubic-bezier(0.4, 0, 0.2, 1) forwards"
            : animation === "slide-up"
            ? "slide-up 0.24s cubic-bezier(0.4, 0, 0.2, 1) forwards"
            : animation === "slide-down"
            ? "slide-down 0.24s cubic-bezier(0.4, 0, 0.2, 1) forwards"
            : animation === "search-expand-in"
            ? "search-expand-in 0.24s cubic-bezier(0.4, 0, 0.2, 1) forwards"
            : animation === "search-collapse-out"
            ? "search-collapse-out 0.2s cubic-bezier(0.4, 0, 0.2, 1) forwards"
            : undefined,
          ...(props.style || {})
        }}
        {...props}
      />
    )
  }
)
Box.displayName = "Box"
