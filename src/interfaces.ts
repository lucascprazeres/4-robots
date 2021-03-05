export interface State {
  searchTerm: string;
  prefix: string;
  sourceContentOriginal: string;
  sourceContentSanitized: string;
  maximumSentences: number;
  sentences: Sentence[];
}

export interface Sentence {
  text: string;
  keywords: string[];
  images: string[];
}