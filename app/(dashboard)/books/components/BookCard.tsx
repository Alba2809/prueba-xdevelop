import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Book } from "@/services/books.service";
import { BOOKS_COVER } from "@/utils/constants";
import { Image } from "lucide-react";

export default function BookCard({
  book,
  onClickCard,
}: {
  book: Book;
  onClickCard?: () => void;
}) {
  const imageUrl = book.cover_i ? `${BOOKS_COVER}/${book.cover_i}-S.jpg` : null;
  return (
    <Card
      className="w-full max-w-sm gap-3 hover:cursor-pointer hover:bg-accent transition-colors duration-200 ease-in-out"
      onClick={onClickCard}
    >
      {" "}
      {/* // opción para que se ajuste al contenido */}
      <CardHeader className="">
        <CardTitle className="line-clamp-2">{book.title}</CardTitle>
        <CardDescription className="line-clamp-3 text-pretty">
          {book.author_name}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col items-center justify-center gap-2">
        {/* Imagen */}
        <div className="w-[200px] aspect-2/3 bg-muted rounded-md overflow-hidden">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="cover"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <Image />
          )}
        </div>
        <CardDescription>{book.first_publish_year}</CardDescription>
      </CardContent>
    </Card>
  );
}
