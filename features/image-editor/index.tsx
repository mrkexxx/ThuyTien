import React, { useState, useCallback } from 'react';
import { editImage } from './services/geminiService';
import type { EditImageResult } from './types';
import ImageInput from './components/ImageInput';
import ImageOutput from './components/ImageOutput';

const ImageEditor: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [originalImageType, setOriginalImageType] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [aspectRatio, setAspectRatio] = useState<string>('1:1');
  const [result, setResult] = useState<EditImageResult | null>(null);
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
        setOriginalImage(base64String);
        setOriginalImageType(file.type);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = useCallback(async () => {
    if (!originalImage || !prompt || !originalImageType) {
      setError('Vui lòng tải lên một hình ảnh và cung cấp một câu lệnh chỉnh sửa.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const apiResult = await editImage(originalImage, originalImageType, prompt, aspectRatio);
      setResult(apiResult);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Đã xảy ra một lỗi không mong muốn.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [originalImage, originalImageType, prompt, aspectRatio]);

  return (
    <>
      <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ImageInput
          originalImage={originalImage}
          originalImageType={originalImageType}
          prompt={prompt}
          aspectRatio={aspectRatio}
          isLoading={isLoading}
          onImageChange={handleImageChange}
          onPromptChange={setPrompt}
          onAspectRatioChange={setAspectRatio}
          onSubmit={handleSubmit}
        />
        <ImageOutput
          result={result}
          isLoading={isLoading}
          error={error}
          aspectRatio={aspectRatio}
        />
      </main>
    </>
  );
};

export default ImageEditor;