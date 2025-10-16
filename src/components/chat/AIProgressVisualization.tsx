import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  Search, 
  Puzzle, 
  Sparkles, 
  CheckCircle,
  Info
} from 'lucide-react';
import './AIProgressVisualization.css';

interface AIProgressVisualizationProps {
  isVisible: boolean;
  onComplete?: () => void;
  expectedDuration?: number; // in seconds, default 180 (3 minutes)
  actualDuration?: number; // actual response time, if known
}

type ProgressStage = 'think' | 'query' | 'combine' | 'generate';

interface StageConfig {
  id: ProgressStage;
  label: string;
  icon: React.ReactNode;
  color: string;
  duration: number; // in seconds
}

const STAGES: StageConfig[] = [
  {
    id: 'think',
    label: 'SUY NGHĨ',
    icon: <Brain className="w-6 h-6" />,
    color: 'bg-blue-500',
    duration: 45
  },
  {
    id: 'query',
    label: 'TÌM KIẾM',
    icon: <Search className="w-6 h-6" />,
    color: 'bg-purple-500',
    duration: 45
  },
  {
    id: 'combine',
    label: 'KẾT HỢP DỮ LIỆU',
    icon: <Puzzle className="w-6 h-6" />,
    color: 'bg-green-500',
    duration: 45
  },
  {
    id: 'generate',
    label: 'TẠO CÂU TRẢ LỜI',
    icon: <Sparkles className="w-6 h-6" />,
    color: 'bg-orange-500',
    duration: 45
  }
];

