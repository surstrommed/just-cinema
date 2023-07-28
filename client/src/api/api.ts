import axios, { AxiosRequestConfig } from "axios";
import { parsedStoredUser } from "utils";
import { apiLink } from "utils/helpers/helpers";

const API = axios.create({
  baseURL: apiLink,
});

API.interceptors.request.use((req: AxiosRequestConfig) => {
  if (!req.headers) {
    req.headers = {};
  }
  if (parsedStoredUser?.token) {
    req.headers.authorization = `Bearer ${parsedStoredUser.token}`;
  }
  return req;
});

export default API;
