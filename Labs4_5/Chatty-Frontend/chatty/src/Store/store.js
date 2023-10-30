import $api from "../HTTP";
import { makeAutoObservable } from "mobx";
import { HubConnectionBuilder } from "@microsoft/signalr";

export default class Store {
  messages = [];
  users = [];
  url = "https://localhost:7191";
  username = "";
  isAuth = false;
  myHubConnection = null;
  usersInChat = [];
  setAuth(boolean) {
    this.isAuth = boolean;
  }
  setUsername(username) {
    this.username = username;
  }

  setMessages(messages) {
    this.messages = messages;
  }

  setUsersInChat(users) {
    this.usersInChat = users;
  }

  setMyHubConnection(hubConnection) {
    this.myHubConnection = hubConnection;
  }

  async login(creds) {
    try {
      const response = await $api.post("/Users/login", creds);
      this.setAuth(true);
      this.setUsername(response?.data);
    } catch (e) {
      alert(e);
    }
  }

  async register(registrationData) {
    try {
      const response = await $api.post("/Users/register", registrationData);
      if (response?.status === 200) {
        alert("Акаунт успішно зареєстровано");
      }
    } catch (e) {
      alert(e);
    }
  }

  async logout() {
    try {
      this?.myHubConnection?.stop();
      this.myHubConnection = null;
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
        console.log(response?.data);
        this.setUsername(response?.data);
      }
    } catch (e) {
      console.log(e);
    }
  }

  async createHubConnection() {
    if (!this.myHubConnection) {
      const hubConnection = new HubConnectionBuilder()
        .withUrl(this.url + "/chatHub")
        .withAutomaticReconnect()
        .build();
      try {
        await hubConnection?.start();
        console.log("HUB START");
        this.setMyHubConnection(hubConnection);
      } catch (e) {
        console.log("errorHub", e);
      }
    }
  }

  constructor() {
    makeAutoObservable(this);
    this.login = this.login.bind(this);
    this.register = this.register.bind(this);
    this.checkAuth = this.checkAuth.bind(this);
    this.logout = this.logout.bind(this);
    this.createHubConnection = this.createHubConnection.bind(this);
  }
}
