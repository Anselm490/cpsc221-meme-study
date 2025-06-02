export default function ProgressBar({ total, completed }) {
  const percent = (completed / total) * 100;

  return (
    <div className="fixed top-0 left-0 w-full h-2 bg-gray-300 dark:bg-gray-700 z-50">
      <div
        className="h-full bg-green-500 transition-all"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
