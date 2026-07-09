"use client"

import * as React from "react"

export interface QrCodeSvgProps {
  width?: string | number
  height?: string | number
}

export function QrCodeSvg({ width = 140, height = 140 }: QrCodeSvgProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 29 29"
      fill="none"
      shapeRendering="crispEdges"
    >
      <path d="M0 0h7v7H0zM22 0h7v7h-7zM0 22h7v7H0zM2 2h3v3H2zM24 2h3v3h-3zM2 24h3v3H2zM10 0h2v1h-2zM13 0h1v1h-1zM16 0h2v1h-2zM10 2h1v1h-1zM13 2h2v1h-2zM10 4h2v1h-2zM13 4h3v1h-3zM10 6h4v1h-4zM16 5h1v2h-1zM18 2h1v3h-1zM20 1h1v1h-1zM20 4h1v2h-1zM8 8h1v1H8zM11 8h2v2h-2zM14 8h2v1h-2zM17 8h1v2h-1zM19 8h2v1h-2zM9 10h1v1H9zM13 10h3v1h-3zM18 10h1v1h-1zM20 10h2v1h-2zM23 9h2v1h-2zM26 8h2v2h-2zM8 12h3v1H8zM12 12h1v1h-1zM15 12h3v1h-3zM19 12h2v1h-2zM23 12h1v2h-1zM26 12h2v2h-2zM8 14h2v1H8zM12 14h2v1h-2zM17 14h1v1h-1zM21 14h1v1h-1zM10 16h3v1h-3zM14 16h2v1h-2zM17 16h2v1h-2zM20 16h2v2h-2zM23 16h2v1h-2zM27 16h1v2h-1zM8 18h1v1H8zM12 18h2v1h-2zM15 18h3v1h-3zM22 18h2v1h-2zM9 20h2v1H9zM12 20h1v1h-1zM14 20h3v1h-3zM18 20h2v1h-2zM25 20h2v1h-2z" fill="#18181b" />
    </svg>
  )
}
