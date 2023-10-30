import { useState, useEffect } from "react";
import $api from "../../HTTP";
import s from "./Users.module.css";
import User from "../../Components/User/User";

const Users = () => {
  const [needUpdate, setNeedUpdate] = useState(false);
  const [users, setUsers] = useState([]);
  useEffect(() => {
    const getUsers = async () => {
      try {
        const gotUsers = await $api.get("/users");
        console.log(gotUsers.data);
        setUsers(gotUsers.data);
      } catch (e) {
        console.log(e);
      }
    };
    getUsers();
  }, [needUpdate]);

  return (
    <div className={s.wrapper}>
      <h2>Користувачі</h2>
      {users.map((user) => (
        <User
          user={user}
          key={user?.username}
          needUpdate={needUpdate}
          setNeedUpdate={setNeedUpdate}
        />
      ))}
    </div>
  );
};

export default Users;
