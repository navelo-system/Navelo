import * as React from "react"
import { Header } from "@/components/store/advanced/Header"
import { DashboardShell } from "@/components/store/advanced/DashboardShell"

export default function DesignSystemLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <DashboardShell header={<Header />}>
      {children}
    </DashboardShell>
  )
}
