import React from 'react';
import { useQuery } from 'react-query';
import { useAuth } from '../contexts/AuthContext';
import { getWorkoutPlans } from '../api/workouts';
import WorkoutCard from '../components/workouts/WorkoutCard';

interface WorkoutPlan {
  id: string;
  title: string;
  description: string;
  duration: number;
  calories: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  imageUrl: string;
  exercises: {
    name: string;
    sets: number;
    reps: number;
    weight?: number;
    duration?: number;
    restTime: number;
  }[];
  targetMuscles: string[];
  equipment: string[];
  geneticFactors: {
    metabolismImpact: string;
    recoverySpeed: string;
    injuryRisk: string;
  };
}

const Workouts: React.FC = () => {
  const { user } = useAuth();
  const { data: workoutPlans, isLoading } = useQuery<WorkoutPlan[]>(
    ['workoutPlans', user?.id],
    getWorkoutPlans,
    {
      enabled: !!user?.id,
    }
  );

  if (isLoading) {
    return (
      <div className="flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">个性化训练计划</h2>
          <p className="mt-1 text-sm text-gray-500">
            基于您的基因数据和健身目标定制的训练计划
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            生成新计划
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {workoutPlans?.map((plan) => (
          <WorkoutCard
            key={plan.id}
            title={plan.title}
            description={plan.description}
            duration={plan.duration}
            calories={plan.calories}
            difficulty={plan.difficulty}
            imageUrl={plan.imageUrl}
            onClick={() => {
              // TODO: 导航到训练计划详情页
              console.log('查看训练计划:', plan.id);
            }}
          />
        ))}
      </div>

      {workoutPlans?.length === 0 && (
        <div className="text-center py-12">
          <h3 className="mt-2 text-sm font-medium text-gray-900">暂无训练计划</h3>
          <p className="mt-1 text-sm text-gray-500">
            请先上传您的基因数据，我们将为您生成个性化的训练计划。
          </p>
        </div>
      )}
    </div>
  );
};

export default Workouts; 