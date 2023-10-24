import { BrowserRouter } from "react-router-dom";
import AppRouter from "./AppRouter";
import NavBar from "./NavBar/NavBar";
import { useEffect, useContext } from "react";
import { Context } from "..";
const App = () => {
  const { store } = useContext(Context);

  useEffect(() => {
    async function checkAuth() {
      await store.checkAuth();
    }
    checkAuth();
  }, []);

  return (
    <div className="wrapper">
      <BrowserRouter>
        <NavBar />
        <AppRouter />
      </BrowserRouter>
    </div>
  );
};

export default App;
