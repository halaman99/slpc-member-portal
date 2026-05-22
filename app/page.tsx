'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    router.push('/dashboard')
  }, [router])

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-[#f5f0e8] mb-2">Loading...</h1>
        <p className="text-[#8a6070]">Redirecting to portal</p>
      </div>
    </div>
  )
}
