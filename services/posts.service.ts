import { API_POSTS } from "@/utils/constants";
import { api } from "./http";

export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export interface Comment {
  id: number;
  email: string;
  body: string;
  postId: number;
  name: string;
}

export async function getPosts() {
  const res = await api.get<Post[]>(`${API_POSTS}/posts`);
  return res.data;
}

export async function getPost(id: number) {
  const res = await api.get<Post>(`${API_POSTS}/posts/${id}`);
  return res.data;
}

export async function getComments(id: number) {
  const res = await api.get<Comment[]>(`${API_POSTS}/posts/${id}/comments`);
  return res.data;
}

export async function getPostsByUser(userId: number) {
  const res = await api.get<Post[]>(`${API_POSTS}/posts?userId=${userId}`);
  return res.data;
}

export async function createPost(data: {
  title: string;
  body: string;
  userId: number;
}) {
  const res = await api.post<Post>(`${API_POSTS}/posts`, data);
  return res.data;
}

export async function updatePost(id: number, data: Partial<Post>) {
  const res = await api.put<Post>(`${API_POSTS}/posts/${id}`, data);
  return res.data;
}

export async function deletePost(id: string) {
  const res = await api.delete(`${API_POSTS}/posts/${id}`);
  return res.data;
}
