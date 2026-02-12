"use client";

import { useState, useCallback } from "react";
import Image from "next/image";

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

const ReorderList = ({ items, onChangeOrder }: ReorderListProps) => {
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

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

  return (
    <div className={styles.container}>
      {items.map((item) => (
        <div
          key={item.id}
          className={`${styles.item} ${draggedId === item.id ? styles.itemDragging : ""} ${dragOverId === item.id ? styles.itemDragOver : ""}`}
          draggable
          onDragStart={(e) => handleDragStart(e, item.id)}
          onDragEnd={handleDragEnd}
          onDragOver={(e) => handleDragOver(e, item.id)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, item.id)}
        >
          <span className={styles.itemLabel}>{item.label}</span>
          <Image
            src={ReorderIcon}
            alt=""
            width={24}
            height={24}
            className={styles.itemIcon}
            draggable={false}
          />
        </div>
      ))}
    </div>
  );
};

export default ReorderList;
