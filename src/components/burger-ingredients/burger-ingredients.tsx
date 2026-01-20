import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import IngredientsTabs from "./ingredients-tabs/ingredients-tabs";
import IngredientCard from "./ingredient-card/ingredient-card";
import styles from "./burger-ingredients.module.scss";
import type { RootState, AppDispatch } from "../../services/store";
import { fetchIngredientsThunk } from "../../services/burgerIngredients";
import { setDetails } from "../../services/ingredientDetails";
import type { Ingredient } from "../../utils/types";
import { useAppDispatch, useAppSelector } from "../../services/store";

const BurgerIngredients = () => {
  const [currentTab, setCurrentTab] = useState<"bun" | "sauce" | "main">("bun");
  const bunRef = useRef<HTMLDivElement>(null);
  const sauceRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const currentTabRef = useRef(currentTab);
  const dispatch: AppDispatch = useAppDispatch();

  const {
    items: ingredients,
    isLoading,
    error,
  } = useAppSelector((state: RootState) => state.burgerIngredients);

  const { bun, ingredients: constructorIngredients } = useAppSelector(
    (state: RootState) => state.burgerConstructor,
  );

  const buns = useMemo(
    () => ingredients.filter((item) => item.type === "bun"),
    [ingredients],
  );
  const sauces = useMemo(
    () => ingredients.filter((item) => item.type === "sauce"),
    [ingredients],
  );
  const mains = useMemo(
    () => ingredients.filter((item) => item.type === "main"),
    [ingredients],
  );

  const handleTabClick = useCallback((value: string) => {
    setCurrentTab(value as "bun" | "sauce" | "main");

    if (value === "bun" && bunRef.current) {
      bunRef.current.scrollIntoView({ behavior: "smooth" });
    } else if (value === "sauce" && sauceRef.current) {
      sauceRef.current.scrollIntoView({ behavior: "smooth" });
    } else if (value === "main" && mainRef.current) {
      mainRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  const handleIngredientClick = useCallback(
    (ingredient: Ingredient) => {
      dispatch(setDetails(ingredient));
    },
    [dispatch],
  );

  const getIngredientCount = useCallback(
    (ingredient: Ingredient) => {
      if (ingredient.type === "bun") {
        return bun && bun._id === ingredient._id ? 2 : 0;
      }

      return constructorIngredients.filter((item) => item._id === ingredient._id).length;
    },
    [bun, constructorIngredients],
  );

  useEffect(() => {
    dispatch(fetchIngredientsThunk());
  }, [dispatch]);
  useEffect(() => {
    currentTabRef.current = currentTab;
  }, [currentTab]);

  useEffect(
    function () {
      const container = containerRef.current;
      if (!container) {
        return;
      }

      function handleScroll() {
        const sections = [
          { ref: bunRef.current, tab: "bun" as const },
          { ref: sauceRef.current, tab: "sauce" as const },
          { ref: mainRef.current, tab: "main" as const },
        ];

        const validSections = sections.filter((section) => section.ref);

        if (validSections.length === 0) {
          return;
        }
        if (!container) return;

        const containerTop = container.getBoundingClientRect().top;
        let minDistance = Infinity;
        let closestTab = null;

        validSections.forEach(({ ref, tab }) => {
          if (!ref) return;
          const distance = Math.abs(ref.getBoundingClientRect().top - containerTop);
          if (distance < minDistance) {
            minDistance = distance;
            closestTab = tab;
          }
        });

        if (closestTab && closestTab !== currentTabRef.current) {
          setCurrentTab(closestTab);
        }
      }

      container.addEventListener("scroll", handleScroll);
      handleScroll();

      return function () {
        container.removeEventListener("scroll", handleScroll);
      };
    },
    [ingredients.length],
  );

  if (isLoading) {
    return (
      <section className={styles.ingredients}>
        <h1 className="text text_type_main-large mt-10 mb-5">Соберите бургер</h1>
        <div className={styles.container}>
          <p className="text text_type_main-default">Загрузка ингредиентов...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={styles.ingredients}>
        <h1 className="text text_type_main-large mt-10 mb-5">Соберите бургер</h1>
        <div className={styles.container}>
          <p className="text text_type_main-default">Ошибка загрузки: {error}</p>
        </div>
      </section>
    );
  }
  return (
    <section className={styles.ingredients}>
      <h1 className="text text_type_main-large mt-10 mb-5">Соберите бургер</h1>

      <IngredientsTabs currentTab={currentTab} onTabClick={handleTabClick} />

      <div className={styles.ingredientsContainer} ref={containerRef}>
        <div ref={bunRef} id="bun-section">
          <h2 className="text text_type_main-medium pt-10 pb-6">Булки</h2>
          <div className={styles.cardsGrid}>
            {buns.map((bun) => (
              <IngredientCard
                key={bun._id}
                ingredient={bun}
                onClick={handleIngredientClick}
                count={getIngredientCount(bun)}
              />
            ))}
          </div>
        </div>

        <div ref={sauceRef} id="sauce-section">
          <h2 className="text text_type_main-medium pt-10 pb-6">Соусы</h2>
          <div className={styles.cardsGrid}>
            {sauces.map((sauce) => (
              <IngredientCard
                key={sauce._id}
                ingredient={sauce}
                onClick={handleIngredientClick}
                count={getIngredientCount(sauce)}
              />
            ))}
          </div>
        </div>

        <div ref={mainRef} id="main-section">
          <h2 className="text text_type_main-medium pt-10 pb-6">Начинки</h2>
          <div className={styles.cardsGrid}>
            {mains.map((main) => (
              <IngredientCard
                key={main._id}
                ingredient={main}
                onClick={handleIngredientClick}
                count={getIngredientCount(main)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BurgerIngredients;
