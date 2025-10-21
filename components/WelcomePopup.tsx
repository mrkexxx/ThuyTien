
import React, { useState } from 'react';

interface WelcomePopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const WelcomePopup: React.FC<WelcomePopupProps> = ({ isOpen, onClose }) => {
  const [isZaloVisible, setIsZaloVisible] = useState(false);

  if (!isOpen) {
    return null;
  }

  const handleThuyTienClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsZaloVisible(true);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 transition-opacity duration-300">
      <div className="bg-gray-800 rounded-2xl shadow-xl max-w-md w-full p-6 text-white border border-gray-700 relative transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale">
        <style>{`
          @keyframes fade-in-scale {
            0% {
              opacity: 0;
              transform: scale(0.95);
            }
            100% {
              opacity: 1;
              transform: scale(1);
            }
          }
          .animate-fade-in-scale {
            animation: fade-in-scale 0.3s forwards ease-out;
          }
        `}</style>
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors"
          aria-label="Đóng"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h2 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-500">
          Thuỷ Tiên xin chào !
        </h2>
        <p className="text-gray-300 mb-4">
          Đây là tool chỉnh sửa ảnh Afflate tiktok miễn phí.
        </p>
        <p className="text-gray-300">
          A/c có nhu cầu mua các tài khoản A.I như Chatgpt, Gemini, các tool tạo ảnh tạo video bằng A.I liên hệ ngay zalo{' '}
          <a
            href="#"
            onClick={handleThuyTienClick}
            className="font-bold text-yellow-400 hover:text-yellow-300 underline"
          >
            Thuỷ Tiên
          </a>
          .
        </p>
        {isZaloVisible && (
          <div className="mt-4 p-3 bg-gray-900 rounded-lg text-center">
            <p className="text-lg font-mono tracking-widest text-green-400">
              0392 613 948
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WelcomePopup;
