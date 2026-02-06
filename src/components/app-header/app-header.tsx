import styles from "./app-header.module.scss";
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon,
} from "@ya.praktikum/react-developer-burger-ui-components";
import { NavLink, useLocation } from "react-router-dom";

const AppHeader = () => {
  const location = useLocation();

  const activeButton = (() => {
    if (location.pathname.startsWith("/profile")) return "profile";
    if (location.pathname.startsWith("/feed")) return "feed";
    if (location.pathname === "/" || location.pathname.startsWith("/ingredients"))
      return "constructor";
    return "constructor";
  })();

  return (
    <header className={`${styles.header} p-4`}>
      <nav className={styles.nav}>
        <div className={styles.leftSection}>
          <NavLink
            to="/"
            className={`${styles.link} pl-5 pr-5 pt-4 pb-4 ${
              activeButton === "constructor" ? styles.linkActive : ""
            }`}
          >
            <BurgerIcon type={activeButton === "constructor" ? "primary" : "secondary"} />
            <span className="text text_type_main-default">Конструктор</span>
          </NavLink>

          <NavLink
            to="/feed"
            className={`${styles.link} pl-5 pr-5 pt-4 pb-4 ${
              activeButton === "feed" ? styles.linkActive : ""
            }`}
          >
            <ListIcon type={activeButton === "feed" ? "primary" : "secondary"} />
            <span className="text text_type_main-default">Лента заказов</span>
          </NavLink>
        </div>

        <div className={styles.centerSection}>
          <NavLink to="/">
            <Logo />
          </NavLink>
        </div>

        <div className={styles.rightSection}>
          <NavLink
            to="/profile"
            className={`${styles.link} pl-5 pr-5 pt-4 pb-4 ${
              activeButton === "profile" ? styles.linkActive : ""
            }`}
          >
            <ProfileIcon type={activeButton === "profile" ? "primary" : "secondary"} />
            <span className="text text_type_main-default">Личный кабинет</span>
          </NavLink>
        </div>
      </nav>
    </header>
  );
};

export default AppHeader;
