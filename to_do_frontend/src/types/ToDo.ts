import { Priority } from "./Priority";

export type ToDo = {
  id?: number;
  text: string;
  dueDate: Date | null | string;
  doneFlag?: boolean;
  doneDate?: Date | null | string;
  priority: Priority | undefined;
  creationTime?: Date;
};
