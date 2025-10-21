import React, { useState, useEffect } from 'react';
import ImageEditor from './features/image-editor';
import ImageGenerator from './features/image-generator';
import FashionTryOn from './features/fashion-tryon';
import CharacterGenerator from './features/character-generator';
import VirtualCorner from './features/virtual-corner';
import VideoGenerator from './features/video-generator';
import WelcomePopup from './components/WelcomePopup';
import ApiKeyModal from './components/ApiKeyModal';
import { getApiKey } from './services/geminiClient';
import Sidebar from './components/Sidebar';

// Icons
import ShirtIcon from './components/icons/ShirtIcon';
import UsersIcon from './components/icons/UsersIcon';
import CameraIcon from './components/icons/CameraIcon';
import VideoIcon from './components/icons/VideoIcon';
import SparklesIcon from './components/icons/SparklesIcon';
import ImageIcon from './components/icons/ImageIcon';

type Subject = 'fashion' | 'character' | 'virtual' | 'video' | 'editor' | 'generator';

const toolConfig: Record<Subject, {
  title: string;
  description: string;
  component: React.FC;
  icon: React.FC<any>;
}> = {
  fashion: {
    title: 'Thay Trang Phục Cho Mẫu',
    description: 'Tải ảnh người mẫu và trang phục để AI kết hợp chúng một cách chân thực.',
    component: FashionTryOn,
    icon: ShirtIcon,
  },
  character: {
    title: 'Nhân Vật Nhất Quán',
    description: 'Tạo ra hình ảnh mới với nhân vật nhất quán dựa trên các ảnh tham chiếu.',
    component: CharacterGenerator,
    icon: UsersIcon,
  },
  virtual: {
    title: 'Góc Sống Ảo',
    description: 'Ghép ảnh của bạn vào các bối cảnh độc đáo hoặc theo phong cách gợi ý.',
    component: VirtualCorner,
    icon: CameraIcon,
  },
  video: {
    title: 'Video AI',
    description: 'Biến ý tưởng và hình ảnh của bạn thành những video chuyển động ấn tượng.',
    component: VideoGenerator,
    icon: VideoIcon,
  },
  editor: {
    title: 'Image Editor',
    description: 'Chỉnh sửa ảnh của bạn bằng cách mô tả thay đổi bạn mong muốn.',
    component: ImageEditor,
    icon: SparklesIcon,
  },
  generator: {
    title: 'Text To Image',
    description: 'Mô tả bất cứ điều gì bạn tưởng tượng và để AI biến nó thành hình ảnh.',
    component: ImageGenerator,
    icon: ImageIcon,
  },
};


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
        const change = Math.floor(Math.random() * 5) - 2;
        const newCount = prevCount + change;
        return newCount > 50 ? newCount : 50;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPopupVisible(true);
    }, 60000);
    return () => clearTimeout(timer);
  }, []);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!getApiKey()) {
        setIsApiKeyModalOpen(true);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleNavigate = (subject: Subject) => {
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

  const ActiveComponent = toolConfig[activeSubject].component;

  return (
    <div className="flex h-screen bg-[#0D1117] text-white font-sans">
      <Sidebar
        activeSubject={activeSubject}
        onNavigate={handleNavigate}
        onUndo={handleUndo}
        onRedo={handleRedo}
        isUndoDisabled={currentIndex === 0}
        isRedoDisabled={currentIndex >= history.length - 1}
        onSettingsClick={() => setIsApiKeyModalOpen(true)}
      />

      <main className="flex-1 flex flex-col overflow-y-auto custom-scrollbar">
        <header className="sticky top-0 z-10 bg-[#0D1117]/80 backdrop-blur-md border-b border-gray-800 p-6">
          <div className="flex justify-between items-center">
            <div>
                <h1 className="text-2xl font-bold text-gray-100">{toolConfig[activeSubject].title}</h1>
                <p className="text-sm text-gray-400 mt-1">{toolConfig[activeSubject].description}</p>
            </div>
            <div className="flex items-center space-x-4">
                <div className="text-right">
                    <p className="text-sm font-medium text-gray-300">Hotline/Zalo</p>
                    <p className="text-xs text-gray-400">0392 613 948</p>
                </div>
                 <div className="flex items-center space-x-2 text-sm text-gray-400 bg-gray-800/50 px-3 py-1.5 rounded-full border border-gray-700">
                   <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                    </span>
                    <span>{onlineCount} Online</span>
                </div>
            </div>
          </div>
        </header>
        
        <div className="p-4 md:p-6 lg:p-8">
            <ActiveComponent />
        </div>
      </main>

      <WelcomePopup isOpen={isPopupVisible} onClose={() => setIsPopupVisible(false)} />
      <ApiKeyModal isOpen={isApiKeyModalOpen} onClose={() => setIsApiKeyModalOpen(false)} />
    </div>
  );
};

export default App;