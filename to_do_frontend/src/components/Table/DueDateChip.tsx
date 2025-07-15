import { Box, Chip, Typography, useTheme } from '@mui/material';
import { getDueDateChipConfig } from '../../helpers/styleHelpers';
import { ToDo } from '../../types/ToDo';
// Due Date Chip Component
const DueDateChip = ({ task }: { task: ToDo }) => {
  const theme = useTheme();
  const chipConfig = getDueDateChipConfig(task, theme);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
      <Chip
        label={chipConfig.label}
        size='small'
        variant={chipConfig.isCompleted ? 'filled' : 'outlined'}
        sx={{
          backgroundColor: chipConfig.bgColor,
          color: chipConfig.color,
          border: `1px solid ${chipConfig.borderColor}`,
          fontWeight: 600,
          fontSize: '0.7rem',
          textDecoration: chipConfig.isCompleted ? 'line-through' : 'none',
          '& .MuiChip-label': {
            px: 1.5,
          },
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'scale(1.05)',
            boxShadow: `0 4px 12px ${chipConfig.bgColor}`,
          },
        }}
      />
      <Typography
        variant='caption'
        sx={{
          fontSize: '0.65rem',
          color: 'text.secondary',
          fontWeight: 500,
        }}
      >
        {task.dueDate && !task.doneFlag ? new Date(task.dueDate).toLocaleDateString() : ''}
      </Typography>
    </Box>
  );
};

export default DueDateChip;
