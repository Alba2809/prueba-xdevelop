"use client";

import { useParams } from "next/navigation";
import LoaderSpin from "@/components/common/LoaderSpin";
import { usePostDetailsQuery } from "../hooks/usePostDetailsQuery";
import { toast } from "sonner";
import { usePostsStore } from "@/stores/posts.store";

export default function PostDetailPage() {
  const { id } = useParams();
  const postId = Number(id);

  const localPosts = usePostsStore((s) => s.localPosts);
  const localPostById = localPosts.find((post) => post.id === postId);

  const { post, comments } = usePostDetailsQuery(postId, {
    enabled: !localPostById && !!postId, // Solo se ejecuta si hay un postId y el post no es local
  });

  if (post.isLoading || comments.isLoading) return <LoaderSpin />;

  if (post.error || comments.error) {
    toast.error("Error al cargar post.");
  }

  if (!post.data) {
    return (
      <div className="text-center text-accent-foreground">
        No se encontró el post
      </div>
    );
  }

  const finalPost = localPostById ?? post.data;

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">{finalPost.title}</h1>
      <p>{finalPost.body}</p>

      <h2 className="text-xl font-semibold mt-6">Comentarios</h2>

      {comments.data ? (
        comments.data.map((c) => (
          <div key={c.id} className="border p-3 rounded">
            <p className="font-bold">{c.email}</p>
            <p>{c.body}</p>
          </div>
        ))
      ) : (
        <div className="text-center text-accent-foreground">
          No hay comentarios.
        </div>
      )}
    </div>
  );
}
