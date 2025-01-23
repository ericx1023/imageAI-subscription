import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full py-6 px-6 bg-gray-100">
      <div className="max-w-7xl mx-auto text-center">
        <p className="text-gray-600">
          © {new Date().getFullYear()} 您的網站名稱. 版權所有.
        </p>
      </div>
    </footer>
  );
} 