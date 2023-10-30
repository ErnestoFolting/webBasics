import { BrowserRouter } from "react-router-dom";
import AppRouter from "./AppRouter";
import NavBar from "./NavBar/NavBar";
import { useEffect, useContext } from "react";
import { Context } from "..";
import { observer } from "mobx-react-lite";
const App = () => {
  const { store } = useContext(Context);

  useEffect(() => {
    async function checkAuth() {
      await store.checkAuth();
    }
    checkAuth();
  }, []);

  useEffect(() => {
    async function createHubConnection() {
      await store.createHubConnection();
    }
    if (store?.isAuth) {
      createHubConnection();
    }
  }, [store?.isAuth]);

  return (
    <div className="wrapper">
      <BrowserRouter>
        <NavBar />
        <AppRouter />
      </BrowserRouter>
    </div>
  );
};

export default observer(App);
