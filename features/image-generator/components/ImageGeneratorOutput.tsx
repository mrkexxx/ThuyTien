import React from 'react';
import type { GenerateImageResult } from '../types';
import ImagePlaceholder from '../../../components/ImagePlaceholder';
import ImageIcon from '../../../components/icons/ImageIcon';
import DownloadIcon from '../../../components/icons/DownloadIcon';

interface ImageGeneratorOutputProps {
  result: GenerateImageResult | null;
  isLoading: boolean;
  error: string | null;
  aspectRatio: string;
}

const ImageGeneratorOutput: React.FC<ImageGeneratorOutputProps> = ({ result, isLoading, error, aspectRatio }) => {
  const getAspectRatioClass = (ratio: string): string => {
    switch (ratio) {
      case '1:1':
        return 'aspect-square';
      case '16:9':
        return 'aspect-video';
      case '9:16':
        return 'aspect-[9/16]';
      case '4:3':
        return 'aspect-[4/3]';
      case '3:4':
        return 'aspect-[3/4]';
      default:
        return 'aspect-square';
    }
  };

  const aspectRatioClass = getAspectRatioClass(aspectRatio);

  const handleDownload = () => {
    if (!result?.images?.[0]) return;
    const link = document.createElement('a');
    link.href = result.images[0];
    link.download = 'ai-image-generator-result.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col gap-4 p-6 bg-gray-800 rounded-2xl shadow-lg lg:col-span-1">
      <h2 className="text-lg font-semibold text-gray-300">3. Kết quả do AI tạo ra</h2>
      <div className={`w-full ${aspectRatioClass} bg-gray-900/50 rounded-xl flex items-center justify-center relative`}>
        {isLoading && (
          <div className="flex flex-col items-center gap-2 text-gray-400" aria-label="Đang tải kết quả">
            <svg className="animate-spin h-10 w-10 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
        {!isLoading && !error && result?.images?.[0] && (
           <img
              src={result.images[0]}
              alt="Kết quả do AI tạo ra"
              className="object-contain w-full h-full rounded-xl"
            />
        )}
         {!isLoading && !error && !result && (
          <ImagePlaceholder label="Hình ảnh bạn tạo sẽ xuất hiện ở đây" icon={<ImageIcon className="w-10 h-10" />} />
        )}
      </div>

      {!isLoading && !error && result?.images?.[0] && (
        <button
          onClick={handleDownload}
          className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-gray-700 text-white font-semibold rounded-xl shadow-md hover:bg-gray-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500"
          aria-label="Tải ảnh kết quả xuống"
        >
          <DownloadIcon className="w-5 h-5" />
          Tải ảnh xuống
        </button>
      )}
    </div>
  );
};

export default ImageGeneratorOutput;