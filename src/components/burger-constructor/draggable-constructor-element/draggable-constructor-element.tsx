import { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import {
  ConstructorElement,
  DragIcon,
} from "@ya.praktikum/react-developer-burger-ui-components";
import styles from "./draggable-constructor-element.module.scss";
import type { ConstructorIngredient } from "../../../utils/types";

interface DraggableConstructorElementProps {
  item: ConstructorIngredient;
  index: number;
  onDelete: (uniqueId: string) => void;
  moveIngredient: (fromIndex: number, toIndex: number) => void;
}

function DraggableConstructorElement({
  item,
  index,
  onDelete,
  moveIngredient,
}: DraggableConstructorElementProps) {
  const ref = useRef<HTMLLIElement>(null);
  type DragItem = {
    index: number;
    uniqueId: string;
  };

  const [{ isDragging }, drag] = useDrag({
    type: "constructorIngredient",
    item: (): DragItem => ({
      index,
      uniqueId: item.uniqueId,
    }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: "constructorIngredient",
    hover(draggedItem: DragItem) {
      if (draggedItem.index === index) {
        return;
      }

      if (!ref.current) {
        return;
      }

      moveIngredient(draggedItem.index, index);
      draggedItem.index = index;
    },
  });

  drag(drop(ref));

  return (
    <li ref={ref} className={styles.staffItem} style={{ opacity: isDragging ? 0.5 : 1 }}>
      <DragIcon className={`${styles.dragIcon} pr-1`} type="primary" />
      <ConstructorElement
        text={item.name}
        price={item.price}
        thumbnail={item.image}
        handleClose={() => onDelete(item.uniqueId)}
      />
    </li>
  );
}

export default DraggableConstructorElement;
