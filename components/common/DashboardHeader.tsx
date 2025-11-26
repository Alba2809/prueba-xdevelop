"use client";

import { ROLES } from "@/utils/constants";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { usePathname } from "next/navigation";
import LogoutButton from "./LogoutButton";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/auth.store";

export default function DashboardHeader() {
  const components: {
    title: string;
    href: string;
    description: string;
    role?: string[];
  }[] = [
    {
      title: "Usuarios",
      href: "/users",
      description: "Ver y gestionar usuarios",
      role: [ROLES.ADMIN],
    },
    {
      title: "Posts",
      href: "/posts",
      description: "Ver y gestionar posts",
    },
    {
      title: "Books",
      href: "/books",
      description: "Ver y gestionar libros",
    },
  ];

  const [isMobile, setIsMobile] = useState(false); // Estado para detectar si es móvil
  const path = usePathname();
  const role = useAuthStore((s) => s.role);

  useEffect(() => {
    // Función para actualizar el estado de isMobile
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize(); // Llamar al cargar el componente
    window.addEventListener("resize", handleResize); // Escuchar cambios de tamaño de ventana

    return () => {
      window.removeEventListener("resize", handleResize); // Limpiar el evento al desmontar
    };
  }, []);

  return (
    <div className="w-full flex items-center justify-center mb-5 sticky top-0 z-100 bg-background/95">
      <NavigationMenu viewport={isMobile} className="space-x-5 py-3">
        <NavigationMenuList className="flex-wrap">
          {components
            .filter(
              (component) =>
                !component.role || (role && component.role.includes(role))
            )
            .map((component) => (
              <NavigationMenuItem key={component.title}>
                <NavigationMenuLink
                  asChild
                  className={navigationMenuTriggerStyle({
                    className: path.startsWith(component.href)
                      ? "bg-accent"
                      : "",
                  })}
                >
                  <Link href={component.href}>{component.title}</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
        </NavigationMenuList>
        <ThemeToggle />
        <LogoutButton isMobile={isMobile} />
      </NavigationMenu>
    </div>
  );
}
