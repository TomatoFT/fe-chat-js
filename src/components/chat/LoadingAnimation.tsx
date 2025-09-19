import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Search, Brain, Sparkles } from 'lucide-react';

interface LoadingAnimationProps {
  stage: 'reading' | 'analyzing' | 'generating' | 'finalizing';
  documents?: string[];
}

const LoadingAnimation: React.FC<LoadingAnimationProps> = ({ stage, documents = [] }) => {
  const stages = [
    {
      key: 'reading',
      icon: FileText,
      title: 'Reading documents',
      description: 'Scanning through your uploaded files...',
      color: 'blue',
    },
    {
      key: 'analyzing',
      icon: Search,
      title: 'Analyzing content',
      description: 'Understanding the context and extracting relevant information...',
      color: 'purple',
    },
    {
      key: 'generating',
      icon: Brain,
      title: 'Generating response',
      description: 'Crafting a comprehensive answer based on your documents...',
      color: 'green',
    },
    {
      key: 'finalizing',
      icon: Sparkles,
      title: 'Finalizing',
      description: 'Putting the finishing touches on your response...',
      color: 'orange',
    },
  ];

  const currentStageIndex = stages.findIndex(s => s.key === stage);
  const currentStage = stages[currentStageIndex];

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 max-w-md">
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-10 h-10 bg-${currentStage.color}-100 rounded-full flex items-center justify-center`}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <currentStage.icon className={`w-5 h-5 text-${currentStage.color}-600`} />
          </motion.div>
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{currentStage.title}</h3>
          <p className="text-sm text-gray-600">{currentStage.description}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-gray-500 mb-2">
          <span>Progress</span>
          <span>{Math.round(((currentStageIndex + 1) / stages.length) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className={`bg-${currentStage.color}-500 h-2 rounded-full`}
            initial={{ width: 0 }}
            animate={{ width: `${((currentStageIndex + 1) / stages.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Stage Indicators */}
      <div className="flex justify-between mb-4">
        {stages.map((stageItem, index) => (
          <div key={stageItem.key} className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-300 ${
                index <= currentStageIndex
                  ? `bg-${currentStage.color}-500 text-white`
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              {index < currentStageIndex ? '✓' : index + 1}
            </div>
            <span className="text-xs text-gray-500 mt-1 text-center">
              {stageItem.key}
            </span>
          </div>
        ))}
      </div>

      {/* Documents Being Processed */}
      {documents.length > 0 && stage === 'reading' && (
        <div className="border-t border-gray-200 pt-4">
          <p className="text-xs text-gray-500 mb-2">Processing documents:</p>
          <div className="space-y-1">
            {documents.slice(0, 3).map((doc, index) => (
              <motion.div
                key={doc}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2 }}
                className="flex items-center gap-2 text-xs text-gray-600"
              >
                <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse" />
                <span className="truncate">{doc}</span>
              </motion.div>
            ))}
            {documents.length > 3 && (
              <p className="text-xs text-gray-500">
                +{documents.length - 3} more documents
              </p>
            )}
          </div>
        </div>
      )}

      {/* Animated Dots */}
      <div className="flex justify-center mt-4">
        <div className="flex space-x-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className={`w-2 h-2 bg-${currentStage.color}-500 rounded-full`}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingAnimation;