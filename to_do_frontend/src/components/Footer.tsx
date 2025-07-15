import { FC } from 'react';

import { formatMinutesToStringDDhhmm } from '../helpers/formatHelpers';
import { useFetchStats } from '../hooks/useFetchStats';

const Footer: FC = () => {
  const result = useFetchStats();
  let total = 0;
  const values = result?.map(([k, v], i) => {
    total += v;
    const symbol = k === 'HIGH' ? '🔴' : k === 'MEDIUM' ? '🟡' : k === 'LOW' ? '🟢' : '';
    return (
      <div
        className='flex justify-between items-center p-3 rounded-xl bg-white/60 dark:bg-gray-800/60 border border-gray-200/30 dark:border-gray-600/30'
        key={i}
      >
        <span className='font-semibold text-gray-800 dark:text-gray-200 capitalize'>
          {`${symbol} ${k}`}:
        </span>
        <span className='font-bold text-purple-600 dark:text-purple-400'>
          {formatMinutesToStringDDhhmm(v)}
        </span>
      </div>
    );
  });

  return (
    <footer className='w-full flex justify-center mt-8'>
      <div className='w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex flex-col lg:flex-row gap-6 p-8 rounded-3xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-2xl transition-all duration-300'>
          {/* Overall Average */}
          <div className='flex-1 text-center lg:text-left p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 border border-blue-100 dark:border-gray-600'>
            <h1 className='text-xl font-bold text-gray-900 dark:text-gray-100 mb-3'>
              Average Completion Time
            </h1>
            <div className='text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent'>
              {formatMinutesToStringDDhhmm(total / 3)}
            </div>
          </div>

          {/* Priority Breakdown */}
          <div className='flex-1 p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-700 dark:to-gray-600 border border-purple-100 dark:border-gray-600'>
            <h1 className='text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 text-center lg:text-left'>
              Time by Priority
            </h1>
            <div className='space-y-3'>{values}</div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
