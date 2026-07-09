"use client"

import * as React from "react"
import { RegistryMain } from "@/components/store/advanced/RegistryMain"
import { AuthAdminSection } from "@/components/store/sections/admin/AuthAdminSection"
export default function AdminLoginPage() {
  return (
    <RegistryMain>
      <AuthAdminSection />
    </RegistryMain>
  )
}
