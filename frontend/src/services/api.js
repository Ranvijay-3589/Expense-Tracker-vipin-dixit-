import axios from "axios";

const api = axios.create({
  baseURL: "/vipin",
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Redirect to login on 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/vipin/";
    }
    return Promise.reject(error);
  },
);

// Auth
export const registerUser = async (payload) => {
  const response = await api.post("/api/auth/register", payload);
  return response.data;
};

export const loginUser = async (payload) => {
  const response = await api.post("/api/auth/login", payload);
  return response.data;
};

export const getMe = async () => {
  const response = await api.get("/api/auth/me");
  return response.data;
};

// Expenses
export const getExpensesByDate = async (date) => {
  const response = await api.get("/api/expenses", { params: { date } });
  return response.data;
};

export const createExpense = async (payload) => {
  const response = await api.post("/api/expenses", payload);
  return response.data;
};

export const updateExpense = async (id, payload) => {
  const response = await api.put(`/api/expenses/${id}`, payload);
  return response.data;
};

export const deleteExpense = async (id) => {
  await api.delete(`/api/expenses/${id}`);
};

export const getSummaryByDate = async (date) => {
  const response = await api.get("/api/summary", { params: { date } });
  return response.data;
};
