import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { useAppDispatch } from "../../services/store";
import { logoutUserThunk } from "../../services/auth";
import styles from "./profile-nav.module.scss";

interface ProfileNavProps {
  caption?: string;
}

function ProfileNav({ caption }: ProfileNavProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUserThunk())
      .unwrap()
      .then(() => {
        navigate("/login", { replace: true });
      });
  };

  return (
    <nav className={styles.nav}>
      <NavLink
        to="/profile"
        end
        className={({ isActive }) =>
          `${styles.navLink} ${isActive ? styles.navLinkActive : ""} text text_type_main-medium`
        }
      >
        Профиль
      </NavLink>
      <NavLink
        to="/profile/orders"
        className={({ isActive }) =>
          `${styles.navLink} ${isActive ? styles.navLinkActive : ""} text text_type_main-medium`
        }
      >
        История заказов
      </NavLink>
      <button
        className={`${styles.navLink} text text_type_main-medium`}
        onClick={handleLogout}
      >
        Выход
      </button>
      {caption && (
        <p className={`${styles.navText} text text_type_main-default`}>{caption}</p>
      )}
    </nav>
  );
}

export default ProfileNav;
