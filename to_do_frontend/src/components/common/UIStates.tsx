import React from 'react';
import { 
  Box, 
  CircularProgress, 
  Typography, 
  Alert, 
  Button,
  Paper
} from '@mui/material';
import { Refresh, Error as ErrorIcon } from '@mui/icons-material';

/**
 * Props for loading component
 */
interface LoadingProps {
  message?: string;
  size?: number;
  fullHeight?: boolean;
}

/**
 * Reusable loading component
 */
export const Loading: React.FC<LoadingProps> = ({ 
  message = 'Loading...', 
  size = 40,
  fullHeight = false 
}) => (
  <Box
    display="flex"
    flexDirection="column"
    alignItems="center"
    justifyContent="center"
    minHeight={fullHeight ? '50vh' : '200px'}
    gap={2}
  >
    <CircularProgress size={size} />
    <Typography variant="body2" color="text.secondary">
      {message}
    </Typography>
  </Box>
);

/**
 * Props for error display component
 */
interface ErrorDisplayProps {
  error: string;
  onRetry?: () => void;
  severity?: 'error' | 'warning' | 'info';
  showRetryButton?: boolean;
}

/**
 * Reusable error display component
 */
export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  onRetry,
  severity = 'error',
  showRetryButton = true
}) => (
  <Paper elevation={2} sx={{ p: 3, m: 2 }}>
    <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
      <ErrorIcon color={severity} sx={{ fontSize: 48 }} />
      <Alert severity={severity} sx={{ width: '100%' }}>
        <Typography variant="body1">
          {error}
        </Typography>
      </Alert>
      {showRetryButton && onRetry && (
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={onRetry}
          color={severity}
        >
          Try Again
        </Button>
      )}
    </Box>
  </Paper>
);

/**
 * Props for empty state component
 */
interface EmptyStateProps {
  message?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

/**
 * Reusable empty state component
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  message = 'No data available',
  icon,
  action
}) => (
  <Box
    display="flex"
    flexDirection="column"
    alignItems="center"
    justifyContent="center"
    minHeight="200px"
    gap={2}
    p={4}
  >
    {icon && (
      <Box sx={{ opacity: 0.5, fontSize: 64 }}>
        {icon}
      </Box>
    )}
    <Typography variant="h6" color="text.secondary" textAlign="center">
      {message}
    </Typography>
    {action}
  </Box>
);
