// src/hooks/usePostMetrics.ts
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";

interface PostMetrics {
  views: number;
  likes: number;
  shares: number;
}

export function usePostMetrics(postId: string) {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<PostMetrics>({
    views: 0,
    likes: 0,
    shares: 0,
  });
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(true);

  // Cargar métricas iniciales
  useEffect(() => {
    async function fetchMetrics() {
      try {
        const { data, error } = await supabase
          .from("posts")
          .select("views, likes, shares")
          .eq("id", postId)
          .single();

        if (error) throw error;
        if (data) {
          setMetrics({
            views: data.views || 0,
            likes: data.likes || 0,
            shares: data.shares || 0,
          });
        }
      } catch (error) {
        console.error("Error fetching metrics:", error);
      } finally {
        setLoading(false);
      }
    }

    if (postId) {
      fetchMetrics();
      incrementMetric(postId, "views");
    }

    // Verificar si el usuario ya dio like EN SUPABASE (no localStorage)
    if (user) {
      checkIfLiked();
    }
  }, [postId, user]);

  // Verificar si el usuario ya dio like
  const checkIfLiked = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("post_likes")
        .select("id")
        .eq("post_id", postId)
        .eq("user_id", user.id)
        .single();

      if (!error && data) {
        setIsLiked(true);
      }
    } catch (error) {
      // No existe el like, está bien
    }
  };

  // Función para incrementar métricas
  const incrementMetric = async (
    postId: string,
    metric: "views" | "likes" | "shares",
  ) => {
    try {
      const { data, error } = await supabase.rpc("increment_metrics", {
        target_post_id: postId,
        metric_name: metric,
      });
      if (error) throw error;

      setMetrics((prev) => ({
        ...prev,
        [metric]: data || prev[metric] + 1,
      }));

      return data;
    } catch (error) {
      console.error(`Error incrementing ${metric}:`, error);
      return null;
    }
  };

  // Función para dar like (SOLO SI ESTÁ LOGUEADO)
const toggleLike = async (): Promise<boolean> => {
  if (!user) {
    // Usuario no logueado - retornar false
    return false;
  }

  try {
    if (isLiked) {
      // Ya dio like, quitar like
      await removeLike();
    } else {
      // Dar like
      await addLike();
    }
    return true;
  } catch (error) {
    console.error('Error toggling like:', error);
    return false;
  }
};

  // Agregar like a Supabase
  const addLike = async () => {
    if (!user) return;

    try {
      // Insertar en tabla post_likes
      const { error: likeError } = await supabase
        .from("post_likes")
        .insert({
          user_id: user.id,
          post_id: postId,
        });

      if (likeError) throw likeError;

      // Incrementar contador
      await incrementMetric(postId, "likes");
      setIsLiked(true);
    } catch (error) {
      console.error("Error adding like:", error);
    }
  };

  // Quitar like de Supabase
  const removeLike = async () => {
    if (!user) return;

    try {
      // Eliminar de tabla post_likes
      const { error: deleteError } = await supabase
        .from("post_likes")
        .delete()
        .eq("user_id", user.id)
        .eq("post_id", postId);

      if (deleteError) throw deleteError;

      // Decrementar contador manualmente
      setMetrics((prev) => ({
        ...prev,
        likes: Math.max(0, prev.likes - 1),
      }));

      setIsLiked(false);

      // Actualizar en la tabla posts
      await supabase
        .from("posts")
        .update({ likes: Math.max(0, metrics.likes - 1) })
        .eq("id", postId);
    } catch (error) {
      console.error("Error removing like:", error);
    }
  };

  // Función para compartir
  const handleShare = async () => {
    await incrementMetric(postId, "shares");
  };

  return {
    metrics,
    loading,
    isLiked,
    toggleLike,
    handleShare,
    isLoggedIn: !!user,
  };
}