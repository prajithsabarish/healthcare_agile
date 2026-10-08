import React, { useState } from 'react';
import { Users, Shield, UserPlus, Mail, Award, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const demoUsers = [
  { id: 1, name: 'Dr. Sarah Chen', email: 'scrummaster@healthflow.com', role: 'Scrum Master', department: 'Clinical IT' },
  { id: 2, name: 'Admin Root', email: 'admin@healthflow.com', role: 'Admin', department: 'Operations' },
  { id: 3, name: 'Alex Kumar', email: 'alex@healthflow.com', role: 'Team Member', department: 'Full Stack Engineering' },
  { id: 4, name: 'Dr. Michael Hayes', email: 'michael@healthflow.com', role: 'Team Member', department: 'Clinical QA' }
];

const UserManagement = () => {
  const { user } = useAuth();
  const [usersList, setUsersList] = useState(demoUsers);
  const [showAdd, setShowAdd] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'Team Member', department: 'Engineering' });

  const handleAdd = (e) => {
    e.preventDefault();
    setUsersList([...usersList, { ...newUser, id: Date.now() }]);
    setNewUser({ name: '', email: '', role: 'Team Member', department: 'Engineering' });
    setShowAdd(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-healthcare-dark">Agile Team & Access Management</h1>
          <p className="text-sm text-gray-500">Manage healthcare Scrum team members and role-based permissions</p>
        </div>

        <button
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center px-4 py-2 bg-healthcare-teal text-white rounded-lg hover:bg-healthcare-blue transition-colors text-sm font-medium shadow-sm"
        >
          <UserPlus size={16} className="mr-1.5" />
          Add Team Member
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleAdd} className="bg-white p-5 rounded-xl border border-teal-200 shadow-md space-y-4">
          <h3 className="font-semibold text-healthcare-dark text-base">Register New Healthcare Team Member</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                className="w-full border rounded-lg p-2 text-sm"
                placeholder="Dr. Jordan Lee"
                value={newUser.name}
                onChange={e => setNewUser({ ...newUser, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Email</label>
              <input
                type="email"
                required
                className="w-full border rounded-lg p-2 text-sm"
                placeholder="jordan@healthflow.com"
                value={newUser.email}
                onChange={e => setNewUser({ ...newUser, email: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Role</label>
              <select
                className="w-full border rounded-lg p-2 text-sm"
                value={newUser.role}
                onChange={e => setNewUser({ ...newUser, role: e.target.value })}
              >
                <option value="Team Member">Team Member</option>
                <option value="Scrum Master">Scrum Master</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Department</label>
              <input
                type="text"
                className="w-full border rounded-lg p-2 text-sm"
                placeholder="Clinical Informatics"
                value={newUser.department}
                onChange={e => setNewUser({ ...newUser, department: e.target.value })}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAdd(false)}
              className="px-4 py-2 border rounded-lg text-sm text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-healthcare-teal text-white rounded-lg text-sm font-semibold hover:bg-healthcare-blue"
            >
              Save Member
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 border-b text-xs font-bold uppercase text-gray-500">
              <tr>
                <th className="px-6 py-3.5">Name</th>
                <th className="px-6 py-3.5">Email</th>
                <th className="px-6 py-3.5">Scrum Role</th>
                <th className="px-6 py-3.5">Department</th>
                <th className="px-6 py-3.5">Access Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {usersList.map(u => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-semibold text-healthcare-dark flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs">
                      {u.name.charAt(0)}
                    </div>
                    <span>{u.name}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{u.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      u.role === 'Admin' ? 'bg-purple-100 text-purple-700' :
                      u.role === 'Scrum Master' ? 'bg-teal-100 text-teal-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{u.department}</td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
                      <CheckCircle size={14} /> Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
