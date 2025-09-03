import { UserModel } from '../models/UserModel.js';

export class UserPresenter {
  static async getProfile(req, res) {
    try {
      const { userId } = req.params;
      
      const result = await UserModel.getUserById(userId);

      if (result.success && result.data) {
        const { password_hash, ...userWithoutPassword } = result.data;
        res.json({
          success: true,
          data: userWithoutPassword
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'Usuario no encontrado'
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  static async updateProfile(req, res) {
    try {
      const userId = req.user.userId;
      const { fullName, bio, avatarUrl } = req.body;

      const updates = {};
      if (fullName) updates.full_name = fullName;
      if (bio !== undefined) updates.bio = bio;
      if (avatarUrl) updates.avatar_url = avatarUrl;

      const result = await UserModel.updateUser(userId, updates);

      if (result.success) {
        const { password_hash, ...userWithoutPassword } = result.data;
        res.json({
          success: true,
          message: 'Perfil actualizado exitosamente',
          data: userWithoutPassword
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Error al actualizar perfil'
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  static async searchUsers(req, res) {
    try {
      const { query } = req.query;

      if (!query || query.trim().length < 2) {
        return res.status(400).json({
          success: false,
          message: 'La búsqueda debe tener al menos 2 caracteres'
        });
      }

      const result = await UserModel.searchUsers(query.trim());

      if (result.success) {
        res.json({
          success: true,
          data: result.data
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Error en la búsqueda'
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }
}