import React, { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchDocuments } from '../../hooks/useDocuments';
import { searchDocumentsSchema, type SearchDocumentsInput } from '../../lib/validations';
import { useDebounce } from '../../hooks/useDebounce';

export const DocumentSearch: React.FC = () => {
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchDocuments = useSearchDocuments();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SearchDocumentsInput>({
    resolver: zodResolver(searchDocumentsSchema),
  });

  const query = watch('query');
  const debouncedQuery = useDebounce(query, 500);

  const onSubmit = async (data: SearchDocumentsInput) => {
    setIsSearching(true);
    try {
      const results = await searchDocuments.mutateAsync(data.query);
      setSearchResults(results.results || []);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Auto-search when debounced query changes
  React.useEffect(() => {
    if (debouncedQuery && debouncedQuery.length > 2) {
      onSubmit({ query: debouncedQuery });
    }
  }, [debouncedQuery]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Document Search</h2>
        
        {/* Search Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="mb-6">
          <div className="flex space-x-4">
            <div className="flex-1">
              <input
                {...register('query')}
                type="text"
                placeholder="Search documents..."
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              {errors.query && (
                <p className="mt-1 text-sm text-red-600">{errors.query.message}</p>
              )}
            </div>
            <div className="w-32">
              <input
                {...register('limit', { valueAsNumber: true })}
                type="number"
                placeholder="Limit"
                min="1"
                max="100"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <button
              type="submit"
              disabled={isSearching}
              className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
              {isSearching ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>

        {/* Search Results */}
        <div className="space-y-4">
          {isSearching && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              <p className="mt-2 text-gray-600">Searching documents...</p>
            </div>
          )}

          {!isSearching && searchResults.length === 0 && query && (
            <div className="text-center py-8 text-gray-500">
              No documents found matching "{query}"
            </div>
          )}

          {!isSearching && !query && (
            <div className="text-center py-8 text-gray-500">
              Enter a search term to find documents
            </div>
          )}

          {!isSearching && searchResults.length > 0 && (
            <div>
              <div className="mb-4 text-sm text-gray-600">
                Found {searchResults.length} document(s)
              </div>
              <div className="space-y-3">
                {searchResults.map((result, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          {result.title || 'Untitled Document'}
                        </h3>
                        {result.description && (
                          <p className="text-gray-600 mb-2">{result.description}</p>
                        )}
                        <div className="text-sm text-gray-500">
                          <span className="mr-4">
                            Type: {result.type || 'Unknown'}
                          </span>
                          <span className="mr-4">
                            Size: {result.size ? `${(result.size / 1024).toFixed(1)} KB` : 'Unknown'}
                          </span>
                          {result.created_at && (
                            <span>
                              Created: {new Date(result.created_at).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                        {result.content && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-md">
                            <p className="text-sm text-gray-700">
                              {result.content.substring(0, 200)}
                              {result.content.length > 200 && '...'}
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="ml-4 flex space-x-2">
                        {result.download_url && (
                          <a
                            href={result.download_url}
                            download
                            className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                          >
                            Download
                          </a>
                        )}
                        {result.view_url && (
                          <a
                            href={result.view_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                          >
                            View
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
