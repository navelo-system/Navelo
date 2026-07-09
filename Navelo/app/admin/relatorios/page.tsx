"use client"

import * as React from "react"
import { RegistryMain } from "@/components/store/advanced/RegistryMain"
import { RelatoriosSection } from "@/components/store/sections/admin/RelatoriosSection"

export default function AdminReportsPage() {
  return (
    <RegistryMain>
      <RelatoriosSection />
    </RegistryMain>
  )
}
