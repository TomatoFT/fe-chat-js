import React, { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { testApiConnection } from '../../lib/test-api';
import { useDocuments } from '../../hooks/useDocuments';
import { useChatSessions } from '../../hooks/useChat';
import { useUsers } from '../../hooks/useUsers';
import { useDashboardStats, useSystemStats, useRecentActivity, useDocumentStats, useUserStats } from '../../hooks/useStatistics';

export const Dashboard: React.FC = () => {
  const { user, loading: userLoading } = useAuth();
  const { data: documents, isLoading: documentsLoading } = useDocuments();
  const { data: chatSessions, isLoading: sessionsLoading } = useChatSessions();
  const { data: users, isLoading: usersLoading } = useUsers({ skip: 0, limit: 5 });
  
  // New statistics hooks
  const { data: dashboardStats, isLoading: statsLoading } = useDashboardStats();
  const { data: systemStats, isLoading: systemLoading } = useSystemStats();
  const { data: activityStats } = useRecentActivity();
  const { data: documentStats } = useDocumentStats();
  const { data: userStats } = useUserStats();

  // Test API connection on component mount
  useEffect(() => {
    testApiConnection();
  }, []);

  // Enhanced stats with real API data
  const stats = [
    {
      name: 'Total Documents',
      value: dashboardStats?.totalDocuments ?? (Array.isArray(documents) ? documents.length : 0),
      icon: '📄',
      color: 'bg-blue-500',
      loading: statsLoading || documentsLoading,
      subtitle: documentStats ? `${documentStats.ready} ready, ${documentStats.processing} processing` : '',
    },
    {
      name: 'Chat Sessions',
      value: dashboardStats?.totalSessions ?? (Array.isArray(chatSessions) ? chatSessions.length : 0),
      icon: '💬',
      color: 'bg-green-500',
      loading: statsLoading || sessionsLoading,
      subtitle: dashboardStats?.messagesThisWeek ? `${dashboardStats.messagesThisWeek} messages this week` : '',
    },
    {
      name: 'Total Users',
      value: dashboardStats?.totalUsers ?? (Array.isArray(users) ? users.length : 0),
      icon: '👥',
      color: 'bg-purple-500',
      loading: statsLoading || usersLoading,
      subtitle: userStats ? `${userStats.active} active, ${userStats.inactive} inactive` : '',
    },
    {
      name: 'System Status',
      value: systemStats?.status || 'Healthy',
      icon: '⚡',
      color: systemStats?.status === 'healthy' ? 'bg-green-500' : 'bg-red-500',
      loading: systemLoading,
      subtitle: systemStats?.uptime ? `Uptime: ${systemStats.uptime}` : '',
    },
  ];

  if (userLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.name || 'User'}!
        </h1>
        <p className="text-gray-600">
          Here's what's happening with your EduStats system today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className={`${stat.color} rounded-lg p-3 mr-4`}>
                <span className="text-2xl">{stat.icon}</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                {stat.loading ? (
                  <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
                ) : (
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                )}
                {stat.subtitle && (
                  <p className="text-xs text-gray-500 mt-1">{stat.subtitle}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Documents */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Recent Documents</h2>
        </div>
        <div className="p-6">
          {documentsLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 h-4 w-3/4 rounded mb-2"></div>
                  <div className="bg-gray-200 h-3 w-1/2 rounded"></div>
                </div>
              ))}
            </div>
          ) : Array.isArray(documents) && documents.length > 0 ? (
            <div className="space-y-3">
              {documents.slice(0, 5).map((doc: any) => (
                <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{doc.title || doc.filename}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(doc.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {doc.status || 'Processed'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500">No documents yet</div>
          )}
        </div>
      </div>

      {/* Recent Chat Sessions */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Recent Chat Sessions</h2>
        </div>
        <div className="p-6">
          {sessionsLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 h-4 w-3/4 rounded mb-2"></div>
                  <div className="bg-gray-200 h-3 w-1/2 rounded"></div>
                </div>
              ))}
            </div>
          ) : Array.isArray(chatSessions) && chatSessions.length > 0 ? (
            <div className="space-y-3">
              {chatSessions.slice(0, 5).map((session: any) => (
                <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{session.title || 'Untitled Chat'}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(session.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                    {session.message_count || 0} messages
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500">No chat sessions yet</div>
          )}
        </div>
      </div>

      {/* Recent Users (Admin and Department Manager only) */}
      {(user?.role === 'admin' || user?.role === 'department_manager') && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Recent Users</h2>
          </div>
          <div className="p-6">
            {usersLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 h-4 w-3/4 rounded mb-2"></div>
                    <div className="bg-gray-200 h-3 w-1/2 rounded"></div>
                  </div>
                ))}
              </div>
            ) : Array.isArray(users) && users.length > 0 ? (
              <div className="space-y-3">
                {users.slice(0, 5).map((user: any) => (
                  <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                    <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                      {user.role?.name || 'User'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500">No users yet</div>
            )}
          </div>
        </div>
      )}

      {/* System Analytics */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">System Analytics</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {activityStats?.documentsUploaded || 0}
              </div>
              <div className="text-sm text-gray-500">Documents This Week</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {activityStats?.messagesSent || 0}
              </div>
              <div className="text-sm text-gray-500">Messages This Week</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {activityStats?.recentLogins || 0}
              </div>
              <div className="text-sm text-gray-500">Recent Logins</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {systemStats?.activeUsers || 0}
              </div>
              <div className="text-sm text-gray-500">Active Users</div>
            </div>
          </div>
        </div>
      </div>

      {/* Document Status Breakdown */}
      {documentStats && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Document Status</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{documentStats.ready || 0}</div>
                <div className="text-sm text-gray-500">Ready</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-600">{documentStats.processing || 0}</div>
                <div className="text-sm text-gray-500">Processing</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600">{documentStats.error || 0}</div>
                <div className="text-sm text-gray-500">Error</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/chat"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="text-2xl mr-3">💬</div>
            <div>
              <p className="font-medium text-gray-900">Start Chat</p>
              <p className="text-sm text-gray-500">Begin a new conversation</p>
            </div>
          </a>
          <a
            href="/documents"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="text-2xl mr-3">📄</div>
            <div>
              <p className="font-medium text-gray-900">Upload Document</p>
              <p className="text-sm text-gray-500">Add new documents</p>
            </div>
          </a>
          <a
            href="/search"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="text-2xl mr-3">🔍</div>
            <div>
              <p className="font-medium text-gray-900">Search Documents</p>
              <p className="text-sm text-gray-500">Find information quickly</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};