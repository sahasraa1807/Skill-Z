import SkillTag from '../common/SkillTag';

export default function SkillsList({ skills }) {
  if (!skills || skills.length === 0) {
    return <p className="text-sm text-gray-400 italic">No skills added yet.</p>;
  }
  return (
    <div className="flex flex-wrap gap-2">
      {skills.map((us) => (
        <SkillTag key={us.skill?.id || us.skillId} name={us.skill?.name || us.name} level={us.proficiencyLevel} />
      ))}
    </div>
  );
}
