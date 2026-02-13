import { TranslationKeyFormat } from "@/types/funnel";

const camelCase = (value: string): string => {
  const words = value
    .split(" ")
    .slice(0, 3)
    .map((word) => word.toLowerCase().replace(/[^a-z0-9]/g, ""));
  if (!words.length) return "";
  return words
    .map((word, index) =>
      index === 0
        ? word.charAt(0).toLowerCase() + word.slice(1)
        : word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join("");
};

const snakeCase = (value: string): string => {
  const words = value.split(" ").slice(0, 3);
  return words
    .map((word) => word.toLowerCase().replace(/[^a-z0-9]/g, ""))
    .join("_");
};

const kebabCase = (value: string): string => {
  const words = value.split(" ").slice(0, 3);
  return words
    .map((word) => word.toLowerCase().replace(/[^a-z0-9]/g, ""))
    .join("-");
};

export function formatTranslationKey(
  value: string,
  format: TranslationKeyFormat
): string {
  switch (format) {
    default:
      return value;
    case "camelCase":
      return camelCase(value);
    case "snake_case":
      return snakeCase(value);
    case "kebab-case":
      return kebabCase(value);
  }
}
