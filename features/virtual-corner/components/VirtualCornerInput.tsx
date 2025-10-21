import React, { useState } from 'react';
import ImagePlaceholder from '../../../components/ImagePlaceholder';
import SparklesIcon from '../../../components/icons/SparklesIcon';
import UploadIcon from '../../../components/icons/UploadIcon';
import type { ImageData } from '../types';
import { suggestionData } from '../suggestionData';

interface VirtualCornerInputProps {
  userImage: ImageData | null;
  prompt: string;
  aspectRatio: string;
  isLoading: boolean;
  onImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onPromptChange: (value: string) => void;
  onAspectRatioChange: (value: string) => void;
  onSuggestionSelect: (prompt: string) => void;
  onSubmit: () => void;
}

const aspectRatios = ['1:1', '9:16', '16:9', '4:5', '3:4', '4:3'];

// Split suggestions into two categories
const contextSuggestions = suggestionData.filter(s => !s.name.startsWith('Tạo dáng'));
const poseSuggestions = suggestionData.filter(s => s.name.startsWith('Tạo dáng'));

const VirtualCornerInput: React.FC<VirtualCornerInputProps> = ({
  userImage,
  prompt,
  aspectRatio,
  isLoading,
  onImageChange,
  onPromptChange,
  onAspectRatioChange,
  onSuggestionSelect,
  onSubmit,
}) => {
  const isSubmitDisabled = isLoading || !userImage || !prompt;
  const [isContextSuggestionsExpanded, setIsContextSuggestionsExpanded] = useState(false);
  const [isPoseSuggestionsExpanded, setIsPoseSuggestionsExpanded] = useState(false);

  return (
    <div className="flex flex-col gap-6 p-6 bg-gray-800 rounded-2xl shadow-lg">
      <div>
        <label className="block text-lg font-semibold mb-2 text-gray-300">
          1. Đăng ảnh của bạn
        </label>
         <div className="w-full aspect-square bg-gray-900/50 rounded-xl flex items-center justify-center relative group">
            <input
                type="file"
                id="user-image-upload"
                accept="image/*"
                onChange={onImageChange}
                className="hidden"
            />
            <label
                htmlFor="user-image-upload"
                className="w-full h-full cursor-pointer flex items-center justify-center"
                aria-label="Ảnh của bạn"
            >
                {userImage ? (
                <img
                    src={`data:${userImage.mimeType};base64,${userImage.base64}`}
                    alt="Ảnh của bạn"
                    className="object-contain w-full h-full rounded-xl"
                />
                ) : (
                <ImagePlaceholder label="Ảnh của bạn" icon={<UploadIcon className="w-8 h-8" />} />
                )}
            </label>
        </div>
      </div>

      {/* Context Suggestions Section */}
      <div>
        <div className="flex justify-between items-center mb-2">
            <label className="block text-lg font-semibold text-gray-300">Hoặc chọn một gợi ý</label>
            <button 
                onClick={() => setIsContextSuggestionsExpanded(!isContextSuggestionsExpanded)}
                className="text-sm font-medium text-yellow-400 hover:text-yellow-300 focus:outline-none"
            >
                {isContextSuggestionsExpanded ? 'Thu gọn' : 'Xem tất cả'}
            </button>
        </div>
        <div 
            className={`bg-gray-900/50 rounded-xl p-4 overflow-hidden transition-all duration-300 ease-in-out ${
                isContextSuggestionsExpanded ? 'max-h-72 overflow-y-auto' : 'max-h-24'
            }`}
        >
           <div className="flex flex-wrap gap-2">
              {contextSuggestions.map((suggestion, index) => (
                <button 
                  key={index} 
                  onClick={() => onSuggestionSelect(suggestion.name)}
                  className="px-3 py-1.5 bg-gray-700 text-gray-300 text-sm rounded-full hover:bg-yellow-600 hover:text-white transition-colors duration-200"
                  title={suggestion.name}
                >
                  {suggestion.name}
                </button>
              ))}
            </div>
        </div>
      </div>

      {/* Pose Suggestions Section */}
      <div>
        <div className="flex justify-between items-center mb-2">
            <label className="block text-lg font-semibold text-gray-300">Gợi Ý Tạo Dáng Sống Ảo</label>
            <button 
                onClick={() => setIsPoseSuggestionsExpanded(!isPoseSuggestionsExpanded)}
                className="text-sm font-medium text-yellow-400 hover:text-yellow-300 focus:outline-none"
            >
                {isPoseSuggestionsExpanded ? 'Thu gọn' : 'Xem tất cả'}
            </button>
        </div>
        <div 
            className={`bg-gray-900/50 rounded-xl p-4 overflow-hidden transition-all duration-300 ease-in-out ${
                isPoseSuggestionsExpanded ? 'max-h-72 overflow-y-auto' : 'max-h-24'
            }`}
        >
           <div className="flex flex-wrap gap-2">
              {poseSuggestions.map((suggestion, index) => (
                <button 
                  key={index} 
                  onClick={() => onSuggestionSelect(suggestion.name)}
                  className="px-3 py-1.5 bg-gray-700 text-gray-300 text-sm rounded-full hover:bg-yellow-600 hover:text-white transition-colors duration-200"
                  title={suggestion.name}
                >
                  {suggestion.name}
                </button>
              ))}
            </div>
        </div>
      </div>

      <div>
        <label htmlFor="prompt-input-virtual" className="block text-lg font-semibold mb-2 text-gray-300">
          2. Mô tả bối cảnh bạn muốn
        </label>
        <textarea
          id="prompt-input-virtual"
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          placeholder="ví dụ: 'đang đứng trên bãi biển lúc hoàng hôn' hoặc 'trong một quán cà phê ở Paris'"
          className="w-full h-32 p-4 bg-gray-700 border-2 border-gray-600 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors duration-200 resize-none"
          aria-label="Nhập mô tả bối cảnh"
        />
      </div>
        
      <div>
        <label className="block text-lg font-semibold mb-2 text-gray-300">
          3. Chọn tỷ lệ ảnh đầu ra
        </label>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {aspectRatios.map((ratio) => (
            <button
              key={ratio}
              onClick={() => onAspectRatioChange(ratio)}
              className={`py-2 px-3 text-sm font-semibold rounded-lg transition-colors ${
                aspectRatio === ratio
                  ? 'bg-yellow-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {ratio}
            </button>
          ))}
        </div>
      </div>
     
      <button
        onClick={onSubmit}
        disabled={isSubmitDisabled}
        className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold rounded-xl shadow-lg hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        {isLoading ? 'Đang xử lý...' : 'Tạo ảnh sống ảo'}
        {!isLoading && <SparklesIcon className="w-5 h-5" />}
      </button>
    </div>
  );
};

export default VirtualCornerInput;