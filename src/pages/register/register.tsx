import { useState, FormEvent, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Input,
  Button,
  PasswordInput,
} from "@ya.praktikum/react-developer-burger-ui-components";
import styles from "./register.module.scss";
import { useAppDispatch, useAppSelector } from "../../services/store";
import { registerUserThunk, clearError } from "../../services/auth";

function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useAppDispatch();
  const { isLoading, error, isAuthenticated } = useAppSelector((state) => state.auth);

  const navigate = useNavigate();
  const location = useLocation();

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
    dispatch(registerUserThunk({ email, password, name }));
  };

  return (
    <section className={styles.page}>
      <div className={styles.container}>
        <h1 className={`${styles.title} text text_type_main-medium`}>Регистрация</h1>

        <form className={styles.form} onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="Имя"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={false}
            errorText="Ошибка"
            size="default"
            name="name"
            required
            onPointerEnterCapture={() => {}}
            onPointerLeaveCapture={() => {}}
          />

          <Input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={false}
            errorText="Ошибка"
            size="default"
            name="email"
            required
            onPointerEnterCapture={() => {}}
            onPointerLeaveCapture={() => {}}
          />

          <PasswordInput
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            name="password"
            placeholder="Пароль"
            required
          />
          {error && (
            <p className="text text_type_main-default text_color_error">{error}</p>
          )}
          <Button
            type="primary"
            size="medium"
            htmlType="submit"
            disabled={!name || !email || !password}
            extraClass="mb-20"
          >
            {isLoading ? "Регистрация..." : "Зарегистрироваться"}
          </Button>
        </form>

        <div className={styles.links}>
          <p className="text text_type_main-default text_color_inactive">
            Уже зарегистрированы?{" "}
            <Link
              to="/login"
              className={styles.link}
              state={{ from: location.state?.from }}
            >
              Войти
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}

export default RegisterPage;
