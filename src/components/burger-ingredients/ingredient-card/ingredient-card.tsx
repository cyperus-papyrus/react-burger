import {
  CurrencyIcon,
  Counter,
} from "@ya.praktikum/react-developer-burger-ui-components";
import styles from "./ingredient-card.module.scss";
import { IngredientCardProps } from "../../../utils/types";
import { useDrag } from "react-dnd";

function IngredientCard(props: IngredientCardProps) {
  const { ingredient, count, onClick } = props;

  const [{ isDragging }, dragRef] = useDrag({
    type: "ingredient",
    item: { ingredient },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  const handleClick = () => {
    if (onClick) {
      onClick(ingredient);
    }
  };

  return (
    <div
      className={styles.card}
      onClick={handleClick}
      ref={dragRef as any}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      {count ? <Counter count={count} size="default" extraClass="m-1" /> : ""}
      <img src={ingredient.image} alt={ingredient.name} className={styles.image} />
      <div className={`${styles.price} mt-2`}>
        <span className="text text_type_digits-default">{ingredient.price}</span>
        <CurrencyIcon type="primary" />
      </div>
      <h3 className={`text text_type_main-default mt-2 ${styles.name}`}>
        {ingredient.name}
      </h3>
    </div>
  );
}

export default IngredientCard;
