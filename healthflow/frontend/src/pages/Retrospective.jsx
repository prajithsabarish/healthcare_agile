import React, { useState } from 'react';
import { ThumbsUp, Plus, Sparkles, AlertTriangle, Lightbulb, CheckSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const initialCards = [
  {
    id: 1,
    type: 'well',
    content: 'FHIR JSON parsing microservice performed with sub-50ms latency under stress testing.',
    votes: 6,
    author: 'Alex Kumar'
  },
  {
    id: 2,
    type: 'well',
    content: 'Clinical team was involved in backlog grooming early, eliminating ambiguity in drug dosage calculations.',
    votes: 4,
    author: 'Sarah Chen'
  },
  {
    id: 3,
    type: 'improve',
    content: 'Local MySQL test migrations failed on 2 developer machines due to missing seed script parameters.',
    votes: 5,
    author: 'Dev Team'
  },
  {
    id: 4,
    type: 'improve',
    content: 'Too many last-minute changes to prescription security schemas during sprint mid-point.',
    votes: 3,
    author: 'Clinical Lead'
  },
  {
    id: 5,
    type: 'action',
    content: 'Add Dockerized local MySQL container test environment for CI pipeline.',
    votes: 7,
    author: 'DevOps'
  },
  {
    id: 6,
    type: 'action',
    content: 'Enforce definition of ready (DoR) with clinical compliance sign-off before story moves to sprint backlog.',
    votes: 8,
    author: 'Scrum Master'
  }
];

const Retrospective = () => {
  const { user } = useAuth();
  const [cards, setCards] = useState(initialCards);
  const [columnType, setColumnType] = useState('well');
  const [newText, setNewText] = useState('');
  const [showAdd, setShowAdd] = useState(false);

  const handleVote = (id) => {
    setCards(cards.map(c => c.id === id ? { ...c, votes: c.votes + 1 } : c));
  };

  const handleAddCard = (e) => {
    e.preventDefault();
    if (!newText.trim()) return;
    const newCard = {
      id: Date.now(),
      type: columnType,
      content: newText,
      votes: 1,
      author: user?.name || 'Healthcare Engineer'
    };
    setCards([...cards, newCard]);
    setNewText('');
    setShowAdd(false);
  };

  const wellCards = cards.filter(c => c.type === 'well');
  const improveCards = cards.filter(c => c.type === 'improve');
  const actionCards = cards.filter(c => c.type === 'action');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-healthcare-dark">Sprint Retrospective Ceremony</h1>
          <p className="text-sm text-gray-500">Continuous inspection and adaptation for high-reliability healthcare delivery</p>
        </div>

        <button
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center px-4 py-2 bg-healthcare-teal text-white rounded-lg hover:bg-healthcare-blue transition-colors text-sm font-medium shadow-sm"
        >
          <Plus size={16} className="mr-1.5" />
          Add Retrospective Note
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleAddCard} className="bg-white p-5 rounded-xl border border-teal-200 shadow-md space-y-4">
          <h3 className="font-semibold text-healthcare-dark text-base">Add Retrospective Item</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setColumnType('well')}
              className={`p-3 rounded-lg border text-sm font-semibold flex items-center justify-center gap-2 ${
                columnType === 'well' ? 'bg-emerald-50 border-emerald-500 text-emerald-800' : 'bg-gray-50 text-gray-600'
              }`}
            >
              <Sparkles size={16} /> What Went Well
            </button>
            <button
              type="button"
              onClick={() => setColumnType('improve')}
              className={`p-3 rounded-lg border text-sm font-semibold flex items-center justify-center gap-2 ${
                columnType === 'improve' ? 'bg-amber-50 border-amber-500 text-amber-800' : 'bg-gray-50 text-gray-600'
              }`}
            >
              <AlertTriangle size={16} /> What Needs Improvement
            </button>
            <button
              type="button"
              onClick={() => setColumnType('action')}
              className={`p-3 rounded-lg border text-sm font-semibold flex items-center justify-center gap-2 ${
                columnType === 'action' ? 'bg-blue-50 border-blue-500 text-blue-800' : 'bg-gray-50 text-gray-600'
              }`}
            >
              <Lightbulb size={16} /> Action Items
            </button>
          </div>

          <textarea
            required
            rows={2}
            placeholder="Describe observation, clinical bottleneck, or actionable process change..."
            className="w-full border rounded-lg p-2.5 text-sm focus:ring-healthcare-teal focus:border-healthcare-teal"
            value={newText}
            onChange={e => setNewText(e.target.value)}
          />

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
              Submit Note
            </button>
          </div>
        </form>
      )}

      {/* 3 Columns Retro Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* What Went Well */}
        <div className="bg-white rounded-xl border border-emerald-200 p-5 shadow-sm flex flex-col h-[600px]">
          <div className="flex items-center justify-between pb-3 border-b mb-3">
            <div className="flex items-center gap-2 text-emerald-700 font-bold">
              <Sparkles size={18} />
              <span>What Went Well</span>
            </div>
            <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-0.5 rounded-full font-bold">
              {wellCards.length}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {wellCards.map(c => (
              <div key={c.id} className="p-4 bg-emerald-50/50 rounded-lg border border-emerald-100 hover:shadow-sm transition-all space-y-2">
                <p className="text-sm text-healthcare-dark leading-relaxed">{c.content}</p>
                <div className="flex justify-between items-center pt-1 border-t border-emerald-100/80 text-xs">
                  <span className="text-gray-400">{c.author}</span>
                  <button
                    onClick={() => handleVote(c.id)}
                    className="flex items-center gap-1.5 px-2 py-1 bg-white rounded border border-emerald-200 text-emerald-700 hover:bg-emerald-100 font-semibold"
                  >
                    <ThumbsUp size={12} />
                    {c.votes}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* What Needs Improvement */}
        <div className="bg-white rounded-xl border border-amber-200 p-5 shadow-sm flex flex-col h-[600px]">
          <div className="flex items-center justify-between pb-3 border-b mb-3">
            <div className="flex items-center gap-2 text-amber-700 font-bold">
              <AlertTriangle size={18} />
              <span>What Can Improve</span>
            </div>
            <span className="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded-full font-bold">
              {improveCards.length}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {improveCards.map(c => (
              <div key={c.id} className="p-4 bg-amber-50/50 rounded-lg border border-amber-100 hover:shadow-sm transition-all space-y-2">
                <p className="text-sm text-healthcare-dark leading-relaxed">{c.content}</p>
                <div className="flex justify-between items-center pt-1 border-t border-amber-100/80 text-xs">
                  <span className="text-gray-400">{c.author}</span>
                  <button
                    onClick={() => handleVote(c.id)}
                    className="flex items-center gap-1.5 px-2 py-1 bg-white rounded border border-amber-200 text-amber-700 hover:bg-amber-100 font-semibold"
                  >
                    <ThumbsUp size={12} />
                    {c.votes}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Items */}
        <div className="bg-white rounded-xl border border-blue-200 p-5 shadow-sm flex flex-col h-[600px]">
          <div className="flex items-center justify-between pb-3 border-b mb-3">
            <div className="flex items-center gap-2 text-blue-700 font-bold">
              <Lightbulb size={18} />
              <span>Action Items</span>
            </div>
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full font-bold">
              {actionCards.length}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {actionCards.map(c => (
              <div key={c.id} className="p-4 bg-blue-50/50 rounded-lg border border-blue-100 hover:shadow-sm transition-all space-y-2">
                <p className="text-sm text-healthcare-dark leading-relaxed font-medium">{c.content}</p>
                <div className="flex justify-between items-center pt-1 border-t border-blue-100/80 text-xs">
                  <span className="text-gray-400">{c.author}</span>
                  <button
                    onClick={() => handleVote(c.id)}
                    className="flex items-center gap-1.5 px-2 py-1 bg-white rounded border border-blue-200 text-blue-700 hover:bg-blue-100 font-semibold"
                  >
                    <ThumbsUp size={12} />
                    {c.votes}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Retrospective;
