import { ReactNode, useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Alert, AlertColor, Snackbar } from '@mui/material';
import { SnackbarContext } from '../contexts/SnackbarContext';

interface SnackbarProviderProps {
  children: ReactNode;
}
interface SnackbarState {
  open: boolean;
  message: string;
  severity: AlertColor;
}

export const SnackbarProvider: React.FC<SnackbarProviderProps> = ({ children }) => {
  const { isDark } = useTheme();
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: '',
    severity: 'success',
  });

  const showSnackbar = (message: string, severity: AlertColor = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const hideSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbar, hideSnackbar }}>
      {children}

      {/* Global Snackbar - positioned outside all components */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={hideSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{
          zIndex: 10000, // Very high z-index to be above everything
          position: 'fixed',
          top: '24px !important',
          right: '24px !important',
          '& .MuiAlert-root': {
            borderRadius: '12px',
            minWidth: '300px',
            boxShadow: isDark
              ? '0 12px 40px rgba(0, 0, 0, 0.5), 0 4px 16px rgba(0, 0, 0, 0.3)'
              : '0 12px 40px rgba(0, 0, 0, 0.2), 0 4px 16px rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(10px)',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.05)',
          },
        }}
      >
        <Alert
          onClose={hideSnackbar}
          severity={snackbar.severity}
          variant='filled'
          sx={{
            width: '100%',
            fontWeight: 600,
            fontSize: '0.875rem',
            '& .MuiAlert-icon': {
              fontSize: '1.25rem',
            },
            '& .MuiAlert-action': {
              padding: 0,
              marginRight: '-8px',
            },
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};

export default SnackbarProvider;
