import SuggestionCategory from "./enums";

export interface SuggestionObj {
  id: string;
  category: SuggestionCategory;
  relevancyScore: number;
  suggestion: string | null;
}

export interface SendPromptData {
  id: string;
  prompt: string;
  mock?: boolean;
}

export interface AiResponseData {
  id: string;
  response: string | null;
}
