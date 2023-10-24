import styles from "./Login.module.css";
import { useState, useContext } from "react";
import { observer } from "mobx-react-lite";
import { Context } from "../..";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const Login = () => {
  const { store } = useContext(Context);
  const [loginData, setLoginData] = useState({ username: "", password: "" });

  const loginRequest = async () => {
    store.login(loginData);
  };

  return (
    <div>
      <input
        type="text"
        id="username-field"
        placeholder="User"
        className={styles.loginFormField}
        value={loginData.username}
        onChange={(e) =>
          setLoginData((prevLoginData) => ({
            ...prevLoginData,
            username: e.target.value,
          }))
        }
      />
      <input
        type="password"
        id="password-field"
        placeholder="Password"
        className={styles.loginFormField}
        value={loginData.password}
        onChange={(e) =>
          setLoginData((prevLoginData) => ({
            ...prevLoginData,
            password: e.target.value,
          }))
        }
      />
      <button onClick={loginRequest}> Login</button>
    </div>
  );
};

export default observer(Login);
