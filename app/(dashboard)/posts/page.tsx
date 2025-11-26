"use client";

import LoaderSpin from "@/components/common/LoaderSpin";
import { usePostsQuery } from "./hooks/usePostsQuery";
import PostCard from "./components/PostCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuthStore } from "@/stores/auth.store";
import { usePostsStore } from "@/stores/posts.store";

export default function PostPage() {
  const { data, isLoading } = usePostsQuery();
  const localPosts = usePostsStore((s) => s.localPosts);
  const favoritePosts = usePostsStore((s) => s.favoritePosts);
  const addFavoritePost = usePostsStore((s) => s.addFavoritePost);

  // se combinan los posts locales con los obtenidos de la API
  const allPosts = [...localPosts, ...(data ?? [])];

  const userId = useAuthStore((s) => s.userId);
  const isAdmin = useAuthStore((s) => s.isAdmin());

  if (isLoading) return <LoaderSpin />;

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

      <div className="w-full flex flex-wrap gap-5 items-center justify-between">
        {allPosts?.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            showEdit={isAdmin && post.userId === userId}
            isOwner={post.userId === userId}
            onFavorite={addFavoritePost}
            isFavorite={favoritePosts.includes(post.id)}
          />
        ))}
      </div>
    </div>
  );
}
