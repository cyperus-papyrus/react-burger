import { Link } from "react-router-dom";
import { Button } from "@ya.praktikum/react-developer-burger-ui-components";
import styles from "./not-found.module.scss";
import { useRef } from "react";

function NotFoundPage() {
  const spacePhrases = [
    "Ой! Страницу съел космический червяк 🐛",
    "Этой страницы нет в нашей вселенной 🌌",
    "Страница отправилась в гиперпрыжок без нас ⚡",
    "Наши космонавты ищут эту страницу 👨‍🚀",
    "Бургер-навигатор сломался... 🍔🔧",
    "Ингредиенты для этой страницы закончились 🍅",
  ];

  const randomPhrase = useRef(
    spacePhrases[Math.floor(Math.random() * spacePhrases.length)],
  ).current;
  return (
    <div className={styles.page}>
      <h1 className="text text_type_digits-large mb-6">404</h1>

      <p className="text text_type_main-medium mb-10">{randomPhrase}</p>
      <Link to="/" className={styles.link}>
        <Button htmlType="button" type="primary" size="large">
          Собрать новый бургер
        </Button>
      </Link>
    </div>
  );
}

export default NotFoundPage;
