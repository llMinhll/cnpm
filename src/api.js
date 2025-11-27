import axios from "axios";

// Backend đang chạy tại đây
export const API_BASE = "http://localhost:3000/api";

export const api = axios.create({
  baseURL: API_BASE,
});
