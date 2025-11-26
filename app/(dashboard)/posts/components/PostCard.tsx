import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Post } from "@/services/posts.service";
import { Star } from "lucide-react";

type Props = {
  post: Post;
  showEdit?: boolean;
  isOwner?: boolean;
  onFavorite: (postId: number) => void;
  isFavorite: boolean;
};

export default function PostCard({
  post,
  showEdit,
  isOwner,
  onFavorite,
  isFavorite,
}: Props) {
  return (
    // <Card className="w-full max-w-sm h-80 gap-3"> // opción para que sean del mismo alto
    <Card className="w-full max-w-sm gap-3">
      {" "}
      {/* // opción para que se ajuste al contenido */}
      <CardHeader className="">
        <CardTitle className="line-clamp-2">{post.title}</CardTitle>
        {isOwner && (
          <CardDescription className="line-clamp-3 text-pretty">
            (Eres el autor)
          </CardDescription>
        )}
        {!isOwner && (
          <CardAction>
            <Button
              onClick={() => onFavorite(post.id)}
              variant="ghost"
              className="rounded-full size-[42px]"
            >
              <Star
                className={isFavorite ? "text-yellow-500" : "text-gray-300"}
              />
            </Button>
          </CardAction>
        )}
      </CardHeader>
      <CardContent className="flex-1">
        <CardDescription className="line-clamp-5 text-pretty">
          {post.body}
        </CardDescription>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button type="submit" className="w-full">
          Ver comentarios
        </Button>
        {showEdit && (
          <Button variant="outline" className="w-full">
            Editar
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
