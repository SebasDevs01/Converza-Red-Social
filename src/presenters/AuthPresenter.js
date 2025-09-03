import { UserModel } from '../models/UserModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export class AuthPresenter {
  static async register(req, res) {
    try {
      const { username, email, password, fullName } = req.body;

      // Validaciones
      if (!username || !email || !password || !fullName) {
        return res.status(400).json({
          success: false,
          message: 'Todos los campos son requeridos'
        });
      }

      // Verificar si el usuario ya existe
      const existingUser = await UserModel.getUserByEmail(email);
      if (existingUser.data) {
        return res.status(400).json({
          success: false,
          message: 'El usuario ya existe'
        });
      }

      // Encriptar contraseña
      const hashedPassword = await bcrypt.hash(password, 10);

      // Crear usuario
      const userData = {
        username,
        email,
        password_hash: hashedPassword,
        full_name: fullName,
        avatar_url: 'https://images.pexels.com/photos/1851164/pexels-photo-1851164.jpeg?auto=compress&cs=tinysrgb&w=150',
        bio: '',
        created_at: new Date().toISOString()
      };

      const result = await UserModel.createUser(userData);

      if (result.success) {
        // Generar token JWT
        const token = jwt.sign(
          { userId: result.data.id, email: result.data.email },
          process.env.JWT_SECRET || 'secret_key',
          { expiresIn: '7d' }
        );

        res.status(201).json({
          success: true,
          message: 'Usuario registrado exitosamente',
          token,
          user: {
            id: result.data.id,
            username: result.data.username,
            email: result.data.email,
            fullName: result.data.full_name,
            avatarUrl: result.data.avatar_url
          }
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Error al registrar usuario'
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email y contraseña son requeridos'
        });
      }

      const result = await UserModel.getUserByEmail(email);
      
      if (!result.success || !result.data) {
        return res.status(401).json({
          success: false,
          message: 'Credenciales inválidas'
        });
      }

      const isValidPassword = await bcrypt.compare(password, result.data.password_hash);
      
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          message: 'Credenciales inválidas'
        });
      }

      const token = jwt.sign(
        { userId: result.data.id, email: result.data.email },
        process.env.JWT_SECRET || 'secret_key',
        { expiresIn: '7d' }
      );

      res.json({
        success: true,
        message: 'Login exitoso',
        token,
        user: {
          id: result.data.id,
          username: result.data.username,
          email: result.data.email,
          fullName: result.data.full_name,
          avatarUrl: result.data.avatar_url,
          bio: result.data.bio
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  static async verifyToken(req, res, next) {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      
      if (!token) {
        return res.status(401).json({
          success: false,
          message: 'Token no proporcionado'
        });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key');
      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json({
        success: false,
        message: 'Token inválido'
      });
    }
  }
}