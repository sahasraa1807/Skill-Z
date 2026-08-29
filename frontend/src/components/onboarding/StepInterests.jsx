import { useState } from 'react';
import Button from '../common/Button';
import { INTERESTS } from '../../utils/constants';

export default function StepInterests({ initialInterests = [], allInterests = [], onNext, onBack, isLoading }) {
  const [selected, setSelected] = useState(initialInterests);
  const [error, setError] = useState('');

  // Use allInterests from backend if available, fall back to constants
  const interestList = allInterests.length > 0 ? allInterests : INTERESTS.map((name) => ({ name }));

  const toggle = (name) => {
    setSelected((prev) =>
      prev.includes(name) ? prev.filter((i) => i !== name) : [...prev, name]
    );
  };

  const handleNext = () => {
    if (selected.length === 0) { setError('Please select at least one interest'); return; }
    setError('');
    onNext(selected);
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">What are you interested in?</h2>
        <p className="text-gray-500 mt-1">This helps us match you with relevant projects.</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {interestList.map((interest) => {
          const name = interest.name || interest;
          return (
            <button
              key={name}
              onClick={() => toggle(name)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                selected.includes(name)
                  ? 'bg-primary-600 text-white border-primary-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-primary-400'
              }`}
            >
              {selected.includes(name) ? '✓ ' : ''}{name}
            </button>
          );
        })}
      </div>
      {selected.length > 0 && (
        <p className="text-sm text-gray-500">{selected.length} selected</p>
      )}
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex gap-3">
        <Button variant="secondary" onClick={onBack}>← Back</Button>
        <Button onClick={handleNext} isLoading={isLoading} fullWidth>Continue →</Button>
      </div>
    </div>
  );
}
