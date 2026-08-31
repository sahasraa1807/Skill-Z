import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../components/layout/PageWrapper';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import ErrorMessage from '../components/common/ErrorMessage';
import RoleBuilder from '../components/projects/RoleBuilder';
import { createProject } from '../services/projectService';
import { getAllSkills } from '../services/skillService';
import { PROJECT_DOMAINS, PROJECT_TYPES } from '../utils/constants';

export default function CreateProjectPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [allSkills, setAllSkills] = useState([]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    domain: PROJECT_DOMAINS[0],
    projectType: PROJECT_TYPES[0].value,
    duration: '',
    commitmentHours: 5,
    maxTeamSize: 5,
    roles: []
  });

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await getAllSkills();
        setAllSkills(res.data || []);
      } catch (err) {
        console.error('Failed to fetch skills:', err);
      }
    };
    fetchSkills();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRolesChange = (newRoles) => {
    setFormData(prev => ({ ...prev, roles: newRoles }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const res = await createProject(formData);
      const projectId = res.data._id || res.data.id;
      navigate(`/projects/${projectId}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create project');
      setIsLoading(false);
    }
  };

  return (
    <PageWrapper>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create a Project</h1>
        <p className="text-gray-600 mb-8">Set up your project and find the right teammates.</p>

        {error && <ErrorMessage message={error} className="mb-6" />}

        <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
          
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">Basic Info</h2>
            
            <Input
              label="Project Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. NextGen E-Commerce Platform"
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                placeholder="What is this project about? What are you trying to build?"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Domain</label>
                <select
                  name="domain"
                  value={formData.domain}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 bg-white"
                >
                  {PROJECT_DOMAINS.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project Type</label>
                <select
                  name="projectType"
                  value={formData.projectType}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 bg-white"
                >
                  {PROJECT_TYPES.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input
                label="Duration (e.g. 3 months)"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                placeholder="3 months"
              />
              <Input
                label="Commitment (hrs/week)"
                name="commitmentHours"
                type="number"
                min="1"
                value={formData.commitmentHours}
                onChange={handleChange}
              />
              <Input
                label="Max Team Size"
                name="maxTeamSize"
                type="number"
                min="1"
                value={formData.maxTeamSize}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="space-y-6 pt-6">
            <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">Roles & Requirements</h2>
            <p className="text-sm text-gray-500">Define the roles you need and the skills required for each.</p>
            
            <RoleBuilder 
              roles={formData.roles} 
              onChange={handleRolesChange} 
              allSkills={allSkills} 
            />
          </div>

          <div className="pt-6 flex justify-end gap-4 border-t border-gray-100">
            <Button variant="ghost" onClick={() => navigate('/projects')} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isLoading}>
              Create Project
            </Button>
          </div>
        </form>
      </div>
    </PageWrapper>
  );
}
