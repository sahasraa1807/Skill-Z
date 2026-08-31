import { Link } from 'react-router-dom';
import Avatar from '../common/Avatar';
import { PROJECT_STATUSES, PROJECT_TYPES } from '../../utils/constants';

export default function ProjectCard({ project }) {
  const statusConfig = PROJECT_STATUSES.find((s) => s.value === project.status) || PROJECT_STATUSES[0];
  const typeLabel = PROJECT_TYPES.find((t) => t.value === project.projectType)?.label || project.projectType;

  const totalOpenings = project.roles?.reduce((sum, role) => sum + (role.openings || 0), 0) || 0;

  return (
    <Link to={`/projects/${project._id || project.id}`} className="block h-full">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow h-full flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{project.title}</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-full">
                {project.domain}
              </span>
              <span className="bg-primary-100 text-primary-700 text-xs px-2 py-0.5 rounded-full">
                {typeLabel}
              </span>
            </div>
          </div>
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusConfig.color} whitespace-nowrap ml-2`}>
            {statusConfig.label}
          </span>
        </div>

        <p className="text-gray-600 text-sm line-clamp-2 mb-6 flex-grow">
          {project.description}
        </p>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
          <div className="flex items-center gap-4 text-xs text-gray-500">
            {project.commitmentHours && (
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {project.commitmentHours}h/wk
              </div>
            )}
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {totalOpenings} open
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">by</span>
            {project.owner && (
              <div className="flex items-center gap-1.5" title={project.owner.username}>
                <Avatar user={project.owner} size="sm" />
                <span className="text-xs font-medium text-gray-700 max-w-[80px] truncate">
                  {project.owner.firstName || project.owner.username}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
