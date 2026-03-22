import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../services/store";
import { profileWsConnect, profileWsDisconnect } from "../../services/actions/wsActions";
import OrderInfo from "../../components/order-info/order-info";
import { WS_BASE_URL } from "../../utils/api";
import styles from "./profile-order.module.scss";

function ProfileOrderPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const orderNumber = Number(id);
  const { accessToken, isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated || !accessToken) return;
    const token = accessToken.replace(/^Bearer\s+/i, "");
    const url = `${WS_BASE_URL}/orders?token=${token}`;
    dispatch(profileWsConnect(url));
    return () => {
      dispatch(profileWsDisconnect());
    };
  }, [dispatch, isAuthenticated, accessToken]);

  const order = useAppSelector((state) =>
    state.profileOrders.orders.find((o) => o.number === orderNumber),
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

export default ProfileOrderPage;
