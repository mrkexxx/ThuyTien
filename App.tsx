
import React, { useState, useEffect } from 'react';
import ImageEditor from './features/image-editor';
import ImageGenerator from './features/image-generator';
import FashionTryOn from './features/fashion-tryon';
import CharacterGenerator from './features/character-generator';
import VirtualCorner from './features/virtual-corner';
import WelcomePopup from './components/WelcomePopup';
import ApiKeyModal from './components/ApiKeyModal';
import { getApiKey } from './services/geminiClient';

// Import new icons
import UndoIcon from './components/icons/UndoIcon';
import RedoIcon from './components/icons/RedoIcon';
import SettingsIcon from './components/icons/SettingsIcon';
import SearchIcon from './components/icons/SearchIcon';
import InfoIcon from './components/icons/InfoIcon';

type Subject = 'editor' | 'generator' | 'fashion' | 'character' | 'virtual';

const App: React.FC = () => {
  const [history, setHistory] = useState<Subject[]>(['fashion']);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const activeSubject = history[currentIndex];

  const [onlineCount, setOnlineCount] = useState(Math.floor(Math.random() * (150 - 80 + 1)) + 80);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineCount(prevCount => {
        const change = Math.floor(Math.random() * 5) - 2; // -2 to +2
        const newCount = prevCount + change;
        return newCount > 50 ? newCount : 50; // Ensure it doesn't drop too low
      });
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPopupVisible(true);
    }, 60000); // 1 minute

    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, []);
  
  useEffect(() => {
    // Check for API key on initial load
    const timer = setTimeout(() => {
      if (!getApiKey()) {
        setIsApiKeyModalOpen(true);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, []);


  const handleTabClick = (subject: Subject) => {
    if (subject === activeSubject) return;
    const newHistory = history.slice(0, currentIndex + 1);
    newHistory.push(subject);
    setHistory(newHistory);
    setCurrentIndex(newHistory.length - 1);
  };

  const handleUndo = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleRedo = () => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleClosePopup = () => {
    setIsPopupVisible(false);
  };

  const navButtonClasses = (subject: Subject, activeColor: string) => 
    `px-4 py-2 text-sm font-medium rounded-md transition-colors ${
      activeSubject === subject
        ? `${activeColor} text-white shadow-lg`
        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
    }`;
    
  const toolbarButtonClasses = "p-2 rounded-full hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <header className="sticky top-0 z-10 bg-gray-900/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
                <div className="flex-1">
                    <div className="flex flex-col items-start space-y-1">
                        <p className="text-sm font-medium text-gray-300">Hotline/Zalo: 0392 613 948</p>
                        <div className="flex items-center space-x-2 text-xs text-gray-400">
                           <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            <span>Đang online: {onlineCount}</span>
                        </div>
                         <p className="text-xs text-gray-500">© Thuỷ Tiên MMO Community</p>
                    </div>
                </div>
                <div className="flex flex-col items-center justify-center">
                    <h1 className="text-5xl font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-500">Thuỷ Tiên MMO</h1>
                    <p className="text-white text-sm tracking-widest mt-1">CÁI GÌ CŨNG CÓ CHỈ TIỀN KHÔNG CÓ</p>
                </div>
                <div className="flex-1 flex justify-end items-center space-x-2">
                    <button onClick={handleUndo} disabled={currentIndex === 0} className={toolbarButtonClasses} aria-label="Trở lại" title="Hoàn tác: Trở lại thao tác trước đó.">
                        <UndoIcon className="w-5 h-5" />
                    </button>
                    <button onClick={handleRedo} disabled={currentIndex >= history.length - 1} className={toolbarButtonClasses} aria-label="Tiếp" title="Làm lại: Khôi phục thao tác vừa hoàn tác.">
                        <RedoIcon className="w-5 h-5" />
                    </button>
                    <div className="w-px h-6 bg-gray-700"></div>
                    <button onClick={() => setIsApiKeyModalOpen(true)} className={toolbarButtonClasses} aria-label="Cài đặt" title="Cài đặt: Mở phần cài đặt, tùy chỉnh chức năng.">
                        <SettingsIcon className="w-5 h-5" />
                    </button>
                    <button className={toolbarButtonClasses} aria-label="Tìm kiếm" title="Tìm kiếm: Tìm kiếm nội dung trong ứng dụng/tài liệu.">
                        <SearchIcon className="w-5 h-5" />
                    </button>
                     <button className={toolbarButtonClasses} aria-label="Thông tin" title="Thông tin: Xem thông tin chi tiết hoặc trợ giúp liên quan.">
                        <InfoIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
      </header>
      
      <main className="p-4 sm:p-6 lg:p-8 pb-16">
        <div className="max-w-7xl mx-auto">
            <nav className="flex justify-center mb-8">
            <div className="flex space-x-2 bg-gray-800 p-1 rounded-lg shadow-md flex-wrap justify-center">
                <button
                onClick={() => handleTabClick('fashion')}
                className={navButtonClasses('fashion', 'bg-pink-600')}
                aria-current={activeSubject === 'fashion' ? 'page' : undefined}
                >
                Thay Trang Phục Cho Mẫu
                </button>
                <button
                onClick={() => handleTabClick('character')}
                className={navButtonClasses('character', 'bg-green-600')}
                aria-current={activeSubject === 'character' ? 'page' : undefined}
                >
                Nhân Vật Nhất Quán
                </button>
                 <button
                onClick={() => handleTabClick('virtual')}
                className={navButtonClasses('virtual', 'bg-yellow-600')}
                aria-current={activeSubject === 'virtual' ? 'page' : undefined}
                >
                Góc Sống Ảo
                </button>
                <button
                onClick={() => handleTabClick('editor')}
                className={navButtonClasses('editor', 'bg-purple-600')}
                aria-current={activeSubject === 'editor' ? 'page' : undefined}
                >
                Image Editor
                </button>
                <button
                onClick={() => handleTabClick('generator')}
                className={navButtonClasses('generator', 'bg-blue-600')}
                aria-current={activeSubject === 'generator' ? 'page' : undefined}
                >
                Text To Image
                </button>
            </div>
            </nav>
            
            {activeSubject === 'editor' && <ImageEditor />}
            {activeSubject === 'generator' && <ImageGenerator />}
            {activeSubject === 'fashion' && <FashionTryOn />}
            {activeSubject === 'character' && <CharacterGenerator />}
            {activeSubject === 'virtual' && <VirtualCorner />}
        </div>
      </main>
      <WelcomePopup isOpen={isPopupVisible} onClose={handleClosePopup} />
      <ApiKeyModal isOpen={isApiKeyModalOpen} onClose={() => setIsApiKeyModalOpen(false)} />
    </div>
  );
};

export default App;
