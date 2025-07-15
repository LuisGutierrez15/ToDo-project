import { Priority } from '../../types/Priority';
import { Chip, useTheme } from '@mui/material';
import { transformPriorityValue } from '../../utils/dataTransformers';
// Priority Badge Component
const PriorityBadge = ({ priority }: { priority: Priority | undefined }) => {
  const theme = useTheme();

  const getPriorityConfig = (priority: Priority | undefined | string) => {
    // Handle the enum values (0, 1, 2 from backend)
    switch (transformPriorityValue(priority)) {
      case Priority.HIGH: // HIGH priority
        return {
          label: '🔴 High',
          color: theme.palette.mode === 'dark' ? '#ef4444' : '#dc2626',
          bgColor:
            theme.palette.mode === 'dark' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(220, 38, 38, 0.1)',
          borderColor:
            theme.palette.mode === 'dark' ? 'rgba(239, 68, 68, 0.5)' : 'rgba(220, 38, 38, 0.3)',
        };

      case Priority.MEDIUM: // MEDIUM priority
        return {
          label: '🟡 Medium',
          color: theme.palette.mode === 'dark' ? '#f59e0b' : '#d97706',
          bgColor:
            theme.palette.mode === 'dark' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(217, 119, 6, 0.1)',
          borderColor:
            theme.palette.mode === 'dark' ? 'rgba(245, 158, 11, 0.5)' : 'rgba(217, 119, 6, 0.3)',
        };

      case Priority.LOW: // LOW priority
        return {
          label: '🟢 Low',
          color: theme.palette.mode === 'dark' ? '#10b981' : '#059669',
          bgColor:
            theme.palette.mode === 'dark' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(5, 150, 105, 0.1)',
          borderColor:
            theme.palette.mode === 'dark' ? 'rgba(16, 185, 129, 0.5)' : 'rgba(5, 150, 105, 0.3)',
        };
      default:
        return {
          label: 'None',
          color: theme.palette.text.secondary,
          bgColor:
            theme.palette.mode === 'dark' ? 'rgba(148, 163, 184, 0.2)' : 'rgba(148, 163, 184, 0.1)',
          borderColor:
            theme.palette.mode === 'dark' ? 'rgba(148, 163, 184, 0.5)' : 'rgba(148, 163, 184, 0.3)',
        };
    }
  };

  const config = getPriorityConfig(priority);

  return (
    <Chip
      label={config.label}
      size='small'
      sx={{
        backgroundColor: config.bgColor,
        color: config.color,
        border: `1px solid ${config.borderColor}`,
        fontWeight: 600,
        fontSize: '0.75rem',
        minWidth: 60,
        '& .MuiChip-label': {
          px: 1.5,
        },
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: 'scale(1.05)',
          boxShadow: `0 4px 12px ${config.bgColor}`,
        },
      }}
    />
  );
};

export default PriorityBadge;
