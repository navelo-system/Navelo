import * as React from "react"
import { Box } from "../base/Box"
import { Stack } from "../base/Stack"

export interface DashboardShellProps extends React.HTMLAttributes<HTMLDivElement> {
  sidebar?: React.ReactNode
  header?: React.ReactNode
  children: React.ReactNode
}

export const DashboardShell: React.FC<DashboardShellProps> = ({
  sidebar,
  header,
  children,
  ...props
}) => {
  return (
    <Box w="full" h="screen" bg="bg-background" display="flex" direction={header ? "col" : "row"} overflow="hidden" {...props}>
      {header}
      {sidebar && (
        <>
          {sidebar}
          <Box w="w-[2px]" h="full" bg="bg-border" />
        </>
      )}
      <Box w="full" h="full" display="flex" overflow="x-hidden y-auto" direction="col" flex="1">
        {children}
      </Box>
    </Box>
  )
}
