import styles from "./app-header.module.scss";
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon,
} from "@ya.praktikum/react-developer-burger-ui-components";
import { NavLink } from "react-router-dom";

const AppHeader = () => {
  return (
    <header className={`${styles.header} p-4`}>
      <nav className={styles.nav}>
        <div className={styles.leftSection}>
          <NavLink
            to="/"
            className={({ isActive }) =>
              `${styles.link} pl-5 pr-5 pt-4 pb-4 ${isActive ? styles.linkActive : ""}`
            }
          >
            {({ isActive }) => (
              <>
                <BurgerIcon type={isActive ? "primary" : "secondary"} />
                <span className="text text_type_main-default">Конструктор</span>{" "}
              </>
            )}
          </NavLink>

          <NavLink
            to="/feed"
            className={({ isActive }) =>
              `${styles.link} pl-5 pr-5 pt-4 pb-4 ${isActive ? styles.linkActive : ""}`
            }
          >
            {({ isActive }) => (
              <>
                <ListIcon type={isActive ? "primary" : "secondary"} />
                <span className="text text_type_main-default">Лента заказов</span>
              </>
            )}
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
            className={({ isActive }) =>
              `${styles.link} pl-5 pr-5 pt-4 pb-4 ${isActive ? styles.linkActive : ""}`
            }
          >
            {({ isActive }) => (
              <>
                <ProfileIcon type={isActive ? "primary" : "secondary"} />
                <span className="text text_type_main-default">Личный кабинет</span>
              </>
            )}
          </NavLink>
        </div>
      </nav>
    </header>
  );
};

export default AppHeader;
