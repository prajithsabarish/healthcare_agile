import React, { useState, useEffect } from 'react';
import { getProjects } from '../services/projectService';
import { getStoriesByProject } from '../services/storyService';
import { Plus, Filter, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ProductBacklog = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const isScrumMaster = user?.role === 'Scrum Master' || user?.role === 'Admin';

  useEffect(() => {
    const fetchInit = async () => {
      const pData = await getProjects();
      setProjects(pData);
      if (pData.length > 0) {
        setSelectedProjectId(pData[0].id);
      }
    };
    fetchInit();
  }, []);

  useEffect(() => {
    if (!selectedProjectId) return;
    const fetchStories = async () => {
      setLoading(true);
      const sData = await getStoriesByProject(selectedProjectId);
      // Filter out stories that are done (for backlog) or just show all
      setStories(sData);
      setLoading(false);
    };
    fetchStories();
  }, [selectedProjectId]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-healthcare-dark">Product Backlog</h1>
          <p className="text-sm text-gray-500">Manage user stories and prioritize work</p>
        </div>
        
        <div className="flex items-center space-x-4">
            <select 
                className="border-gray-300 rounded-md shadow-sm focus:ring-healthcare-teal focus:border-healthcare-teal text-sm py-2 px-3"
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
            >
                {projects.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
                ))}
            </select>

            {isScrumMaster && (
            <button className="flex items-center px-4 py-2 bg-healthcare-teal text-white rounded-md hover:bg-healthcare-blue transition-colors shadow-sm">
                <Plus size={16} className="mr-2" />
                Add Story
            </button>
            )}
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex items-center justify-between">
        <div className="flex-1 flex items-center mr-4">
            <Search className="text-gray-400 mr-2" size={20} />
            <input 
            type="text" 
            placeholder="Search stories..." 
            className="w-full focus:outline-none text-sm"
            />
        </div>
        <div className="flex space-x-2">
            <button className="flex items-center px-3 py-1.5 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50">
                <Filter size={14} className="mr-1" /> Filter
            </button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
           <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-healthcare-teal"></div></div>
        ) : (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Story</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Points</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sprint</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {stories.map((story) => (
              <tr key={story.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">US-{story.id}</td>
                <td className="px-6 py-4 text-sm text-gray-500 max-w-md truncate">{story.title}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    story.priority === 'Critical' ? 'bg-red-100 text-red-800' :
                    story.priority === 'High' ? 'bg-orange-100 text-orange-800' :
                    story.priority === 'Medium' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {story.priority}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="w-6 h-6 rounded-full bg-healthcare-light border border-gray-200 flex items-center justify-center font-semibold text-healthcare-teal">
                        {story.story_points}
                    </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{story.status}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {story.sprint_id ? `Sprint ${story.sprint_id}` : 'Backlog'}
                </td>
              </tr>
            ))}
            {stories.length === 0 && (
                <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-sm text-gray-500">
                        No stories found in the backlog.
                    </td>
                </tr>
            )}
          </tbody>
        </table>
        )}
      </div>
    </div>
  );
};

export default ProductBacklog;
