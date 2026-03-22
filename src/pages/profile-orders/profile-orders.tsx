import { useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../services/store";
import { profileWsConnect, profileWsDisconnect } from "../../services/actions/wsActions";
import ProfileNav from "../../components/profile-nav/profile-nav";
import OrdersList from "../../components/orders-list/orders-list";
import styles from "./profile-orders.module.scss";
import { WS_BASE_URL } from "../../utils/api";

function ProfileOrdersPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { orders } = useAppSelector((state) => state.profileOrders);
  const { accessToken, isAuthenticated } = useAppSelector((state) => state.auth);
  const ordersReversed = useMemo(() => [...orders].reverse(), [orders]);

  useEffect(() => {
    if (isAuthenticated && accessToken) {
      const token = accessToken.replace(/^Bearer\s+/i, "");
      const url = `${WS_BASE_URL}/orders?token=${token}`;
      dispatch(profileWsConnect(url));
    }

    return () => {
      dispatch(profileWsDisconnect());
    };
  }, [dispatch, isAuthenticated, accessToken]);

  const handleOrderClick = (orderNumber: number) => {
    navigate(`/profile/orders/${orderNumber}`, { state: { background: location } });
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <section className={styles.page}>
      <div className={styles.container}>
        <div className={styles.nav}>
          <ProfileNav caption="В этом разделе вы можете просмотреть историю своих заказов" />
        </div>
        <div className={styles.content}>
          <OrdersList
            orders={ordersReversed}
            showStatus={true}
            onOrderClick={handleOrderClick}
          />
        </div>
      </div>
    </section>
  );
}

export default ProfileOrdersPage;
