import { ReactNode } from "react";

interface MetricCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  calculation?: string;
  icon?: ReactNode;
  colorClass?: string;
}

export default function MetricCard({
  label,
  value,
  subValue,
  calculation,
  icon,
  colorClass = "bg-white",
}: MetricCardProps) {
  return (
    <div
      className={`${colorClass} rounded-lg shadow-md p-5 border border-gray-100 hover:shadow-lg transition-shadow`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subValue && (
            <p className="text-sm text-gray-500 mt-1">{subValue}</p>
          )}
          {calculation && (
            <p className="text-xs text-indigo-600 mt-2 font-mono bg-indigo-50 px-2 py-1 rounded">
              {calculation}
            </p>
          )}
        </div>
        {icon && (
          <div className="ml-4 text-indigo-500 opacity-50">{icon}</div>
        )}
      </div>
    </div>
  );
}

