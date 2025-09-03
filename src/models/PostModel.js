import { supabase } from '../config/supabase.js';

export class PostModel {
  static async createPost(postData) {
    try {
      const { data, error } = await supabase
        .from('posts')
        .insert([postData])
        .select(`
          *,
          user:users(id, username, full_name, avatar_url)
        `)
        .single();
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  static async getFeedPosts(userId, limit = 20, offset = 0) {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          user:users(id, username, full_name, avatar_url),
          likes:post_likes(count),
          comments:post_comments(count)
        `)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  static async likePost(userId, postId) {
    try {
      const { error } = await supabase
        .from('post_likes')
        .insert([{ user_id: userId, post_id: postId }]);
      
      if (error) throw error;
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  static async unlikePost(userId, postId) {
    try {
      const { error } = await supabase
        .from('post_likes')
        .delete()
        .eq('user_id', userId)
        .eq('post_id', postId);
      
      if (error) throw error;
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  static async addComment(commentData) {
    try {
      const { data, error } = await supabase
        .from('post_comments')
        .insert([commentData])
        .select(`
          *,
          user:users(id, username, full_name, avatar_url)
        `)
        .single();
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}