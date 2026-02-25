import { FormEvent, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Input,
  Button,
  PasswordInput,
} from "@ya.praktikum/react-developer-burger-ui-components";
import styles from "./login.module.scss";
import { useAppDispatch, useAppSelector } from "../../services/store";
import { loginUserThunk, clearError } from "../../services/auth";
import { useForm } from "../../hooks/useForms";

function LoginPage() {
  const { values, handleChange } = useForm({ email: "", password: "" });

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { isLoading, error, isAuthenticated } = useAppSelector((state) => state.auth);

  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!values.email || !values.password) {
      return;
    }

    dispatch(loginUserThunk({ email: values.email, password: values.password }));
  };

  return (
    <section className={styles.page}>
      <div className={styles.container}>
        <h1 className={`${styles.title} text text_type_main-medium`}>Вход</h1>

        <form className={styles.form} onSubmit={handleSubmit}>
          <Input
            extraClass="mb-6"
            type="email"
            placeholder="E-mail"
            value={values.email}
            onChange={handleChange}
            error={false}
            errorText="Ошибка"
            size="default"
            name="email"
            required
            disabled={isLoading}
            onPointerEnterCapture={() => {}}
            onPointerLeaveCapture={() => {}}
          />

          <PasswordInput
            value={values.password}
            onChange={handleChange}
            name="password"
            placeholder="Пароль"
            required
            disabled={isLoading}
            icon="ShowIcon"
          />

          <div className={styles.error}>
            {error && <p className="text text_type_main-default">{error}</p>}
          </div>

          <Button
            type="primary"
            size="medium"
            htmlType="submit"
            disabled={isLoading || !values.email || !values.password}
            extraClass="mb-20"
          >
            {isLoading ? "Вход..." : "Войти"}
          </Button>
        </form>

        <div className={styles.links}>
          <p className="text text_type_main-default text_color_inactive">
            Вы — новый пользователь?{" "}
            <Link
              to="/register"
              className={styles.link}
              state={{ from: location.state?.from }}
            >
              Зарегистрироваться
            </Link>
          </p>
        </div>

        <div className={styles.links}>
          <p className="text text_type_main-default text_color_inactive">
            Забыли пароль?{" "}
            <Link
              to="/forgot-password"
              className={styles.link}
              state={{ from: location.state?.from }}
            >
              Восстановить пароль
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}

export default LoginPage;
