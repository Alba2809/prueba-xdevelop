import { Loader } from "lucide-react";

export default function LoaderSpin() {
  return (
    <div className="flex justify-center items-center w-full">
      <Loader className="animate-spin dark:text-white text-gray-600 self-center" />
    </div>
  );
}
