"use client"

import * as React from "react"
import { RegistryMain } from "@/components/store/advanced/RegistryMain"
import { TenantsSection } from "@/components/store/sections/admin/TenantsSection"

export default function AdminTenantsPage() {
  return (
    <RegistryMain>
      <TenantsSection />
    </RegistryMain>
  )
}
