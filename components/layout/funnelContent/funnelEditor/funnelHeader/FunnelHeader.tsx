"use client";

import type { TranslationKeyFormat, Step } from "@/types/funnel";

import FunnelHeaderTitle from "./funnelHeaderTitle/FunnelHeaderTitle";
import FunnelHeaderSettings from "./funnelHeaderSettings/FunnelHeaderSettings";

export type FunnelHeaderProps = {
  value: string;
  isEditMode: boolean;
  isEditDisabled: boolean;
  translationKeyFormat: TranslationKeyFormat;
  componentTypes: string[];
  steps: Step[];
  onStartEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onNameChange: (name: string) => void;
  onTranslationKeyFormatChange: (format: TranslationKeyFormat) => void;
  onComponentTypesChange: (types: string[]) => void;
};

const FunnelHeader = ({
  value,
  isEditMode,
  isEditDisabled,
  translationKeyFormat,
  componentTypes,
  steps,
  onStartEdit,
  onSave,
  onCancel,
  onNameChange,
  onTranslationKeyFormatChange,
  onComponentTypesChange,
}: FunnelHeaderProps) => {
  if (isEditMode) {
    return (
      <FunnelHeaderSettings
        value={value}
        steps={steps}
        onNameChange={onNameChange}
        onSave={onSave}
        onCancel={onCancel}
        translationKeyFormat={translationKeyFormat}
        componentTypes={componentTypes}
        onTranslationKeyFormatChange={onTranslationKeyFormatChange}
        onComponentTypesChange={onComponentTypesChange}
      />
    );
  }

  return isEditMode ? (
    <FunnelHeaderSettings
      value={value}
      steps={steps}
      onNameChange={onNameChange}
      onSave={onSave}
      onCancel={onCancel}
      translationKeyFormat={translationKeyFormat}
      componentTypes={componentTypes}
      onTranslationKeyFormatChange={onTranslationKeyFormatChange}
      onComponentTypesChange={onComponentTypesChange}
    />
  ) : (
    <FunnelHeaderTitle
      value={value}
      isEditDisabled={isEditDisabled}
      onStartEdit={onStartEdit}
    />
  );
};

export default FunnelHeader;
