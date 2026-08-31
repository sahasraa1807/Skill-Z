import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageWrapper from '../components/layout/PageWrapper';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import RoleBuilder from '../components/projects/RoleBuilder';
import { getProjectById, updateProject } from '../services/projectService';
import { getAllSkills } from '../services/skillService';
import { PROJECT_DOMAINS, PROJECT_TYPES, PROJECT_STATUSES } from '../utils/constants';
import { useAuth } from '../context/AuthContext';

export default function EditProjectPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [allSkills, setAllSkills] = useState([]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    domain: PROJECT_DOMAINS[0],
    projectType: PROJECT_TYPES[0].value,
    status: 'RECRUITING',
    duration: '',
    commitmentHours: 5,
    maxTeamSize: 5,
    roles: []
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [projectRes, skillsRes] = await Promise.all([
          getProjectById(id),
          getAllSkills()
        ]);
        
        const project = projectRes.data;
        
        // Authorization check: only owner can edit
        if (project.ownerId !== user?.id && project.owner?.id !== user?.id) {
          setError('You are not authorized to edit this project.');
          setIsLoading(false);
          return;
        }

        // Format roles for RoleBuilder
        const formattedRoles = (project.roles || []).map(r => ({
          roleName: r.roleName,
          openings: r.openings,
          skillIds: (r.skills || []).map(s => s.skillId || s.skill?.id)
        }));

        setFormData({
          title: project.title || '',
          description: project.description || '',
          domain: project.domain || PROJECT_DOMAINS[0],
          projectType: project.projectType || PROJECT_TYPES[0].value,
          status: project.status || 'RECRUITING',
          duration: project.duration || '',
          commitmentHours: project.commitmentHours || 5,
          maxTeamSize: project.maxTeamSize || 5,
          roles: formattedRoles
        });

        setAllSkills(skillsRes.data || []);
      } catch (err) {
        setError(err.response?.data?.error || err.response?.data?.message || 'Failed to load project details');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRolesChange = (newRoles) => {
    setFormData(prev => ({ ...prev, roles: newRoles }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    try {
      await updateProject(id, formData);
      navigate(`/projects/${id}`);
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Failed to update project');
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner fullPage message="Loading project..." />;
  }

  return (
    <PageWrapper>
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Project</h1>
            <p className="text-gray-600 mt-1">Update your project details, requirements, and status.</p>
          </div>
          <Button variant="secondary" onClick={() => navigate(`/projects/${id}`)}>
            Back to Project
          </Button>
        </div>

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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Domain</label>
                <select
                  name="domain"
                  value={formData.domain}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 bg-white text-sm"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 bg-white text-sm"
                >
                  {PROJECT_TYPES.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 bg-white text-sm font-medium"
                >
                  {PROJECT_STATUSES.map(s => (
                    <option key={s.value} value={s.value}>{s.label}</option>
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
            <p className="text-sm text-gray-500">Update the roles you need and the skills required for each.</p>
            
            <RoleBuilder 
              roles={formData.roles} 
              onChange={handleRolesChange} 
              allSkills={allSkills} 
            />
          </div>

          <div className="pt-6 flex justify-end gap-4 border-t border-gray-100">
            <Button variant="ghost" onClick={() => navigate(`/projects/${id}`)} disabled={isSaving}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isSaving}>
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </PageWrapper>
  );
}
