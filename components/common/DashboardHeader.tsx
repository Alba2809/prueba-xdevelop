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

  const isMobile = false;
  const path = usePathname();

  return (
    <div className="w-full flex items-center justify-center mb-5">
      <NavigationMenu viewport={isMobile} className="space-x-5">
        <NavigationMenuList className="flex-wrap">
          {components.map((component) => (
            <NavigationMenuItem key={component.title}>
              <NavigationMenuLink
                asChild
                className={navigationMenuTriggerStyle({
                  className: path.startsWith(component.href) ? "bg-accent" : ""
                })}
              >
                <Link href={component.href}>{component.title}</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
        <ThemeToggle />
      </NavigationMenu>
    </div>
  );
}
