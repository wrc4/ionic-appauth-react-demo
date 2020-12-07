import axios from "axios";
import { Auth } from "./AuthService";

const client = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL
});

client.interceptors.request.use(async req => {
  const authToken = await Auth.Instance.getValidToken();
  const accessToken = authToken.accessToken;

  req.headers.authorization = `Bearer ${accessToken}`;
  return req;
});

export default client;