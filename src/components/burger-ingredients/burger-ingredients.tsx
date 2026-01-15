import { useState, useRef, useCallback, useEffect } from "react";
import IngredientsTabs from "./ingredients-tabs/ingredients-tabs";
import IngredientCard from "./ingredient-card/ingredient-card";
import styles from "./burger-ingredients.module.scss";
import { BurgerIngredientsProps } from "../../utils/types";

const BurgerIngredients = (props: BurgerIngredientsProps) => {
  const { ingredients, onIngredientClick } = props;
  const [currentTab, setCurrentTab] = useState<"bun" | "sauce" | "main">("bun");

  const bunRef = useRef<HTMLDivElement>(null);
  const sauceRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  const buns = ingredients.filter((item) => item.type === "bun");
  const sauces = ingredients.filter((item) => item.type === "sauce");
  const mains = ingredients.filter((item) => item.type === "main");

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

  useEffect(
    function () {
      const container = containerRef.current;
      if (!container) {
        return;
      }

      function handleScroll() {
        const sections = [
          { ref: bunRef.current, tab: "bun" },
          { ref: sauceRef.current, tab: "sauce" },
          { ref: mainRef.current, tab: "main" },
        ];

        if (!container || sections.some((section) => !section.ref)) {
          return;
        }

        const containerTop = container.getBoundingClientRect().top;
        let minDistance = Infinity;
        let closestTab = null;

        sections.forEach(({ ref, tab }) => {
          if (!ref) return;
          const distance = Math.abs(ref.getBoundingClientRect().top - containerTop);
          if (distance < minDistance) {
            minDistance = distance;
            closestTab = tab;
          }
        });

        if (closestTab && closestTab !== currentTab) {
          setCurrentTab(closestTab);
        }
      }
      container.addEventListener("scroll", handleScroll);

      return function () {
        container.removeEventListener("scroll", handleScroll);
      };
    },
    [currentTab]
  );

  if (ingredients.length === 0) {
    return (
      <section className={styles.ingredients}>
        <h1 className="text text_type_main-large mt-10 mb-5">Соберите бургер</h1>
        <div className={styles.container}>
          <p className="text text_type_main-default">Ингредиенты не загружены</p>
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
                onClick={onIngredientClick}
                count={2}
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
                onClick={onIngredientClick}
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
                onClick={onIngredientClick}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BurgerIngredients;
