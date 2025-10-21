import React from 'react';
import SparklesIcon from '../../../components/icons/SparklesIcon';

interface ImageGeneratorInputProps {
  prompt: string;
  aspectRatio: string;
  isLoading: boolean;
  onPromptChange: (value: string) => void;
  onAspectRatioChange: (value: string) => void;
  onSubmit: () => void;
}

const aspectRatios = ['1:1', '9:16', '16:9', '4:3', '3:4'];

const ImageGeneratorInput: React.FC<ImageGeneratorInputProps> = ({
  prompt,
  aspectRatio,
  isLoading,
  onPromptChange,
  onAspectRatioChange,
  onSubmit,
}) => {
  const isSubmitDisabled = isLoading || !prompt;

  return (
    <div className="flex flex-col gap-6 p-6 bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl shadow-lg">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-200">1. Mô tả hình ảnh bạn muốn tạo</h3>
        <textarea
          id="prompt-input-generator"
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          placeholder="ví dụ: 'Một con mèo phi hành gia dễ thương đang cưỡi ván trượt trong không gian, nghệ thuật kỹ thuật số'"
          className="w-full h-40 p-4 bg-gray-800 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 resize-none custom-scrollbar"
          aria-label="Nhập mô tả để tạo ảnh"
        />
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-200">2. Chọn tỷ lệ khung hình</h3>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {aspectRatios.map((ratio) => (
            <button
              key={ratio}
              onClick={() => onAspectRatioChange(ratio)}
              className={`py-2 px-3 text-sm font-semibold rounded-lg transition-all duration-200 outline-none focus:ring-2 ring-offset-2 ring-offset-[#0D1117] ${
                aspectRatio === ratio
                  ? 'bg-blue-600 text-white ring-blue-500'
                  : 'bg-gray-700/80 text-gray-300 hover:bg-gray-700'
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
        className="w-full flex items-center justify-center gap-3 py-3 px-6 bg-gradient-to-r from-blue-500 to-teal-500 text-white font-bold rounded-xl shadow-lg hover:shadow-blue-500/30 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
      >
        <SparklesIcon className="w-5 h-5" />
        {isLoading ? 'Đang tạo...' : 'Tạo ảnh'}
      </button>
    </div>
  );
};

export default ImageGeneratorInput;