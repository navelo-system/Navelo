"use client"

import * as React from "react"
import { RegistryMain } from "@/components/store/advanced/RegistryMain"
import { AuditLogsSection } from "@/components/store/sections/admin/AuditLogsSection"

export default function AdminLogsPage() {
  return (
    <RegistryMain>
      <AuditLogsSection />
    </RegistryMain>
  )
}
