import { useState } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import { validateUsername } from '../../utils/validators';

export default function StepBasicInfo({ initialData, onNext, isLoading }) {
  const [form, setForm] = useState({
    name: initialData?.name || '',
    username: initialData?.username || '',
    bio: initialData?.bio || '',
    location: initialData?.location || ''
  });
  const [errors, setErrors] = useState({});

  const set = (field) => (e) => setForm((p) => ({ ...p, [field]: e.target.value }));

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.username.trim()) errs.username = 'Username is required';
    else {
      const usernameErr = validateUsername(form.username.trim().toLowerCase());
      if (usernameErr) errs.username = usernameErr;
    }
    return errs;
  };

  const handleNext = () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    onNext({ ...form, username: form.username.toLowerCase() });
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Tell us about yourself</h2>
        <p className="text-gray-500 mt-1">This is what others will see on your profile.</p>
      </div>
      <Input label="Full Name" id="name" value={form.name} onChange={set('name')} placeholder="Sahasra Reddy" required error={errors.name} />
      <Input label="Username" id="username" value={form.username} onChange={set('username')} placeholder="sahasra_r" hint="Lowercase letters, numbers, and underscores only" required error={errors.username} />
      <div className="flex flex-col gap-1">
        <label htmlFor="bio" className="text-sm font-medium text-gray-700">Bio <span className="text-gray-400">(optional)</span></label>
        <textarea
          id="bio"
          value={form.bio}
          onChange={set('bio')}
          placeholder="I'm a developer passionate about AI and open source..."
          rows={3}
          className="px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
        />
      </div>
      <Input label="Location" id="location" value={form.location} onChange={set('location')} placeholder="Hyderabad, India" />
      <Button onClick={handleNext} isLoading={isLoading} fullWidth>Continue →</Button>
    </div>
  );
}
