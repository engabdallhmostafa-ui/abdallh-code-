export enum Role {
  USER = 'user',
  MODEL = 'model'
}

export enum CodeSystem {
  SBC_GENERAL = 'SBC_GENERAL',
  SBC_RESIDENTIAL = 'SBC_RESIDENTIAL',
  ACI_318 = 'ACI_318'
}

export enum AppMode {
  CHAT = 'CHAT',
  INSPECTOR = 'INSPECTOR'
}

export enum ModelMode {
  FAST = 'FAST',
  STANDARD = 'STANDARD',
  DEEP_THINKING = 'DEEP_THINKING'
}

export interface Attachment {
  mimeType: string;
  data: string; // Base64
  name?: string;
}

export interface GroundingLink {
  title: string;
  url: string;
}

export interface Message {
  id: string;
  role: Role;
  text: string;
  attachments?: Attachment[];
  groundingLinks?: GroundingLink[];
  timestamp: Date;
  isThinking?: boolean;
}

export enum ThinkingState {
  IDLE = 'IDLE',
  ANALYZING_REQUEST = 'ANALYZING_REQUEST',
  SEARCHING_SBC_CODES = 'SEARCHING_SBC_CODES',
  EXTRACTING_PARAGRAPHS = 'EXTRACTING_PARAGRAPHS',
  FORMULATING_RISK = 'FORMULATING_RISK',
  FINALIZING = 'FINALIZING'
}

export interface InspectionRequest {
  element: string; // e.g., Slab, Column
  buildingType: string; // e.g., Residential, Hospital
  location: string; // e.g., Riyadh, Coastal
  language: 'ar' | 'en';
}