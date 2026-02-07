"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import IntroPage from "@/components/home/IntroPage"

export default function Home() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Check if user has visited before (using sessionStorage)
    if (typeof window !== 'undefined') {
      const hasVisited = sessionStorage.getItem("hasVisited")
      
      if (hasVisited) {
        // Returning visitor - redirect to main home
        router.replace("/home")
      }
    }
  }, [router])

  // Show intro page on first visit, or while checking
  if (!mounted) {
    return <IntroPage />
  }

  // Check again after mount
  if (typeof window !== 'undefined') {
    const hasVisited = sessionStorage.getItem("hasVisited")
    
    if (!hasVisited) {
      return <IntroPage />
    }
  }

  return null
}
