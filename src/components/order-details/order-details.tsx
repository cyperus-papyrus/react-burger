import styles from "./order-details.module.scss";
import imageCheck from "../../images/graphics.svg";

interface OrderDetailsProps {
  orderNumber: number;
}

function OrderDetails(props: OrderDetailsProps) {
  const orderNumber = props.orderNumber;

  return (
    <div className={styles.details}>
      <h2 className={`text text_type_digits-large mb-8 ${styles.orderNumber}`}>
        {orderNumber}
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
