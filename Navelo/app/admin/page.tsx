"use client"

import * as React from "react"
import { RegistryMain } from "@/components/store/advanced/RegistryMain"
import { DashboardSection } from "@/components/store/sections/admin/DashboardSection"

export default function AdminDashboardPage() {
  return (
    <RegistryMain>
      <DashboardSection />
    </RegistryMain>
  )
}
