import * as React from "react"
import { cn } from "@/lib/utils"

type GapToken = "section" | "title-content" | 12.5 | 12 | 5 | 2.5 | 1 | 0

export interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: "row" | "col"
  gap?: GapToken
  align?: "start" | "center" | "end" | "stretch" | "baseline"
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly"
  wrap?: boolean
  w?: "full" | "auto" | "fit-content" | string
  h?: "full" | "screen" | "auto" | "fit-content" | string
  maxWidth?: "5xl" | "full" | "none"
  paddingX?: "5" | "12" | "2.5" | "0"
}

const gapMap: Record<string, string> = {
  "section": "gap-y-[50px] lg:gap-y-[100px]",
  "title-content": "gap-y-[30px] lg:gap-y-[50px]",
  "12.5": "gap-[50px]",
  "12": "gap-12",
  "5": "gap-5",
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

const justifyMap = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
  around: "justify-around",
  evenly: "justify-evenly",
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
  "5": "px-5",
  "12": "px-12",
  "2.5": "px-2.5",
  "0": "px-0",
}

export const Stack = React.forwardRef<HTMLDivElement, StackProps>(
  ({ className, direction = "col", gap = 5, align, justify, wrap, w, h, maxWidth, paddingX, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex",
          direction === "col" ? "flex-col" : "flex-row",
          gapMap[String(gap)],
          align && alignMap[align],
          justify && justifyMap[justify],
          wrap && "flex-wrap",
          w && (widthMap[w] || w),
          h && (heightMap[h] || h),
          maxWidth && maxWidthMap[maxWidth],
          paddingX && paddingXMap[paddingX],
          className
        )}
        {...props}
      />
    )
  }
)
Stack.displayName = "Stack"
