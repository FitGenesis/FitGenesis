import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from './User';
import { WorkoutSession } from './WorkoutSession';

@Entity('workout_plans')
export class WorkoutPlan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column()
  duration: number;

  @Column()
  calories: number;

  @Column({
    type: 'enum',
    enum: ['beginner', 'intermediate', 'advanced'],
  })
  difficulty: 'beginner' | 'intermediate' | 'advanced';

  @Column()
  imageUrl: string;

  @Column('jsonb')
  exercises: {
    name: string;
    sets: number;
    reps: number;
    weight?: number;
    duration?: number;
    restTime: number;
  }[];

  @Column('simple-array')
  targetMuscles: string[];

  @Column('simple-array')
  equipment: string[];

  @Column('jsonb')
  geneticFactors: {
    metabolismImpact: string;
    recoverySpeed: string;
    injuryRisk: string;
  };

  @Column()
  userId: string;

  @ManyToOne(() => User, user => user.workoutPlans)
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => WorkoutSession, session => session.workoutPlan)
  sessions: WorkoutSession[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 