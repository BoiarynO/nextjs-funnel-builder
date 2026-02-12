"use client";

import { useState, useCallback, type CSSProperties } from "react";
import classNames from "classnames";

import ReorderIcon from "./assets/reorder.svg";
import styles from "./ReorderList.module.css";

export type ReorderItem = {
  id: string;
  label: string;
};

type ReorderListProps = {
  items: ReorderItem[];
  onChangeOrder: (items: ReorderItem[]) => void;
};

type ReorderListOwnProps = {
  className?: string;
  style?: CSSProperties;
  basic?: boolean;
  fill?: boolean;
  outlined?: boolean;
  filled?: boolean;
};

const ReorderList = ({
  items,
  onChangeOrder,
  className = "",
  style = {},
  basic,
  fill = false,
  outlined = false,
  filled = false,
}: ReorderListProps & ReorderListOwnProps) => {
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  void basic;

  const handleDragStart = useCallback((e: React.DragEvent, id: string) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", id);
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggedId(null);
    setDragOverId(null);
  }, []);

  const handleDragOver = useCallback(
    (e: React.DragEvent, id: string) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      if (draggedId && draggedId !== id) {
        setDragOverId(id);
      }
    },
    [draggedId]
  );

  const handleDragLeave = useCallback(() => {
    setDragOverId(null);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent, dropTargetId: string) => {
      e.preventDefault();
      setDraggedId(null);
      setDragOverId(null);

      const sourceId = e.dataTransfer.getData("text/plain");
      if (!sourceId || sourceId === dropTargetId) return;

      const currentOrder = [...items];
      const fromIndex = currentOrder.findIndex((i) => i.id === sourceId);
      const toIndex = currentOrder.findIndex((i) => i.id === dropTargetId);
      if (fromIndex === -1 || toIndex === -1) return;

      const [removed] = currentOrder.splice(fromIndex, 1);
      currentOrder.splice(toIndex, 0, removed);
      onChangeOrder(currentOrder);
    },
    [items, onChangeOrder]
  );

  const containerVariantClass = filled
    ? styles.filled
    : outlined
      ? styles.outlined
      : undefined;

  return (
    <div
      className={classNames(
        styles.container,
        containerVariantClass,
        fill && styles.fill,
        className
      )}
      style={style}
    >
      {items.map((item) => (
        <div
          key={item.id}
          className={classNames(
            styles.item,
            draggedId === item.id && styles.itemDragging,
            dragOverId === item.id && styles.itemDragOver
          )}
          draggable
          onDragStart={(e) => handleDragStart(e, item.id)}
          onDragEnd={handleDragEnd}
          onDragOver={(e) => handleDragOver(e, item.id)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, item.id)}
        >
          <span className={styles.itemLabel}>{item.label}</span>
          <ReorderIcon
            width={24}
            height={24}
            aria-hidden
            className={styles.itemIcon}
          />
        </div>
      ))}
    </div>
  );
};

export default ReorderList;
