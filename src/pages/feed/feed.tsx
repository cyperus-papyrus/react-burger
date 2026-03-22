import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../services/store";
import { feedWsConnect, feedWsDisconnect } from "../../services/actions/wsActions";
import OrdersList from "../../components/orders-list/orders-list";
import FeedSummary from "../../components/feed-summary/feed-summary";
import styles from "./feed.module.scss";
import { WS_BASE_URL } from "../../utils/api";

function FeedPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { orders, total, totalToday } = useAppSelector((state) => state.feed);

  useEffect(() => {
    const url = `${WS_BASE_URL}/orders/all`;
    dispatch(feedWsConnect(url));

    return () => {
      dispatch(feedWsDisconnect());
    };
  }, [dispatch]);

  const handleOrderClick = (orderNumber: number) => {
    navigate(`/feed/${orderNumber}`, { state: { background: location } });
  };

  return (
    <div className={styles.container}>
      <h1 className="text text_type_main-large mb-5">Лента заказов</h1>
      <div className={styles.content}>
        <div className={styles.orders}>
          <OrdersList orders={orders} onOrderClick={handleOrderClick} />
        </div>
        <div className={styles.summary}>
          <FeedSummary orders={orders} total={total || 0} totalToday={totalToday || 0} />
        </div>
      </div>
    </div>
  );
}

export default FeedPage;
