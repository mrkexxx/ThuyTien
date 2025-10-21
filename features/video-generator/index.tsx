import React, { useState, useCallback } from 'react';
import { generateVideo } from './services/geminiService';
import type { GenerateVideoResult } from './types';
import VideoGeneratorInput from './components/VideoGeneratorInput';
import VideoGeneratorOutput from './components/VideoGeneratorOutput';

const VideoGenerator: React.FC = () => {
  const [inputImage, setInputImage] = useState<string | null>(null);
  const [inputImageType, setInputImageType] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [result, setResult] = useState<GenerateVideoResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setResult(null);
      setError(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        setInputImage(base64String);
        setInputImageType(file.type);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleRemoveImage = () => {
      setInputImage(null);
      setInputImageType(null);
  }

  const handleSubmit = useCallback(async () => {
    if (!prompt) {
      setError('Vui lòng nhập mô tả để tạo video.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const apiResult = await generateVideo(prompt, inputImage, inputImageType);
      setResult(apiResult);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Đã xảy ra một lỗi không mong muốn.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [prompt, inputImage, inputImageType]);

  return (
    <>
      <header className="text-center mb-8">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-500">
          Veo AI Video Generator
        </h1>
        <p className="mt-2 text-lg text-gray-400">
          Biến ý tưởng của bạn thành video chuyển động. Mô tả một cảnh, và AI sẽ tạo ra nó.
        </p>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <VideoGeneratorInput
          prompt={prompt}
          inputImage={inputImage}
          inputImageType={inputImageType}
          isLoading={isLoading}
          onPromptChange={setPrompt}
          onImageChange={handleImageChange}
          onRemoveImage={handleRemoveImage}
          onSubmit={handleSubmit}
        />
        <VideoGeneratorOutput
          result={result}
          isLoading={isLoading}
          error={error}
        />
      </main>
    </>
  );
};

export default VideoGenerator;