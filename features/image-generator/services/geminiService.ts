
import { GoogleGenAI } from "@google/genai";
import { getAiClient } from "../../../services/geminiClient";
import type { GenerateImageResult } from '../types';

export const generateImage = async (prompt: string, aspectRatio: string): Promise<GenerateImageResult> => {
  const ai = getAiClient();
  try {
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: prompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/png',
          aspectRatio: aspectRatio as '1:1' | '9:16' | '16:9' | '4:3' | '3:4',
        },
    });

    if (!response.generatedImages || response.generatedImages.length === 0) {
        throw new Error("The API did not return any images.");
    }
    
    const images = response.generatedImages.map(img => `data:image/png;base64,${img.image.imageBytes}`);

    return { images };

  } catch (error) {
    console.error("Error generating image with Gemini API:", error);
    if (error instanceof Error) {
        if (error.message.includes('API key not valid')) {
            throw new Error(`API Key không hợp lệ. Vui lòng kiểm tra lại trong phần Cài đặt.`);
       }
        throw new Error(`Failed to generate image: ${error.message}`);
    }
    throw new Error("An unknown error occurred while generating the image.");
  }
};
