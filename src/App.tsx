import "./App.css";
import AppHeader from "./components/app-header/app-header";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import {
  HomePage,
  LoginPage,
  RegisterPage,
  ForgotPasswordPage,
  ResetPasswordPage,
  ProfilePage,
  IngredientDetailsPage,
  NotFoundPage,
} from "./pages";
import Modal from "./components/modal/modal";
import IngredientDetails from "./components/ingredient-details/ingredient-details";
import { useAppDispatch, useAppSelector } from "./services/store";
import ProtectedRouteElement from "./components/protected-route/protected-route";
import { useEffect, useRef } from "react";
import { setDetails } from "./services/ingredientDetails";
import { fetchIngredientsThunk } from "./services/burgerIngredients";
import { restoreFromCookies } from "./services/auth";
import { initAuthThunk } from "./services/auth";

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const background = location.state?.background;
  const ingredients = useAppSelector((state) => state.burgerIngredients.items);
  const ingredient = useAppSelector((state) => state.ingredientDetails.item);
  const hasRestoredCookies = useRef(false);

  useEffect(() => {
    if (!hasRestoredCookies.current) {
      dispatch(restoreFromCookies());
      dispatch(initAuthThunk());
      hasRestoredCookies.current = true;
    }
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchIngredientsThunk());
  }, [dispatch]);

  const handleCloseModal = () => {
    navigate(-1);
  };

  useEffect(() => {
    if (background && location.pathname.startsWith("/ingredients/")) {
      const ingredientId = location.pathname.split("/")[2];
      const foundIngredient = ingredients.find((item) => item._id === ingredientId);
      if (foundIngredient) {
        dispatch(setDetails(foundIngredient));
      }
    }
  }, [background, location.pathname, ingredients, dispatch]);

  return (
    <div className="App">
      <AppHeader />
      <Routes location={background || location}>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/login"
          element={<ProtectedRouteElement element={<LoginPage />} onlyUnauth={true} />}
        />
        <Route
          path="/register"
          element={<ProtectedRouteElement element={<RegisterPage />} onlyUnauth={true} />}
        />
        <Route
          path="/forgot-password"
          element={
            <ProtectedRouteElement element={<ForgotPasswordPage />} onlyUnauth={true} />
          }
        />
        <Route
          path="/reset-password"
          element={
            <ProtectedRouteElement element={<ResetPasswordPage />} onlyUnauth={true} />
          }
        />
        <Route
          path="/profile"
          element={<ProtectedRouteElement element={<ProfilePage />} />}
        />
        <Route path="/ingredients/:id" element={<IngredientDetailsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      {/* Модалка ингредиента */}
      {background && location.pathname.startsWith("/ingredients/") && ingredient && (
        <Routes>
          <Route
            path="/ingredients/:id"
            element={
              <Modal title="Детали ингредиента" onClose={handleCloseModal}>
                <IngredientDetails />
              </Modal>
            }
          />
        </Routes>
      )}
    </div>
  );
}

export default App;
