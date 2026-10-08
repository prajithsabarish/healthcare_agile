import React, { useState, useEffect } from 'react';
import { getProjects } from '../services/projectService';
import { getSprintsByProject } from '../services/sprintService';
import { getProjectVelocity, getSprintBurndown } from '../services/analyticsService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, LineChart, Line, ResponsiveContainer } from 'recharts';
import { Activity, Target, TrendingUp, AlertTriangle } from 'lucide-react';

const AnalyticsDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [sprints, setSprints] = useState([]);
  const [selectedSprintId, setSelectedSprintId] = useState('');
  
  const [velocityData, setVelocityData] = useState([]);
  const [burndownData, setBurndownData] = useState(null);
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
    const fetchSprintsAndAnalytics = async () => {
      setLoading(true);
      const sData = await getSprintsByProject(selectedProjectId);
      setSprints(sData);
      
      if (sData.length > 0) {
          // Find active or latest sprint for burndown
          const activeSprint = sData.find(s => s.status === 'Active') || sData[sData.length - 1];
          setSelectedSprintId(activeSprint.id);
          
          // Fetch Burndown
          const bData = await getSprintBurndown(selectedProjectId, activeSprint.id);
          setBurndownData(bData);
      }
      
      // Fetch Velocity
      const vData = await getProjectVelocity(selectedProjectId);
      // Format velocity for chart
      const formattedVData = vData.map((v, index) => ({
          name: v.name || `Sprint ${index + 1}`,
          points: parseInt(v.points, 10)
      }));
      setVelocityData(formattedVData);
      
      setLoading(false);
    };
    fetchSprintsAndAnalytics();
  }, [selectedProjectId]);

  const handleSprintChange = async (e) => {
      const sId = e.target.value;
      setSelectedSprintId(sId);
      if (sId && selectedProjectId) {
          const bData = await getSprintBurndown(selectedProjectId, sId);
          setBurndownData(bData);
      }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-healthcare-dark">Analytics Dashboard</h1>
          <p className="text-sm text-gray-500">Agile performance metrics and tracking</p>
        </div>
        
        <div className="flex items-center space-x-3">
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

      {loading ? (
        <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-healthcare-teal"></div></div>
      ) : (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-gray-500">Avg Velocity</p>
                    <TrendingUp size={18} className="text-healthcare-blue" />
                </div>
                <h4 className="text-2xl font-bold text-healthcare-dark">
                    {velocityData.length > 0 ? Math.round(velocityData.reduce((acc, curr) => acc + curr.points, 0) / velocityData.length) : 0} pts
                </h4>
            </div>
            
            <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-gray-500">Total Sprints</p>
                    <Activity size={18} className="text-healthcare-teal" />
                </div>
                <h4 className="text-2xl font-bold text-healthcare-dark">{sprints.length}</h4>
            </div>

            <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-gray-500">Completion Rate</p>
                    <Target size={18} className="text-green-500" />
                </div>
                <h4 className="text-2xl font-bold text-healthcare-dark">
                    {burndownData?.totalPoints ? Math.round((burndownData.completedPoints / burndownData.totalPoints) * 100) : 0}%
                </h4>
            </div>

            <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-gray-500">Blocked Stories</p>
                    <AlertTriangle size={18} className="text-red-500" />
                </div>
                <h4 className="text-2xl font-bold text-healthcare-dark">3</h4>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {/* Velocity Chart */}
            <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="text-lg font-semibold text-healthcare-dark mb-4">Team Sprint Velocity</h3>
                <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={velocityData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
                            <RechartsTooltip cursor={{ fill: '#F1F5F9' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                            <Legend />
                            <Bar dataKey="points" name="Completed Points" fill="#0A66C2" radius={[4, 4, 0, 0]} barSize={40} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Burndown Chart */}
            <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-healthcare-dark">Sprint Burndown</h3>
                    <select 
                        className="border-gray-300 rounded shadow-sm focus:ring-healthcare-teal focus:border-healthcare-teal text-xs py-1 px-2"
                        value={selectedSprintId}
                        onChange={handleSprintChange}
                    >
                        {sprints.map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                    </select>
                </div>
                <div className="h-72">
                    {burndownData && burndownData.chartData ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={burndownData.chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
                                <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                <Legend />
                                <Line type="monotone" dataKey="ideal" name="Ideal Remaining" stroke="#94A3B8" strokeWidth={2} dot={false} strokeDasharray="5 5" />
                                <Line type="monotone" dataKey="actual" name="Actual Remaining" stroke="#0097A7" strokeWidth={3} dot={{ r: 4, fill: '#0097A7', strokeWidth: 0 }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-full flex items-center justify-center text-gray-400 text-sm">No data available for this sprint</div>
                    )}
                </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AnalyticsDashboard;
