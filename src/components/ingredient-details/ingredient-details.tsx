import styles from "./ingredient-details.module.scss";
import { Ingredient } from "../../utils/types";

interface IngredientDetailsProps {
  ingredient: Ingredient;
}

function IngredientDetails(props: IngredientDetailsProps) {
  const ingredient = props.ingredient;

  return (
    <div className={styles.details}>
      <img src={ingredient.image_large} alt={ingredient.name} className={styles.image} />
      <h3 className={`text text_type_main-medium mt-4 mb-8 ${styles.name}`}>
        {ingredient.name}
      </h3>

      <div className={styles.nutrition}>
        <div className={styles.nutritionItem}>
          <span className="text text_type_main-default text_color_inactive">
            Калории,ккал
          </span>
          <span className="text text_type_digits-default text_color_inactive">
            {ingredient.calories}
          </span>
        </div>

        <div className={styles.nutritionItem}>
          <span className="text text_type_main-default text_color_inactive">
            Белки, г
          </span>
          <span className="text text_type_digits-default text_color_inactive">
            {ingredient.proteins}
          </span>
        </div>

        <div className={styles.nutritionItem}>
          <span className="text text_type_main-default text_color_inactive">Жиры, г</span>
          <span className="text text_type_digits-default text_color_inactive">
            {ingredient.fat}
          </span>
        </div>

        <div className={styles.nutritionItem}>
          <span className="text text_type_main-default text_color_inactive">
            Углеводы, г
          </span>
          <span className="text text_type_digits-default text_color_inactive">
            {ingredient.carbohydrates}
          </span>
        </div>
      </div>
    </div>
  );
}

export default IngredientDetails;
