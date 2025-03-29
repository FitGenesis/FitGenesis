import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from 'react-query';
import { getWorkoutPlanById, logWorkoutSession } from '../api/workouts';

interface ExerciseLog {
  exerciseId: string;
  actualSets: number;
  actualReps: number;
  actualWeight?: number;
  actualDuration?: number;
}

const WorkoutDetail: React.FC = () => {
  const { planId } = useParams<{ planId: string }>();
  const navigate = useNavigate();
  const [exerciseLogs, setExerciseLogs] = useState<Record<string, ExerciseLog>>({});
  const [sessionNotes, setSessionNotes] = useState('');
  const [startTime, setStartTime] = useState<Date | null>(null);

  const { data: workoutPlan, isLoading } = useQuery(
    ['workoutPlan', planId],
    () => getWorkoutPlanById(planId!),
    {
      enabled: !!planId,
    }
  );

  const logSessionMutation = useMutation(
    (sessionData: {
      completedExercises: ExerciseLog[];
      startTime: Date;
      endTime: Date;
      caloriesBurned: number;
      notes?: string;
    }) => logWorkoutSession(planId!, sessionData)
  );

  const handleStartWorkout = () => {
    setStartTime(new Date());
  };

  const handleFinishWorkout = () => {
    if (!startTime || !workoutPlan) return;

    const endTime = new Date();
    const completedExercises = Object.values(exerciseLogs);
    
    // 简单计算消耗的卡路里
    const durationInMinutes = (endTime.getTime() - startTime.getTime()) / (1000 * 60);
    const estimatedCaloriesBurned = Math.round(durationInMinutes * 8); // 假设每分钟消耗8卡路里

    logSessionMutation.mutate(
      {
        completedExercises,
        startTime,
        endTime,
        caloriesBurned: estimatedCaloriesBurned,
        notes: sessionNotes,
      },
      {
        onSuccess: () => {
          navigate('/workouts');
        },
      }
    );
  };

  const updateExerciseLog = (
    exerciseId: string,
    field: keyof ExerciseLog,
    value: number
  ) => {
    setExerciseLogs(prev => ({
      ...prev,
      [exerciseId]: {
        ...prev[exerciseId],
        [field]: value,
      },
    }));
  };

  if (isLoading || !workoutPlan) {
    return (
      <div className="flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="relative h-64">
          <img
            src={workoutPlan.imageUrl}
            alt={workoutPlan.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <h1 className="text-4xl font-bold text-white">{workoutPlan.title}</h1>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-gray-600">{workoutPlan.description}</p>
              <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                <span>时长: {workoutPlan.duration}分钟</span>
                <span>预计消耗: {workoutPlan.calories}千卡</span>
              </div>
            </div>
            {!startTime ? (
              <button
                onClick={handleStartWorkout}
                className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                开始训练
              </button>
            ) : (
              <button
                onClick={handleFinishWorkout}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                完成训练
              </button>
            )}
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">训练动作</h2>
            {workoutPlan.exercises.map((exercise, index) => (
              <div
                key={index}
                className="border rounded-lg p-4 bg-gray-50"
              >
                <h3 className="text-lg font-medium mb-2">{exercise.name}</h3>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      组数 ({exercise.sets}组)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={exerciseLogs[index]?.actualSets || 0}
                      onChange={e =>
                        updateExerciseLog(
                          String(index),
                          'actualSets',
                          parseInt(e.target.value)
                        )
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      disabled={!startTime}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      次数 ({exercise.reps}次)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={exerciseLogs[index]?.actualReps || 0}
                      onChange={e =>
                        updateExerciseLog(
                          String(index),
                          'actualReps',
                          parseInt(e.target.value)
                        )
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      disabled={!startTime}
                    />
                  </div>
                  {exercise.weight && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        重量 ({exercise.weight}kg)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={exerciseLogs[index]?.actualWeight || 0}
                        onChange={e =>
                          updateExerciseLog(
                            String(index),
                            'actualWeight',
                            parseInt(e.target.value)
                          )
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        disabled={!startTime}
                      />
                    </div>
                  )}
                  {exercise.duration && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        时长 ({exercise.duration}秒)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={exerciseLogs[index]?.actualDuration || 0}
                        onChange={e =>
                          updateExerciseLog(
                            String(index),
                            'actualDuration',
                            parseInt(e.target.value)
                          )
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        disabled={!startTime}
                      />
                    </div>
                  )}
                </div>
                <div className="mt-2 text-sm text-gray-500">
                  休息时间: {exercise.restTime}秒
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <label
              htmlFor="notes"
              className="block text-sm font-medium text-gray-700"
            >
              训练笔记
            </label>
            <textarea
              id="notes"
              rows={4}
              value={sessionNotes}
              onChange={e => setSessionNotes(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="记录今天的训练感受..."
              disabled={!startTime}
            />
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">目标肌群</h3>
            <div className="flex flex-wrap gap-2">
              {workoutPlan.targetMuscles.map((muscle, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm"
                >
                  {muscle}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">所需器材</h3>
            <div className="flex flex-wrap gap-2">
              {workoutPlan.equipment.map((item, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">基因因素</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-3 bg-yellow-50 rounded-lg">
                <span className="block text-sm font-medium text-yellow-800">
                  代谢影响
                </span>
                <span className="block mt-1 text-yellow-600">
                  {workoutPlan.geneticFactors.metabolismImpact}
                </span>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <span className="block text-sm font-medium text-green-800">
                  恢复速度
                </span>
                <span className="block mt-1 text-green-600">
                  {workoutPlan.geneticFactors.recoverySpeed}
                </span>
              </div>
              <div className="p-3 bg-red-50 rounded-lg">
                <span className="block text-sm font-medium text-red-800">
                  受伤风险
                </span>
                <span className="block mt-1 text-red-600">
                  {workoutPlan.geneticFactors.injuryRisk}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkoutDetail; 