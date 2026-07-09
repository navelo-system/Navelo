"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { AdminShellSection } from "@/components/store/sections/admin/AdminShellSection"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isLoginPage = pathname === "/admin/login"

  if (isLoginPage) {
    return <>{children}</>
  }

  return <AdminShellSection>{children}</AdminShellSection>
}
