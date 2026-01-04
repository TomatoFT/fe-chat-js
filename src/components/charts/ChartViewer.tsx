import React, { useMemo, useState } from 'react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';

interface ChartViewerProps {
  chartType: string;
  data: Array<{ label: string; value: number; [key: string]: any }>;
  labels?: string[];
  height?: number;
}

const COLORS = [
  '#0088FE',
  '#00C49F',
  '#FFBB28',
  '#FF8042',
  '#8884D8',
  '#82CA9D',
  '#FFC658',
  '#FF7C7C',
  '#8DD1E1',
  '#D084D0',
  '#FF6B9D',
  '#C44569',
  '#F8B500',
  '#6C5CE7',
  '#00D2D3',
];

// Helper to group small values in pie charts
const groupSmallValues = (data: Array<{ name: string; value: number }>, threshold: number = 0.02) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const thresholdValue = total * threshold;
  
  const mainData: Array<{ name: string; value: number }> = [];
  const otherData: Array<{ name: string; value: number }> = [];
  let otherTotal = 0;

  data.forEach((item) => {
    if (item.value >= thresholdValue) {
      mainData.push(item);
    } else {
      otherData.push(item);
      otherTotal += item.value;
    }
  });

  if (otherTotal > 0 && otherData.length > 0) {
    mainData.push({
      name: `Khác (${otherData.length})`,
      value: otherTotal,
    });
  }

  return mainData;
};

// Custom label component for pie chart - cleaner labels
const CustomPieLabel = (props: any) => {
  const { cx, cy, midAngle, innerRadius, outerRadius, percent } = props;
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  const percentValue = (percent * 100).toFixed(0);

  // Only show label if slice is >= 8% to keep it clean
  if (percent < 0.08) {
    return null;
  }

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      fontSize={12}
      fontWeight="600"
      style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}
    >
      {`${percentValue}%`}
    </text>
  );
};

