import { useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import IngredientDetails from "../../components/ingredient-details/ingredient-details";
import { Ingredient } from "../../utils/types";
import { useAppDispatch, useAppSelector } from "../../services/store";
import { setDetails } from "../../services/ingredientDetails";
import styles from "./ingredient-details-page.module.scss";

const IngredientDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const ingredients = useAppSelector((state) => state.burgerIngredients.items);
  const ingredient = useAppSelector((state) => state.ingredientDetails.item);
  const hasBackground = location.state?.background;

  useEffect(() => {
    if (id && ingredients.length > 0) {
      const foundIngredient = ingredients.find((item: Ingredient) => item._id === id);
      if (foundIngredient) {
        dispatch(setDetails(foundIngredient));
      } else {
        navigate("/");
      }
    }
  }, [id, ingredients, dispatch, navigate]);

  if (hasBackground) {
    return (
      <section className={styles.page} style={{ display: "none" }}>
        <div className={styles.container}>
          <div className={styles.content}>
            <h1 className={`${styles.title} text text_type_main-large`}>
              Детали ингредиента
            </h1>
            <IngredientDetails />
          </div>
        </div>
      </section>
    );
  }

  if (ingredients.length === 0) {
    return (
      <section className={styles.page}>
        <div className={styles.container}>
          <div className={styles.loading}>
            <p className="text text_type_main-medium">Загрузка ингредиента...</p>
          </div>
        </div>
      </section>
    );
  }

  if (!ingredient) {
    return (
      <section className={styles.page}>
        <div className={styles.container}>
          <div className={styles.content}>
            <h1 className={`${styles.title} text text_type_main-large`}>
              Детали ингредиента
            </h1>
            <p className="text text_type_main-medium mt-10">Ингредиент не найден</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.page}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={`${styles.title} text text_type_main-large`}>
            Детали ингредиента
          </h1>
          <IngredientDetails />
        </div>
      </div>
    </section>
  );
};

export default IngredientDetailsPage;
