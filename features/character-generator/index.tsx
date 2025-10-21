import React, { useState, useCallback } from 'react';
import { generateCharacter } from './services/geminiService';
import type { GenerateCharacterResult, CharacterImage } from './types';
import CharacterGeneratorInput from './components/CharacterGeneratorInput';
import CharacterGeneratorOutput from './components/CharacterGeneratorOutput';

const CharacterGenerator: React.FC = () => {
  const [characterImages, setCharacterImages] = useState<(CharacterImage | null)[]>(Array(5).fill(null));
  const [prompt, setPrompt] = useState<string>('');
  const [aspectRatio, setAspectRatio] = useState<string>('1:1');
  const [result, setResult] = useState<GenerateCharacterResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setResult(null);
      setError(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        const newImages = [...characterImages];
        newImages[index] = { base64: base64String, mimeType: file.type };
        setCharacterImages(newImages);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = useCallback(async () => {
    const uploadedImages = characterImages.filter(img => img !== null) as CharacterImage[];
    if (uploadedImages.length === 0) {
      setError('Vui lòng tải lên ít nhất một ảnh nhân vật tham chiếu.');
      return;
    }
     if (!prompt) {
      setError('Vui lòng nhập mô tả cho bối cảnh của nhân vật.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const apiResult = await generateCharacter(uploadedImages, prompt, aspectRatio);
      setResult(apiResult);
    // FIX: Removed invalid arrow function syntax (`=>`) from the catch block.
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Đã xảy ra một lỗi không mong muốn.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [characterImages, prompt, aspectRatio]);

  return (
    <>
      <header className="text-center mb-8">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">
          Nhân Vật Nhất Quán
        </h1>
        <p className="mt-2 text-lg text-gray-400">
          Tải lên các ảnh của nhân vật, mô tả một bối cảnh, và để AI tạo ra một hình ảnh mới với nhân vật nhất quán.
        </p>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <CharacterGeneratorInput
          characterImages={characterImages}
          prompt={prompt}
          aspectRatio={aspectRatio}
          isLoading={isLoading}
          onImageChange={handleImageChange}
          onPromptChange={setPrompt}
          onAspectRatioChange={setAspectRatio}
          onSubmit={handleSubmit}
        />
        <CharacterGeneratorOutput
          result={result}
          isLoading={isLoading}
          error={error}
          aspectRatio={aspectRatio}
        />
      </main>
    </>
  );
};

export default CharacterGenerator;