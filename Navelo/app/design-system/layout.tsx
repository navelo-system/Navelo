import * as React from "react"
import { Sidebar } from "@/src/components/store/advanced/Sidebar"
import { DashboardShell } from "@/components/store/advanced/DashboardShell"

export default function DesignSystemLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <DashboardShell sidebar={<Sidebar />}>
      {children}
    </DashboardShell>
  )
}
