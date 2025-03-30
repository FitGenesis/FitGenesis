import { User } from '../models/User';
import { WorkoutPlan } from '../models/WorkoutPlan';

interface ExerciseTemplate {
  name: string;
  targetMuscles: string[];
  equipment: string[];
  metabolismImpact: string;
  injuryRisk: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  defaultSets: number;
  defaultReps: number;
  defaultWeight?: number;
  defaultDuration?: number;
  defaultRestTime: number;
}

const exerciseTemplates: ExerciseTemplate[] = [
  {
    name: '深蹲',
    targetMuscles: ['大腿', '臀部', '核心'],
    equipment: ['杠铃', '深蹲架'],
    metabolismImpact: 'high',
    injuryRisk: 'medium',
    difficulty: 'intermediate',
    defaultSets: 4,
    defaultReps: 8,
    defaultWeight: 60,
    defaultRestTime: 120,
  },
  {
    name: '卧推',
    targetMuscles: ['胸部', '三头肌', '肩部'],
    equipment: ['杠铃', '卧推凳'],
    metabolismImpact: 'medium',
    injuryRisk: 'medium',
    difficulty: 'intermediate',
    defaultSets: 4,
    defaultReps: 10,
    defaultWeight: 50,
    defaultRestTime: 90,
  },
  {
    name: '高强度间歇跑',
    targetMuscles: ['心肺', '腿部'],
    equipment: ['跑步机'],
    metabolismImpact: 'high',
    injuryRisk: 'low',
    difficulty: 'advanced',
    defaultSets: 8,
    defaultReps: 1,
    defaultDuration: 60,
    defaultRestTime: 60,
  },
  // ... 更多运动模板
];

export const generateWorkoutPlanBasedOnGenetics = async (user: User): Promise<WorkoutPlan> => {
  const { geneticData } = user;

  // 根据基因数据分析用户的特点
  const metabolismType = geneticData.metabolismType; // 'fast' | 'normal' | 'slow'
  const muscleType = geneticData.muscleType; // 'power' | 'endurance'
  const recoverySpeed = geneticData.recoverySpeed; // 'fast' | 'normal' | 'slow'
  const injuryRisk = geneticData.injuryRisk; // 'low' | 'medium' | 'high'

  // 根据基因特点选择合适的运动
  const suitableExercises = exerciseTemplates.filter(exercise => {
    // 根据代谢类型筛选
    if (metabolismType === 'slow' && exercise.metabolismImpact === 'high') {
      return false;
    }
    // 根据受伤风险筛选
    if (injuryRisk === 'high' && exercise.injuryRisk !== 'low') {
      return false;
    }
    return true;
  });

  // 根据恢复速度调整休息时间
  const adjustRestTime = (baseTime: number): number => {
    switch (recoverySpeed) {
      case 'fast':
        return baseTime * 0.8;
      case 'slow':
        return baseTime * 1.2;
      default:
        return baseTime;
    }
  };

  // 根据肌肉类型调整组数和重复次数
  const adjustSetsAndReps = (exercise: ExerciseTemplate) => {
    if (muscleType === 'power') {
      return {
        sets: exercise.defaultSets,
        reps: Math.max(6, exercise.defaultReps - 2),
        weight: exercise.defaultWeight ? exercise.defaultWeight * 1.1 : undefined,
        duration: exercise.defaultDuration,
        restTime: adjustRestTime(exercise.defaultRestTime),
      };
    } else {
      return {
        sets: exercise.defaultSets + 1,
        reps: exercise.defaultReps + 2,
        weight: exercise.defaultWeight ? exercise.defaultWeight * 0.9 : undefined,
        duration: exercise.defaultDuration,
        restTime: adjustRestTime(exercise.defaultRestTime),
      };
    }
  };

  // 选择6-8个运动组成训练计划
  const selectedExercises = suitableExercises
    .sort(() => Math.random() - 0.5)
    .slice(0, 7)
    .map(template => ({
      name: template.name,
      ...adjustSetsAndReps(template),
    }));

  // 计算训练时长和卡路里消耗
  const totalDuration = selectedExercises.reduce(
    (total, exercise) =>
      total +
      (exercise.duration || 0) * exercise.sets +
      exercise.restTime * (exercise.sets - 1),
    0
  );

  const estimatedCalories = Math.round(totalDuration / 60 * 8); // 粗略估算，每分钟8卡路里

  // 创建训练计划
  const workoutPlan: Partial<WorkoutPlan> = {
    title: `个性化${muscleType === 'power' ? '力量' : '耐力'}训练计划`,
    description: `根据您的基因特点定制的训练计划，特别关注${
      metabolismType === 'fast' ? '高强度' : '中等强度'
    }运动，并考虑到您的${recoverySpeed}恢复速度。`,
    duration: Math.round(totalDuration / 60), // 转换为分钟
    calories: estimatedCalories,
    difficulty: injuryRisk === 'high' ? 'beginner' : 'intermediate',
    imageUrl: 'https://example.com/workout-plan-image.jpg', // 需要替换为实际图片
    exercises: selectedExercises,
    targetMuscles: Array.from(
      new Set(selectedExercises.flatMap(e => exerciseTemplates.find(t => t.name === e.name)?.targetMuscles || []))
    ),
    equipment: Array.from(
      new Set(selectedExercises.flatMap(e => exerciseTemplates.find(t => t.name === e.name)?.equipment || []))
    ),
    geneticFactors: {
      metabolismImpact: metabolismType,
      recoverySpeed,
      injuryRisk,
    },
    userId: user.id,
  };

  return workoutPlan as WorkoutPlan;
}; 