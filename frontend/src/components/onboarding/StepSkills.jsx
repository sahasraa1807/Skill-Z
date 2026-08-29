import { useState, useEffect } from 'react';
import Button from '../common/Button';
import SkillTag from '../common/SkillTag';
import { SKILL_CATEGORIES, PROFICIENCY_LEVELS } from '../../utils/constants';

export default function StepSkills({ initialSkills = [], allSkills = [], onNext, onBack, isLoading }) {
  const [selected, setSelected] = useState(initialSkills); // [{skillId, name, proficiencyLevel}]
  const [search, setSearch] = useState('');
  const [pendingSkill, setPendingSkill] = useState(null);
  const [error, setError] = useState('');

  const filteredCategories = SKILL_CATEGORIES.map((cat) => ({
    ...cat,
    skills: cat.skills.filter((s) =>
      s.toLowerCase().includes(search.toLowerCase())
    )
  })).filter((cat) => cat.skills.length > 0);

  const isSelected = (name) => selected.some((s) => s.name === name);

  const handleAdd = (skillName) => {
    if (isSelected(skillName)) {
      setSelected((prev) => prev.filter((s) => s.name !== skillName));
      return;
    }
    // Find skill id from allSkills (from backend)
    const found = allSkills.find((s) => s.name === skillName);
    if (!found) return;
    setPendingSkill({ skillId: found.id, name: found.name, proficiencyLevel: 'INTERMEDIATE' });
  };

  const confirmAdd = (level) => {
    if (!pendingSkill) return;
    setSelected((prev) => [...prev, { ...pendingSkill, proficiencyLevel: level }]);
    setPendingSkill(null);
  };

  const handleRemove = (name) => setSelected((prev) => prev.filter((s) => s.name !== name));

  const handleNext = () => {
    if (selected.length === 0) { setError('Please add at least one skill'); return; }
    setError('');
    onNext(selected);
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">What are your skills?</h2>
        <p className="text-gray-500 mt-1">Select skills and your proficiency level for each.</p>
      </div>

      {selected.length > 0 && (
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">Selected skills</p>
          <div className="flex flex-wrap gap-2">
            {selected.map((s) => (
              <SkillTag key={s.skillId} name={s.name} level={s.proficiencyLevel} onRemove={() => handleRemove(s.name)} />
            ))}
          </div>
        </div>
      )}

      <input
        type="text"
        placeholder="Search skills..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
      />

      {pendingSkill && (
        <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Select proficiency for <strong>{pendingSkill.name}</strong></p>
          <div className="flex gap-2">
            {PROFICIENCY_LEVELS.map((level) => (
              <button
                key={level}
                onClick={() => confirmAdd(level)}
                className="flex-1 px-3 py-2 text-sm rounded-lg border border-primary-300 bg-white hover:bg-primary-50 hover:border-primary-500 transition-colors font-medium"
              >
                {level.charAt(0) + level.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
          <button onClick={() => setPendingSkill(null)} className="text-xs text-gray-400 mt-2 hover:underline">Cancel</button>
        </div>
      )}

      <div className="max-h-64 overflow-y-auto flex flex-col gap-4 border border-gray-200 rounded-lg p-3">
        {filteredCategories.map((cat) => (
          <div key={cat.category}>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">{cat.category}</p>
            <div className="flex flex-wrap gap-2">
              {cat.skills.map((skillName) => (
                <button
                  key={skillName}
                  onClick={() => handleAdd(skillName)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                    isSelected(skillName)
                      ? 'bg-primary-600 text-white border-primary-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-primary-400'
                  }`}
                >
                  {isSelected(skillName) ? '✓ ' : ''}{skillName}
                </button>
              ))}
            </div>
          </div>
        ))}
        {filteredCategories.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-4">No skills found for "{search}"</p>
        )}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-3">
        <Button variant="secondary" onClick={onBack}>← Back</Button>
        <Button onClick={handleNext} isLoading={isLoading} fullWidth>Continue →</Button>
      </div>
    </div>
  );
}
