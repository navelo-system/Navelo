import * as React from "react"
import { cn } from "@/lib/utils"

type GapToken = "section" | "title-content" | 12.5 | 12 | 5 | 2.5 | 1 | 0

export interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: "row" | "col" | "col-reverse" | "row-reverse"
  mobileDirection?: "row" | "col" | "col-reverse" | "row-reverse"
  gap?: GapToken
  align?: "start" | "center" | "end" | "stretch" | "baseline"
  mobileAlign?: "start" | "center" | "end"
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly"
  mobileJustify?: "start" | "center" | "end" | "between" | "around" | "evenly"
  wrap?: boolean
  w?: "full" | "auto" | "fit-content" | string
  h?: "full" | "screen" | "auto" | "fit-content" | string
  maxWidth?: "5xl" | "full" | "none"
  paddingX?: 5 | 12 | 2.5 | 0 | "5" | "12" | "2.5" | "0"
  flex?: "1" | "auto" | "none"
  minW?: "0"
  order?: "1" | "2"
  mdOrder?: "1" | "2"
  cursor?: "pointer"
}

const gapMap: Record<string, string> = {
  "section": "gap-y-[50px]",
  "title-content": "gap-y-[30px] lg:gap-y-[50px]",
  "12.5": "gap-[50px]",
  "12": "gap-12",
  "5": "gap-6",
  "2.5": "gap-2.5",
  "1": "gap-1",
  "0": "gap-0",
}

const alignMap = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
  baseline: "items-baseline",
}

const mobileAlignMap = {
  start: "md:items-start",
  center: "md:items-center",
  end: "md:items-end",
}

const justifyMap = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
  around: "justify-around",
  evenly: "justify-evenly",
}

const mobileJustifyMap = {
  start: "md:justify-start",
  center: "md:justify-center",
  end: "md:justify-end",
  between: "md:justify-between",
  around: "md:justify-around",
  evenly: "md:justify-evenly",
}

const widthMap: Record<string, string> = {
  "full": "w-full",
  "auto": "w-auto",
  "fit-content": "w-fit",
}

const heightMap: Record<string, string> = {
  "full": "h-full",
  "screen": "h-screen",
  "auto": "h-auto",
  "fit-content": "h-fit",
}

const maxWidthMap = {
  "5xl": "max-w-5xl",
  "full": "max-w-full",
  "none": "max-w-none",
}

const paddingXMap = {
  "5": "px-6",
  "12": "px-12",
  "2.5": "px-2.5",
  "0": "px-0",
}

const flexMap = {
  "1": "flex-1",
  "auto": "flex-auto",
  "none": "flex-none",
}

const minWMap = {
  "0": "min-w-0",
}

const orderMap = {
  "1": "order-1",
  "2": "order-2",
}

const mdOrderMap = {
  "1": "md:order-1",
  "2": "md:order-2",
}

export const Stack = React.forwardRef<HTMLDivElement, StackProps>(
  ({ className, direction = "col", mobileDirection, gap = 5, align, mobileAlign, justify, mobileJustify, wrap, w, h, maxWidth, paddingX, flex, minW, order, mdOrder, cursor, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex",
          direction === "col" ? "flex-col" : direction === "col-reverse" ? "flex-col-reverse" : direction === "row-reverse" ? "flex-row-reverse" : "flex-row",
          mobileDirection === "row" ? "md:flex-row" : mobileDirection === "col" ? "md:flex-col" : mobileDirection === "col-reverse" ? "md:flex-col-reverse" : mobileDirection === "row-reverse" ? "md:flex-row-reverse" : undefined,
          gapMap[String(gap)],
          align && alignMap[align],
          mobileAlign && mobileAlignMap[mobileAlign],
          justify && justifyMap[justify],
          mobileJustify && mobileJustifyMap[mobileJustify],
          wrap && "flex-wrap",
          w && (widthMap[w] || w),
          h && (heightMap[h] || h),
          maxWidth && maxWidthMap[maxWidth],
          paddingX && paddingXMap[paddingX],
          flex && flexMap[flex],
          minW && minWMap[minW],
          order && orderMap[order],
          mdOrder && mdOrderMap[mdOrder],
          cursor === "pointer" && "cursor-pointer",
          className
        )}
        {...props}
      />
    )
  }
)
Stack.displayName = "Stack"
