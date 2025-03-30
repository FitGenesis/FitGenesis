import { Router } from 'express';
import { WorkoutController } from '../controllers/WorkoutController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();
const workoutController = new WorkoutController();

// 获取用户的所有训练计划
router.get('/plans', authMiddleware, workoutController.getWorkoutPlans);

// 生成新的训练计划
router.post('/generate', authMiddleware, workoutController.generateWorkoutPlan);

// 获取特定训练计划
router.get('/plans/:planId', authMiddleware, workoutController.getWorkoutPlanById);

// 更新训练计划
router.patch('/plans/:planId', authMiddleware, workoutController.updateWorkoutPlan);

// 删除训练计划
router.delete('/plans/:planId', authMiddleware, workoutController.deleteWorkoutPlan);

// 记录训练会话
router.post('/plans/:planId/sessions', authMiddleware, workoutController.logWorkoutSession);

export default router; 