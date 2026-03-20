import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../services/store";
import { feedWsConnect, feedWsDisconnect } from "../../services/actions/wsActions";
import OrderInfo from "../../components/order-info/order-info";
import { WS_BASE_URL } from "../../utils/api";
import styles from "./feed-order.module.scss";

function FeedOrderPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const orderNumber = Number(id);

  const orderFromStore = useAppSelector((state) =>
    state.feed.orders.find((o) => o.number === orderNumber),
  );

  useEffect(() => {
    if (orderFromStore) {
      setLoading(false);
      return;
    }

    dispatch(feedWsConnect(`${WS_BASE_URL}/orders/all`));

    return () => {
      dispatch(feedWsDisconnect());
    };
  }, [dispatch, orderFromStore]);

  const order = useAppSelector((state) =>
    state.feed.orders.find((o) => o.number === orderNumber),
  );

  useEffect(() => {
    if (order) {
      setLoading(false);
    }
  }, [order]);

  if (loading) {
    return <div className={styles.loading}>Загрузка...</div>;
  }

  if (!order) {
    return <div className={styles.notFound}>Заказ не найден</div>;
  }

  return (
    <div className={styles.container}>
      <OrderInfo order={order} />
    </div>
  );
}

export default FeedOrderPage;
