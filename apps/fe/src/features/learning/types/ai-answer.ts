export type Answer = {
  transcript: string;
  assessment: {
    normalize: {
      requestId: string;
      normalized_text: string;
      unclear_segments: string[];
      confidence: number;
    };
    evaluation: {
      requestId: string;
      result: {
        topic: string;
        level: string;
        keyword_hits: {
          transport_layer: boolean;
          connectionless: boolean;
          no_reliability: boolean;
          no_ordering: boolean;
          low_overhead_fast: boolean;
        };
        score: {
          overall: number;
          concept_understanding: number;
          terminology_accuracy: number;
          clarity: number;
        };
        issues: Array<{
          type: string;
          id: string;
          detail: string;
          evidence: string;
        }>;
        summary: string;
        fix_suggestions: string[];
        followup_questions: string[];
      };
    };
  };
};
