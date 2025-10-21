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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
    </div>
  );
};

export default VideoGenerator;