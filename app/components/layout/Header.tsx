'use client'

import React, { useState, useEffect } from 'react';
import { Camera, Menu, X } from 'lucide-react';
import Link from 'next/link'
import { User } from '@supabase/supabase-js'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setUser(JSON.parse(userStr));
    }
  }, []);

  return (
    <header className="fixed w-full top-0 z-50 bg-black/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <nav className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Camera className="w-8 h-8 text-[#4AB8D3]" />
            <span className="text-xl font-bold">AI Photo</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/pricing" className="hover:text-[#4AB8D3] transition">定價</Link>
            <Link href="/gallery" className="hover:text-[#4AB8D3] transition">相簿</Link>
            <Link href="/billing" className="hover:text-[#4AB8D3] transition">帳單</Link>
            {user && (
              <>
                <div className="text-[#4AB8D3]">
                  歡迎 {user.user_metadata.name}
              </div>
            <button
              onClick={async () => {
                localStorage.removeItem('user');
                localStorage.removeItem('session');
                window.location.href = '/';
              }}
              className="text-red-500 hover:text-red-400 transition"
                >
                  登出
                </button>
              </>
            )}
            <Link 
              href="/dashboard" 
              className="bg-gradient-to-r from-[#FF6B4A] to-pink-500 px-6 py-2 rounded-full font-medium hover:opacity-90 transition"
            >
              開始拍照
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </nav>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-black/95 py-4">
            <div className="flex flex-col space-y-4 px-6">
              <Link href="/pricing" className="hover:text-[#4AB8D3] transition">定價</Link>
              <Link href="/gallery" className="hover:text-[#4AB8D3] transition">相簿</Link>
              <Link href="/billing" className="hover:text-[#4AB8D3] transition">帳單</Link>
              {user && (
              <>
                <div className="text-[#4AB8D3]">
                  歡迎 {user.user_metadata.name}
              </div>
            <button
              onClick={async () => {
                localStorage.removeItem('user');
                localStorage.removeItem('session');
                window.location.href = '/';
              }}
              className="text-red-500 hover:text-red-400 transition"
                >
                  登出
                </button>
              </>
            )}
              <Link 
                href="/dashboard" 
                className="bg-gradient-to-r from-[#FF6B4A] to-pink-500 px-6 py-2 rounded-full font-medium text-center"
              >
                開始拍照
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
} 