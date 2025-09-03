import { ChatModel } from '../models/ChatModel.js';

export class ChatPresenter {
  static async sendMessage(req, res) {
    try {
      const { receiverId, content } = req.body;
      const senderId = req.user.userId;

      if (!content || !receiverId) {
        return res.status(400).json({
          success: false,
          message: 'Contenido y destinatario son requeridos'
        });
      }

      const messageData = {
        sender_id: senderId,
        receiver_id: receiverId,
        content,
        created_at: new Date().toISOString()
      };

      const result = await ChatModel.sendMessage(messageData);

      if (result.success) {
        res.status(201).json({
          success: true,
          message: 'Mensaje enviado exitosamente',
          data: result.data
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Error al enviar mensaje'
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  static async getConversation(req, res) {
    try {
      const { userId } = req.params;
      const currentUserId = req.user.userId;

      const result = await ChatModel.getConversation(currentUserId, userId);

      if (result.success) {
        res.json({
          success: true,
          data: result.data
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Error al obtener conversación'
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  static async getUserConversations(req, res) {
    try {
      const userId = req.user.userId;

      const result = await ChatModel.getUserConversations(userId);

      if (result.success) {
        res.json({
          success: true,
          data: result.data
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Error al obtener conversaciones'
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