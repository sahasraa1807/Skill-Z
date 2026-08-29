import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { register } from '../services/authService';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { validateEmail, validatePassword } from '../utils/validators';

export default function SignupPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.id]: e.target.value });

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!validateEmail(form.email)) errs.email = 'Invalid email address';
    
    const passErr = validatePassword(form.password);
    if (passErr) errs.password = passErr;
    
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setIsLoading(true);

    try {
      const response = await register({ name: form.name, email: form.email, password: form.password });
      const { token, user } = response.data;
      login(token, user);
      navigate('/onboarding');
    } catch (err) {
      setApiError(err.response?.data?.error || 'Failed to register. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Create an account</h2>
          <p className="mt-2 text-sm text-gray-500">Join Skillz to find your next team</p>
        </div>
        
        {apiError && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <Input 
            label="Full Name" id="name" value={form.name} onChange={handleChange} 
            placeholder="John Doe" error={errors.name} required
          />
          <Input 
            label="Email address" id="email" type="email" value={form.email} onChange={handleChange} 
            placeholder="john@example.com" error={errors.email} required
          />
          <Input 
            label="Password" id="password" type="password" value={form.password} onChange={handleChange} 
            placeholder="••••••••" error={errors.password} required
          />
          <Input 
            label="Confirm Password" id="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} 
            placeholder="••••••••" error={errors.confirmPassword} required
          />
          
          <Button type="submit" isLoading={isLoading} fullWidth className="mt-2">
            Sign up
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
