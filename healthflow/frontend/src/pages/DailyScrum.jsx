import React, { useState } from 'react';
import { Clock, Plus, AlertOctagon, CheckCircle2, User, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const initialStandups = [
  {
    id: 1,
    member: 'Sarah Chen',
    role: 'Scrum Master',
    date: 'Today, 09:30 AM',
    yesterday: 'Facilitated sprint planning for EHR FHIR integration milestone and cleared backlog blockers.',
    today: 'Coordinating with clinical compliance team regarding HIPAA audit logs.',
    blockers: 'None.',
    hasBlocker: false
  },
  {
    id: 2,
    member: 'Dr. Michael Hayes',
    role: 'Clinical Product Specialist',
    date: 'Today, 09:35 AM',
    yesterday: 'Reviewed user story acceptance criteria for patient prescription auto-refill workflow.',
    today: 'Validating drug-to-drug interaction allergy warning alerts with cardiology team.',
    blockers: 'Awaiting updated NDC drug terminology database API key from vendor.',
    hasBlocker: true
  },
  {
    id: 3,
    member: 'Alex Kumar',
    role: 'Senior Fullstack Engineer',
    date: 'Today, 09:40 AM',
    yesterday: 'Implemented JWT token refresh and role-based permissions for doctor portal.',
    today: 'Connecting MySQL sprint burn-down telemetry and automated test suites.',
    blockers: 'None.',
    hasBlocker: false
  }
];

const DailyScrum = () => {
  const { user } = useAuth();
  const [standups, setStandups] = useState(initialStandups);
  const [showModal, setShowModal] = useState(false);
  const [newEntry, setNewEntry] = useState({
    yesterday: '',
    today: '',
    blockers: ''
  });

  const handleAddStandup = (e) => {
    e.preventDefault();
    const entry = {
      id: Date.now(),
      member: user?.name || 'Healthcare Engineer',
      role: user?.role || 'Team Member',
      date: 'Just now',
      yesterday: newEntry.yesterday,
      today: newEntry.today,
      blockers: newEntry.blockers || 'None.',
      hasBlocker: newEntry.blockers.trim().length > 0 && newEntry.blockers.toLowerCase() !== 'none'
    };
    setStandups([entry, ...standups]);
    setNewEntry({ yesterday: '', today: '', blockers: '' });
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-healthcare-dark">Daily Scrum Standup</h1>
          <p className="text-sm text-gray-500">15-minute daily synchronization for healthcare agile development</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center px-4 py-2 bg-healthcare-teal text-white rounded-lg hover:bg-healthcare-blue transition-colors text-sm font-medium shadow-sm"
        >
          <Plus size={16} className="mr-1.5" />
          Log Today's Standup
        </button>
      </div>

      {/* Standup Rule Guideline Banner */}
      <div className="bg-gradient-to-r from-teal-50 to-blue-50 border border-teal-200 rounded-xl p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-teal-600 text-white rounded-lg">
            <Clock size={20} />
          </div>
          <div>
            <h4 className="font-semibold text-healthcare-dark text-sm">Ceremony Timebox: 15 Minutes</h4>
            <p className="text-xs text-gray-600">Answer 3 questions: What did you do? What will you do? Any clinical or technical blockers?</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-2 text-xs font-semibold text-teal-800 bg-white/80 px-3 py-1.5 rounded-full border border-teal-200">
          <ShieldCheck size={16} className="text-teal-600" />
          HIPAA & Clinical Safety Priority
        </div>
      </div>

      {/* Modal / Form */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-gray-100">
            <h3 className="text-lg font-bold text-healthcare-dark mb-4">Post Daily Standup Log</h3>
            <form onSubmit={handleAddStandup} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">1. What did you accomplish yesterday?</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Completed unit tests for patient vitals ingestion API..."
                  className="w-full border rounded-lg p-2.5 text-sm focus:ring-healthcare-teal focus:border-healthcare-teal"
                  value={newEntry.yesterday}
                  onChange={e => setNewEntry({ ...newEntry, yesterday: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">2. What will you work on today?</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Wiring FHIR patient encounter payload to Postgres database..."
                  className="w-full border rounded-lg p-2.5 text-sm focus:ring-healthcare-teal focus:border-healthcare-teal"
                  value={newEntry.today}
                  onChange={e => setNewEntry({ ...newEntry, today: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">3. Any blockers or clinical impediments?</label>
                <input
                  type="text"
                  placeholder="Leave blank or write 'None' if unobstructed..."
                  className="w-full border rounded-lg p-2.5 text-sm focus:ring-healthcare-teal focus:border-healthcare-teal"
                  value={newEntry.blockers}
                  onChange={e => setNewEntry({ ...newEntry, blockers: e.target.value })}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded-lg text-sm text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-healthcare-teal text-white rounded-lg text-sm font-semibold hover:bg-healthcare-blue"
                >
                  Publish Standup
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Standup Log Feed */}
      <div className="space-y-4">
        {standups.map(entry => (
          <div key={entry.id} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm space-y-3">
            <div className="flex justify-between items-center pb-2 border-b">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-teal-100 text-healthcare-teal flex items-center justify-center font-bold text-sm">
                  {entry.member.charAt(0)}
                </div>
                <div>
                  <h4 className="font-semibold text-healthcare-dark text-sm">{entry.member}</h4>
                  <span className="text-xs text-gray-400">{entry.role} • {entry.date}</span>
                </div>
              </div>

              {entry.hasBlocker ? (
                <span className="flex items-center gap-1.5 text-xs font-semibold text-red-700 bg-red-50 border border-red-200 px-2.5 py-1 rounded-full">
                  <AlertOctagon size={14} />
                  Impediment Reported
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                  <CheckCircle2 size={14} />
                  On Track
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Yesterday</span>
                <p className="text-healthcare-dark text-xs leading-relaxed">{entry.yesterday}</p>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                <span className="text-xs font-bold text-teal-700 uppercase tracking-wider block mb-1">Today</span>
                <p className="text-healthcare-dark text-xs leading-relaxed">{entry.today}</p>
              </div>

              <div className={`p-3 rounded-lg border ${entry.hasBlocker ? 'bg-red-50/50 border-red-100' : 'bg-gray-50 border-gray-100'}`}>
                <span className={`text-xs font-bold uppercase tracking-wider block mb-1 ${entry.hasBlocker ? 'text-red-700' : 'text-gray-500'}`}>
                  Blockers
                </span>
                <p className={`text-xs leading-relaxed ${entry.hasBlocker ? 'text-red-800 font-medium' : 'text-gray-500'}`}>
                  {entry.blockers}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DailyScrum;
