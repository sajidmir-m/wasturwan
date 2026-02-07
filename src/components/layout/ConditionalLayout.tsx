"use client"

import { usePathname } from "next/navigation"
import Navbar from "./Navbar"
import Footer from "./Footer"

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isIntroPage = pathname === "/intro" || pathname === "/"

  if (isIntroPage) {
    return <>{children}</>
  }

  return (
    <>
      <Navbar />
      <main className="flex-grow pt-24">
        {children}
      </main>
      <Footer />
    </>
  )
}

