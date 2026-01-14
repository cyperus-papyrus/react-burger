import React from "react";
import {
  ConstructorElement,
  CurrencyIcon,
  Button,
  DragIcon,
} from "@ya.praktikum/react-developer-burger-ui-components";
import styles from "./burger-constructor.module.scss";
import { BurgerConstructorProps } from "../../utils/types";

function BurgerConstructor(props: BurgerConstructorProps) {
  const ingredients = props.ingredients;

  const buns = ingredients.filter((item) => item.type === "bun");
  const stuffs = ingredients.filter((item) => item.type !== "bun").slice(0, 8);

  const totalPrice = React.useMemo(() => {
    const bunsPrice = buns.length > 0 ? buns[0].price * 2 : 0;
    const stuffsPrice = stuffs.reduce((sum, item) => sum + item.price, 0);
    return bunsPrice + stuffsPrice;
  }, [buns, stuffs]);

  return (
    <section className={`${styles.constructor}`}>
      <div className={`${styles.constructorContainer} mt-25`}>
        {buns.length > 0 && (
          <div className={`${styles.bunContainer} pl-8 pr-4`}>
            <ConstructorElement
              type="top"
              isLocked={true}
              text={`${buns[0].name} (верх)`}
              price={buns[0].price}
              thumbnail={buns[0].image}
            />
          </div>
        )}

        <div className={styles.stuffsContainer}>
          {stuffs.length > 0 ? (
            <ul className={styles.stuffsList}>
              {stuffs.map((item, index) => (
                <li key={`${item._id}_${index}`} className={styles.staffItem}>
                  <DragIcon className={`${styles.dragIcon} pr-1`} type="primary" />
                  <ConstructorElement
                    text={item.name}
                    price={item.price}
                    thumbnail={item.image}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text text_type_main-default text_color_inactive">
              Начинки не добавлены
            </p>
          )}
        </div>

        {buns.length > 0 && (
          <div className={`${styles.bunContainer} pl-8 pr-4`}>
            <ConstructorElement
              type="bottom"
              isLocked={true}
              text={`${buns[0].name} (низ)`}
              price={buns[0].price}
              thumbnail={buns[0].image}
            />
          </div>
        )}

        <div className={styles.orderSection}>
          <div className={styles.totalPrice}>
            <span className="text text_type_digits-medium">{totalPrice}</span>
            <CurrencyIcon type="primary" />
          </div>
          <Button htmlType="button" type="primary" size="large">
            Оформить заказ
          </Button>
        </div>
      </div>
    </section>
  );
}

export default BurgerConstructor;
