import { Link } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { Context } from "../..";
import s from "./NavBar.module.css";

const NavBar = () => {
  const { store } = useContext(Context);

  if (!store.isAuth) {
    return (
      <div className={s.navBar}>
      <div className={s.menuRegistration}>
        <Link to="/registration">Реєстрація</Link>
        <Link to="/login">Логін</Link>
      </div>
    </div>
    );
  }

  return (
    <div className={s.navBar}>
      <div className={s.menuLogin}>
        <Link to="/chat">Чат</Link>
        <Link to="/users">Користувачі</Link>
      </div>
      <div className={s.userData}>
        <p>
          Привіт, <b>{store.username}</b>
        </p>
        <div>
          {store.isAuth && (
            <button onClick={store.logout} style={{ boxShadow: "none" }}>
              Вийти
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default observer(NavBar);
