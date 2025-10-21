import React from 'react';
import SparklesIcon from '../../../components/icons/SparklesIcon';
import UploadIcon from '../../../components/icons/UploadIcon';
import ImagePlaceholder from '../../../components/ImagePlaceholder';

interface VideoGeneratorInputProps {
  prompt: string;
  inputImage: string | null;
  inputImageType: string | null;
  isLoading: boolean;
  onPromptChange: (value: string) => void;
  onImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: () => void;
  onSubmit: () => void;
}

const VideoGeneratorInput: React.FC<VideoGeneratorInputProps> = ({
  prompt,
  inputImage,
  inputImageType,
  isLoading,
  onPromptChange,
  onImageChange,
  onRemoveImage,
  onSubmit,
}) => {
  const isSubmitDisabled = isLoading || !prompt;

  return (
    <div className="flex flex-col gap-6 p-6 bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl shadow-lg">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-200">1. Mô tả video bạn muốn tạo</h3>
        <textarea
          id="prompt-input-video"
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          placeholder="ví dụ: 'Một con tàu vũ trụ neon đang bay qua một thành phố tương lai vào một đêm mưa'"
          className="w-full h-32 p-4 bg-gray-800 border border-gray-700 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors duration-200 resize-none custom-scrollbar"
          aria-label="Nhập mô tả để tạo video"
        />
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-200">2. Thêm hình ảnh ban đầu (Tùy chọn)</h3>
        <div className="w-full aspect-video bg-gray-800/40 rounded-xl flex items-center justify-center relative border-2 border-dashed border-gray-700">
          <input
            type="file"
            id="image-upload-video"
            accept="image/*"
            onChange={onImageChange}
            className="hidden"
          />
          <label
            htmlFor="image-upload-video"
            className="w-full h-full cursor-pointer flex items-center justify-center group"
            aria-label="Tải ảnh lên"
          >
            {inputImage ? (
              <img
                src={`data:${inputImageType};base64,${inputImage}`}
                alt="Ảnh đầu vào"
                className="object-contain w-full h-full rounded-xl"
              />
            ) : (
              <ImagePlaceholder label="Nhấn để tải ảnh lên" icon={<UploadIcon className="w-10 h-10 text-gray-500 group-hover:text-gray-400 transition-colors" />} />
            )}
          </label>
           {inputImage && (
            <button 
                onClick={onRemoveImage}
                className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1.5 hover:bg-black/80 transition-colors z-10"
                aria-label="Xóa ảnh"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
           )}
        </div>
      </div>

      <button
        onClick={onSubmit}
        disabled={isSubmitDisabled}
        className="w-full flex items-center justify-center gap-3 py-3 px-6 bg-gradient-to-r from-cyan-500 to-green-500 text-white font-bold rounded-xl shadow-lg hover:shadow-cyan-500/30 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
      >
        <SparklesIcon className="w-5 h-5" />
        {isLoading ? 'Đang tạo...' : 'Tạo video'}
      </button>
    </div>
  );
};

export default VideoGeneratorInput;