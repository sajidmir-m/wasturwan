import type { ReactNode } from "react"

// This layout overrides the parent admin layout for the login page
// It doesn't require authentication, preventing redirect loops
export default function LoginLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}

