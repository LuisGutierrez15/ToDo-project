import { Priority } from '../types/Priority';
import { Status } from '../types/Status';
import { ToDo } from '../types/ToDo';

/**
 * Transforms backend enum string values to frontend numeric enum values
 * The backend sends enum values as strings like "HIGH", "MEDIUM", "LOW"
 * The frontend needs numeric values like 0, 1, 2 for MUI components
 */
export const transformToDoData = (todo: ToDo): ToDo => {
  return {
    ...todo,
    priority: transformPriorityValue(todo.priority),
  };
};

/**
 * Transforms priority string values to numeric enum values
 * @param priority - Priority value from backend (string or number)
 * @returns Numeric priority value or undefined
 */
export const transformPriorityValue = (
  priority: string | number | null | undefined
): Priority | undefined => {
  if (priority === null || priority === undefined) {
    return undefined;
  }

  // If it's already a number, return it as is
  if (typeof priority === 'number') {
    return priority as Priority;
  }

  // If it's a string, convert it to the corresponding enum value
  if (typeof priority === 'string') {
    switch (priority.toUpperCase()) {
      case 'HIGH':
        return Priority.HIGH; // 0
      case 'MEDIUM':
        return Priority.MEDIUM; // 1
      case 'LOW':
        return Priority.LOW; // 2
      default:
        return undefined;
    }
  }

  return undefined;
};

/**
 * Transforms status string values to numeric enum values
 * @param status - Status value from backend (string or number)
 * @returns Numeric status value or undefined
 */
export const transformStatusValue = (
  status: string | number | null | undefined
): Status | undefined => {
  if (status === null || status === undefined) {
    return undefined;
  }

  // If it's already a number, return it as is
  if (typeof status === 'number') {
    return status as Status;
  }

  // If it's a string, convert it to the corresponding enum value
  if (typeof status === 'string') {
    switch (status.toUpperCase()) {
      case 'DONE':
        return Status.DONE; // 0
      case 'UNDONE':
        return Status.UNDONE; // 1
      default:
        return undefined;
    }
  }

  return undefined;
};

/**
 * Transforms an array of ToDo objects from backend format to frontend format
 * @param todos - Array of ToDo objects from backend
 * @returns Array of transformed ToDo objects
 */
export const transformToDoArray = (todos: ToDo[]): ToDo[] => {
  return todos.map(transformToDoData);
};
