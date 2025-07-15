import { FC, useRef, KeyboardEvent } from 'react';

import StatusSelection from './StatusSelection';
import PrioritySelection from './PrioritySelection';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import ClearIcon from '@mui/icons-material/Clear';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness';
import { SearchFilters } from '../hooks/useUrlParams';
import { useTheme } from '../contexts/ThemeContext';

type HeaderProps = {
  filters: SearchFilters;
  updateUrlParams: (newFilters: Partial<SearchFilters>) => void;
  clearFilters: () => void;
  hasActiveFilters: boolean;
};

const Header: FC<HeaderProps> = ({ filters, updateUrlParams, clearFilters, hasActiveFilters }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { theme, setTheme } = useTheme();

  const handleSearch = () => {
    if (inputRef.current) {
      updateUrlParams({ name: inputRef.current.value, page: 0 }); // Reset to first page on search
    }
  };

  const handleEnterKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleClear = () => {
    clearFilters();
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const cycleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('system');
    } else {
      setTheme('light');
    }
  };

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return <LightModeIcon />;
      case 'dark':
        return <DarkModeIcon />;
      default:
        return <SettingsBrightnessIcon />;
    }
  };

  return (
    <header className='w-full'>
      {/* App Title Section - Centered and Elegant */}
      <div className='text-center mb-4 px-4 '>
        <div className='flex items-center justify-center space-x-3 mb-2'>
          <div className='w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg'>
            <span className='text-white font-bold text-sm'>T</span>
          </div>
          <h1 className='text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 dark:from-blue-400 dark:via-purple-400 dark:to-indigo-400 bg-clip-text text-transparent'>
            To Do App
          </h1>
        </div>
        <p className='text-sm text-gray-600 dark:text-gray-300 max-w-md mx-auto'>
          Organize your tasks with elegance
        </p>
      </div>

      {/* Main Header Card - Centered and Responsive */}
      <div className='w-full justify-between mx-auto '>
        <div className='bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-3xl border border-gray-200/60 dark:border-gray-700/60 shadow-2xl p-4 sm:p-6 transition-all duration-300'>
          {/* Theme Toggle - Top Right */}
          <div className='flex justify-end mb-4'>
            <button
              onClick={cycleTheme}
              className='p-2 rounded-xl bg-gray-100/80 hover:bg-gray-200/80 dark:bg-gray-700/80 dark:hover:bg-gray-600/80 text-gray-700 dark:text-gray-300 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 focus:outline-none'
              aria-label={`Switch to ${theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light'} theme`}
              title={`Current: ${theme} theme. Click to switch.`}
            >
              {getThemeIcon()}
            </button>
          </div>

          {/* Search Section - Centered */}
          <div className='mb-4'>
            <div className='mx-auto self-start'>
              <TextField
                inputRef={inputRef}
                fullWidth
                id='search-tasks'
                label='Search your tasks...'
                variant='outlined'
                color='primary'
                defaultValue={filters.name}
                onKeyDown={handleEnterKeyDown}
                className='[&_.MuiOutlinedInput-root]:bg-gray-50/50 [&_.MuiOutlinedInput-root]:dark:bg-gray-700/50 [&_.MuiInputLabel-root]:text-gray-600 [&_.MuiInputLabel-root]:dark:text-gray-300 [&_.MuiOutlinedInput-input]:text-gray-900 [&_.MuiOutlinedInput-input]:dark:text-gray-100 [&_.MuiOutlinedInput-root]:rounded-2xl'
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'rgb(209 213 219 / 0.5)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgb(59 130 246 / 0.5)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'rgb(59 130 246)',
                    },
                  },
                }}
              />
              {hasActiveFilters && (
                <div className='flex justify-center mt-2'>
                  <button
                    onClick={handleClear}
                    className='inline-flex items-center px-3 py-1 text-xs bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full transition-colors duration-200'
                  >
                    <ClearIcon className='w-3 h-3 mr-1' />
                    Clear search
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Filters Section - Centered */}
          <div className='space-y-4'>
            <div className='text-center'>
              <h3 className='text-base font-semibold text-gray-700 dark:text-gray-300 mb-3'>
                Filter Options
              </h3>
            </div>

            <div className='flex flex-col sm:flex-row gap-3 justify-center items-center max-w-2xl mx-auto'>
              <div className='w-full sm:w-48'>
                <PrioritySelection
                  value={filters.priority}
                  setValue={priority => updateUrlParams({ priority, page: 0 })}
                />
              </div>
              <div className='w-full sm:w-48'>
                <StatusSelection
                  value={filters.status}
                  setValue={status => updateUrlParams({ status, page: 0 })}
                />
              </div>
            </div>

            {/* Action Buttons - Centered */}
            <div className='flex flex-col sm:flex-row gap-3 justify-center items-center pt-3'>
              <Button
                variant='contained'
                onClick={handleSearch}
                className='px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200'
                sx={{
                  background: 'linear-gradient(45deg, #2563eb 30%, #1d4ed8 90%)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #1d4ed8 30%, #1e40af 90%)',
                  },
                }}
              >
                Search
              </Button>
              {hasActiveFilters && (
                <Button
                  variant='outlined'
                  onClick={handleClear}
                  className='px-4 py-2 border-2 border-gray-300 hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300 rounded-2xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200'
                >
                  Clear All
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
