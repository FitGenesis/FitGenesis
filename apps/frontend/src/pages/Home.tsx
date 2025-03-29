import React from 'react';
import StatsCard from '../components/dashboard/StatsCard';
import WorkoutCard from '../components/workouts/WorkoutCard';
import {
  ChartBarIcon,
  ScaleIcon,
  HeartIcon,
  FireIcon,
} from '@heroicons/react/24/outline';

const Home: React.FC = () => {
  const stats = [
    {
      title: '本周训练次数',
      value: 5,
      unit: '次',
      change: 25,
      timeFrame: '较上周',
      icon: ChartBarIcon,
    },
    {
      title: '当前体重',
      value: 70.5,
      unit: 'kg',
      change: -2.3,
      timeFrame: '较上月',
      icon: ScaleIcon,
    },
    {
      title: '平均心率',
      value: 75,
      unit: 'bpm',
      change: -5,
      timeFrame: '较上周',
      icon: HeartIcon,
    },
    {
      title: '本周消耗热量',
      value: 3500,
      unit: 'kcal',
      change: 15,
      timeFrame: '较上周',
      icon: FireIcon,
    },
  ];

  const recommendedWorkouts = [
    {
      title: '高强度间歇训练',
      description: '基于您的基因类型定制的HIIT训练，帮助提高新陈代谢和燃烧脂肪。',
      duration: 30,
      calories: 400,
      difficulty: 'intermediate' as const,
      imageUrl: '/images/workouts/hiit.jpg',
    },
    {
      title: '力量训练',
      description: '针对您的肌肉生长基因特点优化的力量训练计划。',
      duration: 45,
      calories: 350,
      difficulty: 'advanced' as const,
      imageUrl: '/images/workouts/strength.jpg',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">健身数据概览</h2>
        <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <StatsCard key={stat.title} {...stat} />
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-900">推荐训练</h2>
        <p className="mt-1 text-sm text-gray-500">
          基于您的基因数据和健身目标推荐的个性化训练计划
        </p>
        <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {recommendedWorkouts.map((workout) => (
            <WorkoutCard key={workout.title} {...workout} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home; 