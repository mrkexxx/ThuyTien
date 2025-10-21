
import { GoogleGenAI, Modality } from "@google/genai";
import { getAiClient } from './geminiClient';
import type { EditImageResult } from '../types';

export const editImage = async (
  base64ImageData: string,
  mimeType: string,
  prompt: string
): Promise<EditImageResult> => {
  const ai = getAiClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64ImageData,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    let resultImage: string | null = null;
    let resultText: string | null = null;

    if (response.candidates && response.candidates[0] && response.candidates[0].content && response.candidates[0].content.parts) {
        for (const part of response.candidates[0].content.parts) {
            if (part.text) {
                resultText = part.text;
            } else if (part.inlineData) {
                const base64ImageBytes: string = part.inlineData.data;
                resultImage = `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
            }
        }
    }
    
    if (!resultImage && !resultText) {
        throw new Error("The API did not return any image or text content.");
    }

    return { image: resultImage, text: resultText };

  } catch (error) {
    console.error("Error editing image with Gemini API:", error);
    if (error instanceof Error) {
        if (error.message.includes('API key not valid')) {
            throw new Error(`API Key không hợp lệ. Vui lòng kiểm tra lại trong phần Cài đặt.`);
       }
        throw new Error(`Failed to edit image: ${error.message}`);
    }
    throw new Error("An unknown error occurred while editing the image.");
  }
};
