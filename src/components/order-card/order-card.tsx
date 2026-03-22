import { useMemo } from "react";
import { CurrencyIcon } from "@ya.praktikum/react-developer-burger-ui-components";
import { useAppSelector } from "../../services/store";
import { Order } from "../../utils/types";
import { formatOrderDate } from "../../utils/date";
import styles from "./order-card.module.scss";

interface OrderCardProps {
  order: Order;
  showStatus?: boolean;
  onClick?: (orderNumber: number) => void;
}

function OrderCard({ order, showStatus = false, onClick }: OrderCardProps) {
  const ingredients = useAppSelector((state) => state.burgerIngredients.items);

  const orderIngredients = useMemo(() => {
    return order.ingredients
      .map((id) => ingredients.find((item) => item._id === id))
      .filter((item): item is NonNullable<typeof item> => item !== undefined);
  }, [order.ingredients, ingredients]);

  const totalPrice = useMemo(() => {
    return orderIngredients.reduce((sum, item) => sum + item.price, 0);
  }, [orderIngredients]);

  let statusText = "";
  let statusColor = "#F2F2F3";

  if (order.status === "done") {
    statusText = "Выполнен";
    statusColor = "#00CCCC";
  } else if (order.status === "pending") {
    statusText = "Готовится";
  } else if (order.status === "created") {
    statusText = "Создан";
  }

  const visibleIngredients = orderIngredients.slice(0, 6);
  const restCount = orderIngredients.length - 6;

  const handleClick = () => {
    if (onClick) {
      onClick(order.number);
    }
  };

  return (
    <div className={styles.card} onClick={handleClick}>
      <div className={styles.header}>
        <span className="text text_type_digits-default">#{order.number}</span>
        <span className="text text_type_main-default text_color_inactive">
          {formatOrderDate(order.createdAt)}
        </span>
      </div>
      <h3 className={`text text_type_main-medium ${styles.title}`}>{order.name}</h3>
      {showStatus && (
        <p
          className={`text text_type_main-default ${styles.status}`}
          style={{ color: statusColor }}
        >
          {statusText}
        </p>
      )}
      <div className={styles.footer}>
        <div className={styles.ingredients}>
          {visibleIngredients.map((item, index) => (
            <div
              key={index}
              className={styles.iconWrapper}
              style={{ zIndex: visibleIngredients.length - index }}
            >
              <img src={item.image_mobile} alt={item.name} className={styles.icon} />
            </div>
          ))}
          {restCount > 0 && (
            <div className={styles.iconWrapper}>
              <div className={styles.restCount}>+{restCount}</div>
            </div>
          )}
        </div>
        <div className={styles.price}>
          <span className="text text_type_digits-default">{totalPrice}</span>
          <CurrencyIcon type="primary" />
        </div>
      </div>
    </div>
  );
}

export default OrderCard;
