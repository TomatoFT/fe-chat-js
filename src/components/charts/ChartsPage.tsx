import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Loader2, Users, UserCheck, BookOpen } from 'lucide-react';
import { useChartTypes } from '../../hooks/useCharts';
import { ChartCard } from './ChartCard';

const categoryIcons: { [key: string]: React.ComponentType<{ className?: string }> } = {
  Students: Users,
  Staff: UserCheck,
  Examinations: BookOpen,
  'Học sinh': Users,
  'Nhân viên': UserCheck,
  'Thi cử': BookOpen,
};

// Category name translations
const categoryTranslations: { [key: string]: string } = {
  'Students': 'Học sinh',
  'Staff': 'Nhân viên',
  'Examinations': 'Thi cử',
};

// Fallback icon
const DefaultIcon = BarChart3;

export const ChartsPage: React.FC = () => {
  const { data: chartTypesData, isLoading: typesLoading, error: typesError } = useChartTypes();

  if (typesLoading) {
    return (
      <div className="space-y-6 p-4 md:p-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-3 text-gray-600">Đang tải danh sách biểu đồ...</span>
          </div>
        </div>
      </div>
    );
  }

  if (typesError) {
    return (
      <div className="space-y-6 p-4 md:p-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">Lỗi khi tải danh sách biểu đồ. Vui lòng thử lại sau.</p>
          </div>
        </div>
      </div>
    );
  }

  // Handle different possible response structures
  let categories: { [key: string]: any[] } = {};
  if (chartTypesData) {
    if (chartTypesData.categories) {
      categories = chartTypesData.categories;
    } else if (Array.isArray(chartTypesData)) {
      // If response is an array, group by category
      const grouped: { [key: string]: any[] } = {};
      chartTypesData.forEach((item: any) => {
        const cat = item.category || 'Khác';
        if (!grouped[cat]) {
          grouped[cat] = [];
        }
        grouped[cat].push(item);
      });
      categories = grouped;
    } else if (typeof chartTypesData === 'object') {
      categories = chartTypesData as any;
    }
  }

  // Flatten all charts into a single array
  const allCharts: Array<{ type: string; category: string; name: string }> = [];
  Object.entries(categories).forEach(([category, charts]) => {
    if (charts && charts.length > 0) {
      charts.forEach((chart: any) => {
        const chartType = typeof chart === 'string' ? chart : chart.type;
        const chartName = typeof chart === 'string' ? chart : (chart.name || chart.type);
        allCharts.push({
          type: chartType,
          category,
          name: chartName,
        });
      });
    }
  });

  const hasCharts = allCharts.length > 0;

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Biểu đồ thống kê</h1>
        <p className="text-gray-600">Xem tất cả các biểu đồ thống kê giáo dục</p>
      </div>

      {/* Charts Dashboard */}
      {hasCharts ? (
        <div className="space-y-8">
          {Object.entries(categories).map(([category, charts]) => {
            if (!charts || charts.length === 0) return null;
            const CategoryIcon = categoryIcons[category] || DefaultIcon;
            const translatedCategory = categoryTranslations[category] || category;

            return (
              <div key={category} className="space-y-4">
                {/* Category Header */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <CategoryIcon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{translatedCategory}</h2>
                    <p className="text-sm text-gray-600">
                      {charts.length} {charts.length === 1 ? 'biểu đồ' : 'biểu đồ'}
                    </p>
                  </div>
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {charts.map((chart: any, index: number) => {
                    const chartType = typeof chart === 'string' ? chart : chart.type;
                    const chartName = typeof chart === 'string' ? chart : (chart.name || chart.type);
                    const translatedCategory = categoryTranslations[category] || category;

                    return (
                      <ChartCard
                        key={chartType}
                        chartType={chartType}
                        category={translatedCategory}
                        name={chartName}
                        defaultLevel="school"
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 p-12">
          <div className="text-center">
            <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Không có biểu đồ nào khả dụng</p>
          </div>
        </div>
      )}
    </div>
  );
};
