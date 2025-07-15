import { Component, ErrorInfo, ReactNode } from 'react';
import { Alert, Box, Button, Typography } from '@mui/material';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * Error Boundary component to catch and handle React errors gracefully.
 * Provides a user-friendly fallback UI when errors occur.
 */
class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: undefined,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error Boundary caught an error:', error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '50vh',
            padding: 3,
          }}
        >
          <Alert severity='error' sx={{ mb: 2, maxWidth: 600 }}>
            <Typography variant='h6' gutterBottom>
              Something went wrong
            </Typography>
            <Typography variant='body2' color='text.secondary' gutterBottom>
              {this.state.error?.message || 'An unexpected error occurred'}
            </Typography>
            <Button variant='outlined' color='error' onClick={this.handleRetry} sx={{ mt: 2 }}>
              Try Again
            </Button>
          </Alert>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
