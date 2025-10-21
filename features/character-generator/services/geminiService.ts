
import { GoogleGenAI, Modality } from "@google/genai";
import { getAiClient } from "../../../services/geminiClient";
import type { GenerateCharacterResult, CharacterImage } from '../types';

export const generateCharacter = async (
  characterImages: CharacterImage[],
  prompt: string,
  aspectRatio: string
): Promise<GenerateCharacterResult> => {
  const ai = getAiClient();
  try {
    const fullPrompt = `
**Primary Goal:** Flawless Consistent Character Recreation.
**Task:** Recreate the character from the provided reference images in a new scene.

**Reference Images:**
- **Primary Reference (Image 1):** THIS IS THE GROUND TRUTH for the character's face and identity.
- **Additional References (Images 2-${characterImages.length}):** Use these for additional details (e.g., body type, style) but the face from the Primary Reference is NON-NEGOTIABLE.

**Scene Description:** ${prompt}

**CRITICAL, NON-NEGOTIABLE RULES:**
1.  **IDENTICAL FACE REPLICATION:** The face of the character in the generated image MUST be a 100% PERFECT, IDENTICAL match to the face in the **Primary Reference (Image 1)**. DO NOT alter facial structure, features, skin tone, or unique marks. This is the most important rule.
2.  **FEATURE CONSISTENCY:** Maintain absolute consistency with all other character features learned from the reference images, such as hair style, hair color, body type, and height.
3.  **SCENE INTEGRATION:** Place the perfectly replicated character into the scene described: "${prompt}". The pose, lighting, and clothing (unless specified in the prompt) should be appropriate for the scene.
4.  **PHOTOREALISM:** The final image must be photorealistic, with natural lighting, shadows, and textures, making the character look seamlessly integrated into the environment.
5.  **ASPECT RATIO:** The final image MUST have a ${aspectRatio} aspect ratio.

Failure to follow these rules, especially Rule #1, results in a failed task.
`;
    
    const parts: ({ inlineData: { data: string; mimeType: string; } } | { text: string })[] = characterImages.map(img => ({
        inlineData: {
            data: img.base64,
            mimeType: img.mimeType,
        }
    }));

    parts.push({ text: fullPrompt });

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
    console.error("Error generating character with Gemini API:", error);
    if (error instanceof Error) {
        if (error.message.includes('API key not valid')) {
            throw new Error(`API Key không hợp lệ. Vui lòng kiểm tra lại trong phần Cài đặt.`);
       }
        throw new Error(`Failed to generate character: ${error.message}`);
    }
    throw new Error("An unknown error occurred while generating the character image.");
  }
};
