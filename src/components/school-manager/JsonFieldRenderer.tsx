import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin } from 'lucide-react';

interface JsonFieldRendererProps {
  data: Record<string, any> | null | undefined;
  label?: string;
}

export const JsonFieldRenderer: React.FC<JsonFieldRendererProps> = ({ data, label }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!data || typeof data !== 'object') {
    return <span className="text-sm text-gray-400">N/A</span>;
  }

  const entries = Object.entries(data);
  if (entries.length === 0) {
    return <span className="text-sm text-gray-400">Empty</span>;
  }

  // Format the data nicely
  const formatValue = (value: any): string => {
    if (value === null || value === undefined) return 'N/A';
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  };

  // Create a beautiful preview with formatted fields
  const previewFields = entries.slice(0, 3);
  const hasMore = entries.length > 3;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="group relative flex flex-col gap-1.5 p-2 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all text-left min-w-[180px]"
        title="Nhấp để xem chi tiết đầy đủ"
      >
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-blue-600 flex-shrink-0" />
          <span className="text-xs font-semibold text-gray-700">{label || 'Địa chỉ'}</span>
        </div>
        <div className="space-y-1">
          {previewFields.map(([key, value], idx) => {
            const displayKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            const displayValue = formatValue(value);
            return (
              <div key={idx} className="text-xs text-gray-600">
                <span className="font-medium text-gray-700">{displayKey}:</span>{' '}
                <span className="text-gray-600">
                  {displayValue.length > 25 ? displayValue.substring(0, 25) + '...' : displayValue}
                </span>
              </div>
            );
          })}
        </div>
        {hasMore && (
          <div className="text-xs text-blue-600 font-medium mt-1">
            +{entries.length - 3} trường khác
          </div>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-50"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      {label || 'Chi tiết địa chỉ'}
                    </h3>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-200 rounded"
                    aria-label="Đóng"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)] bg-gray-50">
                  <div className="space-y-3">
                    {entries.map(([key, value]) => (
                      <div key={key} className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-start gap-3">
                          <div className="flex-1">
                            <div className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-2 flex items-center gap-1">
                              <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                              {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </div>
                            <div className="text-sm text-gray-900 break-words bg-gray-50 p-2 rounded border border-gray-100">
                              {formatValue(value)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

