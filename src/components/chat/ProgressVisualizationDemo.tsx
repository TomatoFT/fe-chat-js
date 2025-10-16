import React, { useState } from 'react';
import { AIProgressVisualization } from './AIProgressVisualization';

export const ProgressVisualizationDemo: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [actualDuration, setActualDuration] = useState<number | undefined>(undefined);

  const startDemo = () => {
    setIsVisible(true);
    setActualDuration(undefined);
    
    // Simulate different response times
    const responseTimes = [30, 90, 150, 200]; // seconds
    const randomTime = responseTimes[Math.floor(Math.random() * responseTimes.length)];
    
    setTimeout(() => {
      setActualDuration(randomTime);
    }, randomTime * 1000);
  };

  const stopDemo = () => {
    setIsVisible(false);
    setActualDuration(undefined);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
        Demo Hiển thị Tiến trình AI
      </h1>
      
      <div className="text-center mb-8">
        <p className="text-gray-600 mb-4">
          Demo này hiển thị việc hiển thị tiến trình đa bước cho phản hồi AI.
          Nhấp vào nút bên dưới để bắt đầu quá trình phản hồi AI mô phỏng.
        </p>
        
        <div className="flex gap-4 justify-center">
          <button
            onClick={startDemo}
            disabled={isVisible}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Bắt đầu Demo Phản hồi AI
          </button>
          
          <button
            onClick={stopDemo}
            disabled={!isVisible}
            className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Dừng Demo
          </button>
        </div>
        
        {actualDuration && (
          <p className="mt-4 text-sm text-gray-500">
            Thời gian phản hồi mô phỏng: {actualDuration} giây
          </p>
        )}
      </div>

      <AIProgressVisualization
        isVisible={isVisible}
        expectedDuration={180}
        actualDuration={actualDuration}
        onComplete={() => {
          console.log('Demo completed!');
          setTimeout(() => {
            setIsVisible(false);
            setActualDuration(undefined);
          }, 2000);
        }}
      />

      <div className="mt-12 bg-gray-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Tính năng</h2>
        <ul className="space-y-2 text-gray-700">
          <li>• <strong>4 Giai đoạn Xử lý:</strong> SUY NGHĨ → TÌM KIẾM → KẾT HỢP DỮ LIỆU → TẠO CÂU TRẢ LỜI</li>
          <li>• <strong>Thời gian Thích ứng:</strong> Điều chỉnh tốc độ hoạt ảnh dựa trên thời gian phản hồi thực tế</li>
          <li>• <strong>Hoạt ảnh Mượt mà:</strong> Hiệu ứng nhấp nháy, phát sáng và lấp lánh</li>
          <li>• <strong>Phản hồi Trực quan:</strong> Tiến trình rõ ràng qua từng giai đoạn</li>
          <li>• <strong>Thiết kế Đáp ứng:</strong> Hoạt động trên mọi kích thước màn hình</li>
          <li>• <strong>Chỉ báo TRUNG TÂM THÔNG TIN:</strong> Chỉ báo hình kim cương với hiệu ứng hoạt ảnh</li>
        </ul>
      </div>
    </div>
  );
};
