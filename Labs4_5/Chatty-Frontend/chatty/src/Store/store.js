import $api from "../HTTP";
import { makeAutoObservable } from "mobx";

export default class Store {
  url = "https://localhost:7191";
  username = "";
  isAuth = false;
  setAuth(boolean) {
    this.isAuth = boolean;
  }
  setUsername(username) {
    this.username = username;
  }

  async login(creds) {
    try {
      const response = await $api.post("/Users/login", creds);
      this.setAuth(true);
      this.setUsername(response?.data?.userId);
    } catch (e) {
      alert(e);
    }
  }

  async logout() {
    try {
      await $api.post("/Users/logout");
      this.setAuth(false);
      this.setUsername("");
    } catch (e) {
      console.log(e);
    }
  }

  async checkAuth() {
    try {
      const response = await $api.post("/Users/checkAuth");
      if (response?.status === 200) {
        this.setAuth(true);
      }
    } catch (e) {
      console.log(e);
    }
  }

  constructor() {
    makeAutoObservable(this);
    this.login = this.login.bind(this);
    this.checkAuth = this.checkAuth.bind(this);
    this.logout = this.logout.bind(this);
  }
}
