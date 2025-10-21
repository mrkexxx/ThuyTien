import React from 'react';
import ImagePlaceholder from './ImagePlaceholder';
import SparklesIcon from './icons/SparklesIcon';
import UploadIcon from './icons/UploadIcon';

interface ImageInputProps {
  originalImage: string | null;
  originalImageType: string | null;
  prompt: string;
  isLoading: boolean;
  onImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onPromptChange: (value: string) => void;
  onSubmit: () => void;
}

const ImageInput: React.FC<ImageInputProps> = ({
  originalImage,
  originalImageType,
  prompt,
  isLoading,
  onImageChange,
  onPromptChange,
  onSubmit,
}) => {
  const isSubmitDisabled = isLoading || !originalImage || !prompt;

  return (
    <div className="flex flex-col gap-6 p-6 bg-gray-800 rounded-2xl shadow-lg">
      <div>
        <label htmlFor="image-upload" className="block text-lg font-semibold mb-2 text-gray-300">
          1. Tải ảnh của bạn lên
        </label>
        <div className="w-full aspect-square bg-gray-900/50 rounded-xl flex items-center justify-center">
          <input
            type="file"
            id="image-upload"
            accept="image/*"
            onChange={onImageChange}
            className="hidden"
          />
          <label
            htmlFor="image-upload"
            className="w-full h-full cursor-pointer flex items-center justify-center"
            aria-label="Tải ảnh lên"
          >
            {originalImage ? (
              <img
                src={`data:${originalImageType};base64,${originalImage}`}
                alt="Ảnh gốc"
                className="object-contain w-full h-full rounded-xl"
              />
            ) : (
              <ImagePlaceholder label="Nhấn để tải ảnh lên" icon={<UploadIcon className="w-10 h-10" />} />
            )}
          </label>
        </div>
      </div>

      <div>
        <label htmlFor="prompt-input" className="block text-lg font-semibold mb-2 text-gray-300">
          2. Mô tả chỉnh sửa của bạn
        </label>
        <textarea
          id="prompt-input"
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          placeholder="ví dụ: 'thêm một chiếc mũ tiệc tùng dễ thương cho con mèo' hoặc 'biến nền thành một dải ngân hà'"
          className="w-full h-32 p-4 bg-gray-700 border-2 border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200 resize-none"
          aria-label="Nhập mô tả chỉnh sửa"
        />
      </div>
      <button
        onClick={onSubmit}
        disabled={isSubmitDisabled}
        className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl shadow-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        {isLoading ? 'Đang tạo...' : 'Tạo ảnh'}
        {!isLoading && <SparklesIcon className="w-5 h-5" />}
      </button>
    </div>
  );
};

export default ImageInput;
