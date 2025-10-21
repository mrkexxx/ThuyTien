import React, { useState, useCallback } from 'react';
import { performTryOn } from './services/geminiService';
import type { TryOnResult } from './types';
import FashionTryOnInput from './components/FashionTryOnInput';
import FashionTryOnOutput from './components/FashionTryOnOutput';

const FashionTryOn: React.FC = () => {
  const [modelImage, setModelImage] = useState<string | null>(null);
  const [modelImageType, setModelImageType] = useState<string | null>(null);
  const [garmentImage, setGarmentImage] = useState<string | null>(null);
  const [garmentImageType, setGarmentImageType] = useState<string | null>(null);
  const [accessoryImage, setAccessoryImage] = useState<string | null>(null);
  const [accessoryImageType, setAccessoryImageType] = useState<string | null>(null);
  const [handheldImage, setHandheldImage] = useState<string | null>(null);
  const [handheldImageType, setHandheldImageType] = useState<string | null>(null);
  const [contextPrompt, setContextPrompt] = useState<string>('');
  const [pose, setPose] = useState<string>('');
  const [aspectRatio, setAspectRatio] = useState<string>('9:16');
  const [detailedPrompt, setDetailedPrompt] = useState<string>('');
  const [result, setResult] = useState<TryOnResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: 'model' | 'garment' | 'accessory' | 'handheld'
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setResult(null);
      setError(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        switch (type) {
          case 'model':
            setModelImage(base64String);
            setModelImageType(file.type);
            break;
          case 'garment':
            setGarmentImage(base64String);
            setGarmentImageType(file.type);
            break;
          case 'accessory':
            setAccessoryImage(base64String);
            setAccessoryImageType(file.type);
            break;
          case 'handheld':
            setHandheldImage(base64String);
            setHandheldImageType(file.type);
            break;
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = useCallback(async () => {
    if (!modelImage || !modelImageType || !garmentImage || !garmentImageType) {
      setError('Vui lòng tải lên cả ảnh người mẫu và ảnh trang phục.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const apiResult = await performTryOn({
        modelImage: { base64: modelImage, mimeType: modelImageType },
        garmentImage: { base64: garmentImage, mimeType: garmentImageType },
        accessoryImage: accessoryImage && accessoryImageType ? { base64: accessoryImage, mimeType: accessoryImageType } : null,
        handheldImage: handheldImage && handheldImageType ? { base64: handheldImage, mimeType: handheldImageType } : null,
        context: contextPrompt,
        pose,
        aspectRatio,
        detailedPrompt,
      });
      setResult(apiResult);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Đã xảy ra một lỗi không mong muốn.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [modelImage, modelImageType, garmentImage, garmentImageType, accessoryImage, accessoryImageType, handheldImage, handheldImageType, contextPrompt, pose, aspectRatio, detailedPrompt]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <FashionTryOnInput
        modelImage={modelImage}
        modelImageType={modelImageType}
        garmentImage={garmentImage}
        garmentImageType={garmentImageType}
        accessoryImage={accessoryImage}
        accessoryImageType={accessoryImageType}
        handheldImage={handheldImage}
        handheldImageType={handheldImageType}
        contextPrompt={contextPrompt}
        pose={pose}
        aspectRatio={aspectRatio}
        detailedPrompt={detailedPrompt}
        isLoading={isLoading}
        onImageChange={handleImageChange}
        onContextChange={setContextPrompt}
        onPoseChange={setPose}
        onAspectRatioChange={setAspectRatio}
        onDetailedPromptChange={setDetailedPrompt}
        onSubmit={handleSubmit}
      />
      <FashionTryOnOutput
        result={result}
        isLoading={isLoading}
        error={error}
        aspectRatio={aspectRatio}
      />
    </div>
  );
};

export default FashionTryOn;