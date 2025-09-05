export default function DashboardStatsCard({ title, value, description, icon: Icon }) {
  return (
    <div className="bg-white dark:bg-gray-800/50 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
          <Icon className="h-6 w-6 text-indigo-500 dark:text-indigo-400" />
        </div>
        <p className="text-3xl font-bold text-gray-800 dark:text-gray-100 mt-2">{value}</p>
      </div>
      <p className="text-xs text-gray-400 dark:text-gray-500 mt-4">{description}</p>
    </div>
  );
}