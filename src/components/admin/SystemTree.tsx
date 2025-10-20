import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronDown, Building2, School, Users, Plus, Edit, Trash2, Eye } from 'lucide-react';
import { useProvinces, useSchools } from '../../hooks/useUsers';
import { useUsers } from '../../hooks/useUsers';

interface TreeNode {
  id: string;
  name: string;
  type: 'deputy' | 'province' | 'school';
  children?: TreeNode[];
  usersCount?: number;
  expanded?: boolean;
}

const SystemTree: React.FC = () => {
  // Fetch real data from APIs
  const { data: provinces, isLoading: provincesLoading } = useProvinces();
  const { data: schools, isLoading: schoolsLoading } = useSchools();
  const { data: users, isLoading: usersLoading } = useUsers({ skip: 0, limit: 1000 });

  // Build tree data from API responses
  const buildTreeData = (): TreeNode[] => {
    if (!provinces || !schools) return [];

    const treeData: TreeNode[] = [{
      id: 'deputy-1',
      name: 'National Education System',
      type: 'deputy',
      expanded: true,
      children: provinces.map((province: any) => ({
        id: province.id,
        name: province.name,
        type: 'province' as const,
        usersCount: users?.filter((user: any) => user.provinceId === province.id).length || 0,
        expanded: false,
        children: schools
          ?.filter((school: any) => school.provinceId === province.id)
          .map((school: any) => ({
            id: school.id,
            name: school.name,
            type: 'school' as const,
            usersCount: users?.filter((user: any) => user.schoolId === school.id).length || 0,
          })) || [],
      })),
    }];

    return treeData;
  };

  const [treeData, setTreeData] = useState<TreeNode[]>([]);

  // Update tree data when API data changes
  React.useEffect(() => {
    if (provinces && schools) {
      setTreeData(buildTreeData());
    }
  }, [provinces, schools, users]);

  if (provincesLoading || schoolsLoading || usersLoading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600">Loading system tree...</div>
        </div>
      </div>
    );
  }

  const toggleNode = (nodeId: string, path: number[] = []) => {
    setTreeData(prevData => {
      const newData = [...prevData];
      let current: TreeNode[] = newData;
      
      // Navigate to the parent of the target node
      for (let i = 0; i < path.length; i++) {
        current = current[path[i]].children!;
      }
      
      // Find and toggle the target node
      const nodeIndex = current.findIndex(node => node.id === nodeId);
      if (nodeIndex !== -1) {
        current[nodeIndex] = {
          ...current[nodeIndex],
          expanded: !current[nodeIndex].expanded
        };
      }
      
      return newData;
    });
  };

  const getNodeIcon = (type: string, expanded?: boolean) => {
    switch (type) {
      case 'deputy':
        return expanded ? ChevronDown : ChevronRight;
      case 'province':
        return Building2;
      case 'school':
        return School;
      default:
        return Building2;
    }
  };

  const getNodeColor = (type: string) => {
    switch (type) {
      case 'deputy':
        return 'purple';
      case 'province':
        return 'blue';
      case 'school':
        return 'green';
      default:
        return 'gray';
    }
  };

  const TreeNodeComponent: React.FC<{
    node: TreeNode;
    level: number;
    path: number[];
    index: number;
  }> = ({ node, level, path, index }) => {
    const hasChildren = node.children && node.children.length > 0;
    const Icon = getNodeIcon(node.type, node.expanded);
    const color = getNodeColor(node.type);
    const currentPath = [...path, index];

    return (
      <div>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: level * 0.1 }}
          className={`flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer group`}
          style={{ marginLeft: `${level * 24}px` }}
          onClick={() => hasChildren && toggleNode(node.id, path)}
        >
          <div className="flex items-center gap-2 flex-1">
            {hasChildren ? (
              <motion.div
                animate={{ rotate: node.expanded ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </motion.div>
            ) : (
              <div className="w-4 h-4" />
            )}
            
            <div className={`w-8 h-8 bg-${color}-100 rounded-lg flex items-center justify-center`}>
              <Icon className={`w-4 h-4 text-${color}-600`} />
            </div>
            
            <div className="flex-1">
              <h3 className="font-medium text-gray-900">{node.name}</h3>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                {node.usersCount !== undefined && (
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {node.usersCount} users
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
              <Eye className="w-3 h-3" />
            </button>
            <button className="p-1 text-green-600 hover:bg-green-50 rounded">
              <Edit className="w-3 h-3" />
            </button>
            {node.type !== 'deputy' && (
              <button className="p-1 text-red-600 hover:bg-red-50 rounded">
                <Trash2 className="w-3 h-3" />
              </button>
            )}
            {node.type !== 'school' && (
              <button className="p-1 text-purple-600 hover:bg-purple-50 rounded">
                <Plus className="w-3 h-3" />
              </button>
            )}
          </div>
        </motion.div>

        <AnimatePresence>
          {hasChildren && node.expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              {node.children!.map((child, childIndex) => (
                <TreeNodeComponent
                  key={child.id}
                  node={child}
                  level={level + 1}
                  path={currentPath}
                  index={childIndex}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">System Tree View</h1>
        <p className="text-gray-600">Visual hierarchy of the entire educational system</p>
      </div>

      <div className="card">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Organizational Structure</h2>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-purple-100 rounded"></div>
                <span>Deputy</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-blue-100 rounded"></div>
                <span>Province</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-green-100 rounded"></div>
                <span>School</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-1">
          {treeData.map((node, index) => (
            <TreeNodeComponent
              key={node.id}
              node={node}
              level={0}
              path={[]}
              index={index}
            />
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Provinces</p>
              <p className="text-2xl font-bold text-gray-900">{provinces?.length || 0}</p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <School className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Schools</p>
              <p className="text-2xl font-bold text-gray-900">{schools?.length || 0}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemTree;