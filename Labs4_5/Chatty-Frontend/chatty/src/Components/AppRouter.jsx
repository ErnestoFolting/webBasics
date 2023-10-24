import { Route, Routes, Navigate } from "react-router-dom";
import Login from "../Pages/Login/Login";
import Chat from "../Pages/Chat/Chat";
import Users from "../Pages/Users/Users";
import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { Context } from "..";

const AppRouter = () => {
  const { store } = useContext(Context);

  return store.isAuth ? (
    <Routes>
      <Route path="/chat" element=<Chat /> exact />
      <Route path="/users" element=<Users /> exact />
      <Route path="*" element=<Navigate replace to="/chat" /> />
    </Routes>
  ) : (
    <Routes>
      <Route path="/login" element=<Login /> />
      <Route path="*" element=<Navigate replace to="/login" /> />
    </Routes>
  );
};

export default observer(AppRouter);
