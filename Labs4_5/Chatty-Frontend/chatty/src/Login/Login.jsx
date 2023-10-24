import styles from "./Login.module.css";
import $api from "../HTTP/index";
import { useState } from "react";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const Login = () => {
  const [loginData, setLoginData] = useState({ username: "", password: ""});

  const loginRequest = async () => {
    try {
      const response = await $api.post("/Users",loginData);
    } catch (e) {
      alert(e.message);
    }
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

export default Login;
