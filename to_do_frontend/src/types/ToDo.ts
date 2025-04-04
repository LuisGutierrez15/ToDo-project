import { Priority } from "./Priority";

export type ToDo = {
  id: number;
  text: string;
  dueDate: Date | null;
  doneFlag: boolean;
  doneDate: Date | null;
  priority: Priority;
  creationTime: Date;
};
