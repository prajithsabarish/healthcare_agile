import React, { useState, useEffect } from 'react';
import { getProjects } from '../services/projectService';
import { getSprintsByProject, createSprint } from '../services/sprintService';
import { getStoriesByProject } from '../services/storyService';
import { Calendar, CheckCircle2, Plus, Users, Target, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const SprintPlanning = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [sprints, setSprints] = useState([]);
  const [selectedSprintId, setSelectedSprintId] = useState('');
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateSprint, setShowCreateSprint] = useState(false);
  const [newSprint, setNewSprint] = useState({
    name: '',
    goal: '',
    start_date: '',
    end_date: '',
    capacity: 35
  });

  const { user } = useAuth();
  const isScrumMaster = user?.role === 'Scrum Master' || user?.role === 'Admin';

  useEffect(() => {
    const fetchInit = async () => {
      try {
        const pData = await getProjects();
        setProjects(pData);
        if (pData.length > 0) {
          setSelectedProjectId(pData[0].id);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchInit();
  }, []);

  useEffect(() => {
    if (!selectedProjectId) return;
    const loadData = async () => {
      setLoading(true);
      try {
        const [sprintList, storyList] = await Promise.all([
          getSprintsByProject(selectedProjectId),
          getStoriesByProject(selectedProjectId)
        ]);
        setSprints(sprintList);
        if (sprintList.length > 0) {
          setSelectedSprintId(sprintList[0].id);
        }
        setStories(storyList);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [selectedProjectId]);

  const handleCreateSprint = async (e) => {
    e.preventDefault();
    try {
      await createSprint(selectedProjectId, newSprint);
      const updatedSprints = await getSprintsByProject(selectedProjectId);
      setSprints(updatedSprints);
      setShowCreateSprint(false);
      setNewSprint({ name: '', goal: '', start_date: '', end_date: '', capacity: 35 });
    } catch (err) {
      console.error('Failed to create sprint', err);
    }
  };

  const selectedSprint = sprints.find(s => s.id == selectedSprintId) || sprints[0];
  const assignedStories = stories.filter(st => st.sprint_id == selectedSprintId);
  const unassignedStories = stories.filter(st => !st.sprint_id || st.sprint_id != selectedSprintId);

  const totalCommittedPoints = assignedStories.reduce((acc, curr) => acc + (parseInt(curr.story_points) || 0), 0);
  const sprintCapacity = 40;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-healthcare-dark">Sprint Planning Ceremony</h1>
          <p className="text-sm text-gray-500">Plan user story commitments and manage healthcare team capacity</p>
        </div>

        <div className="flex items-center gap-3">
          <select
            className="border border-gray-300 rounded-lg py-2 px-3 text-sm focus:ring-healthcare-teal focus:border-healthcare-teal bg-white"
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
          >
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          {isScrumMaster && (
            <button
              onClick={() => setShowCreateSprint(!showCreateSprint)}
              className="flex items-center px-4 py-2 bg-healthcare-teal text-white rounded-lg hover:bg-healthcare-blue transition-colors text-sm font-medium shadow-sm"
            >
              <Plus size={16} className="mr-1.5" />
              New Sprint
            </button>
          )}
        </div>
      </div>

      {showCreateSprint && (
        <form onSubmit={handleCreateSprint} className="bg-white p-5 rounded-xl border border-teal-200 shadow-md space-y-4">
          <h3 className="font-semibold text-healthcare-dark text-lg">Define New Sprint Target</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Sprint Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Sprint 4 - Patient Telehealth Portal"
                className="w-full border rounded-lg px-3 py-2 text-sm"
                value={newSprint.name}
                onChange={e => setNewSprint({ ...newSprint, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Sprint Goal</label>
              <input
                type="text"
                required
                placeholder="e.g. Deliver HIPAA-compliant video consultations"
                className="w-full border rounded-lg px-3 py-2 text-sm"
                value={newSprint.goal}
                onChange={e => setNewSprint({ ...newSprint, goal: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                required
                className="w-full border rounded-lg px-3 py-2 text-sm"
                value={newSprint.start_date}
                onChange={e => setNewSprint({ ...newSprint, start_date: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">End Date</label>
              <input
                type="date"
                required
                className="w-full border rounded-lg px-3 py-2 text-sm"
                value={newSprint.end_date}
                onChange={e => setNewSprint({ ...newSprint, end_date: e.target.value })}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowCreateSprint(false)}
              className="px-4 py-2 border rounded-lg text-sm text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-healthcare-teal text-white rounded-lg text-sm font-medium hover:bg-healthcare-blue"
            >
              Save Sprint
            </button>
          </div>
        </form>
      )}

      {/* Target Sprint Selector & Metrics Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Active Target Sprint</span>
            <Target size={18} className="text-healthcare-teal" />
          </div>
          <select
            className="w-full border rounded-lg py-2 px-3 text-sm font-semibold text-healthcare-dark bg-gray-50"
            value={selectedSprintId}
            onChange={(e) => setSelectedSprintId(e.target.value)}
          >
            {sprints.map(s => (
              <option key={s.id} value={s.id}>{s.name} ({s.status})</option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-2 italic">Goal: {selectedSprint?.goal || 'No goal specified'}</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Committed Story Points</span>
            <span className="text-xs font-bold text-healthcare-teal">{totalCommittedPoints} / {sprintCapacity} pts</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-3 mb-2 overflow-hidden">
            <div
              className={`h-3 rounded-full transition-all ${
                totalCommittedPoints > sprintCapacity ? 'bg-red-500' : 'bg-teal-500'
              }`}
              style={{ width: `${Math.min(100, (totalCommittedPoints / sprintCapacity) * 100)}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500">
            {totalCommittedPoints > sprintCapacity ? '⚠️ Capacity exceeded!' : 'Optimal velocity load for healthcare team'}
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Ceremony Schedule</span>
            <h4 className="text-sm font-bold text-healthcare-dark mt-1">2-Week Sprint Cadence</h4>
            <p className="text-xs text-gray-400 mt-0.5">Clinical QA & HIPAA Audit windows included</p>
          </div>
          <div className="p-3 bg-teal-50 rounded-full text-healthcare-teal">
            <Calendar size={22} />
          </div>
        </div>
      </div>

      {/* Two Column Planning Board: Product Backlog vs Sprint Backlog */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Unassigned / Product Backlog Stories */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col h-[520px]">
          <div className="flex justify-between items-center mb-4 pb-2 border-b">
            <h3 className="font-semibold text-healthcare-dark flex items-center gap-2">
              <span>Candidate User Stories</span>
              <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full text-gray-600 font-normal">{unassignedStories.length}</span>
            </h3>
            <span className="text-xs text-gray-400">Ready for refinement</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {unassignedStories.map(story => (
              <div key={story.id} className="p-3.5 border rounded-lg bg-gray-50 hover:bg-white hover:border-healthcare-teal transition-all flex justify-between items-start">
                <div className="space-y-1 pr-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-gray-500">US-{story.id}</span>
                    <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                      story.priority === 'Critical' ? 'bg-red-100 text-red-700' :
                      story.priority === 'High' ? 'bg-orange-100 text-orange-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {story.priority}
                    </span>
                  </div>
                  <h4 className="text-sm font-medium text-healthcare-dark">{story.title}</h4>
                  <p className="text-xs text-gray-500 line-clamp-1">{story.description}</p>
                </div>
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <span className="px-2 py-0.5 bg-white border rounded text-xs font-bold text-healthcare-teal">
                    {story.story_points} pts
                  </span>
                </div>
              </div>
            ))}
            {unassignedStories.length === 0 && (
              <p className="text-center text-sm text-gray-400 py-10">All backlog stories are assigned.</p>
            )}
          </div>
        </div>

        {/* Assigned to Current Sprint */}
        <div className="bg-white p-5 rounded-xl border border-teal-100 shadow-sm flex flex-col h-[520px]">
          <div className="flex justify-between items-center mb-4 pb-2 border-b">
            <h3 className="font-semibold text-healthcare-dark flex items-center gap-2">
              <CheckCircle2 size={18} className="text-teal-600" />
              <span>Sprint Backlog: {selectedSprint?.name || 'Current'}</span>
              <span className="text-xs bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full font-bold">{assignedStories.length}</span>
            </h3>
            <span className="text-xs font-bold text-healthcare-teal">{totalCommittedPoints} pts committed</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {assignedStories.map(story => (
              <div key={story.id} className="p-3.5 border border-teal-200 rounded-lg bg-teal-50/40 hover:bg-white transition-all flex justify-between items-start">
                <div className="space-y-1 pr-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-teal-700">US-{story.id}</span>
                    <span className="text-[10px] font-semibold bg-white border border-teal-200 text-teal-700 px-1.5 py-0.5 rounded">
                      {story.status}
                    </span>
                  </div>
                  <h4 className="text-sm font-medium text-healthcare-dark">{story.title}</h4>
                  <p className="text-xs text-gray-500 line-clamp-1">{story.acceptance_criteria || story.description}</p>
                </div>
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <span className="px-2 py-0.5 bg-teal-600 text-white rounded text-xs font-bold">
                    {story.story_points} pts
                  </span>
                </div>
              </div>
            ))}
            {assignedStories.length === 0 && (
              <div className="text-center py-16 text-gray-400">
                <p className="text-sm">No stories assigned to this sprint yet.</p>
                <p className="text-xs mt-1">Select stories from the candidate backlog to commit them.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SprintPlanning;
