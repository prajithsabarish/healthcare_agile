import React, { useState } from 'react';
import { Award, CheckCircle2, XCircle, FileText, Send, ShieldCheck, HeartHandshake } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const initialCriteria = [
  { id: 1, title: 'HIPAA Compliance & Audit Logging', status: 'Passed', verifiedBy: 'Chief Information Security Officer' },
  { id: 2, title: 'HL7 / FHIR Observation Integration', status: 'Passed', verifiedBy: 'Lead Healthcare Architect' },
  { id: 3, title: 'Emergency Room Vitals Alert Latency < 200ms', status: 'Passed', verifiedBy: 'Clinical QA' },
  { id: 4, title: 'Doctor E-Prescription Digital Signature Flow', status: 'Pending Review', verifiedBy: 'Chief Medical Officer' }
];

const SprintReview = () => {
  const { user } = useAuth();
  const [criteria, setCriteria] = useState(initialCriteria);
  const [feedback, setFeedback] = useState([
    {
      author: 'Dr. Evelyn Vance (Chief Medical Officer)',
      comment: 'The doctor vitals alert response is exceptionally clear and prevents alert fatigue. Approved for clinical pilot.',
      time: 'Yesterday at 4:15 PM'
    },
    {
      author: 'Marcus Brody (Product Owner)',
      comment: 'Sprint velocity reached 38 of 40 committed story points. Great work on the prescription workflow.',
      time: 'Today at 10:00 AM'
    }
  ]);
  const [newComment, setNewComment] = useState('');

  const toggleStatus = (id) => {
    setCriteria(criteria.map(c => {
      if (c.id === id) {
        return {
          ...c,
          status: c.status === 'Passed' ? 'Pending Review' : 'Passed'
        };
      }
      return c;
    }));
  };

  const handleAddFeedback = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setFeedback([
      ...feedback,
      {
        author: `${user?.name || 'Agile Reviewer'} (${user?.role || 'Team Member'})`,
        comment: newComment,
        time: 'Just now'
      }
    ]);
    setNewComment('');
  };

  const passedCount = criteria.filter(c => c.status === 'Passed').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-healthcare-dark">Sprint Review & Demo Ceremony</h1>
          <p className="text-sm text-gray-500">Demonstrate working healthcare software increments to clinical stakeholders</p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full border border-emerald-200 text-xs font-bold">
          <ShieldCheck size={16} />
          <span>Sprint 1 Increment: Accepted for Pilot</span>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Clinical Criteria Met</span>
            <h3 className="text-2xl font-bold text-healthcare-dark mt-1">{passedCount} / {criteria.length}</h3>
            <p className="text-xs text-gray-400 mt-1">Acceptance criteria pass rate</p>
          </div>
          <div className="p-3 bg-teal-50 text-healthcare-teal rounded-full">
            <Award size={24} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Velocity Realized</span>
            <h3 className="text-2xl font-bold text-teal-700 mt-1">38 Story Points</h3>
            <p className="text-xs text-gray-400 mt-1">Target was 40 SP (95% completion)</p>
          </div>
          <div className="p-3 bg-blue-50 text-healthcare-blue rounded-full">
            <CheckCircle2 size={24} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Stakeholder Sign-Off</span>
            <h3 className="text-lg font-bold text-healthcare-dark mt-1">Clinical Ready</h3>
            <p className="text-xs text-emerald-600 font-semibold mt-1">All audit hurdles cleared</p>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-full">
            <HeartHandshake size={24} />
          </div>
        </div>
      </div>

      {/* Acceptance Criteria Validation Checklist */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm space-y-4">
        <div className="flex justify-between items-center pb-3 border-b">
          <h3 className="font-semibold text-healthcare-dark flex items-center gap-2">
            <FileText size={18} className="text-healthcare-teal" />
            Healthcare Software Acceptance Verification
          </h3>
          <span className="text-xs text-gray-400">Click row to toggle review outcome</span>
        </div>

        <div className="divide-y divide-gray-100">
          {criteria.map(item => (
            <div
              key={item.id}
              onClick={() => toggleStatus(item.id)}
              className="py-3 flex items-center justify-between hover:bg-gray-50 px-2 rounded-lg cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                {item.status === 'Passed' ? (
                  <CheckCircle2 size={20} className="text-emerald-600 flex-shrink-0" />
                ) : (
                  <XCircle size={20} className="text-amber-500 flex-shrink-0" />
                )}
                <div>
                  <h4 className="text-sm font-semibold text-healthcare-dark">{item.title}</h4>
                  <p className="text-xs text-gray-500">Sign-off Authority: {item.verifiedBy}</p>
                </div>
              </div>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                item.status === 'Passed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
              }`}>
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Stakeholder Feedback & Notes */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm space-y-4">
        <h3 className="font-semibold text-healthcare-dark text-base">Stakeholder Feedback & Clinical Notes</h3>
        
        <div className="space-y-3">
          {feedback.map((f, i) => (
            <div key={i} className="p-3.5 bg-gray-50 rounded-lg border border-gray-100 space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-healthcare-dark">{f.author}</span>
                <span className="text-gray-400">{f.time}</span>
              </div>
              <p className="text-sm text-gray-700">{f.comment}</p>
            </div>
          ))}
        </div>

        <form onSubmit={handleAddFeedback} className="flex gap-2 pt-2">
          <input
            type="text"
            placeholder="Add clinical observation or stakeholder feedback..."
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-healthcare-teal focus:border-healthcare-teal"
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
          />
          <button
            type="submit"
            className="px-4 py-2 bg-healthcare-teal text-white rounded-lg hover:bg-healthcare-blue transition-colors text-sm font-medium flex items-center gap-1.5"
          >
            <Send size={15} />
            Post
          </button>
        </form>
      </div>
    </div>
  );
};

export default SprintReview;
