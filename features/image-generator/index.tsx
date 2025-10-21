import React, { useState, useCallback } from 'react';
import { generateImage } from './services/geminiService';
import type { GenerateImageResult } from './types';
import ImageGeneratorInput from './components/ImageGeneratorInput';
import ImageGeneratorOutput from './components/ImageGeneratorOutput';

const ImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [aspectRatio, setAspectRatio] = useState<string>('1:1');
  const [result, setResult] = useState<GenerateImageResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(async () => {
    if (!prompt) {
      setError('Vui lòng nhập mô tả để tạo ảnh.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const apiResult = await generateImage(prompt, aspectRatio);
      setResult(apiResult);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Đã xảy ra một lỗi không mong muốn.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [prompt, aspectRatio]);

  return (
    <>
      <header className="text-center mb-8">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-500">
          Text To Image
        </h1>
        <p className="mt-2 text-lg text-gray-400">
          Mô tả bất cứ điều gì bạn có thể tưởng tượng và để AI biến nó thành hình ảnh.
        </p>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ImageGeneratorInput
          prompt={prompt}
          aspectRatio={aspectRatio}
          isLoading={isLoading}
          onPromptChange={setPrompt}
          onAspectRatioChange={setAspectRatio}
          onSubmit={handleSubmit}
        />
        <ImageGeneratorOutput
          result={result}
          isLoading={isLoading}
          error={error}
          aspectRatio={aspectRatio}
        />
      </main>
    </>
  );
};

export default ImageGenerator;