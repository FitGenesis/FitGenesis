import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { hash } from 'bcryptjs';
import { User } from '../models/User';
import { createToken } from '../utils/auth';
import { validateOrReject } from 'class-validator';

export class UserController {
  static register = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { firstName, lastName, email, password } = req.body;

      const userRepository = getRepository(User);
      const existingUser = await userRepository.findOne({ where: { email } });

      if (existingUser) {
        return res.status(400).json({ message: '该邮箱已被注册' });
      }

      const hashedPassword = await hash(password, 12);
      const user = userRepository.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
      });

      await validateOrReject(user);
      await userRepository.save(user);

      const token = createToken(user.id);
      return res.status(201).json({ token });
    } catch (error) {
      console.error('注册失败:', error);
      return res.status(500).json({ message: '注册失败，请稍后重试' });
    }
  };

  static getProfile = async (req: Request, res: Response): Promise<Response> => {
    try {
      const userRepository = getRepository(User);
      const user = await userRepository.findOne({ where: { id: req.user.id } });

      if (!user) {
        return res.status(404).json({ message: '用户不存在' });
      }

      return res.json(user);
    } catch (error) {
      console.error('获取用户资料失败:', error);
      return res.status(500).json({ message: '获取用户资料失败，请稍后重试' });
    }
  };

  static updateProfile = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { firstName, lastName, biometricData, fitnessGoals } = req.body;
      const userRepository = getRepository(User);
      const user = await userRepository.findOne({ where: { id: req.user.id } });

      if (!user) {
        return res.status(404).json({ message: '用户不存在' });
      }

      user.firstName = firstName || user.firstName;
      user.lastName = lastName || user.lastName;
      user.biometricData = biometricData || user.biometricData;
      user.fitnessGoals = fitnessGoals || user.fitnessGoals;

      await validateOrReject(user);
      await userRepository.save(user);

      return res.json(user);
    } catch (error) {
      console.error('更新用户资料失败:', error);
      return res.status(500).json({ message: '更新用户资料失败，请稍后重试' });
    }
  };

  static updateGeneticData = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { geneticData } = req.body;
      const userRepository = getRepository(User);
      const user = await userRepository.findOne({ where: { id: req.user.id } });

      if (!user) {
        return res.status(404).json({ message: '用户不存在' });
      }

      user.geneticData = geneticData;
      await userRepository.save(user);

      return res.json(user);
    } catch (error) {
      console.error('更新基因数据失败:', error);
      return res.status(500).json({ message: '更新基因数据失败，请稍后重试' });
    }
  };
} 