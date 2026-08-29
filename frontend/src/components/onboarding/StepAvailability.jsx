import { useState } from 'react';
import Button from '../common/Button';

export default function StepAvailability({ initialData = {}, onNext, onBack, isLoading }) {
  const [hours, setHours] = useState(initialData.availabilityHours || 10);
  const [weekdays, setWeekdays] = useState(initialData.preferWeekdays || false);
  const [weekends, setWeekends] = useState(initialData.preferWeekends || false);
  const [evenings, setEvenings] = useState(initialData.preferEvenings || false);
  const [mornings, setMornings] = useState(initialData.preferMornings || false);

  const Toggle = ({ label, checked, onChange }) => (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border-2 transition-colors ${
        checked ? 'border-primary-600 bg-primary-50 text-primary-700' : 'border-gray-200 bg-white text-gray-700'
      }`}
    >
      <span className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
        checked ? 'border-primary-600 bg-primary-600' : 'border-gray-300'
      }`}>
        {checked && <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>}
      </span>
      {label}
    </button>
  );

  const handleNext = () => {
    onNext({ availabilityHours: Number(hours), preferWeekdays: weekdays, preferWeekends: weekends, preferEvenings: evenings, preferMornings: mornings });
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">How available are you?</h2>
        <p className="text-gray-500 mt-1">This helps project owners find people with compatible schedules.</p>
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700">Hours per week: <strong>{hours}</strong></label>
        <input
          type="range" min={1} max={40} value={hours}
          onChange={(e) => setHours(e.target.value)}
          className="w-full mt-3 accent-primary-600"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>1h</span><span>10h</span><span>20h</span><span>30h</span><span>40h</span>
        </div>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-700 mb-3">Preferred time</p>
        <div className="grid grid-cols-2 gap-2">
          <Toggle label="Weekdays" checked={weekdays} onChange={setWeekdays} />
          <Toggle label="Weekends" checked={weekends} onChange={setWeekends} />
          <Toggle label="Mornings" checked={mornings} onChange={setMornings} />
          <Toggle label="Evenings" checked={evenings} onChange={setEvenings} />
        </div>
      </div>
      <div className="flex gap-3">
        <Button variant="secondary" onClick={onBack}>← Back</Button>
        <Button onClick={handleNext} isLoading={isLoading} fullWidth>Continue →</Button>
      </div>
    </div>
  );
}
