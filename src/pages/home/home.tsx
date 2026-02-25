import { useLocation } from "react-router-dom";
import BurgerIngredients from "../../components/burger-ingredients/burger-ingredients";
import BurgerConstructor from "../../components/burger-constructor/burger-constructor";
import Modal from "../../components/modal/modal";
import OrderDetails from "../../components/order-details/order-details";
import { resetDetails } from "../../services/ingredientDetails";
import { resetOrder } from "../../services/orderDetails";
import { resetConstructor } from "../../services/burgerConstructor";
import { useAppDispatch, useAppSelector } from "../../services/store";

const HomePage = () => {
  const dispatch = useAppDispatch();
  const order = useAppSelector((state) => state.orderDetails.order);
  const { isLoading: isOrderLoading } = useAppSelector((state) => state.orderDetails);
  const location = useLocation();

  const closeOrderModal = () => {
    dispatch(resetOrder());
    dispatch(resetConstructor());
    dispatch(resetDetails());
  };

  return (
    <>
      <main className="main">
        <BurgerIngredients />
        <BurgerConstructor />
      </main>

      {/* Модалка с деталями заказа */}
      {order.number && !isOrderLoading && !location.state?.background && (
        <Modal onClose={closeOrderModal}>
          <OrderDetails />
        </Modal>
      )}
    </>
  );
};

export default HomePage;
