// src/hooks/usePostMetrics.ts
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

interface PostMetrics {
  views: number;
  likes: number;
  shares: number;
}

export function usePostMetrics(postId: string) {
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
      console.log("x");
      // Incrementar views automáticamente al cargar
      incrementMetric(postId, "views");
    }

    // Verificar si el usuario ya dio like (localStorage)
    const likedPosts = JSON.parse(localStorage.getItem("likedPosts") || "[]");
    setIsLiked(likedPosts.includes(postId));
  }, [postId]);

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

      // Actualizar estado local
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

  // Función para dar like
  const toggleLike = async () => {
    const likedPosts = JSON.parse(localStorage.getItem("likedPosts") || "[]");

    if (isLiked) {
      // Ya dio like, no hacer nada (o implementar "unlike" si quieres)
      return;
    }

    // Incrementar like
    const newLikes = await incrementMetric(postId, "likes");

    if (newLikes !== null) {
      // Guardar en localStorage
      likedPosts.push(postId);
      localStorage.setItem("likedPosts", JSON.stringify(likedPosts));
      setIsLiked(true);
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
  };
}