import { CurrencyIcon } from "@ya.praktikum/react-developer-burger-ui-components";
import styles from "./ingredient-card.module.scss";
import { IngredientCardProps } from "../../../utils/types";

function IngredientCard(props: IngredientCardProps) {
  const { ingredient, onClick } = props;

  const handleClick = () => {
    if (onClick) {
      onClick(ingredient);
    }
  };

  return (
    <article className={styles.card} onClick={handleClick}>
      <img src={ingredient.image} alt={ingredient.name} className={styles.image} />
      <div className={`${styles.price} mt-2`}>
        <span className="text text_type_digits-default">{ingredient.price}</span>
        <CurrencyIcon type="primary" />
      </div>
      <h3 className={`text text_type_main-default mt-2 ${styles.name}`}>
        {ingredient.name}
      </h3>
    </article>
  );
}

export default IngredientCard;
