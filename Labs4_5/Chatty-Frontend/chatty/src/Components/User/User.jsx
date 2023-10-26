import s from "./User.module.css";
import userImage from "../User/user.png";
import $api from "../../HTTP";

function User({ user, needUpdate, setNeedUpdate, ...props }) {
  const deleteUser = async () => {
    try {
      await $api.delete("/users/" + user?.username);
      setNeedUpdate();
    } catch (e) {
      alert(e?.message);
    }
  };

  return (
    <div className={s.profile}>
      <img src={userImage} alt="img" />
      <p>Username: {user.username}</p>
      <p>Ім'я: {user.name}</p>
      <p>Роль: {user.role === 0 ? "admin" : "user"}</p>
      <button onClick={deleteUser} className={s.deleteButton}>
        Видалити
      </button>
    </div>
  );
}

export default User;
