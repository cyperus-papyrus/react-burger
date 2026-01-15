import { useState } from "react";
import styles from "./app-header.module.scss";
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon,
} from "@ya.praktikum/react-developer-burger-ui-components";

const AppHeader = () => {
  const [activeButton] = useState<"constructor" | "feed" | "profile">("constructor");
  return (
    <header className={`${styles.header} p-4`}>
      <nav className={styles.nav}>
        <div className={styles.leftSection}>
          <a
            href="/"
            className={`${styles.link} pl-5 pr-5 pt-4 pb-4 ${
              activeButton === "constructor" ? styles.linkActive : ""
            }`}
          >
            <BurgerIcon type={activeButton === "constructor" ? "primary" : "secondary"} />
            <span className="text text_type_main-default">Конструктор</span>
          </a>

          <a
            href="/"
            className={`${styles.link} pl-5 pr-5 pt-4 pb-4 ${
              activeButton === "feed" ? styles.linkActive : ""
            }`}
          >
            <ListIcon type={activeButton === "feed" ? "primary" : "secondary"} />
            <span className="text text_type_main-default">Лента заказов</span>
          </a>
        </div>

        <div className={styles.centerSection}>
          <a href="/">
            <Logo />
          </a>
        </div>

        <div className={styles.rightSection}>
          <a
            href="/"
            className={`${styles.link} pl-5 pr-5 pt-4 pb-4 ${
              activeButton === "profile" ? styles.linkActive : ""
            }`}
          >
            <ProfileIcon type={activeButton === "profile" ? "primary" : "secondary"} />
            <span className="text text_type_main-default">Личный кабинет</span>
          </a>
        </div>
      </nav>
    </header>
  );
};

export default AppHeader;
