"use client";

import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuContent,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

const pages = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "Agency",
    href: "/agency",
  },
  {
    name: "Properties",
    href: "/property",
    children: [
      {
        name: "All Properties",
        href: "/property",
        description: "View and manage all properties",
      },
      {
        name: "Create Property",
        href: "/property/new",
        description: "Add a new property to the system",
      },
      {
        name: "Model",
        href: "/model",
        description: "View and manage the models",
      },
    ],
  },
  {
    name: "Inspections",
    href: "/inspection",
  },
];

const ListItem = ({
  className,
  title,
  children,
  href,
  ...props
}: {
  className?: string;
  title: string;
  children: React.ReactNode;
  href: string;
}) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          href={href}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
};

export function NavMenu() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        {pages.map((page) => (
          <NavigationMenuItem key={page.href}>
            {page.children ? (
              <>
                <NavigationMenuTrigger>{page.name}</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-2 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <Link
                          className="from-muted/50 to-muted flex h-full w-full flex-col justify-end rounded-md bg-gradient-to-b p-4 no-underline outline-none transition-all duration-200 select-none focus:shadow-md md:p-6"
                          href={page.href}
                        >
                          <div className="mb-2 text-lg font-medium sm:mt-4">
                            {page.name}
                          </div>
                          <p className="text-muted-foreground text-sm leading-tight">
                            Manage your properties and related information.
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    {page.children.map((child) => (
                      <ListItem
                        key={child.href}
                        href={child.href}
                        title={child.name}
                      >
                        {child.description}
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </>
            ) : (
              <Link href={page.href} passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  {page.name}
                </NavigationMenuLink>
              </Link>
            )}
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
