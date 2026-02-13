"use client";

import { useState } from "react";

import type { Funnel, Step, TranslationKeyFormat } from "@/types/funnel";
import {
  DEFAULT_COMPONENT_TYPES,
  TRANSLATION_FORMATS,
} from "@/utils/variables";
import { formatTranslationKey } from "@/utils/formatting/formatTranslationKey";
import { MAX_QUESTIONS_PER_FUNNEL } from "@/utils/config/limits";
import Button from "@/components/ui/button/Button";
import Input from "@/components/ui/input/Input";
import ReorderList, {
  type ReorderItem,
} from "@/components/ui/reorderList/ReorderList";
import DeleteIcon from "@/assets/icons/delete.svg";

import styles from "./StepsForm.module.css";

type FormPoint = { commonPoint: string; pointTranslationKey: string };

type StepsFormProps = {
  funnel: Funnel;
  onUpdateFunnel: (updatedFunnel: Funnel) => void;
  onClose: () => void;
  initialStep?: Step;
};

const StepsForm = ({
  funnel,
  onUpdateFunnel,
  onClose,
  initialStep,
}: StepsFormProps) => {
  const isEditMode = Boolean(initialStep);

  const availableComponentTypes =
    funnel.componentTypes ?? DEFAULT_COMPONENT_TYPES;
  const hasComponentTypes = availableComponentTypes.length > 0;

  const [componentType, setComponentType] = useState<string | null>(() => {
    if (initialStep) return initialStep.componentType;
    if (!hasComponentTypes) return null;
    const lastStep = funnel.steps[funnel.steps.length - 1];
    const lastType = lastStep?.componentType;
    if (lastType && availableComponentTypes.includes(lastType)) return lastType;
    return availableComponentTypes[0];
  });
  const [translationKeyFormat, setTranslationKeyFormat] =
    useState<TranslationKeyFormat>(
      initialStep?.translationKeyFormat ??
        funnel.translationKeyFormat ??
        "camelCase"
    );
  const [title, setTitle] = useState(initialStep?.commonTitle ?? "");
  const [subtitle, setSubtitle] = useState(initialStep?.commonSubtitle ?? "");
  const [titleTranslationKey, setTitleTranslationKey] = useState(
    initialStep?.titleTranslationKey ?? ""
  );
  const [subtitleTranslationKey, setSubtitleTranslationKey] = useState(
    initialStep?.subtitleTranslationKey ?? ""
  );
  const [points, setPoints] = useState<FormPoint[]>(() => {
    if (initialStep && initialStep.commonPoints.length > 0) {
      return initialStep.commonPoints.map((cp, i) => ({
        commonPoint: cp,
        pointTranslationKey: initialStep.pointsTranslationKeys[i] ?? "",
      }));
    }
    return [{ commonPoint: "", pointTranslationKey: "" }];
  });
  const [isPointsReorderMode, setIsPointsReorderMode] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const limitReached = funnel.steps.length >= MAX_QUESTIONS_PER_FUNNEL;
  const limitReachedCreate = !isEditMode && limitReached;

  const updateTitle = (value: string) => {
    setTitle(value);
    setTitleTranslationKey(formatTranslationKey(value, translationKeyFormat));
  };

  const updateSubtitle = (value: string) => {
    setSubtitle(value);
    setSubtitleTranslationKey(
      formatTranslationKey(value, translationKeyFormat)
    );
  };

  const handleFormatChange = (value: TranslationKeyFormat) => {
    setTranslationKeyFormat(value);
    setTitleTranslationKey(formatTranslationKey(title, value));
    setSubtitleTranslationKey(formatTranslationKey(subtitle, value));
    setPoints((prev) =>
      prev.map((p) => ({
        ...p,
        pointTranslationKey: formatTranslationKey(p.commonPoint, value),
      }))
    );
  };

  const updatePoint = (index: number, commonPoint: string) => {
    setPoints((prev) => {
      const next = [...prev];
      next[index] = {
        ...next[index],
        commonPoint,
        pointTranslationKey: formatTranslationKey(
          commonPoint,
          translationKeyFormat
        ),
      };
      return next;
    });
  };

  const setPointTranslationKey = (index: number, value: string) => {
    setPoints((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], pointTranslationKey: value };
      return next;
    });
  };

  const addPoint = () => {
    setPoints((prev) => [
      ...prev,
      { commonPoint: "", pointTranslationKey: "" },
    ]);
  };

  const removePoint = (index: number) => {
    setPoints((prev) => {
      if (prev.length <= 1) return prev;
      return prev.filter((_, i) => i !== index);
    });
  };

  const handlePointsReorder = (reordered: ReorderItem[]) => {
    setPoints((prev) => {
      const next = reordered
        .map((item) => prev[Number(item.id)])
        .filter(Boolean);
      return next.length > 0 ? next : prev;
    });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (limitReachedCreate) return;

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError("Title is required.");
      return;
    }

    const filledPoints = points.filter((p) => p.commonPoint.trim());
    const stepId = initialStep?.id ?? crypto.randomUUID();
    const updatedStep: Step = {
      id: stepId,
      componentType,
      translationKeyFormat,
      commonTitle: trimmedTitle,
      commonSubtitle: subtitle.trim(),
      titleTranslationKey: titleTranslationKey.trim(),
      subtitleTranslationKey: subtitleTranslationKey.trim(),
      commonPoints: filledPoints.map((p) => p.commonPoint.trim()),
      pointsTranslationKeys: filledPoints.map((p) =>
        p.pointTranslationKey.trim()
      ),
    };

    const updatedFunnel: Funnel = isEditMode
      ? {
          ...funnel,
          steps: funnel.steps.map((s) => (s.id === stepId ? updatedStep : s)),
        }
      : {
          ...funnel,
          steps: [...funnel.steps, updatedStep],
        };

    onUpdateFunnel(updatedFunnel);
    onClose();
  };

  const pointsReorderItems: ReorderItem[] = points.map((p, i) => ({
    id: String(i),
    label: p.commonPoint.trim() || "(empty)",
  }));

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.field}>
        <label className={styles.label}>Component type</label>
        {hasComponentTypes ? (
          <select
            className={styles.select}
            value={componentType ?? ""}
            onChange={(e) => setComponentType(e.target.value || null)}
          >
            {availableComponentTypes.map((ct) => (
              <option key={ct} value={ct}>
                {ct}
              </option>
            ))}
          </select>
        ) : (
          <span className={styles.nullValue}>null (no types configured)</span>
        )}
      </div>

      <div className={styles.field}>
        <label className={styles.label}>TranslationKey format</label>
        <select
          className={styles.select}
          value={translationKeyFormat}
          onChange={(e) =>
            handleFormatChange(e.target.value as TranslationKeyFormat)
          }
        >
          {TRANSLATION_FORMATS.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Title (required)</label>
        <Input
          value={title}
          onChange={(e) => updateTitle(e.target.value)}
          placeholder="Step title"
        />
      </div>
      <div className={styles.field}>
        <label className={styles.label}>Title translation key</label>
        <Input
          value={titleTranslationKey}
          onChange={(e) => setTitleTranslationKey(e.target.value)}
          placeholder="Title translation key"
          className={styles.inputTranslationKey}
        />
      </div>
      <div className={styles.field}>
        <label className={styles.label}>Subtitle (optional)</label>
        <Input
          value={subtitle}
          onChange={(e) => updateSubtitle(e.target.value)}
          placeholder="Step subtitle"
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Subtitle translation key</label>
        <Input
          value={subtitleTranslationKey}
          onChange={(e) => setSubtitleTranslationKey(e.target.value)}
          placeholder="Subtitle translation key"
          className={styles.inputTranslationKey}
        />
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <label className={styles.sectionLabel}>Points</label>
          <Button
            type="button"
            outlined
            onClick={() => setIsPointsReorderMode((prev) => !prev)}
          >
            {isPointsReorderMode ? "Edit points" : "Reorder points"}
          </Button>
        </div>
        {isPointsReorderMode ? (
          <ReorderList
            items={pointsReorderItems}
            onChangeOrder={handlePointsReorder}
          />
        ) : (
          <>
            {points.map((point, index) => (
              <div key={index} className={styles.pointGroup}>
                <div className={styles.pointRow}>
                  <div className={styles.pointInputs}>
                    <Input
                      value={point.commonPoint}
                      onChange={(e) => updatePoint(index, e.target.value)}
                      placeholder="commonPoint"
                    />
                    <Input
                      value={point.pointTranslationKey}
                      onChange={(e) =>
                        setPointTranslationKey(index, e.target.value)
                      }
                      placeholder="pointTranslationKey"
                      className={styles.inputTranslationKey}
                    />
                  </div>
                  <Button
                    type="button"
                    outlined
                    onClick={() => removePoint(index)}
                    disabled={points.length <= 1}
                    className={styles.pointDeleteButton}
                    aria-label={`Delete point ${index + 1}`}
                  >
                    <DeleteIcon
                      className={styles.pointDeleteIcon}
                      aria-hidden
                    />
                  </Button>
                </div>
              </div>
            ))}
            <Button type="button" outlined onClick={addPoint}>
              Add point
            </Button>
          </>
        )}
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.actions}>
        <Button type="submit" disabled={limitReachedCreate}>
          {isEditMode ? "Save" : "Add"}
        </Button>
        <Button type="button" variant="outlined" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default StepsForm;
