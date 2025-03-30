import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './User';
import { WorkoutPlan } from './WorkoutPlan';

@Entity('workout_sessions')
export class WorkoutSession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  workoutPlanId: string;

  @Column('jsonb')
  completedExercises: {
    exerciseId: string;
    actualSets: number;
    actualReps: number;
    actualWeight?: number;
    actualDuration?: number;
  }[];

  @Column()
  startTime: Date;

  @Column()
  endTime: Date;

  @Column()
  caloriesBurned: number;

  @Column({ nullable: true })
  notes?: string;

  @ManyToOne(() => User, user => user.workoutSessions)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => WorkoutPlan, plan => plan.sessions)
  @JoinColumn({ name: 'workoutPlanId' })
  workoutPlan: WorkoutPlan;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 