"use client"

import * as React from "react"
import { RegistryMain } from "@/components/store/advanced/RegistryMain"
import { UsuariosSection } from "@/components/store/sections/admin/UsuariosSection"

export default function AdminUsersPage() {
  return (
    <RegistryMain>
      <UsuariosSection />
    </RegistryMain>
  )
}