export const ChartViewer: React.FC<ChartViewerProps> = ({ chartType, data, height = 400 }) => {
  const [showAllLegend, setShowAllLegend] = useState(false);
  const MAX_VISIBLE_LEGEND_ITEMS = 6;

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
        <p className="text-gray-500">Không có dữ liệu để hiển thị</p>
      </div>
    );
  }

  // Format data for recharts and filter out zero values
  const processedData = useMemo(() => {
    return data
      .map((item) => {
        const value = item.value || 0;
        return {
          ...item,
          name: item.label || item.name || 'Không có',
          originalName: item.label || item.name || 'Không có', // Keep original for tooltip
          value: value,
        };
      })
      .filter((item) => item.value > 0); // Remove zero values
  }, [data]);

  // Determine chart type based on the chart_type string
  const isPieChart = chartType.includes('by_gender') ||
                     chartType.includes('by_ethnicity') ||
                     chartType.includes('by_religion') ||
                     chartType.includes('by_policy') ||
                     chartType.includes('by_membership');

  const isLineChart = chartType.includes('by_semester') ||
                      chartType.includes('scores_by_semester') ||
                      chartType.includes('trend');

  // For pie charts with many categories, group small values
  const pieChartData = useMemo(() => {
    if (isPieChart && processedData.length > 8) {
      const grouped = groupSmallValues(processedData, 0.02);
      // Preserve originalName for grouped items
      return grouped.map((item) => {
        if (item.name.startsWith('Khác')) {
          return { ...item, originalName: item.name };
        }
        const original = processedData.find((d) => d.name === item.name);
        return { ...item, originalName: original?.originalName || item.name };
      });
    }
    return processedData;
  }, [isPieChart, processedData]);

  // Sort pie chart data by value for better label display
  const sortedPieData = useMemo(() => {
    if (!isPieChart) return pieChartData;
    return [...pieChartData].sort((a, b) => b.value - a.value);
  }, [isPieChart, pieChartData]);

  // Custom tooltip for better formatting
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const total = sortedPieData.reduce((sum: number, item: any) => sum + item.value, 0);
      const percentage = total > 0 ? ((data.value / total) * 100).toFixed(1) : '0';
      const displayName = data.payload?.originalName || data.name || data.payload?.name || 'Không có';
      
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg max-w-xs">
          <p className="font-semibold text-gray-900 mb-1 break-words">{displayName}</p>
          <p className="text-sm text-gray-600">
            Giá trị: <span className="font-medium">{data.value.toLocaleString()}</span>
          </p>
          <p className="text-sm text-gray-600">
            Tỷ lệ: <span className="font-medium">{percentage}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom legend with "view more" option
  const renderCustomLegend = (props: any) => {
    const { payload } = props;
    if (!payload || payload.length === 0) return null;

    const visibleItems = showAllLegend ? payload : payload.slice(0, MAX_VISIBLE_LEGEND_ITEMS);
    const hasMore = payload.length > MAX_VISIBLE_LEGEND_ITEMS;

    return (
      <div className="mt-4">
        <div className="max-h-64 overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {visibleItems.map((entry: any, index: number) => {
              const displayName = entry.payload?.originalName || entry.value || 'Không có';
              return (
                <div 
                  key={`legend-${index}`} 
                  className="flex items-start gap-2 text-xs"
                  title={displayName}
                >
                  <div
                    className="w-3 h-3 rounded-sm flex-shrink-0 mt-0.5"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span
                    className="text-gray-700 break-words flex-1 leading-relaxed"
                  >
                    {displayName}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        {hasMore && (
          <button
            onClick={() => setShowAllLegend(!showAllLegend)}
            className="mt-2 text-xs text-blue-600 hover:text-blue-800 font-medium"
          >
            {showAllLegend ? 'Ẩn bớt' : `Xem thêm (${payload.length - MAX_VISIBLE_LEGEND_ITEMS} mục)`}
          </button>
        )}
      </div>
    );
  };

  // Render chart
  const renderChart = (chartHeight: number = 400) => {
    if (isPieChart) {
      // Show labels for top slices (>= 8%) to keep it clean
      const showLabels = sortedPieData.length <= 12;

      return (
        <div className="w-full">
          <ResponsiveContainer width="100%" height={chartHeight * 0.75}>
            <PieChart>
              <Pie
                data={sortedPieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={showLabels ? CustomPieLabel : false}
                outerRadius={Math.min(chartHeight * 0.3, 130)}
                fill="#8884d8"
                dataKey="value"
              >
                {sortedPieData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <Legend 
            content={renderCustomLegend}
            wrapperStyle={{ paddingTop: '10px' }}
          />
        </div>
      );
    }

    if (isLineChart) {
      return (
        <ResponsiveContainer width="100%" height={chartHeight}>
          <LineChart data={processedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              angle={processedData.length > 6 ? -45 : 0}
              textAnchor={processedData.length > 6 ? 'end' : 'middle'}
              height={processedData.length > 6 ? 80 : 30}
              tick={{ fontSize: 12 }}
            />
            <YAxis />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '8px',
              }}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              content={renderCustomLegend}
            />
            <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      );
    }

    // Default bar chart
    return (
      <ResponsiveContainer width="100%" height={chartHeight}>
        <BarChart data={processedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="name" 
            angle={processedData.length > 6 ? -45 : 0}
            textAnchor={processedData.length > 6 ? 'end' : 'middle'}
            height={processedData.length > 6 ? Math.min(chartHeight * 0.3, 100) : 30}
            tick={{ fontSize: 12 }}
            interval={processedData.length > 10 ? 'preserveStartEnd' : 0}
          />
          <YAxis />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '8px',
            }}
            formatter={(value: any) => value.toLocaleString()}
          />
          <Legend 
            wrapperStyle={{ paddingTop: '20px' }}
            content={renderCustomLegend}
          />
          <Bar dataKey="value" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  return (
    <div className="w-full h-full">
      {renderChart(height)}
    </div>
  );
};
