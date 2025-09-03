import { FollowModel } from '../models/FollowModel.js';

export class FollowPresenter {
  static async followUser(req, res) {
    try {
      const { userId } = req.params;
      const followerId = req.user.userId;

      if (followerId === userId) {
        return res.status(400).json({
          success: false,
          message: 'No puedes seguirte a ti mismo'
        });
      }

      const result = await FollowModel.followUser(followerId, userId);

      if (result.success) {
        res.json({
          success: true,
          message: 'Usuario seguido exitosamente'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Error al seguir usuario'
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  static async unfollowUser(req, res) {
    try {
      const { userId } = req.params;
      const followerId = req.user.userId;

      const result = await FollowModel.unfollowUser(followerId, userId);

      if (result.success) {
        res.json({
          success: true,
          message: 'Usuario no seguido exitosamente'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Error al dejar de seguir usuario'
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  static async getFollowers(req, res) {
    try {
      const { userId } = req.params;

      const result = await FollowModel.getFollowers(userId);

      if (result.success) {
        res.json({
          success: true,
          data: result.data
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Error al obtener seguidores'
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  static async getFollowing(req, res) {
    try {
      const { userId } = req.params;

      const result = await FollowModel.getFollowing(userId);

      if (result.success) {
        res.json({
          success: true,
          data: result.data
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Error al obtener seguidos'
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  static async checkFollowStatus(req, res) {
    try {
      const { userId } = req.params;
      const followerId = req.user.userId;

      const result = await FollowModel.isFollowing(followerId, userId);

      if (result.success) {
        res.json({
          success: true,
          isFollowing: result.isFollowing
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Error al verificar estado de seguimiento'
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