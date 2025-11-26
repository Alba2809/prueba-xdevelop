import { API_POSTS } from "@/utils/constants";
import { api } from "./http";

export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export async function getPosts() {
  const res = await api.get<Post[]>(`${API_POSTS}/posts`);
  return res.data;
}

export async function getPost(id: string) {
  const res = await api.get<Post>(`${API_POSTS}/posts/${id}`);
  return res.data;
}

export async function createPost(data: {
  title: string;
  body: string;
  userId: number;
}) {
  console.log("Enviando post: ", data)
  const res = await api.post<Post>(`${API_POSTS}/posts`, data);
  return res.data;
}

export async function updatePost(id: string, data: Partial<Post>) {
  const res = await api.put<Post>(`${API_POSTS}/posts/${id}`, data);
  return res.data;
}

export async function deletePost(id: string) {
  const res = await api.delete(`${API_POSTS}/posts/${id}`);
  return res.data;
}
