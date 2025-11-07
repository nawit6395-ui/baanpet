import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ForumPost {
  id: string;
  user_id: string;
  title: string;
  content: string;
  category: string;
  views: number;
  is_pinned: boolean;
  is_locked: boolean;
  created_at: string;
  updated_at: string;
  profiles?: {
    full_name: string;
    avatar_url?: string;
  };
  comment_count?: number;
}

export const useForumPosts = (category?: string) => {
  return useQuery({
    queryKey: ['forum-posts', category],
    queryFn: async () => {
      let query = supabase
        .from('forum_posts')
        .select('*')
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false });

      if (category && category !== 'all') {
        query = query.eq('category', category);
      }

      const { data: posts, error } = await query;

      if (error) throw error;

      // Get user profiles and comment counts
      const postsWithDetails = await Promise.all(
        (posts || []).map(async (post) => {
          // Get profile
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name, avatar_url')
            .eq('id', post.user_id)
            .single();

          // Get comment count
          const { count } = await supabase
            .from('forum_comments')
            .select('*', { count: 'exact', head: true })
            .eq('post_id', post.id);

          return { 
            ...post, 
            profiles: profile || undefined,
            comment_count: count || 0 
          };
        })
      );

      return postsWithDetails as ForumPost[];
    },
  });
};

export const useForumPost = (postId: string) => {
  return useQuery({
    queryKey: ['forum-post', postId],
    queryFn: async () => {
      const { data: post, error } = await supabase
        .from('forum_posts')
        .select('*')
        .eq('id', postId)
        .single();

      if (error) throw error;

      // Get profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, avatar_url')
        .eq('id', post.user_id)
        .single();

      // Increment view count
      await supabase
        .from('forum_posts')
        .update({ views: post.views + 1 })
        .eq('id', postId);

      return { ...post, profiles: profile || undefined } as ForumPost;
    },
    enabled: !!postId,
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newPost: {
      title: string;
      content: string;
      category: string;
      user_id: string;
    }) => {
      const { data, error } = await supabase
        .from('forum_posts')
        .insert([newPost])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forum-posts'] });
      toast.success('สร้างกระทู้สำเร็จ!');
    },
    onError: (error: any) => {
      toast.error('เกิดข้อผิดพลาด', {
        description: error.message,
      });
    },
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: string) => {
      const { error } = await supabase
        .from('forum_posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forum-posts'] });
      toast.success('ลบกระทู้สำเร็จ');
    },
    onError: (error: any) => {
      toast.error('เกิดข้อผิดพลาด', {
        description: error.message,
      });
    },
  });
};
