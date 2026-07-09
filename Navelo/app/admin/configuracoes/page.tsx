"use client"

import * as React from "react"
import { RegistryMain } from "@/components/store/advanced/RegistryMain"
import { ConfiguracoesSection } from "@/components/store/sections/admin/ConfiguracoesSection"

export default function AdminSettingsPage() {
  return (
    <RegistryMain>
      <ConfiguracoesSection />
    </RegistryMain>
  )
}
