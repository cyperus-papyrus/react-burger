import { useMemo } from "react";
import { CurrencyIcon } from "@ya.praktikum/react-developer-burger-ui-components";
import { useAppSelector } from "../../services/store";
import { Order } from "../../utils/types";
import { formatOrderDate } from "../../utils/date";
import styles from "./order-info.module.scss";

interface OrderInfoProps {
  order: Order;
}

function OrderInfo({ order }: OrderInfoProps) {
  const ingredients = useAppSelector((state) => state.burgerIngredients.items);

  const ingredientsWithCount = useMemo(() => {
    const counts: Record<string, number> = {};
    order.ingredients.forEach((id) => {
      counts[id] = (counts[id] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([id, count]) => {
        const ingredient = ingredients.find((item) => item._id === id);
        if (!ingredient) return null;
        return {
          ...ingredient,
          count,
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);
  }, [order.ingredients, ingredients]);

  const totalPrice = useMemo(() => {
    return ingredientsWithCount.reduce((sum, item) => sum + item.price * item.count, 0);
  }, [ingredientsWithCount]);

  const statusText = {
    done: "Выполнен",
    pending: "Готовится",
    created: "Создан",
  }[order.status];

  const statusColor = order.status === "done" ? "#00CCCC" : "#F2F2F3";

  return (
    <div className={styles.container}>
      <h2 className={`text text_type_digits-default mb-10`}>#{order.number}</h2>
      <h3 className={`text text_type_main-medium mb-3`}>{order.name}</h3>
      <p className={`text text_type_main-default mb-15`} style={{ color: statusColor }}>
        {statusText}
      </p>

      <h4 className={`text text_type_main-medium mb-6`}>Состав:</h4>
      <div className={styles.ingredientsList}>
        {ingredientsWithCount.map((item) => (
          <div key={item._id} className={styles.ingredient}>
            <div className={styles.iconWrapper}>
              <img src={item.image_mobile} alt={item.name} className={styles.icon} />
            </div>
            <span className={`text text_type_main-default ${styles.name}`}>
              {item.name}
            </span>
            <div className={styles.price}>
              <span className="text text_type_digits-default">
                {item.count} x {item.price}
              </span>
              <CurrencyIcon type="primary" />
            </div>
          </div>
        ))}
      </div>

      <div className={styles.footer}>
        <span className="text text_type_main-default text_color_inactive">
          {formatOrderDate(order.createdAt)}
        </span>
        <div className={styles.totalPrice}>
          <span className="text text_type_digits-default">{totalPrice}</span>
          <CurrencyIcon type="primary" />
        </div>
      </div>
    </div>
  );
}

export default OrderInfo;
