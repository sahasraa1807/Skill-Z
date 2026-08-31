import { useState, useMemo } from 'react';
import Button from '../common/Button';
import Input from '../common/Input';
import SkillTag from '../common/SkillTag';

export default function RoleBuilder({ roles, onChange, allSkills = [] }) {
  const [activeRoleIndex, setActiveRoleIndex] = useState(null);

  const skillsByCategory = useMemo(() => {
    const grouped = {};
    allSkills.forEach(skill => {
      const cat = skill.category || 'Other';
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(skill);
    });
    return grouped;
  }, [allSkills]);

  const addRole = () => {
    onChange([...roles, { roleName: '', openings: 1, skillIds: [] }]);
  };

  const removeRole = (index) => {
    const newRoles = [...roles];
    newRoles.splice(index, 1);
    onChange(newRoles);
    if (activeRoleIndex === index) setActiveRoleIndex(null);
  };

  const updateRole = (index, field, value) => {
    const newRoles = [...roles];
    newRoles[index] = { ...newRoles[index], [field]: value };
    onChange(newRoles);
  };

  const toggleSkill = (roleIndex, skillId) => {
    const role = roles[roleIndex];
    let newSkillIds = [...(role.skillIds || [])];
    if (newSkillIds.includes(skillId)) {
      newSkillIds = newSkillIds.filter(id => id !== skillId);
    } else {
      newSkillIds.push(skillId);
    }
    updateRole(roleIndex, 'skillIds', newSkillIds);
  };

  return (
    <div className="space-y-4">
      {roles.map((role, index) => (
        <div key={index} className="p-4 border border-gray-200 rounded-xl bg-gray-50 relative">
          <button 
            type="button" 
            onClick={() => removeRole(index)}
            className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
            title="Remove Role"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 pr-8">
            <Input
              label="Role Name"
              value={role.roleName}
              onChange={(e) => updateRole(index, 'roleName', e.target.value)}
              placeholder="e.g. Frontend Developer"
              required
            />
            <Input
              label="Openings"
              type="number"
              min="1"
              value={role.openings}
              onChange={(e) => updateRole(index, 'openings', parseInt(e.target.value) || 1)}
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">Required Skills ({role.skillIds?.length || 0})</label>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                onClick={() => setActiveRoleIndex(activeRoleIndex === index ? null : index)}
              >
                {activeRoleIndex === index ? 'Hide Skills' : 'Select Skills'}
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-2">
              {role.skillIds?.map(skillId => {
                const skill = allSkills.find(s => s._id === skillId || s.id === skillId);
                if (!skill) return null;
                return (
                  <span key={skillId} className="inline-flex items-center bg-primary-100 text-primary-700 px-2.5 py-1 rounded-full text-xs font-medium">
                    {skill.name}
                    <button type="button" onClick={() => toggleSkill(index, skillId)} className="ml-1.5 text-primary-500 hover:text-primary-700">
                      &times;
                    </button>
                  </span>
                );
              })}
            </div>

            {activeRoleIndex === index && (
              <div className="mt-4 border-t border-gray-200 pt-4 max-h-60 overflow-y-auto">
                {Object.keys(skillsByCategory).map(category => (
                  <div key={category} className="mb-4 last:mb-0">
                    <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">{category}</h4>
                    <div className="flex flex-wrap gap-2">
                      {skillsByCategory[category].map(skill => {
                        const skillId = skill._id || skill.id;
                        const isSelected = role.skillIds?.includes(skillId);
                        return (
                          <button
                            key={skillId}
                            type="button"
                            onClick={() => toggleSkill(index, skillId)}
                            className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                              isSelected 
                                ? 'bg-primary-600 border-primary-600 text-white' 
                                : 'bg-white border-gray-300 text-gray-700 hover:border-primary-500'
                            }`}
                          >
                            {skill.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}

      <Button type="button" variant="secondary" onClick={addRole} fullWidth>
        + Add Role
      </Button>
    </div>
  );
}
