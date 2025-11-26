import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Post } from "@/services/posts.service";
import { Button } from "@/components/ui/button";
import LoaderSpin from "@/components/common/LoaderSpin";
import { usePostDetailsQuery } from "../hooks/usePostDetailsQuery";
import { toast } from "sonner";

type Props = {
  post: Post;
  open: boolean;
  setOpen: (open: boolean) => void;
  isOwner?: boolean;
};

export default function PostDetailsSheet({
  post,
  isOwner,
  open,
  setOpen,
}: Props) {
  const { comments } = usePostDetailsQuery(post.id);

  const isEmpty = comments?.data?.length === 0;
  const existComments = comments?.data;

  if (comments.error) {
    toast.error("Error al cargar comentarios.");
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{post.title}</SheetTitle>
          {isOwner && <SheetDescription>(Eres el autor)</SheetDescription>}
        </SheetHeader>
        <div className="grid flex-1 auto-rows-min gap-6 px-4 overflow-y-auto" style={{
          scrollbarWidth: "thin"
        }}>
          <SheetDescription>{post.body}</SheetDescription>
          <Label>Comentarios:</Label>
          {comments.isLoading ? (
            <LoaderSpin />
          ) : existComments ? (
            isEmpty ? (
              <div className="text-center text-accent-foreground">
                No hay comentarios.
              </div>
            ) : (
              comments.data.map((comm) => (
                <div key={comm.id} className="border p-3 rounded">
                  <p className="font-bold text-sm">{comm.email}</p>
                  <p className="text-sm">{comm.body}</p>
                </div>
              ))
            )
          ) : (
            <div className="text-center text-accent-foreground">
              No se pudo cargar los comentarios.
            </div>
          )}
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Cerrar</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
