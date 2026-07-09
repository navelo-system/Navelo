"use client"

import * as React from "react"
import { RegistryMain } from "@/components/store/advanced/RegistryMain"
import { TenantsSection } from "@/components/store/sections/admin/TenantsSection"

export default function AdminClientsPage() {
  return (
    <RegistryMain>
      <TenantsSection />
    </RegistryMain>
  )
}

