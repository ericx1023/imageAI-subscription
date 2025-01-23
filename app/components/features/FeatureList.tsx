'use client'

import { Camera, Sparkles, Zap, Shield } from 'lucide-react'

const features = [
  {
    icon: Camera,
    title: '智能攝影指導',
    description: '即時提供專業的構圖和光線建議，讓您輕鬆拍出完美照片'
  },
  {
    icon: Sparkles,
    title: 'AI美化增強',
    description: '自動優化照片效果，一鍵實現專業級後期處理'
  },
  {
    icon: Zap,
    title: '快速處理',
    description: '強大的AI引擎，秒級完成照片處理，節省寶貴時間'
  },
  {
    icon: Shield,
    title: '隱私保護',
    description: '完整的資料加密和隱私保護機制，確保您的照片安全'
  }
]

export default function FeatureList() {
  return (
    <section className="py-20 bg-black/50">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-12">
          為什麼選擇我們的<span className="text-[#4AB8D3]">AI攝影服務</span>
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div 
                key={index}
                className="p-6 rounded-xl bg-white/5 backdrop-blur-sm hover:bg-white/10 transition"
              >
                <Icon className="w-12 h-12 text-[#4AB8D3] mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
} 