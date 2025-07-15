import { Suspense } from 'react';
import { CircularProgress } from '@mui/material';

import Body from './components/Body';
import Header from './components/Header';
import Footer from './components/Footer';
import ButtonNewTodo from './components/NewToDo/ButtonNewTodo';
import DataTable from './components/Table/DataTable';
import ErrorBoundary from './components/ErrorBoundary';
import { useUrlParams } from './hooks/useUrlParams';
import SnackbarProvider from './providers/SnackbarProvider';

/**
 * Loading fallback component with enhanced styling
 */
const LoadingFallback = () => (
  <div className='flex justify-center items-center min-h-[200px] p-8'>
    <div className='flex flex-col items-center space-y-4'>
      <CircularProgress size={40} className='text-blue-600 dark:text-blue-400' />
      <p className='text-sm text-gray-600 dark:text-gray-400 font-medium'>Loading...</p>
    </div>
  </div>
);

function App() {
  const { filters, updateUrlParams, clearFilters, hasActiveFilters } = useUrlParams();

  return (
    <SnackbarProvider>
      <ErrorBoundary>
        <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-slate-900 dark:to-gray-900 text-gray-900 dark:text-gray-100 transition-all duration-500'>
          {/* Main Container with proper centering and max width */}
          <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
            <div className='grid min-h-screen grid-rows-[auto_1fr_auto] gap-6 py-6'>
              {/* Header Section */}
              <Header
                filters={filters}
                updateUrlParams={updateUrlParams}
                clearFilters={clearFilters}
                hasActiveFilters={hasActiveFilters}
              />

              {/* Main Content */}
              <main className='flex-1'>
                <Body>
                  <ErrorBoundary>
                    <Suspense fallback={<LoadingFallback />}>
                      {/* Centered content container */}
                      <div className='space-y-8'>
                        {/* New Todo Button - Centered */}
                        <div className='flex justify-center'>
                          <ButtonNewTodo />
                        </div>

                        {/* Data Table with enhanced container */}
                        <div className='bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl overflow-hidden'>
                          <DataTable
                            name={filters.name}
                            priority={filters.priority}
                            complete={filters.status}
                            page={filters.page}
                            size={filters.size}
                            sortByPriority={filters.sortByPriority}
                            sortByDueDate={filters.sortByDueDate}
                            updateUrlParams={updateUrlParams}
                          />
                        </div>
                      </div>
                    </Suspense>
                  </ErrorBoundary>
                </Body>
              </main>

              {/* Footer Section */}
              <ErrorBoundary>
                <Footer />
              </ErrorBoundary>
            </div>
          </div>
        </div>
      </ErrorBoundary>
    </SnackbarProvider>
  );
}

export default App;
