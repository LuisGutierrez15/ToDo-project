import axios from "axios";
import { axiosInstance } from "./axiosInstance";

export const getToDos = async (params: unknown) => {
  try {
    const response = await axiosInstance.get("", { params });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response?.data;
    }
    throw error;
  }
};

export const markDone = async (id: number) => {
  try {
    const response = await axiosInstance.post(`/${id}/done`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response?.data;
    }
    throw error;
  }
};

export const markUnDone = async (id: number) => {
  try {
    const response = await axiosInstance.put(`/${id}/undone`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response?.data;
    }
    throw error;
  }
};
