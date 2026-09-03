import { useState } from 'react';
import Button from '../common/Button';
import Input from '../common/Input';

export default function AddProofModal({ isOpen, onClose, onAdd, isLoading }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [repoUrl, setRepoUrl] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [skillsInput, setSkillsInput] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Project title is required');
      return;
    }

    const skillsUsed = skillsInput
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    onAdd({
      title: title.trim(),
      description: description.trim(),
      repoUrl: repoUrl.trim(),
      liveUrl: liveUrl.trim(),
      skillsUsed
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-xs animate-in fade-in">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-200"
      >
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-primary-50 text-primary-600 rounded-xl text-lg">📁</span>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Add Project Proof</h3>
              <p className="text-xs text-gray-500">Provide repository or live demo evidence to boost your profile confidence.</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 p-1 text-lg font-bold"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input 
            label="Project Title"
            id="proof-title"
            placeholder="e.g. AI-Powered Portfolio Hub"
            value={title}
            onChange={(e) => { setTitle(e.target.value); setError(''); }}
            required
            error={error}
          />

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Short Description
            </label>
            <textarea
              rows={2}
              placeholder="What does this project do and what was your role?"
              className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-primary-500 focus:border-primary-500"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input 
              label="GitHub Repo URL"
              id="proof-repo"
              placeholder="https://github.com/user/repo"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              hint="Stars & languages will be auto-scanned"
            />
            <Input 
              label="Live Demo URL"
              id="proof-live"
              placeholder="https://myproject.com"
              value={liveUrl}
              onChange={(e) => setLiveUrl(e.target.value)}
            />
          </div>

          <Input 
            label="Skills Used (comma-separated)"
            id="proof-skills"
            placeholder="React, TypeScript, Tailwind, Node.js"
            value={skillsInput}
            onChange={(e) => setSkillsInput(e.target.value)}
            hint="Tagging skills validates your self-reported skills"
          />

          <div className="flex gap-3 pt-3">
            <Button 
              type="button" 
              variant="secondary" 
              onClick={onClose} 
              fullWidth
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="primary" 
              isLoading={isLoading} 
              fullWidth
            >
              Add Project Proof
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
