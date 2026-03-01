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

// Dịch tên danh mục (dùng cả chữ hoa và chữ thường)
const categoryTranslations: { [key: string]: string } = {
  'Students': 'Học sinh',
  'students': 'Học sinh',
  'Staff': 'Nhân viên',
  'staff': 'Nhân viên',
  'Examinations': 'Thi cử',
  'examinations': 'Thi cử',
};

function translateCategory(category: string): string {
  if (!category || typeof category !== 'string') return category;
  const trimmed = category.trim();
  return categoryTranslations[trimmed] ?? categoryTranslations[trimmed.toLowerCase()] ?? trimmed;
}

// Dịch tên loại biểu đồ (chart type / name từ API)
const chartNameTranslations: { [key: string]: string } = {
  // Học sinh
  'students_by_gender': 'Học sinh theo giới tính',
  'students_by_ethnicity': 'Học sinh theo dân tộc',
  'students_by_religion': 'Học sinh theo tôn giáo',
  'students_by_policy': 'Học sinh theo chính sách',
  'students_by_semester': 'Học sinh theo học kỳ',
  'students_by_membership': 'Học sinh theo đoàn thể',
  // Nhân viên
  'staff_by_gender': 'Nhân viên theo giới tính',
  'staff_by_ethnicity': 'Nhân viên theo dân tộc',
  'staff_by_religion': 'Nhân viên theo tôn giáo',
  'staff_by_policy': 'Nhân viên theo chính sách',
  'staff_by_semester': 'Nhân viên theo học kỳ',
  'staff_by_membership': 'Nhân viên theo đoàn thể',
  // Thi cử / điểm
  'scores_by_semester': 'Điểm theo học kỳ',
  'scores_by_subject': 'Điểm theo môn học',
  'examination_scores': 'Điểm thi',
  'scores_trend': 'Xu hướng điểm',
  // Theo môn học / nhóm tuổi
  'staff_by_subject': 'Nhân viên theo môn học',
  'students_by_subject': 'Học sinh theo môn học',
  'students_by_age_group': 'Học sinh theo nhóm tuổi',
  'pass_fail_by_subject': 'Đạt/Trượt theo môn học',
};

/** Trả về tên biểu đồ tiếng Việt (dùng bản dịch có sẵn hoặc ghép từ key). */
function translateChartName(key: string): string {
  const raw = typeof key === 'string' ? key.trim() : '';
  if (!raw) return key;
  const normalized = raw.toLowerCase().replace(/\s+/g, '_');
  const exact = chartNameTranslations[normalized];
  if (exact) return exact;
  // Dịch cụm tiếng Anh còn sót trong tên (vd: "By Subject", "Pass Fail", "Students")
  let out = raw
    .replace(/\bBy Subject\b/gi, 'theo môn học')
    .replace(/\bBy Age Group\b/gi, 'theo nhóm tuổi')
    .replace(/\bPass Fail\b/gi, 'Đạt/Trượt')
    .replace(/\bStudents\b/g, 'Học sinh')
    .replace(/\bStaff\b/g, 'Nhân viên')
    .replace(/\bExaminations\b/g, 'Thi cử');
  if (out !== raw) return out.trim();
  // Fallback: dịch theo từng phần (students → Học sinh, by_gender → theo giới tính, ...)
  const segmentMap: { [key: string]: string } = {
    students: 'Học sinh',
    staff: 'Nhân viên',
    examinations: 'Thi cử',
    by_gender: 'theo giới tính',
    by_ethnicity: 'theo dân tộc',
    by_religion: 'theo tôn giáo',
    by_policy: 'theo chính sách',
    by_semester: 'theo học kỳ',
    by_membership: 'theo đoàn thể',
    by_subject: 'theo môn học',
    by_age_group: 'theo nhóm tuổi',
    scores: 'Điểm',
    examination: 'Thi',
    trend: 'xu hướng',
    pass_fail: 'Đạt/Trượt',
  };
  const parts = normalized.split('_');
  const translated: string[] = [];
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    const withNext = i < parts.length - 1 ? `${part}_${parts[i + 1]}` : null;
    if (withNext && segmentMap[withNext]) {
      translated.push(segmentMap[withNext]);
      i++;
    } else if (segmentMap[part]) {
      translated.push(segmentMap[part]);
    } else {
      translated.push(part.charAt(0).toUpperCase() + part.slice(1));
    }
  }
  return translated.join(' ') || key;
}

// Biểu tượng mặc định
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

  // Xử lý các cấu trúc phản hồi khác nhau
  let categories: { [key: string]: any[] } = {};
  if (chartTypesData) {
    if (chartTypesData.categories) {
      categories = chartTypesData.categories;
    } else if (Array.isArray(chartTypesData)) {
      // Nếu phản hồi là mảng, nhóm theo danh mục
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

  // Gom tất cả biểu đồ vào một mảng
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
      {/* Đầu trang */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Biểu đồ thống kê</h1>
        <p className="text-gray-600">Xem tất cả các biểu đồ thống kê giáo dục</p>
      </div>

      {/* Bảng điều khiển biểu đồ */}
      {hasCharts ? (
        <div className="space-y-8">
          {Object.entries(categories).map(([category, charts]) => {
            if (!charts || charts.length === 0) return null;
            const CategoryIcon = categoryIcons[category] || categoryIcons[translateCategory(category)] || DefaultIcon;
            const translatedCategory = translateCategory(category);

            return (
              <div key={category} className="space-y-4">
                {/* Tiêu đề danh mục */}
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

                {/* Lưới biểu đồ */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {charts.map((chart: any, index: number) => {
                    const chartType = typeof chart === 'string' ? chart : chart.type;
                    const chartName = typeof chart === 'string' ? chart : (chart.name || chart.type);
                    const translatedCategory = translateCategory(category);

                    return (
                      <ChartCard
                        key={chartType}
                        chartType={chartType}
                        category={translatedCategory}
                        name={translateChartName(chartName)}
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
