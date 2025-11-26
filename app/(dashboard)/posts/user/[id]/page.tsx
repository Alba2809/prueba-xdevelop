"use client";

import { useParams } from "next/navigation";
import LoaderSpin from "@/components/common/LoaderSpin";
import { usePostsByUserQuery } from "../../hooks/usePostsByUserQuery";
import PostCard from "../../components/PostCard";
import { usePostsStore } from "@/stores/posts.store";
import { toast } from "sonner";
import PostDetailsSheet from "../../components/PostDetailsSheet";
import { useState } from "react";
import { Post } from "@/services/posts.service";

export default function UserPostsPage() {
  const params = useParams();
  const userId = Number(params.id);

  const { data, isLoading, error } = usePostsByUserQuery(userId);
  
  // se combinan los posts locales con los obtenidos de la API
  const localPosts = usePostsStore((s) => s.localPosts);
  const localPostsByUser = localPosts.filter((post) => post.userId === userId);
  const allPosts = [...localPostsByUser, ...(data ?? [])];
  
  const favoritePosts = usePostsStore((s) => s.favoritePosts);
  const addFavoritePost = usePostsStore((s) => s.addFavoritePost);

  // Estados para la modal de detalles
  const [open, setOpen] = useState(false);
  const [post, setPost] = useState<Post | null>(null);

  if (isLoading) return <LoaderSpin />;

  if (error) {
    toast.error("Error al cargar posts.");
  }

  function handleViewDetails(post: Post) {
    setPost(post);
    setOpen(true);
  }

  function handleCloseDetails(value: boolean) {
    setOpen(value);
    setPost(null);
  }

  return (
    <div>
      <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">
        Posts del usuario {userId}
      </h1>

      <div className="w-full flex flex-wrap gap-5 items-center justify-between">
        {allPosts?.length === 0 && (
          <div className="text-center text-accent-foreground">
            No hay posts de este usuario...
          </div>
        )}
        {allPosts?.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            showEdit={false}
            onFavorite={addFavoritePost}
            onViewDetails={handleViewDetails}
            isFavorite={favoritePosts.includes(post.id)}
            isOwner={false}
          />
        ))}
      </div>
      <PostDetailsSheet
        open={open}
        post={post ?? ({} as Post)}
        setOpen={handleCloseDetails}
        isOwner={false}
      />
    </div>
  );
}
