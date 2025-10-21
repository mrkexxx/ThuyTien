import { GoogleGenAI } from "@google/genai";
import type { GenerateVideoResult } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const pollOperation = async (operation: any): Promise<any> => {
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
  try {
    let initialOperation;
    
    const requestPayload: any = {
        model: 'veo-2.0-generate-001',
        prompt: prompt,
        config: {
          numberOfVideos: 1,
        }
    };
    
    if (base64ImageData && mimeType) {
        requestPayload.image = {
            imageBytes: base64ImageData,
            mimeType: mimeType,
        };
    }

    initialOperation = await ai.models.generateVideos(requestPayload);
    
    const completedOperation = await pollOperation(initialOperation);

    const downloadLink = completedOperation.response?.generatedVideos?.[0]?.video?.uri;

    if (!downloadLink) {
        throw new Error("The API did not return a video download link.");
    }
    
    // The response.body contains the MP4 bytes. You must append an API key when fetching from the download link.
    const response = await fetch(`${downloadLink}&key=${API_KEY}`);
    if (!response.ok) {
        throw new Error(`Failed to download video file: ${response.statusText}`);
    }

    const videoBlob = await response.blob();
    const videoUrl = URL.createObjectURL(videoBlob);

    return { videoUrl };

  } catch (error) {
    console.error("Error generating video with Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to generate video: ${error.message}`);
    }
    throw new Error("An unknown error occurred while generating the video.");
  }
};