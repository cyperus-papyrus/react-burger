import "./App.css";
import AppHeader from "./components/app-header/app-header";
import BurgerIngredients from "./components/burger-ingredients/burger-ingredients";
import BurgerConstructor from "./components/burger-constructor/burger-constructor";
import Modal from "./components/modal/modal";
import IngredientDetails from "./components/ingredient-details/ingredient-details";
import OrderDetails from "./components/order-details/order-details";
import type { RootState } from "./services/store";
import { resetDetails } from "./services/ingredientDetails";
import { resetOrder } from "./services/orderDetails";
import { resetConstructor } from "./services/burgerConstructor";
import { useAppDispatch, useAppSelector } from "./services/store";

function App() {
  const dispatch = useAppDispatch();
  const ingredient = useAppSelector((state: RootState) => state.ingredientDetails.item);
  const order = useAppSelector((state: RootState) => state.orderDetails.order);
  const { isLoading: isOrderLoading } = useAppSelector(
    (state: RootState) => state.orderDetails,
  );

  const closeIngredientModal = () => {
    dispatch(resetDetails());
  };

  const closeOrderModal = () => {
    dispatch(resetOrder());
    dispatch(resetConstructor());
    dispatch(resetDetails());
  };

  return (
    <div className="App">
      <AppHeader />
      <main className="main">
        <BurgerIngredients />
        <BurgerConstructor />
      </main>

      {/* Модалка с деталями ингредиента */}
      {ingredient && (
        <Modal title="Детали ингредиента" onClose={closeIngredientModal}>
          <IngredientDetails />
        </Modal>
      )}

      {/* Модалка с деталями заказа */}
      {order.number && !isOrderLoading && (
        <Modal onClose={closeOrderModal}>
          <OrderDetails />
        </Modal>
      )}
    </div>
  );
}

export default App;
