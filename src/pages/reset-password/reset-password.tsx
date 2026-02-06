import { useState, FormEvent, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Input,
  Button,
  PasswordInput,
} from "@ya.praktikum/react-developer-burger-ui-components";
import styles from "./reset-password.module.scss";
import { useAppDispatch, useAppSelector } from "../../services/store";
import { resetPasswordThunk, clearError } from "../../services/auth";

function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");

  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const forgotPasswordVisited = localStorage.getItem("forgotPasswordVisited");
    const fromForgotPassword = location.state?.from?.pathname === "/forgot-password";

    if (!forgotPasswordVisited && !fromForgotPassword) {
      navigate("/forgot-password", { replace: true });
    }

    return () => {
      dispatch(clearError());
    };
  }, [location, navigate, dispatch]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    dispatch(resetPasswordThunk({ password, token }))
      .unwrap()
      .then(() => {
        localStorage.removeItem("forgotPasswordVisited");
        navigate("/login", { replace: true });
      });
  };
  return (
    <section className={styles.page}>
      <div className={styles.container}>
        <h1 className={`${styles.title} text text_type_main-medium`}>
          Восстановление пароля
        </h1>

        <form className={styles.form} onSubmit={handleSubmit}>
          <PasswordInput
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            name="password"
            placeholder="Введите новый пароль"
            required
          />

          <Input
            type="text"
            placeholder="Введите код из письма"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            error={false}
            errorText="Ошибка"
            size="default"
            name="token"
            required
            onPointerEnterCapture={() => {}}
            onPointerLeaveCapture={() => {}}
          />

          {error && (
            <p className="text text_type_main-default text_color_error">{error}</p>
          )}
          <Button
            type="primary"
            size="medium"
            htmlType="submit"
            disabled={!password || !token}
            extraClass="mb-20"
          >
            {isLoading ? "Сохраняем..." : "Сохранить"}
          </Button>
        </form>

        <div className={styles.links}>
          <p className="text text_type_main-default text_color_inactive">
            Вспомнили пароль?{" "}
            <Link to="/login" className={styles.link}>
              Войти
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}

export default ResetPasswordPage;
