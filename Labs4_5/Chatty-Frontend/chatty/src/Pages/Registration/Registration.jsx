import styles from "./Registration.module.css";
import { useState, useContext } from "react";
import { observer } from "mobx-react-lite";
import { Context } from "../..";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const Registration = () => {
  const { store } = useContext(Context);
  const [registrationData, setRegistrationData] = useState({
    username: "",
    password: "",
    name: "",
  });

  const registrationRequest = async () => {
    store.register(registrationData);
    setRegistrationData({ username: "", password: "", name: "" });
  };

  return (
    <div className={styles.wrapper}>
      <h1>Реєстрація</h1>
      <input
        type="text"
        id="username-field"
        placeholder="User"
        className={styles.registratiionFormField}
        value={registrationData.username}
        onChange={(e) =>
          setRegistrationData((prevLoginData) => ({
            ...prevLoginData,
            username: e.target.value,
          }))
        }
      />
      <input
        type="password"
        id="password-field"
        placeholder="Password"
        className={styles.registratiionFormField}
        value={registrationData.password}
        onChange={(e) =>
          setRegistrationData((prevLoginData) => ({
            ...prevLoginData,
            password: e.target.value,
          }))
        }
      />
      <input
        type="text"
        id="name-field"
        placeholder="Name"
        className={styles.registratiionFormField}
        value={registrationData.name}
        onChange={(e) =>
          setRegistrationData((prevLoginData) => ({
            ...prevLoginData,
            name: e.target.value,
          }))
        }
      />
      <button onClick={registrationRequest}> Register</button>
    </div>
  );
};

export default observer(Registration);
