
import { GoogleGenAI, Modality } from "@google/genai";
import { getAiClient } from "../../../services/geminiClient";
import type { VirtualCornerResult, ImageData } from '../types';

export const createVirtualScene = async (
  userImage: ImageData,
  prompt: string,
  aspectRatio: string
): Promise<VirtualCornerResult> => {
  const ai = getAiClient();
  try {
    const fullPrompt = `
**GOAL:** Flawless Scene Integration (Virtual Photo).
**INPUT 1 (Subject):** The image containing the person/subject to be extracted.
**INPUT 2 (Text Prompt):** A description of the new scene: "${prompt}".

**CRITICAL, NON-NEGOTIABLE RULE:**
1.  **IDENTICAL SUBJECT PRESERVATION:** You MUST extract the person/subject from the 'Subject' image (Input 1) and place them into the new scene. The person's face, body, clothing, and pose MUST remain 100% IDENTICAL to the original. This is the most important rule. Do not change anything about the person.

**INSTRUCTION:**
Create a new, photorealistic image where the perfectly preserved person from Input 1 is seamlessly integrated into a new background as described in the Text Prompt. The new background must be photorealistic and match the description accurately.

**OUTPUT FORMAT:**
The final generated image MUST have a ${aspectRatio} aspect ratio.
`;

    const parts = [
      { inlineData: { data: userImage.base64, mimeType: userImage.mimeType } },
      { text: fullPrompt },
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: { parts },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    let resultImage: string | null = null;
    let resultText: string | null = null;

    if (response.candidates?.[0]?.content?.parts) {
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
    console.error("Error creating virtual scene with Gemini API:", error);
    if (error instanceof Error) {
        if (error.message.includes('API key not valid')) {
            throw new Error(`API Key không hợp lệ. Vui lòng kiểm tra lại trong phần Cài đặt.`);
       }
      throw new Error(`Failed to create virtual scene: ${error.message}`);
    }
    throw new Error("An unknown error occurred while creating the virtual scene.");
  }
};
