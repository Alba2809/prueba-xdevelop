import { create } from "zustand";
import { persist } from "zustand/middleware";

interface LocalPost {
  id: number;
  title: string;
  body: string;
  userId: number;
}

interface PostsState {
  localPosts: LocalPost[];
  addPost: (post: LocalPost) => void;
  favoritePosts: number[];
  addFavoritePost: (postId: number) => void;
}

export const usePostsStore = create<PostsState>()(
  persist(
    (set, get) => ({
      localPosts: [],
      favoritePosts: [],
      addPost: (post) =>
        set((state) => ({
          localPosts: [post, ...state.localPosts],
        })),
      addFavoritePost: (postId) => {
        // si el post ya está en favoritos, eliminarlo
        if (!get().favoritePosts.includes(postId)) {
          console.log(`Añadiendo ${postId} a favoritos`);
          set((state) => ({
            favoritePosts: [postId, ...state.favoritePosts],
          }));
        } else {
          console.log(`Eliminando ${postId} de favoritos`);
          set((state) => ({
            favoritePosts: state.favoritePosts.filter((id) => id !== postId),
          }));
        }
      },
    }),
    {
      name: "posts-store",
    }
  )
);
