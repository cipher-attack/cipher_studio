
export enum ModelName {
  FLASH = 'gemini-2.5-flash',
  PRO = 'gemini-3-pro-preview',
  FLASH_LITE = 'gemini-flash-lite-latest',
}

export interface ModelConfig {
  model: ModelName;
  temperature: number;
  topK: number;
  topP: number;
  maxOutputTokens: number;
  systemInstruction: string;
}

export interface Attachment {
  mimeType: string;
  data: string; // base64
}

export interface GroundingMetadata {
  groundingChunks: {
    web?: {
      uri: string;
      title: string;
    };
  }[];
}

export interface ChatMessage {
  id?: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
  attachments?: Attachment[];
  pinned?: boolean;
  groundingMetadata?: GroundingMetadata; // New: For Search Sources
}

export interface Session {
  id: string;
  title: string;
  history: ChatMessage[];
  config: ModelConfig;
  lastModified: number;
}

export interface Persona {
    id: string;
    name: string;
    icon: any;
    systemInstruction: string;
    temperature: number;
}

export type Theme = 'light' | 'dark';

export type Voice = 'male' | 'female' | 'robot';

export type ViewMode = 'chat' | 'codelab' | 'prompt-studio' | 'vision-hub' | 'data-analyst' | 'doc-intel' | 'cyber-house' | 'about';

export const DEFAULT_CONFIG: ModelConfig = {
  model: ModelName.FLASH,
  temperature: 1.0,
  topK: 64,
  topP: 0.95,
  maxOutputTokens: 8192,
  systemInstruction: "You are a helpful and expert AI assistant.",
};
