import { NavLink, Form, useRouteLoaderData } from "react-router-dom";
import styles from "./MainNavigation.module.css";

const getLinkClass = ({ isActive }) => (isActive ? styles.active : undefined);

const MainNavigation = () => {
  const token = useRouteLoaderData("root");

  return (
    <nav className={styles.nav}>
      <NavLink to="/" end className={getLinkClass}>
        Games
      </NavLink>
      {token && (
        <NavLink to="/add-game" className={getLinkClass}>
          Add Game
        </NavLink>
      )}
      {!token && (
        <NavLink to="/authentication?mode=login" className={getLinkClass}>
          Log In
        </NavLink>
      )}
      {token && (
        <Form action="/logout" method="post">
          <button type="submit">Log Out</button>
        </Form>
      )}
    </nav>
  );
};

export default MainNavigation;
