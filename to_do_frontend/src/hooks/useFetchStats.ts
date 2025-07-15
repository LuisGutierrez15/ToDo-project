import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectAllToDos } from '../store/selectors/rowsSelector';
import { Stats } from '../types/Stats';
import { Priority } from '../types/Priority';
import { getStats } from '../api/toDoService';
import { isSuccessResponse, extractAPIData } from '../utils/typeGuards';

export const useFetchStats = () => {
  const [stats, setStats] = useState<Stats>();
  const rows = useSelector(selectAllToDos);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getStats();

      if (isSuccessResponse(response)) {
        const data = extractAPIData(response) as Stats;
        setStats(data);
      } else {
        console.error('Failed to fetch stats:', response);
      }
    };

    fetchData();
  }, [rows]);

  const result =
    stats &&
    Object.entries(stats).sort(
      ([a], [b]) => Object.values(Priority).indexOf(a) - Object.values(Priority).indexOf(b)
    );

  return result;
};
