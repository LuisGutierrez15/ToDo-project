import { FC } from 'react';
import { DataGridPro } from '@mui/x-data-grid-pro';
import { Box } from '@mui/material';
import { useFetchToDos, DataTableProps } from '../../hooks/useFetchToDos';
import { getRowClassName } from '../../helpers/styleHelpers';

import { handleSelectionChange } from '../../helpers/handlersHelpers';
import { useDispatch, useSelector } from 'react-redux';
import { cols } from './cols';
import { selectParams } from '../../store/selectors/paramsSelector';

const DataTable: FC<DataTableProps> = ({
  name,
  priority,
  complete,
  page,
  size,
  sortByPriority,
  sortByDueDate,
  updateUrlParams,
  className,
}) => {
  const {
    rows,
    rowCount,
    isLoading,
    paginationModel,
    sortModel,
    selectionModel,
    setPaginationModel,
    setSortModel,
    setSelectionModel,
    setIsLoading,
  } = useFetchToDos({
    name,
    priority,
    complete,
    page,
    size,
    sortByPriority,
    sortByDueDate,
    updateUrlParams,
  });
  const dispatch = useDispatch();
  const parameters = useSelector(selectParams);
  const columns = cols(setIsLoading, dispatch, parameters);

  return (
    <Box
      sx={{
        // Dynamic height calculation based on page size
        minHeight: '400px',
        width: '100%',
        maxWidth: '1200px',

        '& .MuiDataGrid-root': {
          border: 'none',
          borderRadius: '16px',
          backgroundColor: 'transparent',
          color: 'text.primary', // Ensure text is visible in dark mode
        },
        '& .MuiDataGrid-main': {
          borderRadius: '16px',
          overflow: 'hidden',
        },
        '& .MuiDataGrid-columnHeaders': {
          background: theme =>
            theme.palette.mode === 'dark'
              ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(51, 65, 85, 0.95) 100%)'
              : 'linear-gradient(135deg, rgba(79, 70, 229, 0.08) 0%, rgba(59, 130, 246, 0.12) 100%)',
          borderBottom: theme =>
            theme.palette.mode === 'dark'
              ? '2px solid rgba(144, 202, 249, 0.3)'
              : '2px solid rgba(79, 70, 229, 0.2)',
          minHeight: '64px !important',
          '& .MuiDataGrid-columnHeader': {
            fontWeight: 700,
            fontSize: { xs: '0.75rem', md: '0.875rem' },
            textTransform: 'none',
            letterSpacing: '0.025em',
            color: 'text.primary',
            py: 2,
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              backgroundColor: theme =>
                theme.palette.mode === 'dark'
                  ? 'rgba(144, 202, 249, 0.1)'
                  : 'rgba(79, 70, 229, 0.08)',
              transform: 'translateY(-1px)',
            },
            '& .MuiDataGrid-columnHeaderTitle': {
              fontWeight: 'inherit',
              fontSize: 'inherit',
            },
            '& .MuiDataGrid-iconButtonContainer': {
              color: 'text.secondary',
              '& .MuiDataGrid-sortIcon': {
                fontSize: '1.2rem',
                transition: 'all 0.2s ease-in-out',
              },
            },
            // Enhanced sorting indicator styling
            '&.MuiDataGrid-columnHeader--sorted': {
              background: theme =>
                theme.palette.mode === 'dark'
                  ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.25) 0%, rgba(37, 99, 235, 0.25) 100%)'
                  : 'linear-gradient(135deg, rgba(79, 70, 229, 0.15) 0%, rgba(59, 130, 246, 0.2) 100%)',
              borderLeft: '3px solid',
              borderLeftColor: 'primary.main',
              '& .MuiDataGrid-columnHeaderTitle': {
                color: 'primary.main',
                fontWeight: 800,
              },
              '& .MuiDataGrid-sortIcon': {
                color: 'primary.main',
                opacity: 1,
                transform: 'scale(1.2)',
              },
            },
          },
        },
        '& .MuiDataGrid-cell': {
          borderBottom: '1px solid',
          borderBottomColor: 'divider',
          color: 'text.primary',
          fontSize: { xs: '0.8rem', md: '0.875rem' },
          py: { xs: 1.5, md: 2 },
          px: { xs: 1, md: 2 },
          transition: 'all 0.2s ease-in-out',
          '&:focus': {
            outline: 'none',
            backgroundColor: theme =>
              theme.palette.mode === 'dark'
                ? 'rgba(144, 202, 249, 0.05)'
                : 'rgba(79, 70, 229, 0.05)',
          },
        },
        '& .MuiDataGrid-row': {
          cursor: 'pointer',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '& .MuiDataGrid-cell': {
            height: 'auto !important',
            maxHeight: 'none !important',
            minHeight: '60px',
            display: 'flex',
            alignItems: 'center',
          },
          '&:hover': {
            backgroundColor: theme =>
              theme.palette.mode === 'dark'
                ? 'rgba(144, 202, 249, 0.08)'
                : 'rgba(79, 70, 229, 0.04)',
            transform: { xs: 'none', md: 'translateY(-1px)' },
            boxShadow: {
              xs: 'none',
              md: theme =>
                theme.palette.mode === 'dark'
                  ? '0 4px 20px rgba(0, 0, 0, 0.4)'
                  : '0 4px 20px rgba(0, 0, 0, 0.1)',
            },
            '& .MuiDataGrid-cell': {
              backgroundColor: 'transparent',
            },
          },
          '&.Mui-selected': {
            backgroundColor: theme =>
              theme.palette.mode === 'dark'
                ? 'rgba(144, 202, 249, 0.12)'
                : 'rgba(79, 70, 229, 0.08)',
            borderLeft: '4px solid',
            borderLeftColor: 'primary.main',
            '&:hover': {
              backgroundColor: theme =>
                theme.palette.mode === 'dark'
                  ? 'rgba(144, 202, 249, 0.16)'
                  : 'rgba(79, 70, 229, 0.12)',
            },
          },
          // Original red/yellow/green row color system restored
          '&.due-red': {
            background: theme =>
              theme.palette.mode === 'dark'
                ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(220, 38, 38, 0.1) 100%)'
                : 'linear-gradient(135deg, rgba(254, 226, 226, 0.8) 0%, rgba(252, 165, 165, 0.3) 100%)',
            borderLeft: '4px solid #ef4444',
            '&:hover': {
              background: theme =>
                theme.palette.mode === 'dark'
                  ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.25) 0%, rgba(220, 38, 38, 0.2) 100%)'
                  : 'linear-gradient(135deg, rgba(254, 226, 226, 1) 0%, rgba(252, 165, 165, 0.5) 100%)',
            },
          },
          '&.due-yellow': {
            background: theme =>
              theme.palette.mode === 'dark'
                ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(217, 119, 6, 0.1) 100%)'
                : 'linear-gradient(135deg, rgba(254, 243, 199, 0.8) 0%, rgba(253, 230, 138, 0.3) 100%)',
            borderLeft: '4px solid #f59e0b',
            '&:hover': {
              background: theme =>
                theme.palette.mode === 'dark'
                  ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.25) 0%, rgba(217, 119, 6, 0.2) 100%)'
                  : 'linear-gradient(135deg, rgba(254, 243, 199, 1) 0%, rgba(253, 230, 138, 0.5) 100%)',
            },
          },
          '&.due-green': {
            background: theme =>
              theme.palette.mode === 'dark'
                ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(16, 185, 129, 0.1) 100%)'
                : 'linear-gradient(135deg, rgba(220, 252, 231, 0.8) 0%, rgba(167, 243, 208, 0.3) 100%)',
            borderLeft: '4px solid #22c55e',
            '&:hover': {
              background: theme =>
                theme.palette.mode === 'dark'
                  ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.25) 0%, rgba(16, 185, 129, 0.2) 100%)'
                  : 'linear-gradient(135deg, rgba(220, 252, 231, 1) 0%, rgba(167, 243, 208, 0.5) 100%)',
            },
          },
          '&.due-completed': {
            background: theme =>
              theme.palette.mode === 'dark'
                ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(37, 99, 235, 0.1) 100%)'
                : 'linear-gradient(135deg, rgba(219, 234, 254, 0.8) 0%, rgba(147, 197, 253, 0.3) 100%)',
            borderLeft: '4px solid #3b82f6',
            opacity: 0.85,
            '&:hover': {
              background: theme =>
                theme.palette.mode === 'dark'
                  ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.25) 0%, rgba(37, 99, 235, 0.2) 100%)'
                  : 'linear-gradient(135deg, rgba(219, 234, 254, 1) 0%, rgba(147, 197, 253, 0.5) 100%)',
              opacity: 1,
            },
          },
        },
        '& .MuiDataGrid-footerContainer': {
          borderTop: '2px solid',
          borderTopColor: 'divider',
          background: theme =>
            theme.palette.mode === 'dark'
              ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(51, 65, 85, 0.95) 100%)'
              : 'linear-gradient(135deg, rgba(79, 70, 229, 0.05) 0%, rgba(59, 130, 246, 0.08) 100%)',
          backdropFilter: 'blur(8px)',
          minHeight: { xs: '52px', md: '64px' },
          '& .MuiTablePagination-root': {
            color: 'text.primary',
            fontSize: { xs: '0.75rem', md: '0.875rem' },
          },
          '& .MuiTablePagination-select': {
            fontSize: { xs: '0.75rem', md: '0.875rem' },
            fontWeight: 600,
          },
          '& .MuiTablePagination-displayedRows': {
            fontSize: { xs: '0.75rem', md: '0.875rem' },
            fontWeight: 500,
          },
          '& .MuiTablePagination-actions': {
            '& .MuiIconButton-root': {
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                backgroundColor: theme =>
                  theme.palette.mode === 'dark'
                    ? 'rgba(144, 202, 249, 0.1)'
                    : 'rgba(79, 70, 229, 0.1)',
                transform: 'scale(1.1)',
              },
            },
          },
        },
        '& .actions': {
          color: 'text.secondary',
          '& .MuiIconButton-root': {
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              backgroundColor: theme =>
                theme.palette.mode === 'dark'
                  ? 'rgba(144, 202, 249, 0.1)'
                  : 'rgba(79, 70, 229, 0.1)',
            },
          },
        },
        '& .textPrimary': {
          color: 'text.primary',
        },
        // Enhanced scrollbar styling
        '& .MuiDataGrid-scrollbar': {
          '&::-webkit-scrollbar': {
            width: { xs: '6px', md: '8px' },
            height: { xs: '6px', md: '8px' },
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: theme =>
              theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
            borderRadius: '8px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: theme =>
              theme.palette.mode === 'dark' ? 'rgba(144, 202, 249, 0.3)' : 'rgba(79, 70, 229, 0.3)',
            borderRadius: '8px',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              backgroundColor: theme =>
                theme.palette.mode === 'dark'
                  ? 'rgba(144, 202, 249, 0.5)'
                  : 'rgba(79, 70, 229, 0.5)',
            },
          },
        },
      }}
    >
      <DataGridPro
        className={className}
        loading={isLoading}
        rows={rows}
        columns={columns}
        rowCount={rowCount}
        checkboxSelection
        pagination
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[5, 10, 20, 50, 100]}
        paginationMode='server'
        disableColumnResize
        sortingMode='server'
        sortModel={sortModel}
        onSortModelChange={setSortModel}
        onRowSelectionModelChange={newSelection => {
          setIsLoading(true);
          handleSelectionChange(newSelection, setSelectionModel, dispatch, setIsLoading, rows);
        }}
        getRowHeight={() => 'auto'}
        rowSelectionModel={selectionModel}
        getRowClassName={params => getRowClassName(params, selectionModel)}
        sx={{
          '& .MuiDataGrid-virtualScroller': {
            overflowX: 'auto',
            overflowY: 'auto',
          },
          // Mobile optimizations
          '@media (max-width: 768px)': {
            '& .MuiDataGrid-columnHeaderCheckbox': {
              minWidth: '40px',
            },
            '& .MuiDataGrid-cell--withRenderer': {
              px: 1,
            },
          },
          // Smooth loading state
          '& .MuiDataGrid-overlay': {
            backgroundColor: theme =>
              theme.palette.mode === 'dark' ? 'rgba(30, 41, 59, 0.9)' : 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(8px)',
          },
        }}
      />
    </Box>
  );
};

export default DataTable;
