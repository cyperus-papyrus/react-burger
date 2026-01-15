import { useState, useEffect } from "react";
import "./App.css";
import AppHeader from "./components/app-header/app-header";
import BurgerIngredients from "./components/burger-ingredients/burger-ingredients";
import BurgerConstructor from "./components/burger-constructor/burger-constructor";
import { Ingredient } from "./utils/types";
import { fetchIngredients } from "./utils/api";
import Modal from "./components/modal/modal";
import IngredientDetails from "./components/ingredient-details/ingredient-details";
import OrderDetails from "./components/order-details/order-details";

function App() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);
  const [showIngredientModal, setShowIngredientModal] = useState<boolean>(false);
  const [showOrderModal, setShowOrderModal] = useState<boolean>(false);

  useEffect(() => {
    const loadIngredients = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await fetchIngredients();
        setIngredients(data);
      } catch (err) {
        const apiError = err as Error;
        setError(apiError.message || "Неизвестная ошибка при загрузке ингредиентов");
        console.error("Ошибка:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadIngredients();
  }, []);

  function handleIngredientClick(ingredient: Ingredient) {
    setSelectedIngredient(ingredient);
    setShowIngredientModal(true);
  }

  function handleCloseIngredientModal() {
    setShowIngredientModal(false);
    setSelectedIngredient(null);
  }

  function handleOrderClick() {
    setShowOrderModal(true);
  }

  function handleCloseOrderModal() {
    setShowOrderModal(false);
  }

  if (isLoading) {
    return (
      <div className="App">
        <AppHeader />
        <main className="main">
          <div className="text text_type_main-large mt-25">Загрузка...</div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="App">
        <AppHeader />
        <main className="main">
          <div className="text text_type_main-large mt-25" style={{ color: "firebrick" }}>
            {error}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="App">
      <AppHeader />
      <main className="main">
        <BurgerIngredients
          ingredients={ingredients}
          onIngredientClick={handleIngredientClick}
        />
        <BurgerConstructor ingredients={ingredients} onOrderClick={handleOrderClick} />
      </main>

      {/* Модалка с деталями ингредиента */}
      {showIngredientModal && selectedIngredient && (
        <Modal title="Детали ингредиента" onClose={handleCloseIngredientModal}>
          <IngredientDetails ingredient={selectedIngredient} />
        </Modal>
      )}

      {/* Модалка с деталями заказа */}
      {showOrderModal && (
        <Modal onClose={handleCloseOrderModal}>
          <OrderDetails orderNumber={12345} />
        </Modal>
      )}
    </div>
  );
}

export default App;
