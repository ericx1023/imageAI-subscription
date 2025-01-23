'use client'
import { createClient } from '@/utils/supabase/client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AuthCheck() {

  const router = useRouter()
  const supabase = createClient()
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      console.log(user)
      if (user) {
        router.push('/dashboard')
      }
    }
    checkUser()
  }, [])
  
  return null
} 