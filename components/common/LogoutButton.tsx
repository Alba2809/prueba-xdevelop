import { LogOutIcon } from "lucide-react";
import { Button } from "../ui/button";
import { logoutRequest } from "@/services/auth.service";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function LogoutButton({ isMobile }: { isMobile: boolean }) {
  const router = useRouter();

  const handleLogout = async () => {
    const res = await logoutRequest();

    if (!res.ok) {
      toast.error(res.message);
      return;
    }

    toast.success(res.message);
    router.push("/login");
  };

  return (
    <Button
      className="hover:cursor-pointer"
      variant="default"
      onClick={handleLogout}
    >
      <LogOutIcon />
      {!isMobile && "Cerrar sesión" }
    </Button>
  );
}
