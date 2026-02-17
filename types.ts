
export interface PromptPack {
  detectedUseCase: string;
  optimizationLevel: string;
  assumptions: string[];
  masterPrompt: string;
  stabilityEnhancedVersion: string;
  highControlVersion: string;
  negativeConstraints: string;
  reusableVariablesSchema: Record<string, any>;
  strengthChecklist: string[];
  strengthScore: number;
  suggestions: string[];
  clarifyingQuestions?: string[];
}

export enum PromptCategory {
  MARKETING = "Marketing / SEO / Social / Ads",
  IMAGE = "Image Generation",
  VIDEO = "Video Script",
  CODING = "Coding / Automation",
  BUSINESS = "Business / Strategy",
  WRITING = "Writing / Editing",
  AUTO = "Automatic Detection"
}
