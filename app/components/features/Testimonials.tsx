'use client'

import React from 'react';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: '張小明',
    role: '專業攝影師',
    image: 'https://picsum.photos/id/1012/150/150',
    content: 'AI攝影服務大大提升了我的工作效率，讓我能夠專注於創意的部分。照片的優化效果令人驚艷！',
    rating: 5
  },
  {
    name: '李美玲',
    role: '網路創作者',
    image: 'https://picsum.photos/id/1027/150/150',
    content: '作為一個內容創作者，這個服務幫助我輕鬆製作出高質量的照片。強烈推薦給所有創作者！',
    rating: 5
  },
  {
    name: '王大華',
    role: '業餘攝影愛好者',
    image: 'https://picsum.photos/id/1025/150/150',
    content: '從未想過AI可以如此智能，即使是新手也能拍出專業級的照片。這真是太神奇了！',
    rating: 5
  }
];

export default function Testimonials() {
  return (
    <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-12">
          用戶心得分享
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-white/5 backdrop-blur-sm rounded-xl p-6 hover:bg-white/10 transition"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="relative w-12 h-12 rounded-full overflow-hidden">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold">{testimonial.name}</h3>
                  <p className="text-sm text-gray-400">{testimonial.role}</p>
                </div>
              </div>
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-gray-300">{testimonial.content}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 