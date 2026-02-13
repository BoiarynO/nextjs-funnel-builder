"use client";

import { useState } from "react";

import Button from "@/components/ui/button/Button";
import Dropdown from "@/components/ui/dropdown/Dropdown";
import Input from "@/components/ui/input/Input";
import DeleteIcon from "@/assets/icons/delete.svg";
import {
  useFunnelsStore,
  selectSelectedFunnel,
  selectDisplayName,
  selectDraftTranslationKeyFormat,
  selectDraftComponentTypes,
} from "@/stores/funnelsStore";
import { TRANSLATION_FORMATS } from "@/utils/variables";

import styles from "./FunnelHeaderSettings.module.css";

const FunnelHeaderSettings = () => {
  const selectedFunnel = useFunnelsStore(selectSelectedFunnel);
  const displayName = useFunnelsStore(selectDisplayName);
  const translationKeyFormat = useFunnelsStore(selectDraftTranslationKeyFormat);
  const componentTypes = useFunnelsStore(selectDraftComponentTypes);
  const onDraftNameChange = useFunnelsStore((s) => s.onDraftNameChange);
  const onSettingsSave = useFunnelsStore((s) => s.onSettingsSave);
  const onSettingsCancel = useFunnelsStore((s) => s.onSettingsCancel);
  const onDraftTranslationKeyFormatChange = useFunnelsStore(
    (s) => s.onDraftTranslationKeyFormatChange
  );
  const onDraftComponentTypesChange = useFunnelsStore(
    (s) => s.onDraftComponentTypesChange
  );

  const steps = selectedFunnel?.steps ?? [];
  const [newComponentType, setNewComponentType] = useState("");

  const usedComponentTypes = new Set(
    steps.map((s) => s.componentType).filter(Boolean)
  );

  const handleAddComponentType = () => {
    const trimmed = newComponentType.trim();
    if (!trimmed) return;
    if (componentTypes.includes(trimmed)) return;
    onDraftComponentTypesChange([...componentTypes, trimmed]);
    setNewComponentType("");
  };

  const handleRemoveComponentType = (type: string) => {
    if (usedComponentTypes.has(type)) return;
    onDraftComponentTypesChange(componentTypes.filter((t) => t !== type));
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
          value={displayName}
          onChange={(e) => onDraftNameChange(e.target.value)}
          className={styles.titleInput}
        />
        <Button type="button" onClick={onSettingsSave}>
          Save
        </Button>
        <Button type="button" outlined onClick={onSettingsCancel}>
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
                  onClick={() => onDraftTranslationKeyFormatChange(format)}
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
