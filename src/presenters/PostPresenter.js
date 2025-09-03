import { PostModel } from '../models/PostModel.js';

export class PostPresenter {
  static async createPost(req, res) {
    try {
      const { content, imageUrl } = req.body;
      const userId = req.user.userId;

      if (!content && !imageUrl) {
        return res.status(400).json({
          success: false,
          message: 'El contenido o imagen son requeridos'
        });
      }

      const postData = {
        user_id: userId,
        content: content || '',
        image_url: imageUrl || null,
        created_at: new Date().toISOString()
      };

      const result = await PostModel.createPost(postData);

      if (result.success) {
        res.status(201).json({
          success: true,
          message: 'Publicación creada exitosamente',
          data: result.data
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Error al crear publicación'
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  static async getFeedPosts(req, res) {
    try {
      const userId = req.user.userId;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const offset = (page - 1) * limit;

      const result = await PostModel.getFeedPosts(userId, limit, offset);

      if (result.success) {
        res.json({
          success: true,
          data: result.data,
          page,
          limit
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Error al obtener publicaciones'
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  static async likePost(req, res) {
    try {
      const { postId } = req.params;
      const userId = req.user.userId;

      const result = await PostModel.likePost(userId, postId);

      if (result.success) {
        res.json({
          success: true,
          message: 'Publicación marcada como me gusta'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Error al dar like'
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  static async addComment(req, res) {
    try {
      const { postId } = req.params;
      const { content } = req.body;
      const userId = req.user.userId;

      if (!content) {
        return res.status(400).json({
          success: false,
          message: 'El contenido del comentario es requerido'
        });
      }

      const commentData = {
        post_id: postId,
        user_id: userId,
        content,
        created_at: new Date().toISOString()
      };

      const result = await PostModel.addComment(commentData);

      if (result.success) {
        res.status(201).json({
          success: true,
          message: 'Comentario agregado exitosamente',
          data: result.data
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Error al agregar comentario'
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