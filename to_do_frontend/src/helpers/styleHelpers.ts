import { GridRowParams, GridRowSelectionModel } from '@mui/x-data-grid';
import { Theme } from '@mui/material/styles';
import { ToDo } from '../types/ToDo';

const getDueDateUrgencyClass = (task: ToDo): string => {
  // If task is completed, return completed class
  if (task.doneFlag) {
    return 'due-completed';
  }

  // If no due date, return normal class
  if (!task.dueDate) {
    return '';
  }

  const dueDate = new Date(task.dueDate);
  const now = new Date();
  const timeDiff = dueDate.getTime() - now.getTime();
  const daysDiff = timeDiff / (1000 * 3600 * 24); // Use exact days, not Math.ceil

  // Restore original logic exactly as specified:
  // Red: Due within 7 days or overdue (diffInDays <= 7)
  // Yellow: Due between 8-15 days (diffInDays > 7 && diffInDays <= 15)
  // Green: Due after 15 days (diffInDays > 15)
  if (daysDiff <= 7) {
    return 'due-red'; // Red for tasks due within 7 days or overdue
  } else if (daysDiff > 7 && daysDiff <= 15) {
    return 'due-yellow'; // Yellow for tasks due between 8-15 days
  } else {
    return 'due-green'; // Green for tasks due after 15 days
  }
};

const getRowClassName = (
  params: GridRowParams<ToDo>,
  selectionModel: GridRowSelectionModel
): string => {
  const isSelected = selectionModel.includes(params.id);
  const task = params.row;

  // Get base urgency class
  const urgencyClass = getDueDateUrgencyClass(task);

  // Combine classes
  const classes = [urgencyClass];

  // Add selected class if needed
  if (isSelected) {
    classes.push('Mui-selected');
  }

  return classes.filter(Boolean).join(' ');
};

// Helper function to get due date chip configuration matching row colors
const getDueDateChipConfig = (task: ToDo, theme: Theme) => {
  if (task.doneFlag) {
    return {
      label: 'Completed ✓',
      color: theme.palette.mode === 'dark' ? '#3b82f6' : '#2563eb',
      bgColor:
        theme.palette.mode === 'dark' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)',
      borderColor:
        theme.palette.mode === 'dark' ? 'rgba(59, 130, 246, 0.5)' : 'rgba(59, 130, 246, 0.3)',
      isCompleted: true,
    };
  }

  if (!task.dueDate) {
    return {
      label: 'No due date',
      color: theme.palette.text.secondary,
      bgColor: 'transparent',
      borderColor: theme.palette.divider,
      isCompleted: false,
    };
  }

  const dueDate = new Date(task.dueDate);
  const now = new Date();
  const timeDiff = dueDate.getTime() - now.getTime();
  const daysDiff = timeDiff / (1000 * 3600 * 24); // Use exact days like in getDueDateUrgencyClass

  // Use the same logic as getDueDateUrgencyClass but with appropriate labels
  if (daysDiff <= 7) {
    // Red zone: Due within 7 days or overdue
    if (daysDiff < 0) {
      const overdueDays = Math.abs(Math.ceil(daysDiff));
      return {
        label: `Overdue ${overdueDays} day${overdueDays !== 1 ? 's' : ''}`,
        color: theme.palette.mode === 'dark' ? '#ef4444' : '#dc2626',
        bgColor:
          theme.palette.mode === 'dark' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(239, 68, 68, 0.1)',
        borderColor:
          theme.palette.mode === 'dark' ? 'rgba(239, 68, 68, 0.5)' : 'rgba(239, 68, 68, 0.3)',
        isCompleted: false,
      };
    } else if (daysDiff === 0) {
      return {
        label: 'Due today',
        color: theme.palette.mode === 'dark' ? '#ef4444' : '#dc2626',
        bgColor:
          theme.palette.mode === 'dark' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(239, 68, 68, 0.1)',
        borderColor:
          theme.palette.mode === 'dark' ? 'rgba(239, 68, 68, 0.5)' : 'rgba(239, 68, 68, 0.3)',
        isCompleted: false,
      };
    } else {
      const daysLeft = Math.ceil(daysDiff);
      return {
        label: `${daysLeft} day${daysLeft !== 1 ? 's' : ''} left`,
        color: theme.palette.mode === 'dark' ? '#ef4444' : '#dc2626',
        bgColor:
          theme.palette.mode === 'dark' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(239, 68, 68, 0.1)',
        borderColor:
          theme.palette.mode === 'dark' ? 'rgba(239, 68, 68, 0.5)' : 'rgba(239, 68, 68, 0.3)',
        isCompleted: false,
      };
    }
  } else if (daysDiff > 7 && daysDiff <= 15) {
    // Yellow zone: Due between 8-15 days
    const daysLeft = Math.ceil(daysDiff);
    return {
      label: `${daysLeft} days left`,
      color: theme.palette.mode === 'dark' ? '#f59e0b' : '#d97706',
      bgColor:
        theme.palette.mode === 'dark' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(245, 158, 11, 0.1)',
      borderColor:
        theme.palette.mode === 'dark' ? 'rgba(245, 158, 11, 0.5)' : 'rgba(245, 158, 11, 0.3)',
      isCompleted: false,
    };
  } else {
    // Green zone: Due after 15 days
    const daysLeft = Math.ceil(daysDiff);
    return {
      label: `${daysLeft} days left`,
      color: theme.palette.mode === 'dark' ? '#22c55e' : '#16a34a',
      bgColor: theme.palette.mode === 'dark' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(34, 197, 94, 0.1)',
      borderColor:
        theme.palette.mode === 'dark' ? 'rgba(34, 197, 94, 0.5)' : 'rgba(34, 197, 94, 0.3)',
      isCompleted: false,
    };
  }
};

export { getRowClassName, getDueDateUrgencyClass, getDueDateChipConfig };
