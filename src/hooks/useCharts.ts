import { useQuery } from '@tanstack/react-query';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://103.167.88.66:8000';

export interface ChartType {
  type: string;
  category: string;
  name: string;
  description?: string;
}

export interface ChartTypesResponse {
  categories: {
    [category: string]: ChartType[];
  };
}

export interface ChartDataPoint {
  label: string;
  value: number;
  [key: string]: any;
}

export interface ChartDataResponse {
  chart_type: string;
  level: string;
  data: ChartDataPoint[];
  labels?: string[];
}

// Get available chart types
export const useChartTypes = () => {
  return useQuery<ChartTypesResponse>({
    queryKey: ['chartTypes'],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/v1/charts/types`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch chart types');
      }

      return response.json();
    },
  });
};

// Get chart data
export const useChartData = (
  chartType: string,
  level: 'school' | 'province',
  academicYear?: string,
  semester?: string
) => {
  return useQuery<ChartDataResponse>({
    queryKey: ['chartData', chartType, level, academicYear, semester],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({
        chart_type: chartType,
        level: level,
      });

      if (academicYear) {
        params.append('academic_year', academicYear);
      }
      if (semester) {
        params.append('semester', semester);
      }

      const response = await fetch(`${API_BASE_URL}/api/v1/charts/data?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch chart data');
      }

      return response.json();
    },
    enabled: !!chartType && !!level,
  });
};

