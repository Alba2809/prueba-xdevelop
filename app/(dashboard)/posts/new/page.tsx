"use client";

import { useCreatePostMutation } from "../hooks/useCreatePostMutation";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Card,
  CardFooter,
} from "@/components/ui/card";
import { postSchema, PostSchema } from "../schemas/schema";
import { useAuthStore } from "@/stores/auth.store";
import { validateSchema } from "@/utils/validateSchema";
import { Textarea } from "@/components/ui/textarea";
import { usePostsStore } from "@/stores/posts.store";

export default function NewPostPage() {
  const router = useRouter();
  const createPost = useCreatePostMutation();
  const userId = useAuthStore((s) => s.userId);
  const { addPost } = usePostsStore.getState();

  const form = useForm<PostSchema>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      body: "",
    },
  });

  const onSubmit = async (data: PostSchema) => {
    try {
      console.log("Validando datos");
      // validar datos con zod
      const parsed = validateSchema(postSchema, data);

      if (!parsed.ok) throw new Error("Datos incorrectos");

      // ejecutar mutation / creación de post
      const payload = {
        ...data,
        userId: Number(userId),
      };

      console.log("Creando post");
      createPost.mutate(payload, {
        onSuccess: () => {
          toast.success("Post creado exitosamente");

          // Se simula que el post se guardo en la base de datos. Para ello, se guarda de forma local en zustand
          const post = {
            id: Date.now(),
            ...payload,
          };

          addPost(post); // se agrega al estado de zustand

          router.push("/posts"); // se redirige a la lista de posts
        },
        onError: (err) => {
          console.log("Error al crear post", err);
          toast.error("Error al crear post");
        },
      });
    } catch (error) {
      toast.error("Error al crear post");
      console.log(error);
    }
  };

  return (
    <div className="flex size-full justify-center items-center">
      <Card className="w-full max-w-sm rounded-lg shadow-md bg-card">
        <CardHeader>
          <CardTitle>Tu nuevo Post</CardTitle>
          <CardDescription>
            Comparte tus ideas y comentarios con las personas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
              id="post-form"
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
            form="post-form"
            disabled={form.formState.isSubmitting}
            className="w-full hover:cursor-pointer"
          >
            {form.formState.isSubmitting ? "Creando post..." : "Crear post"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
