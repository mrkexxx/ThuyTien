import React from 'react';
import ImagePlaceholder from '../../../components/ImagePlaceholder';
import SparklesIcon from '../../../components/icons/SparklesIcon';
import UploadIcon from '../../../components/icons/UploadIcon';

interface ImageInputProps {
  originalImage: string | null;
  originalImageType: string | null;
  prompt: string;
  aspectRatio: string;
  isLoading: boolean;
  onImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onPromptChange: (value: string) => void;
  onAspectRatioChange: (value: string) => void;
  onSubmit: () => void;
}

const aspectRatios = ['1:1', '9:16', '16:9', '4:5', '3:4', '4:3'];

const ImageInput: React.FC<ImageInputProps> = ({
  originalImage,
  originalImageType,
  prompt,
  aspectRatio,
  isLoading,
  onImageChange,
  onPromptChange,
  onAspectRatioChange,
  onSubmit,
}) => {
  const isSubmitDisabled = isLoading || !originalImage || !prompt;

  return (
    <div className="flex flex-col gap-6 p-6 bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl shadow-lg">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-200">1. Tải ảnh của bạn lên</h3>
        <div className="w-full aspect-square bg-gray-800/40 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-700">
          <input
            type="file"
            id="image-upload"
            accept="image/*"
            onChange={onImageChange}
            className="hidden"
          />
          <label
            htmlFor="image-upload"
            className="w-full h-full cursor-pointer flex items-center justify-center group"
            aria-label="Tải ảnh lên"
          >
            {originalImage ? (
              <img
                src={`data:${originalImageType};base64,${originalImage}`}
                alt="Ảnh gốc"
                className="object-contain w-full h-full rounded-xl"
              />
            ) : (
              <ImagePlaceholder label="Nhấn để tải ảnh lên" icon={<UploadIcon className="w-10 h-10 text-gray-500 group-hover:text-gray-400 transition-colors" />} />
            )}
          </label>
        </div>
      </div>
      
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-200">2. Chọn tỷ lệ khung hình</h3>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {aspectRatios.map((ratio) => (
            <button
              key={ratio}
              onClick={() => onAspectRatioChange(ratio)}
              className={`py-2 px-3 text-sm font-semibold rounded-lg transition-all duration-200 outline-none focus:ring-2 ring-offset-2 ring-offset-[#0D1117] ${
                aspectRatio === ratio
                  ? 'bg-purple-600 text-white ring-purple-500'
                  : 'bg-gray-700/80 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {ratio}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-200">3. Mô tả chỉnh sửa của bạn</h3>
        <textarea
          id="prompt-input"
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          placeholder="ví dụ: 'thêm một chiếc mũ tiệc tùng dễ thương cho con mèo' hoặc 'biến nền thành một dải ngân hà'"
          className="w-full h-32 p-4 bg-gray-800 border border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200 resize-none custom-scrollbar"
          aria-label="Nhập mô tả chỉnh sửa"
        />
      </div>
      <button
        onClick={onSubmit}
        disabled={isSubmitDisabled}
        className="w-full flex items-center justify-center gap-3 py-3 px-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl shadow-lg hover:shadow-purple-500/30 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
      >
        <SparklesIcon className="w-5 h-5" />
        {isLoading ? 'Đang tạo...' : 'Tạo ảnh'}
      </button>
    </div>
  );
};

export default ImageInput;