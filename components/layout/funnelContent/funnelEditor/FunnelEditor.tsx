"use client";

// view documentation: docs/components/layout/funnelContent/funnelEditor/FunnelEditor.md
import { useFunnelEditorDraft } from "./hooks/useFunnelEditorDraft";
import ButtonDownloadFunnelJson from "./buttonDownloadFunnelJson/ButtonDownloadFunnelJson";
import FunnelHeader from "./funnelHeader/FunnelHeader";
import StepsReorderSection from "./stepsReorderSection/StepsReorderSection";
import StepsContent from "./stepsContent/StepsContent";
import styles from "./FunnelEditor.module.css";

const FunnelEditor = () => {
  const { state, actions } = useFunnelEditorDraft();
  // const { state, actions } = editor;

  if (!state.selectedFunnel) return null;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <FunnelHeader
          value={state.displayName}
          isEditMode={state.isEditMode}
          isEditDisabled={state.isFunnelEditDisabled}
          translationKeyFormat={state.draftTranslationKeyFormat}
          componentTypes={state.draftComponentTypes}
          steps={state.selectedFunnel.steps}
          onStartEdit={actions.onStartEdit}
          onSave={actions.onSave}
          onCancel={actions.onCancel}
          onNameChange={actions.onNameChange}
          onTranslationKeyFormatChange={actions.onTranslationKeyFormatChange}
          onComponentTypesChange={actions.onComponentTypesChange}
        />
        <ButtonDownloadFunnelJson />
      </div>

      {state.isEditMode ? (
        <StepsReorderSection
          items={state.reorderItems}
          onReorder={actions.onDraftReorder}
        />
      ) : (
        <StepsContent
          editingStepId={state.editingStepId}
          onEditStep={actions.setEditingStepId}
        />
      )}
    </div>
  );
};

export default FunnelEditor;
