import axios from "axios";
import { axiosInstance } from "./axiosInstance";
import { Parameters } from "../types/Parameters";
import { ToDo } from "../types/ToDo";

export const getToDos = async (params: Parameters) => {
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

export const getStats = async () => {
  try {
    const response = await axiosInstance.get("/stats");
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response?.data;
    }
    throw error;
  }
};

export const createToDo = async (toDo: ToDo) => {
  try {
    const response = await axiosInstance.post("", toDo);
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

export const updateToDo = async (id: number, toDoUpdated: ToDo) => {
  try {
    const response = await axiosInstance.put(`/${id}`, toDoUpdated);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response?.data;
    }
    throw error;
  }
};

export const deleteToDo = async (id: number) => {
  try {
    const response = await axiosInstance.delete(`/${id}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response?.data;
    }
    throw error;
  }
};
