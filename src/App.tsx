import { useState, useEffect } from "react";
import "./App.css";
import AppHeader from "./components/app-header/app-header";
import BurgerIngredients from "./components/burger-ingredients/burger-ingredients";
import BurgerConstructor from "./components/burger-constructor/burger-constructor";
import data from "./utils/data";
import { Ingredient } from "./utils/types";

function App() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      // В будущем здесь будет fetch к API
      setIngredients(data);
    } catch (err) {
      setError("Ошибка загрузки ингредиентов");
      console.error(err);
    }
  }, []);

  if (ingredients.length === 0 && !error) {
    return (
      <div className="App">
        <AppHeader />
        <main className="main">
          <div className="text text_type_main-large">Загрузка...</div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="App">
        <AppHeader />
        <main className="main">
          <div className="text text_type_main-large" style={{ color: "red" }}>
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
        <BurgerIngredients ingredients={ingredients} />
        <BurgerConstructor ingredients={ingredients} />
      </main>
    </div>
  );
}

export default App;
