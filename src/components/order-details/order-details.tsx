import styles from "./order-details.module.scss";
import imageCheck from "../../images/graphics.svg";
import { useAppSelector } from "../../services/store";

function OrderDetails() {
  const { order, isLoading, error } = useAppSelector((state) => state.orderDetails);

  if (isLoading) {
    return (
      <div className={styles.order}>
        <p className="text text_type_main-medium">Загружаем данные заказа...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.order}>
        <p className="text text_type_main-medium text_color_error">Ошибка: {error}</p>
      </div>
    );
  }

  if (!order.number) {
    return (
      <div className={styles.order}>
        <p className="text text_type_main-medium">Заказ не создан</p>
      </div>
    );
  }

  return (
    <div className={styles.details}>
      <h2 className={`text text_type_digits-large mb-8 ${styles.orderNumber}`}>
        {order.number}
      </h2>
      <p className="text text_type_main-medium mb-15">идентификатор заказа</p>

      <div className={`mb-15 ${styles.imageWrapper}`}>
        <img src={imageCheck} alt="check" />
      </div>

      <p className="text text_type_main-default mb-2">Ваш заказ начали готовить</p>
      <p className="text text_type_main-default text_color_inactive">
        Дождитесь готовности на орбитальной станции
      </p>
    </div>
  );
}

export default OrderDetails;
