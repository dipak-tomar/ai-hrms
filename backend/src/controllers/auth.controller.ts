import { Request, Response } from 'express';
import { userService } from '../services/user.service';
import { authService } from '../services/auth.service';
import bcrypt from 'bcrypt';

class AuthController {
  public async register(req: Request, res: Response): Promise<Response> {
    try {
      const { email, password } = req.body;
      const existingUser = await userService.findUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }
      const user = await userService.createUser(req.body);
      const token = authService.generateToken(user);
      return res.status(201).json({ user, token });
    } catch (error) {
      return res.status(500).json({ message: 'Server error' });
    }
  }

  public async login(req: Request, res: Response): Promise<Response> {
    try {
      const { email, password } = req.body;
      const user = await userService.findUserByEmail(email);
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
      const token = authService.generateToken(user);
      return res.status(200).json({ user, token });
    } catch (error) {
      return res.status(500).json({ message: 'Server error' });
    }
  }
}

export const authController = new AuthController(); 