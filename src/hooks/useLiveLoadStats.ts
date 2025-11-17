import { useQuery } from '@tanstack/react-query';

interface LiveLoadStats {
  role: string;
  stats: {
    [key: string]: number;
  };
}

const fetchLiveLoadStats = async (): Promise<LiveLoadStats> => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://103.167.88.66:8000'}/api/v1/statistics/statistics/live-load`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch live load statistics');
  }

  return response.json();
};

export const useLiveLoadStats = () => {
  return useQuery({
    queryKey: ['liveLoadStats'],
    queryFn: fetchLiveLoadStats,
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 25000, // Consider data stale after 25 seconds
  });
};
