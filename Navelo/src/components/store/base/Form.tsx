"use client"

import * as React from "react"

export interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  children: React.ReactNode
}

export function Form({ children, ...props }: FormProps) {
  return (
    <form {...props}>
      {children}
    </form>
  )
}
