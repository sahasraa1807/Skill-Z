import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PageWrapper from '../components/layout/PageWrapper';
import ProjectCard from '../components/projects/ProjectCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import Button from '../components/common/Button';
import { getProjects } from '../services/projectService';
import { getRecommendedProjects } from '../services/matchingService';
import { PROJECT_DOMAINS, PROJECT_TYPES, PROJECT_STATUSES } from '../utils/constants';

export default function ExploreProjectsPage() {
  const { user, isAuthenticated } = useAuth();
  
  const [projects, setProjects] = useState([]);
  const [recommendedProjects, setRecommendedProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filters
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [domain, setDomain] = useState('');
  const [projectType, setProjectType] = useState('');
  const [status, setStatus] = useState('RECRUITING');

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset to page 1 on new search
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch recommended projects for logged in user
  useEffect(() => {
    if (isAuthenticated) {
      getRecommendedProjects(3)
        .then(res => setRecommendedProjects(res.data || []))
        .catch(err => console.error('Failed to load recommended projects', err));
    } else {
      setRecommendedProjects([]);
    }
  }, [isAuthenticated]);

  // Fetch projects
  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const params = {
          page,
          limit: 9,
          ...(debouncedSearch && { search: debouncedSearch }),
          ...(domain && { domain }),
          ...(projectType && { projectType }),
          ...(status && { status })
        };
        const res = await getProjects(params);
        setProjects(res.data.projects || res.data);
        setTotalPages(res.data.totalPages || 1);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load projects');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, [debouncedSearch, domain, projectType, status, page]);

  return (
    <PageWrapper>
      <div className="flex flex-col gap-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Explore Projects</h1>
            <p className="text-gray-600 mt-1">Find exciting projects to join and collaborate on.</p>
          </div>
          {user && (
            <Link to="/projects/create">
              <Button variant="primary">+ Create Project</Button>
            </Link>
          )}
        </div>

        {/* Recommended For You Section */}
        {isAuthenticated && recommendedProjects.length > 0 && (
          <div className="bg-gradient-to-br from-primary-50 via-white to-blue-50 p-6 rounded-3xl border border-primary-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-primary-600 text-white rounded-lg text-sm">✨</span>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Recommended For You</h2>
                  <p className="text-xs text-gray-500">Based on your skills, project goals, and availability preferences.</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {recommendedProjects.map(project => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search projects..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <select 
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 bg-white"
            value={domain}
            onChange={(e) => { setDomain(e.target.value); setPage(1); }}
          >
            <option value="">All Domains</option>
            {PROJECT_DOMAINS.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          
          <select 
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 bg-white"
            value={projectType}
            onChange={(e) => { setProjectType(e.target.value); setPage(1); }}
          >
            <option value="">All Types</option>
            {PROJECT_TYPES.map(t => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
          
          <select 
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 bg-white"
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          >
            <option value="">All Statuses</option>
            {PROJECT_STATUSES.map(s => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>

        {/* Content */}
        {isLoading && projects.length === 0 ? (
          <div className="py-12"><LoadingSpinner /></div>
        ) : error ? (
          <ErrorMessage message={error} />
        ) : projects.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">
            <h3 className="text-xl font-medium text-gray-900 mb-2">No projects found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your filters or search terms.</p>
            <Button variant="secondary" onClick={() => {
              setSearch('');
              setDomain('');
              setProjectType('');
              setStatus('RECRUITING');
              setPage(1);
            }}>
              Clear Filters
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map(project => (
                <ProjectCard key={project._id || project.id} project={project} />
              ))}
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-8">
                <Button 
                  variant="secondary" 
                  disabled={page === 1}
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                >
                  Previous
                </Button>
                <span className="text-gray-600 text-sm font-medium">
                  Page {page} of {totalPages}
                </span>
                <Button 
                  variant="secondary" 
                  disabled={page === totalPages}
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </PageWrapper>
  );
}
