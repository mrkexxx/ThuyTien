
import { GoogleGenAI } from "@google/genai";

export const getApiKey = (): string | null => {
    try {
        return localStorage.getItem('gemini_api_key');
    } catch (e) {
        console.error("Could not access localStorage", e);
        return null;
    }
}

export const setApiKey = (key: string): void => {
    try {
        localStorage.setItem('gemini_api_key', key);
    } catch (e) {
        console.error("Could not access localStorage", e);
    }
}

export const getAiClient = (): GoogleGenAI => {
    const apiKey = getApiKey();
    if (!apiKey) {
        throw new Error("API Key Gemini chưa được thiết lập. Vui lòng vào Cài đặt để thêm key.");
    }
    return new GoogleGenAI({ apiKey });
}
