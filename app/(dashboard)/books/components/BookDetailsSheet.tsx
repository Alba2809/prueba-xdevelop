import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
  Sheet,
} from "@/components/ui/sheet";
import { Book } from "@/services/books.service";

type Props = {
  book: Book | null;
  open: boolean;
  setOpen: (open: boolean) => void;
};

export default function BookDetailsSheet({ open, setOpen, book }: Props) {
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      {book && (
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Detalles del libro</SheetTitle>
          </SheetHeader>
          <div
            className="grid flex-1 auto-rows-min gap-6 px-4 overflow-y-auto"
            style={{
              scrollbarWidth: "thin",
            }}
          >
            <Accordion
              type="single"
              collapsible
              className="w-full"
              defaultValue="item-1"
            >
              <AccordionItem value="item-1">
                <AccordionTrigger>Información básica</AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4 text-balance">
                  <SheetDescription>Título: {book.title}</SheetDescription>
                  <SheetDescription>Autor: {book.author_name}</SheetDescription>
                  <SheetDescription>
                    Año de publicación: {book.first_publish_year}
                  </SheetDescription>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Lenguajes disponibles</AccordionTrigger>
                <AccordionContent className="flex flex-wrap gap-4 text-balance">
                  {book.language.map((lang) => (
                    <SheetDescription key={lang}>{lang}</SheetDescription>
                  ))}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          <SheetFooter>
            <SheetClose asChild>
              <Button variant="outline">Cerrar</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      )}
    </Sheet>
  );
}
