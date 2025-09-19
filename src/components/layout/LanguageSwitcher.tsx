import React from 'react';
import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        onClick={() => setLanguage(language === 'en' ? 'vi' : 'en')}
      >
        <Globe className="w-4 h-4" />
        <span className="text-sm font-medium">
          {language === 'en' ? t('language.vietnamese') : t('language.english')}
        </span>
      </motion.button>
    </div>
  );
};

export default LanguageSwitcher;