import { useMemo } from "react";
import { Order } from "../../utils/types";
import styles from "./feed-summary.module.scss";

interface FeedSummaryProps {
  orders: Order[];
  total: number;
  totalToday: number;
}

function FeedSummary({ orders, total, totalToday }: FeedSummaryProps) {
  const doneOrders = useMemo(() => {
    return orders.filter((order) => order.status === "done");
  }, [orders]);

  const pendingOrders = useMemo(() => {
    return orders.filter(
      (order) => order.status === "pending" || order.status === "created",
    );
  }, [orders]);

  function chunkArray<T>(arr: T[], size: number): T[][] {
    const result: T[][] = [];
    for (let i = 0; i < arr.length; i += size) {
      result.push(arr.slice(i, i + size));
    }
    return result;
  }

  const doneColumns = chunkArray(doneOrders, 10);
  const pendingColumns = chunkArray(pendingOrders, 10);

  return (
    <div className={styles.summary}>
      <div className={styles.boards}>
        <div className={styles.board}>
          <h3 className="text text_type_main-medium mb-6">Готовы:</h3>
          <div className={styles.columns}>
            {doneColumns.map((column, idx) => (
              <div key={idx} className={styles.column}>
                {column.map((order) => (
                  <span
                    key={order._id}
                    className={`text text_type_digits-default ${styles.doneNumber}`}
                  >
                    {order.number}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className={styles.board}>
          <h3 className="text text_type_main-medium mb-6">В работе:</h3>
          <div className={styles.columns}>
            {pendingColumns.map((column, idx) => (
              <div key={idx} className={styles.column}>
                {column.map((order) => (
                  <span key={order._id} className="text text_type_digits-default">
                    {order.number}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className={styles.total}>
        <h3 className="text text_type_main-medium">Выполнено за все время:</h3>
        <span className={`text text_type_digits-large ${styles.totalNumber}`}>
          {total}
        </span>
      </div>
      <div className={styles.total}>
        <h3 className="text text_type_main-medium">Выполнено за сегодня:</h3>
        <span className={`text text_type_digits-large ${styles.totalNumber}`}>
          {totalToday}
        </span>
      </div>
    </div>
  );
}

export default FeedSummary;
