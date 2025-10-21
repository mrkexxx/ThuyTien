import React, { useState } from 'react';
import ImagePlaceholder from '../../../components/ImagePlaceholder';
import SparklesIcon from '../../../components/icons/SparklesIcon';
import UploadIcon from '../../../components/icons/UploadIcon';
import type { ImageData } from '../types';
import { suggestionData } from '../suggestionData';
import Accordion from '../../../components/Accordion';

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

const aspectRatios = ['9:16', '1:1', '16:9', '4:5', '3:4', '4:3'];
const contextSuggestions = suggestionData.filter(s => !s.name.startsWith('Tạo dáng'));

const VirtualCornerInput: React.FC<VirtualCornerInputProps> = ({
  userImage, prompt, aspectRatio, isLoading, onImageChange, onPromptChange, onAspectRatioChange, onSuggestionSelect, onSubmit,
}) => {
  const isSubmitDisabled = isLoading || !userImage || !prompt;

  return (
    <div className="flex flex-col gap-6 p-6 bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl shadow-lg">
      <div className="space-y-4">
        <Accordion title="1. Đăng ảnh của bạn" defaultOpen={true}>
            <div className="w-full aspect-square bg-gray-800/40 rounded-xl flex items-center justify-center relative group border-2 border-dashed border-gray-700">
                <input type="file" id="user-image-upload" accept="image/*" onChange={onImageChange} className="hidden" />
                <label htmlFor="user-image-upload" className="w-full h-full cursor-pointer flex items-center justify-center" aria-label="Ảnh của bạn">
                    {userImage ? (
                    <img src={`data:${userImage.mimeType};base64,${userImage.base64}`} alt="Ảnh của bạn" className="object-contain w-full h-full rounded-xl"/>
                    ) : (
                    <ImagePlaceholder label="Tải ảnh của bạn" icon={<UploadIcon className="w-8 h-8 text-gray-500 group-hover:text-gray-400" />} />
                    )}
                </label>
            </div>
        </Accordion>
        
        <Accordion title="2. Chọn gợi ý hoặc tự mô tả" defaultOpen={true}>
          <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Gợi ý bối cảnh sống ảo</label>
                <div className="max-h-48 overflow-y-auto custom-scrollbar bg-gray-800/50 p-3 rounded-lg border border-gray-700/50">
                    <div className="flex flex-wrap gap-2">
                        {contextSuggestions.map((suggestion, index) => (
                            <button key={index} onClick={() => onSuggestionSelect(suggestion.name)} className="px-3 py-1.5 bg-gray-700/80 text-gray-300 text-sm rounded-full hover:bg-yellow-600 hover:text-white transition-colors duration-200" title={suggestion.name}>
                            {suggestion.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
            <div>
              <label htmlFor="prompt-input-virtual" className="block text-sm font-medium mb-2 text-gray-300">Mô tả bối cảnh bạn muốn</label>
              <textarea id="prompt-input-virtual" value={prompt} onChange={(e) => onPromptChange(e.target.value)} placeholder="ví dụ: 'đang đứng trên bãi biển lúc hoàng hôn'" className="w-full h-24 p-3 bg-gray-800 border border-gray-700 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors resize-none custom-scrollbar"/>
            </div>
          </div>
        </Accordion>

        <Accordion title="3. Cài đặt đầu ra">
             <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-300">Tỷ lệ khung hình</h3>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {aspectRatios.map((ratio) => (
                    <button key={ratio} onClick={() => onAspectRatioChange(ratio)} className={`py-2 px-3 text-sm font-semibold rounded-lg transition-all duration-200 outline-none focus:ring-2 ring-offset-2 ring-offset-[#0D1117] ${aspectRatio === ratio ? 'bg-yellow-600 text-white ring-yellow-500' : 'bg-gray-700/80 text-gray-300 hover:bg-gray-700'}`}>{ratio}</button>
                    ))}
                </div>
            </div>
        </Accordion>
      </div>
     
      <button
        onClick={onSubmit}
        disabled={isSubmitDisabled}
        className="w-full flex items-center justify-center gap-3 py-3 px-6 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold rounded-xl shadow-lg hover:shadow-yellow-500/30 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
      >
        <SparklesIcon className="w-5 h-5" />
        {isLoading ? 'Đang xử lý...' : 'Tạo ảnh sống ảo'}
      </button>
    </div>
  );
};

export default VirtualCornerInput;