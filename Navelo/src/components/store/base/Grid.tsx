import * as React from "react"
import { cn } from "@/lib/utils"

type GapToken = "section" | "title-content" | 12.5 | 12 | 5 | 2.5 | 1 | 0

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 8 | 12
  gap?: GapToken
  responsive?: boolean
  w?: string
  h?: string
  mobileCols?: 1 | 2 | 3 | 4 | 5 | 6 | 12
}

const gapMap: Record<string, string> = {
  "section": "gap-[50px] lg:gap-[100px]",
  "title-content": "gap-[30px] lg:gap-[50px]",
  "12.5": "gap-[50px]",
  "12": "gap-12",
  "5": "gap-5",
  "2.5": "gap-2.5",
  "1": "gap-1",
  "0": "gap-0",
}

const colsMap: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 md:grid-cols-2",
  3: "grid-cols-1 md:grid-cols-3",
  4: "grid-cols-2 md:grid-cols-2 lg:grid-cols-4",
  5: "grid-cols-1 md:grid-cols-5",
  6: "grid-cols-1 md:grid-cols-3 lg:grid-cols-6",
  12: "grid-cols-4 md:grid-cols-6 lg:grid-cols-12",
}

const fixedColsMap: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
  5: "grid-cols-5",
  6: "grid-cols-6",
  12: "grid-cols-12",
}

export const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  ({ className, cols = 1, gap = 5, responsive = true, w, h, mobileCols, ...props }, ref) => {
    const colsClass = React.useMemo(() => {
      if (!responsive) return fixedColsMap[cols]
      if (mobileCols !== undefined) {
        const mdClass = cols === 12
          ? "md:grid-cols-6 lg:grid-cols-12"
          : cols === 6
            ? "md:grid-cols-3 lg:grid-cols-6"
            : cols === 4
              ? "md:grid-cols-2 lg:grid-cols-4"
              : `md:grid-cols-${cols}`
        return `grid-cols-${mobileCols} ${mdClass}`
      }
      return colsMap[cols]
    }, [responsive, cols, mobileCols])

    return (
      <div
        ref={ref}
        className={cn(
          "grid",
          colsClass,
          gapMap[String(gap)],
          w,
          h,
          className
        )}
        {...props}
      />
    )
  }
)
Grid.displayName = "Grid"
