import React from 'react';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid';

interface StatsCardProps {
  title: string;
  value: number | string;
  unit?: string;
  change?: number;
  timeFrame?: string;
  icon?: React.ElementType;
  description?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  unit,
  change,
  timeFrame,
  icon: Icon,
  description,
}) => {
  const isPositiveChange = change && change > 0;
  const changeColor = isPositiveChange ? 'text-green-600' : 'text-red-600';
  const changeIcon = isPositiveChange ? ArrowUpIcon : ArrowDownIcon;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <div className="mt-1 flex items-baseline">
            <p className="text-2xl font-semibold text-gray-900">
              {value}
              {unit && <span className="ml-1 text-sm text-gray-500">{unit}</span>}
            </p>
          </div>
        </div>
        {Icon && (
          <div className="bg-indigo-50 rounded-md p-2">
            <Icon className="h-6 w-6 text-indigo-600" />
          </div>
        )}
      </div>

      {(change !== undefined || description) && (
        <div className="mt-4">
          {change !== undefined && (
            <div className="flex items-center">
              <changeIcon
                className={`${changeColor} h-4 w-4 mr-1 flex-shrink-0`}
              />
              <p className={`${changeColor} text-sm font-medium`}>
                {Math.abs(change)}%
              </p>
              {timeFrame && (
                <span className="ml-2 text-sm text-gray-500">{timeFrame}</span>
              )}
            </div>
          )}
          {description && (
            <p className="mt-2 text-sm text-gray-500">{description}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default StatsCard; 