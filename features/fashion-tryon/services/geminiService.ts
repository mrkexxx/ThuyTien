
import { GoogleGenAI, Modality } from "@google/genai";
import { getAiClient } from "../../../services/geminiClient";
import type { TryOnResult } from '../types';

const ai = new GoogleGenAI({ apiKey: API_KEY });

interface ImageData {
    base64: string;
    mimeType: string;
}

interface PerformTryOnParams {
    modelImage: ImageData;
    garmentImage: ImageData;
    accessoryImage: ImageData | null;
    handheldImage: ImageData | null;
    context: string;
    pose: string;
    aspectRatio: string;
    detailedPrompt: string;
}

export const performTryOn = async ({
    modelImage,
    garmentImage,
    accessoryImage,
    handheldImage,
    context,
    pose,
    aspectRatio,
    detailedPrompt,
}: PerformTryOnParams): Promise<TryOnResult> => {
  const ai = getAiClient();
  try {
    let prompt = `
**Primary Goal:** Virtual Fashion Try-On.
**Input 1 (Model):** An image of a person.
**Input 2 (Garment):** An image of clothing.
`;

    const parts: ({ inlineData: { data: string; mimeType: string; } } | { text: string })[] = [
      { inlineData: { data: modelImage.base64, mimeType: modelImage.mimeType } },
      { inlineData: { data: garmentImage.base64, mimeType: garmentImage.mimeType } },
    ];

    if (accessoryImage) {
        prompt += `**Input 3 (Accessory):** An image of accessories (e.g., hats, glasses, jewelry).\n`;
        parts.push({ inlineData: { data: accessoryImage.base64, mimeType: accessoryImage.mimeType } });
    }
     if (handheldImage) {
        prompt += `**Input 4 (Handheld):** An image of a handheld item (e.g., a bag, a phone).\n`;
        parts.push({ inlineData: { data: handheldImage.base64, mimeType: handheldImage.mimeType } });
    }

    prompt += `
**Critical Instructions (MUST FOLLOW):**
1.  **Preserve the Model 100%:** The person from the Model image MUST be preserved perfectly. DO NOT change their face, facial expression, hair, body shape, or skin tone. The face must be an IDENTICAL match.
2.  **Transfer All Items:** Identify ALL items in the Garment, Accessory, and Handheld images and accurately place them on/with the model. Garments should be worn, accessories placed appropriately, and handheld items held naturally.
3.  **Realism is Key:** The final image must be photorealistic. Ensure the fit, drape, texture, and lighting of all transferred items on the model are natural and believable.
`;

    if (detailedPrompt && detailedPrompt.trim() !== '') {
        prompt += `\n**Detailed Edits:** Apply the following specific edits: "${detailedPrompt}".`;
    }

    if (pose && pose.trim() !== '' && pose !== 'Để AI tự quyết định') {
        prompt += `\n**Pose Instruction:** The model should be in the following pose: "${pose}".`;
    }

    if (context && context.trim() !== '') {
      prompt += `\n**Background Instruction:** Place the model in this context: "${context}".`;
    }

    prompt += `\n**Output Format:** The final image must have a ${aspectRatio} aspect ratio.`;
    
    parts.push({ text: prompt });

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
    console.error("Error performing try-on with Gemini API:", error);
    if (error instanceof Error) {
        if (error.message.includes('API key not valid')) {
            throw new Error(`API Key không hợp lệ. Vui lòng kiểm tra lại trong phần Cài đặt.`);
       }
        throw new Error(`Failed to perform try-on: ${error.message}`);
    }
    throw new Error("An unknown error occurred while performing the try-on.");
  }
};
