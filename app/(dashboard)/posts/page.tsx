"use client";

import LoaderSpin from "@/components/common/LoaderSpin";
import { usePostsQuery } from "./hooks/usePostsQuery";
import PostCard from "./components/PostCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuthStore } from "@/stores/auth.store";
import { usePostsStore } from "@/stores/posts.store";
import PostDetailsSheet from "./components/PostDetailsSheet";
import { useState } from "react";
import { Post } from "@/services/posts.service";
import { usePostDetailsQuery } from "./hooks/usePostDetailsQuery";

export default function PostPage() {
  const { data, isLoading } = usePostsQuery();
  const localPosts = usePostsStore((s) => s.localPosts);
  const favoritePosts = usePostsStore((s) => s.favoritePosts);
  const addFavoritePost = usePostsStore((s) => s.addFavoritePost);

  // se combinan los posts locales con los obtenidos de la API
  const allPosts = [...localPosts, ...(data ?? [])];

  /*
   * Estados para la modal de detalles
   * Se decidió usar un component de sheet para la modal de detalles
   * para mostrar más información sobre el post seleccionado (comentarios, etc.)
   */
  const [open, setOpen] = useState(false);
  const [post, setPost] = useState<Post | null>(null);

  const userId = useAuthStore((s) => s.userId);
  const isAdmin = useAuthStore((s) => s.isAdmin());

  if (isLoading) return <LoaderSpin />;

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
      <div className="flex flex-wrap items-end justify-center mb-5 gap-5">
        <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">
          Posts
        </h1>

        {isAdmin && (
          <Button variant={"outline"} className="">
            <Link href="/posts/new">Nuevo Post</Link>
          </Button>
        )}
      </div>

      <div className="w-full flex flex-wrap gap-5 justify-between">
        {/* Por ahora, se muestran los posts usando flex, pero lo mejor (visualmente) sería usar grid */}
        {/* <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 place-items-center"> */}
        {allPosts?.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            showEdit={isAdmin && post.userId === userId}
            isOwner={post.userId === userId}
            onFavorite={addFavoritePost}
            onViewDetails={handleViewDetails}
            isFavorite={favoritePosts.includes(post.id)}
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
