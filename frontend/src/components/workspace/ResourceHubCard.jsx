import { useState } from 'react';
import Button from '../common/Button';
import Input from '../common/Input';

const CATEGORY_ICONS = {
  REPO: '🐙',
  DESIGN: '🎨',
  DOCS: '📄',
  DEPLOYMENT: '🚀'
};

export default function ResourceHubCard({ resources = [], onAddResource, onDeleteResource }) {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState('REPO');

  const handleSave = (e) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) return;

    onAddResource({
      title: title.trim(),
      url: url.trim(),
      category
    });

    setTitle('');
    setUrl('');
    setIsAdding(false);
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-200 p-5 shadow-sm flex flex-col gap-4">
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <span className="p-1.5 bg-primary-50 text-primary-600 rounded-xl text-sm">🔗</span>
          <h4 className="text-sm font-bold text-gray-900">Team Resource Hub</h4>
        </div>
        <button
          type="button"
          onClick={() => setIsAdding(!isAdding)}
          className="text-xs font-bold text-primary-600 hover:text-primary-700"
        >
          {isAdding ? 'Cancel' : '+ Add Link'}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSave} className="bg-gray-50 p-3.5 rounded-2xl border border-gray-200 space-y-3">
          <Input
            label="Resource Name"
            id="res-title"
            placeholder="e.g. Frontend GitHub Repo"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <Input
            label="URL Link"
            id="res-url"
            placeholder="https://github.com/org/repo"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs bg-white focus:ring-primary-500 focus:border-primary-500 font-medium"
            >
              <option value="REPO">GitHub / Repository</option>
              <option value="DESIGN">Figma / Design Canvas</option>
              <option value="DOCS">Documentation / Notion</option>
              <option value="DEPLOYMENT">Staging / Live Demo</option>
            </select>
          </div>
          <Button type="submit" size="sm" fullWidth>
            Save Link
          </Button>
        </form>
      )}

      {/* Resources list */}
      <div className="space-y-2">
        {resources.length === 0 ? (
          <p className="text-xs text-gray-400 italic text-center py-3">No collaboration links added yet.</p>
        ) : (
          resources.map((res) => (
            <div
              key={res.id}
              className="flex items-center justify-between p-2.5 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50/50 transition-all group"
            >
              <a
                href={res.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs font-semibold text-gray-800 hover:text-primary-600 truncate flex-1"
              >
                <span>{CATEGORY_ICONS[res.category] || '🔗'}</span>
                <span className="truncate">{res.title}</span>
                <span className="text-[10px] text-gray-400 font-normal">↗</span>
              </a>

              <button
                type="button"
                onClick={() => onDeleteResource(res.id)}
                className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1 text-xs"
                title="Remove link"
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
