import React, { useState, useEffect } from 'react';
import { getProjects } from '../services/projectService';
import ProjectCard from '../components/ProjectCard';
import { Plus, Search, Activity } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ProjectsDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getProjects();
        setProjects(data);
      } catch (error) {
        console.error("Failed to fetch projects", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-healthcare-dark">Projects Dashboard</h1>
          <p className="text-sm text-gray-500">Manage all agile healthcare projects</p>
        </div>
        
        {user?.role === 'Admin' && (
          <button className="flex items-center px-4 py-2 bg-healthcare-teal text-white rounded-md hover:bg-healthcare-blue transition-colors shadow-sm">
            <Plus size={16} className="mr-2" />
            New Project
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-gray-500">Active Projects</p>
                <h4 className="text-2xl font-bold text-healthcare-dark">{projects.filter(p => p.status === 'Active').length}</h4>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-full">
                <Activity size={20} />
            </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex items-center mb-6">
        <Search className="text-gray-400 mr-2" size={20} />
        <input 
          type="text" 
          placeholder="Search projects..." 
          className="w-full focus:outline-none text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-healthcare-teal"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
          {filteredProjects.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-500">
              No projects found.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectsDashboard;
