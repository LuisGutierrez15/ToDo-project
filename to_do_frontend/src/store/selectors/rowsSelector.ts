import { RootState } from "../store";

export const selectAllToDos = (state: RootState) => state.rows;