export const AIProgressVisualization: React.FC<AIProgressVisualizationProps> = ({
  isVisible,
  onComplete,
  expectedDuration = 180,
  actualDuration
}) => {
  const [currentStage, setCurrentStage] = useState<ProgressStage | null>(null);
  const [completedStages, setCompletedStages] = useState<ProgressStage[]>([]);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  // Calculate stage durations based on actual vs expected time
  const getStageDuration = (stageIndex: number): number => {
    if (actualDuration && actualDuration < expectedDuration) {
      // If response came early, distribute remaining time proportionally
      const remainingStages = STAGES.length - stageIndex;
      const remainingTime = Math.max(actualDuration - (stageIndex * STAGES[0].duration), 0);
      return remainingTime / remainingStages;
    }
    return STAGES[stageIndex].duration;
  };

  // Start the progress sequence
  useEffect(() => {
    if (isVisible && !startTime) {
      setStartTime(Date.now());
      setCurrentStage('think');
      setCompletedStages([]);
      setIsCompleted(false);
    }
  }, [isVisible, startTime]);

  // Handle stage progression
  useEffect(() => {
    if (!currentStage || !startTime) return;

    const stageIndex = STAGES.findIndex(s => s.id === currentStage);
    if (stageIndex === -1) return;

    const stageDuration = getStageDuration(stageIndex) * 1000; // Convert to milliseconds
    const elapsedTime = Date.now() - startTime;
    const stageStartTime = stageIndex * STAGES[0].duration * 1000;
    const remainingTime = Math.max(stageDuration - (elapsedTime - stageStartTime), 0);

    const timer = setTimeout(() => {
      // Mark current stage as completed
      setCompletedStages(prev => [...prev, currentStage]);

      // Move to next stage or complete
      if (stageIndex < STAGES.length - 1) {
        setCurrentStage(STAGES[stageIndex + 1].id);
      } else {
        setIsCompleted(true);
        onComplete?.();
      }
    }, remainingTime);

    return () => clearTimeout(timer);
  }, [currentStage, startTime, actualDuration, expectedDuration, onComplete]);

  // Reset when visibility changes
  useEffect(() => {
    if (!isVisible) {
      setCurrentStage(null);
      setCompletedStages([]);
      setStartTime(null);
      setIsCompleted(false);
    }
  }, [isVisible]);

  const getStageStatus = (stageId: ProgressStage) => {
    if (completedStages.includes(stageId)) return 'completed';
    if (currentStage === stageId) return 'active';
    return 'inactive';
  };

  const getStageClasses = (stageId: ProgressStage) => {
    const status = getStageStatus(stageId);
    const stage = STAGES.find(s => s.id === stageId);
    
    switch (status) {
      case 'completed':
        return `${stage?.color} text-white shadow-lg`;
      case 'active':
        return `${stage?.color} text-white shadow-lg ring-4 ring-opacity-50`;
      default:
        return 'bg-gray-200 text-gray-400 opacity-50';
    }
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm mb-4"
      >
        {/* INFO HUB Indicator */}
        <div className="flex items-center justify-center mb-6">
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-3 rounded-lg shadow-lg"
          >
            <Info className="w-6 h-6" />
          </motion.div>
          <span className="ml-3 text-lg font-semibold text-gray-700">TRUNG TÂM THÔNG TIN</span>
        </div>

        {/* Progress Stages */}
        <div className="flex items-center justify-center space-x-8">
          {STAGES.map((stage, index) => {
            const status = getStageStatus(stage.id);
            const isActive = status === 'active';
            const isCompleted = status === 'completed';

            return (
              <div key={stage.id} className="flex flex-col items-center">
                {/* Stage Circle */}
                <motion.div
                  className={`
                    relative w-16 h-16 rounded-full flex items-center justify-center
                    progress-stage-transition
                    ${getStageClasses(stage.id)}
                  `}
                  animate={isActive ? {
                    scale: [1, 1.1, 1],
                    boxShadow: [
                      '0 0 0 0 rgba(59, 130, 246, 0.7)',
                      '0 0 0 10px rgba(59, 130, 246, 0)',
                      '0 0 0 0 rgba(59, 130, 246, 0)'
                    ]
                  } : {}}
                  transition={{
                    duration: 1.5,
                    repeat: isActive ? Infinity : 0,
                    ease: "easeInOut"
                  }}
                >
                  {/* Working Animation Ring */}
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-white border-opacity-30"
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    />
                  )}

                  {/* Icon */}
                  <motion.div
                    animate={isActive ? {
                      scale: [1, 1.1, 1]
                    } : {}}
                    transition={{
                      duration: 0.8,
                      repeat: isActive ? Infinity : 0,
                      ease: "easeInOut"
                    }}
                  >
                    {isCompleted ? (
                      <CheckCircle className="w-8 h-8" />
                    ) : (
                      stage.icon
                    )}
                  </motion.div>

                  {/* Shimmer Effect for Active Stage */}
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
                      animate={{
                        x: ['-100%', '100%']
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  )}
                </motion.div>

                {/* Stage Label */}
                <motion.div
                  className="mt-3 text-center"
                  animate={isActive ? {
                    color: ['#6B7280', '#3B82F6', '#6B7280']
                  } : {}}
                  transition={{
                    duration: 1,
                    repeat: isActive ? Infinity : 0,
                    ease: "easeInOut"
                  }}
                >
                  <div className={`text-sm font-medium ${
                    isCompleted ? 'text-green-600' : 
                    isActive ? 'text-blue-600' : 'text-gray-400'
                  }`}>
                    {stage.label}
                  </div>
                </motion.div>

                {/* Connection Line */}
                {index < STAGES.length - 1 && (
                  <div className="absolute left-full top-1/2 w-8 h-0.5 bg-gray-200 transform -translate-y-1/2 connection-line">
                    <motion.div
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                      initial={{ width: 0 }}
                      animate={{ 
                        width: isCompleted || isActive ? '100%' : '0%' 
                      }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Progress Status Text */}
        <motion.div
          className="text-center mt-6"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <p className="text-sm text-gray-600">
            {isCompleted ? (
              'Hoàn thành xử lý! Đang tạo câu trả lời...'
            ) : currentStage ? (
              `Đang ${STAGES.find(s => s.id === currentStage)?.label.toLowerCase()}...`
            ) : (
              'Đang chuẩn bị phản hồi AI...'
            )}
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
