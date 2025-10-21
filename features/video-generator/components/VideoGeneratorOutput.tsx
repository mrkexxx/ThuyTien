import React, { useState, useEffect } from 'react';
import type { GenerateVideoResult } from '../types';
import ImagePlaceholder from '../../../components/ImagePlaceholder';
import VideoIcon from '../../../components/icons/VideoIcon';

interface VideoGeneratorOutputProps {
  result: GenerateVideoResult | null;
  isLoading: boolean;
  error: string | null;
}

const loadingMessages = [
  "Đang liên hệ với mô hình tạo video...",
  "Đang phác thảo kịch bản cho video của bạn...",
  "Đang kết xuất những khung hình đầu tiên...",
  "Việc này có thể mất vài phút, xin vui lòng đợi...",
  "AI đang làm việc chăm chỉ...",
  "Đang thêm những chi tiết cuối cùng...",
  "Video của bạn sắp hoàn thành rồi!",
];

const VideoGeneratorOutput: React.FC<VideoGeneratorOutputProps> = ({ result, isLoading, error }) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % loadingMessages.length);
      }, 3000); // Change message every 3 seconds
      return () => clearInterval(interval);
    }
  }, [isLoading]);
  
  // Clean up Object URL when component unmounts or result changes
  useEffect(() => {
    return () => {
      if (result?.videoUrl) {
        URL.revokeObjectURL(result.videoUrl);
      }
    }
  }, [result]);

  return (
    <div className="flex flex-col gap-6 p-6 bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl shadow-lg">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-200">3. Kết quả do AI tạo ra</h3>
        <div className="w-full aspect-video bg-gray-800/40 rounded-xl flex items-center justify-center relative overflow-hidden border border-gray-700/50">
          {isLoading && (
            <div className="flex flex-col items-center gap-3 text-gray-400 text-center px-4" aria-label="Đang tải kết quả">
              <svg className="animate-spin h-10 w-10 text-cyan-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="font-medium">{loadingMessages[currentMessageIndex]}</span>
            </div>
          )}
          {error && (
            <div className="p-4 text-center text-red-400" role="alert">
              <h3 className="font-bold">Đã xảy ra lỗi</h3>
              <p className="text-sm">{error}</p>
            </div>
          )}
          {!isLoading && !error && result?.videoUrl && (
            <video
                src={result.videoUrl}
                controls
                autoPlay
                loop
                className="object-contain w-full h-full rounded-xl"
              />
          )}
          {!isLoading && !error && !result && (
            <ImagePlaceholder label="Video bạn tạo sẽ xuất hiện ở đây" icon={<VideoIcon className="w-10 h-10" />} />
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoGeneratorOutput;