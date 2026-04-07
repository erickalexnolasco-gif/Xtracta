// src/components/post/CommentsSection.tsx
import { useState, useEffect } from "react";
import { MessageSquare, Heart } from "lucide-react";
import { commentsService, type Comment } from "../../hooks/services.commets";
import { useAuth } from "../../contexts/AuthContext";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

interface CommentsSectionProps {
  postId: string;
}

export default function CommentsSection({ postId }: CommentsSectionProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");

  useEffect(() => {
    loadComments();
  }, [postId]);

  async function loadComments() {
    setLoading(true);
    const data = await commentsService.getCommentsByPost(postId);
    setComments(data);
    setLoading(false);
  }

  async function handleSubmitComment() {
    // Si usuario no esta autenticado o el comentario es vacio, no se hace nada
    if (!user || !newComment.trim()) return;

    setSubmitting(true);
    const comment = await commentsService.createComment(
      postId,
      user.id,
      newComment,
      null,
    );

    if (comment) {
      setComments([comment, ...comments]);
      setNewComment("");
    }
    setSubmitting(false);
  }

  async function handleSubmitReply(parentId: string) {
    // Si usuario no esta autenticado o el comentario es vacio, no se hace nada
    if (!user || !replyContent.trim()) return;

    setSubmitting(true);
    const reply = await commentsService.createComment(
      postId,
      user.id,
      replyContent,
      parentId,
    );

    if (reply) {
      setComments(
        comments.map((c) =>
          c.id === parentId
            ? { ...c, replies: [...(c.replies || []), reply] }
            : c,
        ),
      );
      setReplyContent("");
      setReplyingTo(null);
    }
    setSubmitting(false);
  }

  function formatTime(date: string) {
    return formatDistanceToNow(new Date(date), {
      addSuffix: true,
      locale: es,
    });
  }

  if (loading) {
    return (
      <section className="mt-16 bg-[#fafafa] rounded-4xl p-8 md:p-12 border border-gray-100">
        <div className="text-center py-8">
          <p className="text-gray-500">Cargando comentarios...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-16 bg-[#fafafa] rounded-4xl p-8 md:p-12 border border-gray-100">
      <h3 className="text-2xl font-bold mb-10 text-[#1d1d1f]">
        Conversación ({comments.length})
      </h3>

      {/* Input para nuevo comentario */}
      {user ? (
        <div className="flex gap-6 mb-16">
          <div className="w-12 h-12 rounded-full bg-white border border-gray-200 shrink-0 flex items-center justify-center overflow-hidden shadow-sm">
            {user.user_metadata?.avatar_url ? (
              <img
                src={user.user_metadata.avatar_url}
                alt={user.user_metadata.name || user.email}
                className="w-full h-full object-cover"
              />
            ) : (
              <svg
                className="w-6 h-6 text-gray-300"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>
          <div className="grow">
            <textarea
              className="w-full rounded-2xl p-5 text-[15px] focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400/50 transition-all outline-none resize-none placeholder:text-gray-400 bg-white/80 backdrop-blur-sm border border-gray-200/80"
              placeholder="Añade tu perspectiva a la conversación..."
              rows={3}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              disabled={submitting}
            />
            <div className="flex justify-between items-center mt-4">
              <p className="text-[11px] text-gray-400 font-medium tracking-wide">
                Por favor, mantén un tono profesional.
              </p>
              <button
                onClick={handleSubmitComment}
                disabled={submitting || !newComment.trim()}
                className="bg-[#1d1d1f] text-white px-7 py-2.5 rounded-full text-[14px] font-bold hover:bg-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Publicando..." : "Publicar"}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="mb-16 p-6 bg-white rounded-2xl border border-gray-200 text-center">
          <p className="text-gray-600">
            Inicia sesión para participar en la conversación
          </p>
        </div>
      )}

      {/* Lista de comentarios */}
      <div className="space-y-12">
        {comments.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Sé el primero en comentar</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="relative">
              {comment.replies && comment.replies.length > 0 && (
                <div className="absolute left-6 top-12 bottom-0 w-px bg-gray-200" />
              )}

              {/* Comentario principal */}
              <div className="flex gap-6 relative z-10 bg-[#fafafa]">
                <div className="w-12 h-12 rounded-full border border-gray-200 shrink-0 overflow-hidden shadow-sm">
                  <img
                    alt={comment.users.name}
                    className="w-full h-full object-cover"
                    src={
                      comment.users.avatar_url ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.users.name)}`
                    }
                  />
                </div>
                <div className="grow">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-[15px] font-bold text-[#1d1d1f]">
                      {comment.users.name}
                    </span>
                    <span className="text-[12px] font-medium text-[#86868b]">
                      {formatTime(comment.created_at)}
                    </span>
                  </div>
                  <p className="text-[15px] text-[#424245] leading-relaxed mb-4">
                    {comment.content}
                  </p>
                  <div className="flex items-center gap-6">
                    <button
                      onClick={() => setReplyingTo(comment.id)}
                      className="flex items-center gap-1.5 text-[13px] font-bold text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      <MessageSquare className="w-4.5 h-4.5" />
                      Responder
                    </button>
                    <button className="flex items-center gap-1.5 text-[13px] text-gray-500 hover:text-red-500 transition-colors group">
                      <Heart className="w-4.5 h-4.5 group-hover:fill-current" />
                      <span>{0 || 0}</span>
                    </button>
                  </div>

                  {/* Input para responder */}
                  {replyingTo === comment.id && user && (
                    <div className="mt-4 flex gap-4">
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200 shrink-0">
                        <img
                          src={
                            user.user_metadata?.avatar_url ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(user.email || "User")}`
                          }
                          alt="Tu avatar"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="grow">
                        <textarea
                          className="w-full rounded-xl p-3 text-[14px] focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400/50 transition-all outline-none resize-none placeholder:text-gray-400 bg-white border border-gray-200"
                          placeholder="Escribe tu respuesta..."
                          rows={2}
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                        />
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => handleSubmitReply(comment.id)}
                            disabled={submitting || !replyContent.trim()}
                            className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-[13px] font-bold hover:bg-blue-700 transition-all disabled:opacity-50"
                          >
                            {submitting ? "Enviando..." : "Responder"}
                          </button>
                          <button
                            onClick={() => {
                              setReplyingTo(null);
                              setReplyContent("");
                            }}
                            className="text-gray-600 px-4 py-1.5 rounded-full text-[13px] font-bold hover:bg-gray-100 transition-all"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Respuestas anidadas */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="ml-16 mt-8 space-y-8">
                  {comment.replies.map((reply: any) => (
                    <div
                      key={reply.id}
                      className="flex gap-4 relative z-10 bg-[#fafafa]"
                    >
                      <div className="w-10 h-10 rounded-full border border-gray-200 shrink-0 overflow-hidden">
                        <img
                          alt={reply.users.name}
                          className="w-full h-full object-cover"
                          src={
                            reply.users.avatar_url ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(reply.users.name)}`
                          }
                        />
                      </div>
                      <div className="grow">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-[14px] font-bold text-[#1d1d1f]">
                            {reply.users.name}
                          </span>
                          <span className="text-[11px] font-medium text-[#86868b]">
                            {formatTime(reply.created_at)}
                          </span>
                        </div>
                        <p className="text-[14px] text-[#424245] leading-relaxed mb-3">
                          {reply.content}
                        </p>
                        <div className="flex items-center gap-5">
                          <button className="flex items-center gap-1 text-[12px] text-gray-500 hover:text-red-500 transition-colors group">
                            <Heart className="w-4 h-4" />
                            <span>{reply.likes || 0}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </section>
  );
}
