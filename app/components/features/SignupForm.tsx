'use client'

import React, { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { createClient } from '@/app/utils/supabase/client'

export default function SignupForm() {
  const [email, setEmail] = useState('')
  const supabase = createClient()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // 處理註冊邏輯
    console.log('Submitting email:', email)
  }

  const handleGoogleSignIn = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      // options: {
      //   queryParams: {
      //     access_type: 'offline',
      //     prompt: 'consent',
      //   },
      // },
    })
    
    if (error) {
      console.error('Google 登入錯誤:', error.message)
    }
    if (data) {
      // 儲存使用者資訊到 localStorage
      const { data: sessionData } = await supabase.auth.getSession()
      if (sessionData?.session) {
        localStorage.setItem('session', JSON.stringify(sessionData.session))
        
        // 取得使用者資料
        const { data: userData } = await supabase.auth.getUser()
        if (userData?.user) {
          localStorage.setItem('user', JSON.stringify(userData.user))
          // 導向到首頁或儀表板
          window.location.href = '/dashboard'
        }
      }
    }
  }

  return (
    <section className="py-20 bg-gradient-to-b from-black to-gray-900">
      <div className="container mx-auto px-6">
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            立即開始您的AI攝影之旅
          </h2>
          <p className="text-gray-400 mb-8">
            註冊即可獲得免費試用機會，體驗AI攝影的魅力
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="輸入您的電子郵件"
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 focus:border-[#4AB8D3] focus:outline-none"
            />
            <button
              type="submit"
              className="w-full bg-[#4AB8D3] text-white py-3 rounded-lg font-medium hover:bg-[#3a9ab1] transition flex items-center justify-center gap-2"
            >
              開始免費試用 <ArrowRight className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full bg-white text-gray-800 py-3 rounded-lg font-medium hover:bg-gray-100 transition flex items-center justify-center gap-2"
            >
              <img src="/google.svg" alt="Google" className="w-5 h-5" />
              使用 Google 帳號登入
            </button>
          </form>
        </div>
      </div>
    </section>
  )
} 