import * as React from "react"
import { cn } from "@/lib/utils"

type PaddingToken = 5 | 12 | 2.5 | 1 | 0
type WidthToken = "full" | "screen" | "auto" | "fit-content" | "1/2" | "2/3" | "1/4"
type HeightToken = "full" | "screen" | "auto" | "fit-content"

export interface BoxProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: PaddingToken
  paddingX?: PaddingToken
  paddingY?: PaddingToken
  bg?: string
  w?: WidthToken | string
  h?: HeightToken | string
  display?: "hidden lg:flex" | "flex" | "block" | "inline-flex" | "hidden"
  direction?: "col" | "row"
  justify?: "between" | "center" | "start" | "end"
  radius?: "default" | "full" | "none"
  border?: boolean
  borderTop?: boolean
  borderBottom?: boolean
  borderLeft?: boolean
  borderRight?: boolean
  borderColor?: string
  overflow?: "hidden" | "auto" | "x-hidden y-auto"
  hoverBg?: "surface-sunken" | "primary/10"
  cursor?: "pointer"
  flex?: "1" | "auto" | "none"
}

const paddingMap: Record<string, string> = {
  "5": "p-5",
  "12": "p-12",
  "2.5": "p-2.5",
  "1": "p-1",
  "0": "p-0",
}

const paddingXMap: Record<string, string> = {
  "5": "px-5",
  "12": "px-12",
  "2.5": "px-2.5",
  "1": "px-1",
  "0": "px-0",
}

const paddingYMap: Record<string, string> = {
  "5": "py-5",
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
  "hidden": "hidden"
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
  "default": "rounded-[5px]",
  "full": "rounded-full",
  "none": "rounded-none",
}

const overflowMap = {
  "hidden": "overflow-hidden",
  "auto": "overflow-auto",
  "x-hidden y-auto": "overflow-x-hidden overflow-y-auto"
}

const hoverBgMap = {
  "surface-sunken": "hover:bg-surface-sunken transition-colors",
  "primary/10": "hover:bg-brand-primary/10 transition-colors"
}

const flexMap = {
  "1": "flex-1",
  "auto": "flex-auto",
  "none": "flex-none",
}

export const Box = React.forwardRef<HTMLDivElement, BoxProps>(
  ({ 
    className, padding, paddingX, paddingY, bg, w, h, 
    display, direction, justify, radius, border, borderColor, 
    borderTop, borderBottom, borderLeft, borderRight,
    overflow, hoverBg, cursor, flex, ...props 
  }, ref) => {
    return (
      <div
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
          borderColor,
          overflow && overflowMap[overflow],
          hoverBg && hoverBgMap[hoverBg],
          cursor === "pointer" && "cursor-pointer",
          flex && flexMap[flex],
          bg,
          className
        )}
        {...props}
      />
    )
  }
)
Box.displayName = "Box"
