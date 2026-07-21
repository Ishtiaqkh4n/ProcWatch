export function Toggle({ label, checked, onChange }) {
  return (
    <div
      className="flex items-center justify-between cursor-pointer"
      onClick={() => onChange(!checked)}
    >
      <span className="text-gray-300 text-sm">{label}</span>
      <div
        className={`relative w-10 h-5 rounded-full transition-colors ${
          checked ? "bg-indigo-500" : "bg-gray-600"
        }`}
      >
        <div
          className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
            checked ? "translate-x-5" : ""
          }`}
        />
      </div>
    </div>
  );
}
