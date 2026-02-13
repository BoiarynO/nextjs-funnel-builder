import { useState } from "react";

import Button from "@/components/ui/button/Button";
import Dropdown from "@/components/ui/dropdown/Dropdown";
import Input from "@/components/ui/input/Input";
import { Step, TranslationKeyFormat } from "@/types/funnel";
import DeleteIcon from "@/assets/icons/delete.svg";

import styles from "./FunnelHeaderSettings.module.css";

const TRANSLATION_FORMATS: TranslationKeyFormat[] = [
  "camelCase",
  "snake_case",
  "kebab-case",
];

export type FunnelHeaderSettingsProps = {
  value: string;
  steps: Step[];
  onNameChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
  translationKeyFormat: TranslationKeyFormat;
  componentTypes: string[];
  onTranslationKeyFormatChange: (format: TranslationKeyFormat) => void;
  onComponentTypesChange: (types: string[]) => void;
};
const FunnelHeaderSettings = ({
  value,
  steps,
  onNameChange,
  onSave,
  onCancel,
  translationKeyFormat,
  componentTypes,
  onTranslationKeyFormatChange,
  onComponentTypesChange,
}: FunnelHeaderSettingsProps) => {
  const [newComponentType, setNewComponentType] = useState("");

  const usedComponentTypes = new Set(
    steps.map((s) => s.componentType).filter(Boolean)
  );

  const handleAddComponentType = () => {
    const trimmed = newComponentType.trim();
    if (!trimmed) return;
    if (componentTypes.includes(trimmed)) return;
    onComponentTypesChange([...componentTypes, trimmed]);
    setNewComponentType("");
  };

  const handleRemoveComponentType = (type: string) => {
    if (usedComponentTypes.has(type)) return;
    onComponentTypesChange(componentTypes.filter((t) => t !== type));
  };
  const handleNewTypeKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddComponentType();
    }
  };

  return (
    <div className={styles.editContainer}>
      <div className={styles.row}>
        <Input
          value={value}
          onChange={(e) => onNameChange(e.target.value)}
          className={styles.titleInput}
        />
        <Button type="button" onClick={onSave}>
          Save
        </Button>
        <Button type="button" variant="outlined" onClick={onCancel}>
          Cancel
        </Button>
      </div>
      <div className={styles.settingsRow}>
        <div className={styles.settingItem}>
          <label className={styles.formatLabel}>Translation format:</label>
          <Dropdown
            label={translationKeyFormat}
            outlined
            className={styles.formatDropdown}
          >
            <div className={styles.dropdownMenu}>
              {TRANSLATION_FORMATS.map((format) => (
                <Button
                  key={format}
                  type="button"
                  onClick={() => onTranslationKeyFormatChange(format)}
                >
                  {format}
                </Button>
              ))}
            </div>
          </Dropdown>
        </div>

        <div className={styles.settingItem}>
          <label className={styles.formatLabel}>Component types:</label>
          <Dropdown
            label={`${componentTypes.length} type${componentTypes.length !== 1 ? "s" : ""}`}
            outlined
            className={styles.componentTypesDropdown}
          >
            <div className={styles.componentTypesPanel}>
              <div className={styles.addTypeRow}>
                <Input
                  value={newComponentType}
                  onChange={(e) => setNewComponentType(e.target.value)}
                  onKeyDown={handleNewTypeKeyDown}
                  placeholder="New type name"
                  className={styles.addTypeInput}
                />
                <Button
                  type="button"
                  onClick={handleAddComponentType}
                  disabled={
                    !newComponentType.trim() ||
                    componentTypes.includes(newComponentType.trim())
                  }
                >
                  Add
                </Button>
              </div>

              {componentTypes.length > 0 && (
                <div className={styles.typesList}>
                  {componentTypes.map((type) => {
                    const isUsed = usedComponentTypes.has(type);
                    return (
                      <div key={type} className={styles.typeItem}>
                        <span className={styles.typeName}>{type}</span>
                        {isUsed && (
                          <span className={styles.typeUsedBadge}>in use</span>
                        )}
                        <Button
                          type="button"
                          outlined
                          onClick={() => handleRemoveComponentType(type)}
                          disabled={isUsed}
                          className={styles.typeDeleteButton}
                          aria-label={`Delete component type ${type}`}
                        >
                          <DeleteIcon
                            className={styles.typeDeleteIcon}
                            aria-hidden
                          />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}

              {componentTypes.length === 0 && (
                <p className={styles.emptyTypesHint}>
                  No component types. Steps will use null.
                </p>
              )}
            </div>
          </Dropdown>
        </div>
      </div>
    </div>
  );
};

export default FunnelHeaderSettings;
