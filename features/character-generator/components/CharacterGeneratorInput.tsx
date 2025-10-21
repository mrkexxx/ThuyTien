import React from 'react';
import ImagePlaceholder from '../../../components/ImagePlaceholder';
import SparklesIcon from '../../../components/icons/SparklesIcon';
import UploadIcon from '../../../components/icons/UploadIcon';
import type { CharacterImage } from '../types';
import Accordion from '../../../components/Accordion';

interface CharacterGeneratorInputProps {
  characterImages: (CharacterImage | null)[];
  prompt: string;
  aspectRatio: string;
  isLoading: boolean;
  onImageChange: (event: React.ChangeEvent<HTMLInputElement>, index: number) => void;
  onPromptChange: (value: string) => void;
  onAspectRatioChange: (value: string) => void;
  onSubmit: () => void;
}

const aspectRatios = ['1:1', '9:16', '16:9', '4:5', '3:4', '4:3'];

const CharacterGeneratorInput: React.FC<CharacterGeneratorInputProps> = ({
  characterImages,
  prompt,
  aspectRatio,
  isLoading,
  onImageChange,
  onPromptChange,
  onAspectRatioChange,
  onSubmit,
}) => {
  const isSubmitDisabled = isLoading || characterImages.every(img => img === null) || !prompt;
  const primaryImage = characterImages[0];
  const additionalImages = characterImages.slice(1);

  return (
    <div className="flex flex-col gap-6 p-6 bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl shadow-lg">
      <div className="space-y-4">
        <Accordion title="1. Tải ảnh nhân vật" defaultOpen={true}>
            <div className="flex flex-col gap-4">
                <div>
                    <label htmlFor="character-image-upload-0" className="block text-sm font-semibold mb-2 text-gray-300">Ảnh chính (Quan trọng nhất)</label>
                    <div className="w-full aspect-square bg-gray-800/40 rounded-xl flex items-center justify-center relative group border-2 border-dashed border-gray-700">
                        <input type="file" id="character-image-upload-0" accept="image/*" onChange={(e) => onImageChange(e, 0)} className="hidden"/>
                        <label htmlFor="character-image-upload-0" className="w-full h-full cursor-pointer flex items-center justify-center" aria-label="Tải ảnh nhân vật chính">
                        {primaryImage ? (
                            <img src={`data:${primaryImage.mimeType};base64,${primaryImage.base64}`} alt="Nhân vật chính" className="object-contain w-full h-full rounded-xl" />
                        ) : (
                            <ImagePlaceholder label="Tải ảnh chính" icon={<UploadIcon className="w-8 h-8 text-gray-500 group-hover:text-gray-400" />} />
                        )}
                        </label>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-300">Ảnh tham chiếu bổ sung (Tùy chọn)</label>
                    <div className="grid grid-cols-4 gap-3">
                        {Array.from({ length: 4 }).map((_, index) => {
                            const actualIndex = index + 1;
                            const image = additionalImages[index];
                            const inputId = `character-image-upload-${actualIndex}`;
                            return (
                                <div key={actualIndex} className="w-full aspect-square bg-gray-800/40 rounded-xl flex items-center justify-center relative group border-2 border-dashed border-gray-700">
                                    <input type="file" id={inputId} accept="image/*" onChange={(e) => onImageChange(e, actualIndex)} className="hidden" />
                                    <label htmlFor={inputId} className="w-full h-full cursor-pointer flex items-center justify-center text-xs" aria-label={`Tải ảnh nhân vật ${actualIndex + 1}`}>
                                    {image ? (
                                        <img src={`data:${image.mimeType};base64,${image.base64}`} alt={`Nhân vật ${actualIndex + 1}`} className="object-contain w-full h-full rounded-xl" />
                                    ) : (
                                        <ImagePlaceholder label={`Ảnh ${actualIndex}`} icon={<UploadIcon className="w-5 h-5 text-gray-500 group-hover:text-gray-400" />} />
                                    )}
                                    </label>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </Accordion>
        
        <Accordion title="2. Mô tả & Cài đặt">
          <div className="space-y-4">
            <div>
              <label htmlFor="prompt-input-character" className="block text-sm font-medium mb-2 text-gray-300">Mô tả bối cảnh hoặc hành động</label>
              <textarea id="prompt-input-character" value={prompt} onChange={(e) => onPromptChange(e.target.value)} placeholder="ví dụ: 'nhân vật đang đọc sách trong một quán cà phê ấm cúng'" className="w-full h-24 p-3 bg-gray-800 border border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors resize-none custom-scrollbar" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Chọn tỷ lệ khung hình</label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {aspectRatios.map((ratio) => (
                  <button key={ratio} onClick={() => onAspectRatioChange(ratio)} className={`py-2 px-3 text-sm font-semibold rounded-lg transition-all duration-200 outline-none focus:ring-2 ring-offset-2 ring-offset-[#0D1117] ${aspectRatio === ratio ? 'bg-green-600 text-white ring-green-500' : 'bg-gray-700/80 text-gray-300 hover:bg-gray-700'}`}>{ratio}</button>
                ))}
              </div>
            </div>
          </div>
        </Accordion>
      </div>

      <button
        onClick={onSubmit}
        disabled={isSubmitDisabled}
        className="w-full flex items-center justify-center gap-3 py-3 px-6 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-xl shadow-lg hover:shadow-green-500/30 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
      >
        <SparklesIcon className="w-5 h-5" />
        {isLoading ? 'Đang tạo...' : 'Tạo ảnh nhân vật'}
      </button>
    </div>
  );
};

export default CharacterGeneratorInput;