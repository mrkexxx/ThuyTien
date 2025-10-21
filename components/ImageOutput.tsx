import React from 'react';
import type { EditImageResult } from '../types';
import ImagePlaceholder from './ImagePlaceholder';

interface ImageOutputProps {
  result: EditImageResult | null;
  isLoading: boolean;
  error: string | null;
}

const ImageOutput: React.FC<ImageOutputProps> = ({ result, isLoading, error }) => {
  return (
    <div className="flex flex-col gap-4 p-6 bg-gray-800 rounded-2xl shadow-lg">
      <h2 className="text-lg font-semibold text-gray-300">3. Kết quả do AI tạo ra</h2>
      <div className="w-full aspect-square bg-gray-900/50 rounded-xl flex items-center justify-center relative">
        {isLoading && (
          <div className="flex flex-col items-center gap-2 text-gray-400" aria-label="Đang tải kết quả">
            <svg className="animate-spin h-10 w-10 text-purple-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Đang tạo hình ảnh của bạn...</span>
          </div>
        )}
        {error && (
          <div className="p-4 text-center text-red-400" role="alert">
            <h3 className="font-bold">Đã xảy ra lỗi</h3>
            <p className="text-sm">{error}</p>
          </div>
        )}
        {!isLoading && !error && result?.image && (
           <img
              src={result.image}
              alt="Kết quả đã chỉnh sửa"
              className="object-contain w-full h-full rounded-xl"
            />
        )}
         {!isLoading && !error && !result && (
          <ImagePlaceholder label="Hình ảnh đã chỉnh sửa của bạn sẽ xuất hiện ở đây" />
        )}
      </div>
      {result?.text && (
        <div className="p-4 bg-gray-700 rounded-xl">
          <p className="text-gray-300">{result.text}</p>
        </div>
      )}
    </div>
  );
};

export default ImageOutput;
