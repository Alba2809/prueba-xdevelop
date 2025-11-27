"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getBookDetails } from "@/services/books.service";
import LoaderSpin from "@/components/common/LoaderSpin";

export default function BookDetailPage() {
  const { id } = useParams();

  const { data, isLoading } = useQuery({
    queryKey: ["book", id],
    queryFn: () => getBookDetails(id as string),
  });

  if (isLoading) return <LoaderSpin />;

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h1 className="text-4xl font-bold mb-4">{data.title}</h1>

      {data.description && (
        <p className="text-lg opacity-80">
          {typeof data.description === "string"
            ? data.description
            : data.description.value}
        </p>
      )}

      <div className="mt-6">
        <h2 className="text-xl font-semibold">Detalles</h2>
        <pre className="text-sm opacity-70 mt-2">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </div>
  );
}
