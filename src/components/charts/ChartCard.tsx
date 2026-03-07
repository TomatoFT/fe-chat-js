import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useChartData } from '../../hooks/useCharts';
import { ChartViewer } from './ChartViewer';

interface ChartCardProps {
  chartType: string;
  category: string;
  name: string;
  defaultLevel?: 'school' | 'province';
}

export const ChartCard: React.FC<ChartCardProps> = ({
  chartType,
  category,
  name,
  defaultLevel = 'school',
}) => {
  const { user } = useAuth();
  const isSchoolManager = user?.role === 'school_manager';
  const isProvinceManager = user?.role === 'province_manager';
  // School => always school; Province => always province; others choose
  const [selectedLevel, setSelectedLevel] = useState<'school' | 'province'>(
    isSchoolManager ? 'school' : isProvinceManager ? 'province' : defaultLevel
  );
  const effectiveLevel = isProvinceManager ? 'province' : selectedLevel;
  const [academicYear, setAcademicYear] = useState<string>('');
  const [semester, setSemester] = useState<string>('');

  const { data: chartData, isLoading: dataLoading, error: dataError } = useChartData(
    chartType,
    effectiveLevel,
    academicYear || undefined,
    semester || undefined
  );

  const needsExamFilters = chartType.includes('score') ||
    chartType.includes('examination') ||
    chartType.includes('semester');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
    >
      {/* Tiêu đề */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">{name}</h3>
        <p className="text-sm text-gray-500">{category}</p>
      </div>

      {/* Điều khiển */}
      <div className="mb-4 space-y-3">
        {/* Aggregation level: only for department_manager and admin (province always province, school always school) */}
        {!isSchoolManager && !isProvinceManager && (
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Cấp độ
            </label>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value as 'school' | 'province')}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="school">Trường học</option>
              <option value="province">Tỉnh/Thành phố</option>
            </select>
          </div>
        )}

        {needsExamFilters && (
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Năm học
              </label>
              <input
                type="text"
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                placeholder="2023-2024"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Học kỳ
              </label>
              <select
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Tất cả</option>
                <option value="1">Học kỳ 1</option>
                <option value="2">Học kỳ 2</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Biểu đồ */}
      <div className="mt-4">
        {dataLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            <span className="ml-2 text-sm text-gray-600">Đang tải...</span>
          </div>
        ) : dataError ? (
          <div className="flex flex-col items-center justify-center h-64 bg-red-50 rounded-lg px-4">
            <p className="text-sm font-medium text-red-600">Lỗi khi tải dữ liệu</p>
            <p className="text-xs text-red-500 mt-1 text-center max-w-xs">
              {dataError.message}
            </p>
            {effectiveLevel === 'province' && (
              <p className="text-xs text-gray-500 mt-2 text-center">
                Thử chọn cấp độ &quot;Trường học&quot; nếu dữ liệu cấp tỉnh chưa có.
              </p>
            )}
          </div>
        ) : chartData ? (
          <div className="min-h-[400px]">
            <ChartViewer
              chartType={chartType}
              data={chartData.data}
              labels={chartData.labels}
              height={400}
            />
          </div>
        ) : (
          <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">Chưa có dữ liệu</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

