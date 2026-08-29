import { useState } from 'react';
import Button from '../common/Button';
import { GOALS } from '../../utils/constants';

export default function StepGoals({ initialGoals = [], onNext, onBack, isLoading }) {
  const [selected, setSelected] = useState(initialGoals);
  const [error, setError] = useState('');

  const toggle = (value) => {
    setSelected((prev) =>
      prev.includes(value) ? prev.filter((g) => g !== value) : [...prev, value]
    );
  };

  const handleNext = () => {
    if (selected.length === 0) { setError('Please select at least one goal'); return; }
    setError('');
    onNext(selected);
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">What are you looking for?</h2>
        <p className="text-gray-500 mt-1">Select everything that applies.</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {GOALS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => toggle(value)}
            className={`px-4 py-3 rounded-xl text-sm font-medium border-2 text-left transition-colors ${
              selected.includes(value)
                ? 'border-primary-600 bg-primary-50 text-primary-700'
                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
            }`}
          >
            {selected.includes(value) ? '✓ ' : ''}{label}
          </button>
        ))}
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex gap-3">
        <Button variant="secondary" onClick={onBack}>← Back</Button>
        <Button onClick={handleNext} isLoading={isLoading} fullWidth>Continue →</Button>
      </div>
    </div>
  );
}
