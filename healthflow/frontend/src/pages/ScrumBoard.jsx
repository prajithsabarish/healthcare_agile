import React, { useState, useEffect } from 'react';
import { getProjects } from '../services/projectService';
import { getStoriesByProject, updateStoryStatus } from '../services/storyService';
import { AlertCircle, Clock, CheckCircle2, PlayCircle, ShieldAlert } from 'lucide-react';

const BoardColumn = ({ title, status, stories, onMoveStory, icon, colorClass }) => {
  return (
    <div className="bg-gray-50 rounded-lg p-3 min-w-[300px] flex-shrink-0 flex flex-col h-full border border-gray-200">
      <div className={`flex items-center mb-3 pb-2 border-b ${colorClass}`}>
        {icon}
        <h3 className="font-semibold ml-2">{title}</h3>
        <span className="ml-auto bg-white px-2 py-0.5 rounded-full text-xs border border-gray-200 text-gray-500">
          {stories.length}
        </span>
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-3">
        {stories.map(story => (
          <div key={story.id} className="bg-white p-3 rounded shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-grab">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold text-gray-500">US-{story.id}</span>
              <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                story.priority === 'Critical' ? 'bg-red-100 text-red-700' :
                story.priority === 'High' ? 'bg-orange-100 text-orange-700' :
                story.priority === 'Medium' ? 'bg-blue-100 text-blue-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {story.priority}
              </span>
            </div>
            <p className="text-sm text-healthcare-dark font-medium mb-3 line-clamp-2">{story.title}</p>
            <div className="flex justify-between items-center text-xs text-gray-500">
              <div className="w-6 h-6 rounded-full bg-healthcare-light border border-gray-200 flex items-center justify-center font-semibold text-healthcare-teal">
                {story.story_points}
              </div>
              <select 
                value={story.status}
                onChange={(e) => onMoveStory(story.id, e.target.value)}
                className="bg-transparent border-none text-xs text-healthcare-teal font-medium focus:ring-0 cursor-pointer"
              >
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Testing">Testing</option>
                <option value="Done">Done</option>
                <option value="Blocked">Blocked</option>
              </select>
            </div>
          </div>
        ))}
        {stories.length === 0 && (
          <div className="h-20 flex items-center justify-center border-2 border-dashed border-gray-200 rounded text-gray-400 text-sm">
            Drop tasks here
          </div>
        )}
      </div>
    </div>
  );
};

const ScrumBoard = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(false);

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
      // For demo purposes, we filter only stories in the active sprint.
      // Assuming sprint_id IS NOT NULL for now.
      setStories(sData.filter(s => s.sprint_id !== null)); 
      setLoading(false);
    };
    fetchStories();
  }, [selectedProjectId]);

  const handleMoveStory = async (storyId, newStatus) => {
    // Optimistic update
    setStories(prev => prev.map(s => s.id === storyId ? { ...s, status: newStatus } : s));
    try {
      await updateStoryStatus(selectedProjectId, storyId, newStatus);
    } catch (err) {
      console.error("Failed to move story", err);
      // Revert if API fails (simplification for demo)
    }
  };

  const columns = [
    { title: 'To Do', status: 'To Do', icon: <Clock size={16} />, color: 'text-gray-600 border-gray-200' },
    { title: 'In Progress', status: 'In Progress', icon: <PlayCircle size={16} />, color: 'text-blue-600 border-blue-200' },
    { title: 'Testing', status: 'Testing', icon: <AlertCircle size={16} />, color: 'text-purple-600 border-purple-200' },
    { title: 'Done', status: 'Done', icon: <CheckCircle2 size={16} />, color: 'text-green-600 border-green-200' },
    { title: 'Blocked', status: 'Blocked', icon: <ShieldAlert size={16} />, color: 'text-red-600 border-red-200' },
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-healthcare-dark">Scrum Board</h1>
          <p className="text-sm text-gray-500">Active Sprint Board</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <label className="text-sm font-medium text-gray-700">Project:</label>
          <select 
            className="border-gray-300 rounded-md shadow-sm focus:ring-healthcare-teal focus:border-healthcare-teal text-sm py-2 px-3"
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
          >
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto pb-4">
        {loading ? (
           <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-healthcare-teal"></div></div>
        ) : (
          <div className="flex space-x-4 h-full items-stretch min-h-[500px]">
            {columns.map(col => (
              <BoardColumn 
                key={col.status}
                title={col.title}
                status={col.status}
                stories={stories.filter(s => s.status === col.status)}
                onMoveStory={handleMoveStory}
                icon={col.icon}
                colorClass={col.color}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ScrumBoard;
