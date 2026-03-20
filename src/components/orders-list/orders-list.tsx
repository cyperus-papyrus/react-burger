import OrderCard from "../order-card/order-card";
import { Order } from "../../utils/types";
import styles from "./orders-list.module.scss";

interface OrdersListProps {
  orders: Order[];
  showStatus?: boolean;
  onOrderClick?: (orderNumber: number) => void;
}

function OrdersList({ orders, showStatus = false, onOrderClick }: OrdersListProps) {
  return (
    <div className={styles.list}>
      {orders.map((order) => (
        <OrderCard
          key={order._id}
          order={order}
          showStatus={showStatus}
          onClick={onOrderClick}
        />
      ))}
    </div>
  );
}

export default OrdersList;
