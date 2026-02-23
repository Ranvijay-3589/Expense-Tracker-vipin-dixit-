import axios from "axios";

const api = axios.create({
  baseURL: "/vipin",
});

export const getExpensesByDate = async (date) => {
  const response = await api.get("/api/expenses", { params: { date } });
  return response.data;
};

export const createExpense = async (payload) => {
  const response = await api.post("/api/expenses", payload);
  return response.data;
};

export const deleteExpense = async (id) => {
  await api.delete(`/api/expenses/${id}`);
};

export const getSummaryByDate = async (date) => {
  const response = await api.get("/api/summary", { params: { date } });
  return response.data;
};
