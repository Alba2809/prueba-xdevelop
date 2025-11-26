"use client";

import { useParams, useRouter } from "next/navigation";
import { usePostsStore } from "@/stores/posts.store";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useUpdatePostMutation } from "../../hooks/useUpdatePostMutation";
import LoaderSpin from "@/components/common/LoaderSpin";
import { postSchema, PostSchema } from "../../schemas/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { validateSchema } from "@/utils/validateSchema";
import { usePostQuery } from "../../hooks/usePostQuery";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { useAuthStore } from "@/stores/auth.store";

export default function EditPage() {
  const params = useParams();
  const postId = Number(params.id);
  const router = useRouter();
  const userId = useAuthStore((s) => s.userId);

  /* }
    * Se busca el post localmente
    * Lo ideal sería validar que el post es del usuario actual
    * Pero, debido a que Reqres no ofrece sistema de actualización real, se ignora si el post es del usuario actual
   */
  const localPost = usePostsStore((s) =>
    s.localPosts.find((p) => p.id === postId/*  && p.userId === Number(userId) */)
  );
  const updateLocalPost = usePostsStore((s) => s.updatePost);

  // Fetch del post desde la API solo si no hay un localPost
  /* 
    * TODO: Corregir este error:
    * Error: usePostQuery() sigue realizando la consulta, incluso cuando hay un post local
   */
  const { data, isLoading, error } = usePostQuery(postId, {
    enabled: !localPost,
  });

  // Hook para actualizar el post
  const updatePost = useUpdatePostMutation(postId);

  const targetPost = localPost ?? data;

  const form = useForm<PostSchema>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: targetPost?.title || "",
      body: targetPost?.body || "",
    },
  });

  useEffect(() => {
    if (targetPost) {
      form.reset(targetPost); // resetea el formulario con los datos del post
    }
  }, [targetPost]);

  if (isLoading && !targetPost) return <LoaderSpin />;

  const onSubmit = async (data: PostSchema) => {
    try {
      console.log("Validando datos");
      // validar datos con zod
      const parsed = validateSchema(postSchema, data);

      if (!parsed.ok) throw new Error("Datos incorrectos");

      // ejecutar mutation / creación de post
      const payload = {
        ...data,
        id: Number(postId),
      };

      // SI ES LOCAL -> se actualiza localmente
      if (localPost) {
        updateLocalPost(postId, payload);
        toast.success("Post actualizado exitosamente");
        router.push("/posts");
        return;
      }

      // SI NO ES LOCAL -> se actualiza en la API
      // Debido a que Reqres no ofrece sistema de actualización real, se simula que se ha realizado correctamente (Reqres regresa Ok cuando se "actualiza")
      updatePost.mutate(payload, {
        onSuccess: () => {
          toast.success("Post actualizado exitosamente");
          router.push("/posts");
        },
        onError: (err) => {
          console.log("Error al actualizar post", err);
          toast.error("Error al actualizar post");
        },
      });
    } catch (error) {
      toast.error("Error al crear post");
      console.log(error);
    }
  };

  if (error) {
    if (!targetPost) {
      toast.error("No se encontró el post.");
      return (
        <div className="text-center text-accent-foreground">
          No se encontró el post.
        </div>
      );
    }
  }

  return (
    <div className="flex size-full justify-center items-center">
      <Card className="w-full max-w-sm rounded-lg shadow-md bg-card">
        <CardHeader>
          <CardTitle>Edición del Post</CardTitle>
          <CardDescription>
            Puedes editar el post seleccionado (título y contenido)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
              id="edit-post-form"
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Títutlo</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Mi primer post"
                        {...field}
                        disabled={form.formState.isSubmitting}
                      />
                    </FormControl>
                    <FormMessage>
                      {form.formState.errors.title?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="body"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contenido</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Hoy el día estuvo..."
                        className="resize-none"
                        disabled={form.formState.isSubmitting}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage>
                      {form.formState.errors.body?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            form="edit-post-form"
            disabled={form.formState.isSubmitting}
            className="w-full"
          >
            {form.formState.isSubmitting ? "Editando post..." : "Editar post"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
