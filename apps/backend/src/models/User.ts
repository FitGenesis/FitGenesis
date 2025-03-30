import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { WorkoutPlan } from './WorkoutPlan';
import { WorkoutSession } from './WorkoutSession';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @IsNotEmpty()
  firstName: string;

  @Column()
  @IsNotEmpty()
  lastName: string;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column()
  @MinLength(8)
  password: string;

  @Column({ nullable: true })
  avatarUrl?: string;

  @Column('jsonb')
  geneticData: {
    metabolismType: string;
    exerciseResponse: string;
    nutritionNeeds: string;
    riskFactors: string[];
  };

  @Column('jsonb', { nullable: true })
  fitnessGoals?: {
    type: 'weight_loss' | 'muscle_gain' | 'endurance' | 'strength';
    target: number;
    deadline: Date;
  };

  @Column('jsonb', { nullable: true })
  biometricData?: {
    height: number;
    weight: number;
    bodyFat?: number;
    muscleMass?: number;
    restingHeartRate?: number;
  };

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  tokenBalance: number;

  @OneToMany(() => WorkoutPlan, plan => plan.user)
  workoutPlans: WorkoutPlan[];

  @OneToMany(() => WorkoutSession, session => session.user)
  workoutSessions: WorkoutSession[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 