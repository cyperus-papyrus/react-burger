import { FormEvent, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Input, Button } from "@ya.praktikum/react-developer-burger-ui-components";
import styles from "./forgot-password.module.scss";
import { useAppDispatch, useAppSelector } from "../../services/store";
import { requestPasswordResetThunk, clearError } from "../../services/auth";
import { useForm } from "../../hooks/useForms";
function ForgotPasswordPage() {
  const { values, handleChange } = useForm({ email: "", password: "" });

  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    dispatch(requestPasswordResetThunk(values.email))
      .unwrap()
      .then(() => {
        localStorage.setItem("forgotPasswordVisited", "true");
        navigate("/reset-password", {
          state: { email: values.email, from: location },
        });
      });
  };

  return (
    <section className={styles.page}>
      <div className={styles.container}>
        <h1 className={`${styles.title} text text_type_main-medium`}>
          Восстановление пароля
        </h1>

        <form className={styles.form} onSubmit={handleSubmit}>
          <Input
            type="email"
            placeholder="Укажите e-mail"
            value={values.email}
            onChange={handleChange}
            error={false}
            errorText="Ошибка"
            size="default"
            name="email"
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
            disabled={!values.email}
            extraClass="mb-20"
          >
            {isLoading ? "Восстанавливаем..." : "Восстановить"}
          </Button>
        </form>

        <div className={styles.links}>
          <p className="text text_type_main-default text_color_inactive">
            Вспомнили пароль?{" "}
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

export default ForgotPasswordPage;
