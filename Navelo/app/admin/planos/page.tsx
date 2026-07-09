"use client"

import * as React from "react"
import { RegistryMain } from "@/components/store/advanced/RegistryMain"
import { PlansCrudSection } from "@/components/store/sections/admin/PlansCrudSection"

export default function AdminPlansPage() {
  return (
    <RegistryMain>
      <PlansCrudSection />
    </RegistryMain>
  )
}
