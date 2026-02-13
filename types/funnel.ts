export type TranslationKeyFormat = "camelCase" | "snake_case" | "kebab-case";

export type Step = {
  id: string;
  componentType: string | null;
  translationKeyFormat?: TranslationKeyFormat;
  commonTitle: string;
  commonSubtitle: string;
  titleTranslationKey: string;
  subtitleTranslationKey: string;
  commonPoints: string[];
  pointsTranslationKeys: string[];
};

export type Funnel = {
  id: string;
  name: string;
  translationKeyFormat?: TranslationKeyFormat;
  componentTypes?: string[];
  steps: Step[];
};
