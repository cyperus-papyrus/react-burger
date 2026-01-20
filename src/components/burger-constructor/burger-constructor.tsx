import {
  ConstructorElement,
  CurrencyIcon,
  Button,
} from "@ya.praktikum/react-developer-burger-ui-components";
import styles from "./burger-constructor.module.scss";
import { useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../services/store";
import { useDrop } from "react-dnd";
import { Ingredient } from "../../utils/types";
import {
  addIngredient,
  removeIngredient,
  moveIngredient,
} from "../../services/burgerConstructor";
import { createOrderThunk } from "../../services/orderDetails";
import DraggableConstructorElement from "./draggable-constructor-element/draggable-constructor-element";

function BurgerConstructor() {
  const dispatch = useAppDispatch();
  const { bun, ingredients } = useAppSelector((state) => state.burgerConstructor);
  const { isLoading: isOrderLoading } = useAppSelector((state) => state.orderDetails);

  const totalPrice = useMemo(() => {
    const bunPrice = bun ? bun.price * 2 : 0;
    const ingredientsPrice = ingredients.reduce((sum, item) => sum + item.price, 0);
    return bunPrice + ingredientsPrice;
  }, [bun, ingredients]);

  const handleOrderClick = () => {
    const ingredientIds = [
      bun?._id,
      bun?._id,
      ...ingredients.map((item) => item._id),
    ].filter(Boolean) as string[];

    dispatch(createOrderThunk(ingredientIds));
  };
  const [{ isHover }, dropTarget] = useDrop({
    accept: "ingredient",
    drop(item: { ingredient: Ingredient }) {
      dispatch(addIngredient(item.ingredient));
    },
    collect: (monitor) => ({
      isHover: monitor.isOver(),
    }),
  });

  const handleDeleteIngredient = (uniqueId: string) => {
    dispatch(removeIngredient(uniqueId));
  };

  const handleMoveIngredient = (fromIndex: number, toIndex: number) => {
    dispatch(moveIngredient({ fromIndex, toIndex }));
  };

  const EmptyBunPlaceholder = ({ type }: { type: "top" | "bottom" }) => {
    const text = type === "top" ? " (верх)" : " (низ)";
    return (
      <div className={`${styles.bunPlaceholder} pl-8 pr-4 mb-2`}>
        <div
          className={`${styles.bunPlaceholderContent} ${type === "top" ? styles.bunPlaceholderContentTop : styles.bunPlaceholderContentBottom}`}
        >
          <span className="constructor-element__row">
            <span className="constructor-element__text text text_type_main-default text_color_inactive">
              Выберите булку{text}
            </span>
          </span>
        </div>
      </div>
    );
  };

  const canCreateOrder = !!bun;
  return (
    <section
      className={`${styles.constructor} ${isHover ? styles.constructorHover : ""}`}
      ref={dropTarget as any}
    >
      <div className={`${styles.constructorContainer} mt-25`}>
        {bun ? (
          <div className={`${styles.bunContainer} pl-8 pr-4`}>
            <ConstructorElement
              type="top"
              isLocked={true}
              text={`${bun.name} (верх)`}
              price={bun.price}
              thumbnail={bun.image}
            />
          </div>
        ) : (
          <EmptyBunPlaceholder type="top" />
        )}

        <div className={styles.stuffsContainer}>
          {ingredients.length > 0 ? (
            <ul className={styles.stuffsList}>
              {ingredients.map((item, index) => (
                <DraggableConstructorElement
                  key={item.uniqueId}
                  item={item}
                  index={index}
                  onDelete={handleDeleteIngredient}
                  moveIngredient={handleMoveIngredient}
                />
              ))}
            </ul>
          ) : (
            <p
              className={`${styles.stuffsPlaceholder} text text_type_main-default text_color_inactive`}
            >
              Начинки не добавлены
            </p>
          )}
        </div>

        {bun ? (
          <div className={`${styles.bunContainer} pl-8 pr-4`}>
            <ConstructorElement
              type="bottom"
              isLocked={true}
              text={`${bun.name} (низ)`}
              price={bun.price}
              thumbnail={bun.image}
            />
          </div>
        ) : (
          <EmptyBunPlaceholder type="bottom" />
        )}

        <div className={styles.orderSection}>
          <div className={styles.totalPrice}>
            <span className="text text_type_digits-medium">{totalPrice}</span>
            <CurrencyIcon type="primary" />
          </div>
          <Button
            htmlType="button"
            type="primary"
            size="large"
            onClick={handleOrderClick}
            disabled={!canCreateOrder || isOrderLoading}
          >
            {isOrderLoading ? "Оформляем..." : "Оформить заказ"}
          </Button>
        </div>
      </div>
    </section>
  );
}

export default BurgerConstructor;
