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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
    </div>
  );
};

export default ImageGenerator;