import { redirect } from "@tanstack/react-router";
import axios from "axios";

const GableApi = axios.create({
  baseURL: import.meta.env.VITE_GABLE_API_URL + "/api",
});

GableApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("jwt");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

GableApi.interceptors.response.use((value) => {
  if (value.status === 401) {
    redirect({ to: "/" });
  }
  return value;
});

export default GableApi;
