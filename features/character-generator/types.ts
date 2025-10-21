export interface GenerateCharacterResult {
  image: string | null;
  text: string | null;
}

export interface CharacterImage {
  base64: string;
  mimeType: string;
}
