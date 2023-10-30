import axios from "axios";

const $api = axios.create({
  withCredentials: true,
  baseURL: 'https://localhost:7191',
});

export default $api;
