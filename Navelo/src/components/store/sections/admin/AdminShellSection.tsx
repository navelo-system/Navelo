import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { AdminHeaderSection } from "./AdminHeaderSection"

interface AdminShellSectionProps {
  children: React.ReactNode
}

export const AdminShellSection: React.FC<AdminShellSectionProps> = ({ children }) => {
  return (
    <Box display="flex" direction="col" h="screen" w="full" bg="bg-surface-sunken">
      {/* Top Header */}
      <AdminHeaderSection />

      {/* Main Body */}
      <Box display="flex" flex="1" w="full" overflow="hidden">
        {/* Content Area */}
        <Box display="flex" direction="col" flex="1" h="full" overflow="auto">
          {children}
        </Box>
      </Box>
    </Box>
  )
}
