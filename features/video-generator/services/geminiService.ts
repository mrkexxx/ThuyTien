
import { GoogleGenAI } from "@google/genai";
import { getAiClient, getApiKey } from '../../../services/geminiClient';
import type { GenerateVideoResult } from '../types';

const pollOperation = async (ai: GoogleGenAI, operation: any): Promise<any> => {
    let currentOperation = operation;
    while (!currentOperation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000)); // Poll every 10 seconds
        try {
            currentOperation = await ai.operations.getVideosOperation({ operation: currentOperation });
        } catch (error) {
            console.error("Polling failed:", error);
            throw new Error("Failed to get video generation status.");
        }
    }
    return currentOperation;
}


export const generateVideo = async (
    prompt: string,
    base64ImageData: string | null,
    mimeType: string | null
): Promise<GenerateVideoResult> => {
  const ai = getAiClient();
  const apiKey = getApiKey();

  if (!apiKey) {
      throw new Error("API Key is not set. Please add it in the settings.");
  }

  try {
    let initialOperation;
    
    const requestPayload: any = {
        model: 'veo-3.1-fast-generate-preview',
        prompt: prompt,
        config: {
          numberOfVideos: 1,
          resolution: '720p',
          aspectRatio: '16:9',
        }
    };
    
    if (base64ImageData && mimeType) {
        requestPayload.image = {
            imageBytes: base64ImageData,
            mimeType: mimeType,
        };
    }

    initialOperation = await ai.models.generateVideos(requestPayload);
    
    const completedOperation = await pollOperation(ai, initialOperation);

    const downloadLink = completedOperation.response?.generatedVideos?.[0]?.video?.uri;

    if (!downloadLink) {
        throw new Error("The API did not return a video download link.");
    }
    
    // The response.body contains the MP4 bytes. You must append an API key when fetching from the download link.
    const response = await fetch(`${downloadLink}&key=${apiKey}`);
    if (!response.ok) {
        throw new Error(`Failed to download video file: ${response.statusText}`);
    }

    const videoBlob = await response.blob();
    const videoUrl = URL.createObjectURL(videoBlob);

    return { videoUrl };

  } catch (error) {
    console.error("Error generating video with Gemini API:", error);
    if (error instanceof Error) {
        if (error.message.includes('API key not valid')) {
            throw new Error(`API Key không hợp lệ. Vui lòng kiểm tra lại trong phần Cài đặt.`);
        }
        throw new Error(`Failed to generate video: ${error.message}`);
    }
    throw new Error("An unknown error occurred while generating the video.");
  }
};
