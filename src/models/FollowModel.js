import { supabase } from '../config/supabase.js';

export class FollowModel {
  static async followUser(followerId, followingId) {
    try {
      const { error } = await supabase
        .from('follows')
        .insert([{ follower_id: followerId, following_id: followingId }]);
      
      if (error) throw error;
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  static async unfollowUser(followerId, followingId) {
    try {
      const { error } = await supabase
        .from('follows')
        .delete()
        .eq('follower_id', followerId)
        .eq('following_id', followingId);
      
      if (error) throw error;
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  static async getFollowers(userId) {
    try {
      const { data, error } = await supabase
        .from('follows')
        .select(`
          follower:users!follower_id(id, username, full_name, avatar_url)
        `)
        .eq('following_id', userId);
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  static async getFollowing(userId) {
    try {
      const { data, error } = await supabase
        .from('follows')
        .select(`
          following:users!following_id(id, username, full_name, avatar_url)
        `)
        .eq('follower_id', userId);
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  static async isFollowing(followerId, followingId) {
    try {
      const { data, error } = await supabase
        .from('follows')
        .select('id')
        .eq('follower_id', followerId)
        .eq('following_id', followingId)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return { success: true, isFollowing: !!data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}