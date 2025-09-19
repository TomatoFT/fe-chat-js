import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  FileText, 
  Brain, 
  Loader2, 
  AlertCircle, 
  CheckCircle,
  BookOpen,
  Users,
  GraduationCap
} from 'lucide-react';
import { useSearchDocuments } from '../../hooks/useDocuments';

interface DocumentSearchProps {
  className?: string;
}

export const DocumentSearch: React.FC<DocumentSearchProps> = ({ className = '' }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDocuments, setSelectedDocuments] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);

  const { data: searchResults, isLoading, error } = useSearchDocuments(
    searchQuery, 
    selectedDocuments.length > 0 ? selectedDocuments : undefined
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowResults(true);
    }
  };

  const getDocumentIcon = (docType: string) => {
    switch (docType) {
      case 'staff': return <Users className="w-4 h-4 text-blue-500" />;
      case 'students': return <GraduationCap className="w-4 h-4 text-green-500" />;
      case 'examinations': return <BookOpen className="w-4 h-4 text-purple-500" />;
      default: return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatScore = (score: number) => {
    return Math.round(score * 100);
  };

  return (
    <div className={`p-6 ${className}`}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Document Search</h1>
        <p className="text-gray-600">Search through your documents using AI-powered semantic search</p>
      </div>

      {/* Search Form */}
      <div className="mb-8">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search documents... (e.g., 'student enrollment data', 'staff performance reports')"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={!searchQuery.trim() || isLoading}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Brain className="w-5 h-5" />
                  Search
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Search Tips */}
      <div className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Search Tips</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Use natural language queries like "student attendance records" or "staff salary information"</li>
          <li>• Search for specific topics, dates, or document types</li>
          <li>• The AI will find relevant content even if exact words don't match</li>
          <li>• Results are ranked by relevance to your query</li>
        </ul>
      </div>

      {/* Error State */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <span className="text-red-700">Search failed. Please try again.</span>
        </div>
      )}

      {/* Search Results */}
      {showResults && searchResults && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Results Summary */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              Search Results
            </h2>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <CheckCircle className="w-4 h-4 text-green-500" />
              {searchResults.total_results} results found
            </div>
          </div>

          {/* Results List */}
          <div className="space-y-4">
            {searchResults.results.map((result: any, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {getDocumentIcon(result.document_type || 'general')}
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {result.document_name || 'Untitled Document'}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {result.document_type || 'General Document'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      {formatScore(result.score)}% match
                    </div>
                  </div>
                </div>

                {/* Content Preview */}
                <div className="mb-4">
                  <p className="text-gray-700 leading-relaxed">
                    {result.content_preview || result.text || 'No preview available'}
                  </p>
                </div>

                {/* Metadata */}
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-4">
                    <span>Document ID: {result.document_id}</span>
                    {result.page_number && (
                      <span>Page: {result.page_number}</span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span>Relevance: {formatScore(result.score)}%</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* No Results */}
          {searchResults.results.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
              <p className="text-gray-500 mb-4">
                Try adjusting your search terms or check if your documents are properly indexed.
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className="text-blue-500 hover:text-blue-600 font-medium"
              >
                Clear search and try again
              </button>
            </div>
          )}
        </motion.div>
      )}

      {/* Initial State */}
      {!showResults && (
        <div className="text-center py-12">
          <Brain className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Start searching your documents</h3>
          <p className="text-gray-500">
            Enter a search query above to find relevant content in your documents using AI-powered search.
          </p>
        </div>
      )}
    </div>
  );
};
