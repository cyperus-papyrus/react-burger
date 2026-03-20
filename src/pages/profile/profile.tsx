import { useState, FormEvent, useEffect, useCallback } from "react";
import {
  Input,
  Button,
  PasswordInput,
} from "@ya.praktikum/react-developer-burger-ui-components";
import styles from "./profile.module.scss";
import { useAppDispatch, useAppSelector } from "../../services/store";
import { getUserDataThunk, updateUserDataThunk, clearError } from "../../services/auth";
import ProfileNav from "../../components/profile-nav/profile-nav";

function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("Иван");
  const [email, setEmail] = useState("ivan@example.com");
  const [password, setPassword] = useState("");
  const dispatch = useAppDispatch();
  const { user, isLoading, error, isAuthenticated } = useAppSelector(
    (state) => state.auth,
  );

  useEffect(() => {
    if (isAuthenticated && !user) {
      dispatch(getUserDataThunk());
    }
  }, [dispatch, isAuthenticated, user]);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();

      const updateData: { name?: string; email?: string; password?: string } = {};

      if (name !== user?.name) updateData.name = name;
      if (email !== user?.email) updateData.email = email;
      if (password) updateData.password = password;

      if (Object.keys(updateData).length > 0) {
        dispatch(updateUserDataThunk(updateData))
          .unwrap()
          .then(() => {
            setIsEditing(false);
            setPassword("");
          });
      } else {
        setIsEditing(false);
      }
    },
    [dispatch, name, email, password, user],
  );

  const handleCancel = useCallback(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
    setPassword("");
    setIsEditing(false);
    dispatch(clearError());
  }, [dispatch, user]);

  return (
    <section className={styles.page}>
      <div className={styles.container}>
        <ProfileNav caption="В этом разделе вы можете изменить свои персональные данные" />

        <div className={styles.content}>
          <form className={styles.form} onSubmit={handleSubmit}>
            <Input
              type="text"
              placeholder="Имя"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setIsEditing(true);
              }}
              icon="EditIcon"
              error={false}
              errorText="Ошибка"
              size="default"
              name="name"
              onPointerEnterCapture={() => {}}
              onPointerLeaveCapture={() => {}}
            />

            <Input
              type="email"
              placeholder="Логин"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setIsEditing(true);
              }}
              icon="EditIcon"
              error={false}
              errorText="Ошибка"
              size="default"
              name="email"
              onPointerEnterCapture={() => {}}
              onPointerLeaveCapture={() => {}}
            />

            <PasswordInput
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setIsEditing(true);
              }}
              name="password"
              placeholder="Пароль"
              icon="EditIcon"
            />
            {error && (
              <p className="text text_type_main-default text_color_error">{error}</p>
            )}
            {isEditing && (
              <div className={styles.buttons}>
                <Button
                  type="secondary"
                  size="medium"
                  htmlType="button"
                  onClick={handleCancel}
                >
                  Отмена
                </Button>
                <Button type="primary" size="medium" htmlType="submit">
                  {isLoading ? "Сохраняем..." : "Сохранить"}
                </Button>
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}

export default ProfilePage;
