// src/services/axios.js
import API_URL from "@/lib/API_URL";
import axios from "axios";

const baseURL = API_URL;

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
