import { useState } from 'react';
import Button from '../common/Button';
import Input from '../common/Input';
import { EXPERIENCE_LEVELS } from '../../utils/constants';

export default function StepExperience({ initialData = {}, onNext, onBack, isLoading }) {
  const [experienceLevel, setExperienceLevel] = useState(initialData.experienceLevel || '');
  const [githubUrl, setGithubUrl] = useState(initialData.githubUrl || '');
  const [portfolioUrl, setPortfolioUrl] = useState(initialData.portfolioUrl || '');
  const [linkedinUrl, setLinkedinUrl] = useState(initialData.linkedinUrl || '');
  const [error, setError] = useState('');

  const handleNext = () => {
    if (!experienceLevel) { setError('Please select your experience level'); return; }
    setError('');
    onNext({ experienceLevel, githubUrl, portfolioUrl, linkedinUrl });
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Your experience</h2>
        <p className="text-gray-500 mt-1">Optional links help others learn more about your work.</p>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-700 mb-3">Experience level <span className="text-red-500">*</span></p>
        <div className="flex flex-col gap-2">
          {EXPERIENCE_LEVELS.map(({ value, label, desc }) => (
            <button
              key={value}
              onClick={() => setExperienceLevel(value)}
              className={`flex flex-col items-start p-4 rounded-xl border-2 text-left transition-colors ${
                experienceLevel === value
                  ? 'border-primary-600 bg-primary-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <span className={`font-medium ${ experienceLevel === value ? 'text-primary-700' : 'text-gray-900'}`}>{label}</span>
              <span className="text-xs text-gray-500 mt-0.5">{desc}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="border-t border-gray-200 pt-4 flex flex-col gap-3">
        <p className="text-sm text-gray-500 font-medium">Optional links</p>
        <Input label="GitHub" id="github" value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} placeholder="https://github.com/yourname" />
        <Input label="Portfolio" id="portfolio" value={portfolioUrl} onChange={(e) => setPortfolioUrl(e.target.value)} placeholder="https://yoursite.com" />
        <Input label="LinkedIn" id="linkedin" value={linkedinUrl} onChange={(e) => setLinkedinUrl(e.target.value)} placeholder="https://linkedin.com/in/yourname" />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex gap-3">
        <Button variant="secondary" onClick={onBack}>← Back</Button>
        <Button onClick={handleNext} isLoading={isLoading} fullWidth>Finish setup →</Button>
      </div>
    </div>
  );
}
