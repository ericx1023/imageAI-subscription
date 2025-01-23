'use client'

import React from 'react';
import { Camera, ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-[80vh] flex items-center">
      {/* 背景圖片 */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://picsum.photos/id/1005/1920/1080"
          alt="Hero background"
          className="w-full h-full object-cover opacity-40"
        />
      </div>

      <div className="container mx-auto px-6 z-10">
        <div className="max-w-3xl">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            用AI技術創造完美的
            <span className="text-[#4AB8D3]">專業照片</span>
          </h1>
          <p className="text-xl mb-8 text-gray-300">
            利用最先進的AI技術，讓每張照片都成為藝術品。無需專業設備，立即開始創作。
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => window.location.href = '/dashboard'} 
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#FF6B4A] to-pink-500 px-8 py-3 rounded-full font-medium text-lg hover:opacity-90 transition"
            >
              開始體驗 <ArrowRight className="w-5 h-5" />
            </button>
            <button className="flex items-center justify-center gap-2 bg-white/10 px-8 py-3 rounded-full font-medium text-lg hover:bg-white/20 transition backdrop-blur-sm">
              查看示例 <Camera className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
} 