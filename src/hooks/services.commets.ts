import { supabase } from "../lib/supabase";

export interface Comment {
  id: string;
  content: string;
  post_id: string;
  user_id: string;
  parent_comment_id: string | null;
  created_at: string;
  users: {
    id: string;
    name: string;
    email: string;
    avatar_url: string;
  };
  replies?: Comment[];
}

export const commentsService = {
  // Obtener comentarios de un post
  async getCommentsByPost(postId: string): Promise<Comment[]> {
    console.log("Cargando comentarios para post:", postId);
    try {
      const { data, error } = await supabase
        .from("comments")
        .select(
          `
          id,
          content,
          post_id,
          user_id,
          parent_comment_id,
          created_at,
          users (
            id,
            name,
            email,
            avatar_url
          )
        `,
        )
        .eq("post_id", postId)
        .is("parent_comment_id", null)
        .order("created_at", { ascending: false });
      //console.log(data);
      if (error) {
        console.error("Error de Supabase:", error);
        throw error;
      }
      // Obtener respuestas para cada comentario
      const commentsWithReplies = await Promise.all(
        (data || []).map(async (comment) => {
          const replies = await this.getReplies(comment.id);
          return {
            ...comment,
            replies,
            users: Array.isArray(comment.users)
              ? comment.users[0]
              : comment.users,
          };
        }),
      );
      return commentsWithReplies;
    } catch (error) {
      console.log(error);
      return [];
    }
  },

  // Obtener respuestas de un comentario
  async getReplies(commentId: string): Promise<Comment[]> {
    try {
      const { data, error } = await supabase
        .from("comments")
        .select(
          `
          id,
          content,
          post_id,
          user_id,
          parent_comment_id,
          created_at,
          users!comments_user_id_fkey (
            id,
            name,
            email,
            avatar_url
          )
        `,
        )
        .eq("parent_comment_id", commentId)
        .order("created_at", { ascending: true });

      if (error) throw error;

      return (data || []).map((reply) => ({
        ...reply,
        users: Array.isArray(reply.users) ? reply.users[0] : reply.users,
      }));
    } catch (error) {
      console.error("Error al obtener respuestas:", error);
      return [];
    }
  },

  // Crear un nuevo comentario
  async createComment(
    postId: string,
    userId: string,
    content: string,
    parentCommentId: string | null = null,
  ): Promise<Comment | null> {
    try {
      // Primero insertar el comentario
      const { data: newComment, error: insertError } = await supabase
        .from("comments")
        .insert({
          post_id: postId,
          user_id: userId,
          content: content.trim(),
          parent_comment_id: parentCommentId,
        })
        .select()
        .single();

      if (insertError) {
        console.error("Error al insertar:", insertError);
        throw insertError;
      }

      // Luego obtener el comentario con los datos del usuario
      const { data, error } = await supabase
        .from("comments")
        .select(
          `
          id,
          content,
          post_id,
          user_id,
          parent_comment_id,
          created_at,
          users!comments_user_id_fkey (
            id,
            name,
            email,
            avatar_url
          )
        `,
        )
        .eq("id", newComment.id)
        .single();

      if (error) {
        console.error("Error al obtener comentario con usuario:", error);
        throw error;
      }

      //console.log("Comentario con usuario:", data);

      return {
        ...data,
        users: Array.isArray(data.users) ? data.users[0] : data.users,
      };
    } catch (error) {
      console.error("Error al crear comentario:", error);
      return null;
    }
  },

  // Eliminar comentario (solo si es el autor)
  async deleteComment(commentId: string, userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("comments")
        .delete()
        .eq("id", commentId)
        .eq("user_id", userId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error al eliminar comentario:", error);
      return false;
    }
  },

  // contar los comentarios del post
  async getCount(postId: string): Promise<number> {
    try {
      const { count, error } = await supabase
        .from("comments")
        .select("*", { count: "exact", head: true })
        .eq("post_id", postId);

      if (error) {
        throw error;
      }
      console.log(count);
      return count ?? 0;
    } catch (error) {
      console.log(error);
    }
    return 0;
  },
};
