import { useEffect, useState, ReactNode } from 'react';
import {
  createTheme,
  ThemeProvider as MuiThemeProvider,
  Theme as MuiTheme,
} from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { Theme } from '../types/Theme';
import { ThemeContext } from '../contexts/ThemeContext';
interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme') as Theme;
      return saved || 'system';
    }
    return 'system';
  });

  const [isDark, setIsDark] = useState(false);
  const [muiTheme, setMuiTheme] = useState<MuiTheme>(() =>
    createTheme({
      palette: {
        mode: 'light',
      },
    })
  );

  useEffect(() => {
    const updateTheme = () => {
      const root = document.documentElement;

      if (theme === 'system') {
        // Use system preference
        const systemPrefersDark =
          window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        setIsDark(systemPrefersDark);
        root.classList.toggle('dark', systemPrefersDark);

        // Update MUI theme based on system preference
        setMuiTheme(
          createTheme({
            palette: {
              mode: systemPrefersDark ? 'dark' : 'light',
            },
          })
        );
      } else {
        // Use explicit theme
        const shouldBeDark = theme === 'dark';
        setIsDark(shouldBeDark);
        root.classList.toggle('dark', shouldBeDark);

        // Update MUI theme based on explicit choice
        setMuiTheme(
          createTheme({
            palette: {
              mode: shouldBeDark ? 'dark' : 'light',
            },
          })
        );
      }
    };

    updateTheme();

    // Save theme preference
    if (theme === 'system') {
      localStorage.removeItem('theme');
    } else {
      localStorage.setItem('theme', theme);
    }

    // Listen for system theme changes when in system mode
    if (theme === 'system' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => updateTheme();

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  // Initialize theme on first load
  useEffect(() => {
    const initializeTheme = () => {
      const savedTheme = localStorage.getItem('theme') as Theme;
      const systemPrefersDark =
        window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

      const shouldBeDark = savedTheme === 'dark' || (!savedTheme && systemPrefersDark);

      document.documentElement.classList.toggle('dark', shouldBeDark);

      // Initialize MUI theme
      setMuiTheme(
        createTheme({
          palette: {
            mode: shouldBeDark ? 'dark' : 'light',
          },
        })
      );

      setIsDark(shouldBeDark);
    };

    initializeTheme();
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isDark }}>
      <MuiThemeProvider theme={muiTheme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};
