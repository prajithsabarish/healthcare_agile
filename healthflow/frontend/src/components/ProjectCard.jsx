import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, Activity } from 'lucide-react';

const ProjectCard = ({ project }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <div className="p-5 border-b border-gray-100">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-healthcare-dark truncate">{project.name}</h3>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
            project.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
          }`}>
            {project.status}
          </span>
        </div>
        <p className="text-sm text-gray-500 line-clamp-2 mt-1 mb-4 h-10">
          {project.description}
        </p>
        
        <div className="flex items-center text-xs text-gray-500 space-x-4 mb-4">
          <div className="flex items-center">
            <Calendar size={14} className="mr-1 text-healthcare-teal" />
            {new Date(project.start_date).toLocaleDateString()}
          </div>
          <div className="flex items-center">
            <Activity size={14} className="mr-1 text-healthcare-blue" />
            Active Sprint
          </div>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2">
          <div className="bg-healthcare-teal h-1.5 rounded-full" style={{ width: '45%' }}></div>
        </div>
        <div className="text-xs text-gray-500 text-right">45% Complete</div>
      </div>
      
      <div className="px-5 py-3 bg-gray-50 flex justify-between items-center">
        <div className="flex -space-x-2">
          <div className="w-6 h-6 rounded-full bg-blue-100 border border-white flex justify-center items-center text-xs text-blue-600 font-bold">A</div>
          <div className="w-6 h-6 rounded-full bg-green-100 border border-white flex justify-center items-center text-xs text-green-600 font-bold">B</div>
          <div className="w-6 h-6 rounded-full bg-purple-100 border border-white flex justify-center items-center text-xs text-purple-600 font-bold">C</div>
        </div>
        <Link 
          to={`/projects/${project.id}`}
          className="text-sm font-medium text-healthcare-teal hover:text-healthcare-blue transition-colors"
        >
          View Project &rarr;
        </Link>
      </div>
    </div>
  );
};

export default ProjectCard;
