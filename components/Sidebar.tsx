import React from 'react';

// Icons
import ShirtIcon from './icons/ShirtIcon';
import UsersIcon from './icons/UsersIcon';
import CameraIcon from './icons/CameraIcon';
import VideoIcon from './icons/VideoIcon';
import SparklesIcon from './icons/SparklesIcon';
import ImageIcon from './icons/ImageIcon';
import UndoIcon from './icons/UndoIcon';
import RedoIcon from './icons/RedoIcon';
import SettingsIcon from './icons/SettingsIcon';

type Subject = 'fashion' | 'character' | 'virtual' | 'video' | 'editor' | 'generator';

const tools: Record<Subject, { name: string; icon: React.FC<any>; color: string; }> = {
  fashion: { name: 'Thay Trang Phục', icon: ShirtIcon, color: 'pink' },
  character: { name: 'Nhân Vật Nhất Quán', icon: UsersIcon, color: 'green' },
  virtual: { name: 'Góc Sống Ảo', icon: CameraIcon, color: 'yellow' },
  video: { name: 'Video AI', icon: VideoIcon, color: 'cyan' },
  editor: { name: 'Image Editor', icon: SparklesIcon, color: 'purple' },
  generator: { name: 'Text To Image', icon: ImageIcon, color: 'blue' },
};

const colorClasses = {
  pink: { bg: 'bg-pink-500/20', text: 'text-pink-400', hover: 'hover:bg-pink-500/30' },
  green: { bg: 'bg-green-500/20', text: 'text-green-400', hover: 'hover:bg-green-500/30' },
  yellow: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', hover: 'hover:bg-yellow-500/30' },
  cyan: { bg: 'bg-cyan-500/20', text: 'text-cyan-400', hover: 'hover:bg-cyan-500/30' },
  purple: { bg: 'bg-purple-500/20', text: 'text-purple-400', hover: 'hover:bg-purple-500/30' },
  blue: { bg: 'bg-blue-500/20', text: 'text-blue-400', hover: 'hover:bg-blue-500/30' },
};


interface SidebarProps {
  activeSubject: Subject;
  onNavigate: (subject: Subject) => void;
  onUndo: () => void;
  onRedo: () => void;
  isUndoDisabled: boolean;
  isRedoDisabled: boolean;
  onSettingsClick: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  activeSubject,
  onNavigate,
  onUndo,
  onRedo,
  isUndoDisabled,
  isRedoDisabled,
  onSettingsClick,
}) => {
  return (
    <aside className="w-20 lg:w-64 bg-gray-900/50 backdrop-blur-lg border-r border-gray-800 flex flex-col p-4 transition-all duration-300">
      <div className="mb-8 pl-1">
        <h1 className="text-xl lg:text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-500">
          Thuỷ Tiên
          <span className="text-gray-400 hidden lg:inline"> MMO</span>
        </h1>
      </div>
      
      <nav className="flex-1 flex flex-col space-y-2">
        {(Object.keys(tools) as Subject[]).map((key) => {
          const tool = tools[key];
          const colors = colorClasses[tool.color as keyof typeof colorClasses];
          const isActive = activeSubject === key;
          
          return (
            <button
              key={key}
              onClick={() => onNavigate(key)}
              title={tool.name}
              className={`flex items-center justify-center lg:justify-start p-3 rounded-lg transition-colors duration-200 group ${
                isActive ? `${colors.bg} ${colors.text}` : `text-gray-400 hover:text-white ${colors.hover}`
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              <tool.icon className={`w-6 h-6 shrink-0 ${isActive ? colors.text : 'text-gray-500 group-hover:text-white'}`} />
              <span className="ml-4 text-sm font-medium hidden lg:block">{tool.name}</span>
            </button>
          );
        })}
      </nav>

      <div className="flex flex-col space-y-2">
         <div className="flex items-center justify-center lg:justify-around border-t border-b border-gray-800 py-1 my-2">
            <button onClick={onUndo} disabled={isUndoDisabled} className="p-3 rounded-lg text-gray-400 hover:bg-gray-700/50 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed" aria-label="Trở lại" title="Trở lại">
                <UndoIcon className="w-5 h-5" />
            </button>
             <button onClick={onRedo} disabled={isRedoDisabled} className="p-3 rounded-lg text-gray-400 hover:bg-gray-700/50 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed" aria-label="Tiếp" title="Tiếp">
                <RedoIcon className="w-5 h-5" />
            </button>
        </div>
        <button
            onClick={onSettingsClick}
            className="flex items-center justify-center lg:justify-start p-3 rounded-lg text-gray-400 hover:bg-gray-700/50 hover:text-white transition-colors group"
            aria-label="Cài đặt"
            title="Cài đặt"
        >
            <SettingsIcon className="w-6 h-6 shrink-0 text-gray-500 group-hover:text-white" />
            <span className="ml-4 text-sm font-medium hidden lg:block">Cài đặt API Key</span>
        </button>
         <div className="pt-2 border-t border-gray-800 text-center">
            <p className="text-xs text-gray-500 hidden lg:block">© Thuỷ Tiên MMO Community</p>
            <p className="text-xs text-gray-500 lg:hidden">© TT</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;