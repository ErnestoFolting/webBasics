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
        <h2 style={{ color: "rgb(109, 106, 105)" }}>
          Будь ласка, для початку авторизуйтесь.
        </h2>
      </div>
    );
  }

  return (
    <div className={s.navBar}>
      <div className={s.menu}>
        <Link to="/chat">Чат</Link>
        <Link to="/users">Користувачі</Link>
      </div>
      <div>
        {store.isAuth && <button onClick={store.logout} style={{ boxShadow: 'none' }}>Вийти</button>}
      </div>
    </div>
  );
};

export default observer(NavBar);
