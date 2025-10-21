
import React, { useState, useCallback } from 'react';
import { createVirtualScene } from './services/geminiService';
import type { VirtualCornerResult, ImageData } from './types';
import VirtualCornerInput from './components/VirtualCornerInput';
import VirtualCornerOutput from './components/VirtualCornerOutput';

const VirtualCorner: React.FC = () => {
  const [userImage, setUserImage] = useState<ImageData | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [aspectRatio, setAspectRatio] = useState<string>('1:1');
  const [result, setResult] = useState<VirtualCornerResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setResult(null);
      setError(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        const newImageData = { base64: base64String, mimeType: file.type };
        setUserImage(newImageData);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSuggestionSelect = (suggestionPrompt: string) => {
    setPrompt(suggestionPrompt);
  };

  const handleSubmit = useCallback(async () => {
    if (!userImage || !prompt) {
      setError('Vui lòng tải lên ảnh và mô tả bối cảnh.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const apiResult = await createVirtualScene(userImage, prompt, aspectRatio);
      setResult(apiResult);
      // FIX: Added missing opening brace to the catch block to correct syntax error.
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Đã xảy ra một lỗi không mong muốn.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [userImage, prompt, aspectRatio]);

  return (
    <>
      <header className="text-center mb-8">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
          Góc Sống Ảo
        </h1>
        <p className="mt-2 text-lg text-gray-400">
          Kết hợp ảnh của bạn với một bối cảnh hoặc phong cách gợi ý để tạo ra một bức ảnh độc đáo.
        </p>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <VirtualCornerInput
          userImage={userImage}
          prompt={prompt}
          aspectRatio={aspectRatio}
          isLoading={isLoading}
          onImageChange={handleImageChange}
          onPromptChange={setPrompt}
          onAspectRatioChange={setAspectRatio}
          onSuggestionSelect={handleSuggestionSelect}
          onSubmit={handleSubmit}
        />
        <VirtualCornerOutput
          result={result}
          isLoading={isLoading}
          error={error}
          aspectRatio={aspectRatio}
        />
      </main>
    </>
  );
};

export default VirtualCorner;