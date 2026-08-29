export default function InterestsList({ interests }) {
  if (!interests || interests.length === 0) {
    return <p className="text-sm text-gray-400 italic">No interests added yet.</p>;
  }
  return (
    <div className="flex flex-wrap gap-2">
      {interests.map((ui) => {
        const name = ui.interest?.name || ui.name || ui;
        return (
          <span key={name} className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">{name}</span>
        );
      })}
    </div>
  );
}
