import React, { useState, useEffect } from 'react';
import { getApiKey, setApiKey } from '../services/geminiClient';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose }) => {
  const [key, setKey] = useState('');

  useEffect(() => {
    if (isOpen) {
      setKey(getApiKey() || '');
    }
  }, [isOpen]);

  const handleSave = () => {
    if (key.trim()) {
      setApiKey(key.trim());
      onClose();
    }
  };
  
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && getApiKey()) {
      onClose();
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300"
      onClick={handleOverlayClick}
    >
      <div className="bg-gray-900/80 backdrop-blur-lg rounded-2xl shadow-xl max-w-lg w-full p-6 text-white border border-gray-700 relative transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale">
        <style>{`
          @keyframes fade-in-scale {
            0% { opacity: 0; transform: scale(0.95); }
            100% { opacity: 1; transform: scale(1); }
          }
          .animate-fade-in-scale { animation: fade-in-scale 0.3s forwards ease-out; }
        `}</style>
        
        {getApiKey() && (
             <button
              onClick={onClose}
              className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors"
              aria-label="Đóng"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
        )}
       
        <h2 className="text-2xl font-bold mb-4 text-gray-100">Cài đặt API Key Gemini</h2>
        <p className="text-gray-400 mb-4">
          Để sử dụng ứng dụng, bạn cần cung cấp API Key của riêng mình từ Google Gemini.
        </p>
        
        <div className="mb-4">
          <label htmlFor="api-key-input" className="block text-sm font-medium text-gray-300 mb-1">
            Gemini API Key
          </label>
          <input
            id="api-key-input"
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="Nhập API Key của bạn vào đây"
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
          />
        </div>
        
        <div className="bg-gray-900/70 p-3 rounded-lg text-sm text-gray-400 mb-6 border border-gray-700/50">
            <p className="font-semibold text-gray-300 mb-1">Hướng dẫn lấy API Key:</p>
            <ol className="list-decimal list-inside space-y-1">
                <li>Truy cập <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline">Google AI Studio</a>.</li>
                <li>Đăng nhập bằng tài khoản Google của bạn.</li>
                <li>Nhấn vào nút "Create API key in new project".</li>
                <li>Sao chép key được tạo và dán vào ô bên trên.</li>
            </ol>
        </div>
        
        <button
          onClick={handleSave}
          className="w-full py-3 px-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl shadow-lg hover:shadow-purple-500/30 transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
          disabled={!key.trim()}
        >
          Lưu và Sử dụng
        </button>
      </div>
    </div>
  );
};

export default ApiKeyModal;