"use client";

import { Link } from "@/i18n/navigation";
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
import LocaleSwitcher from "./locale-switcher";
import { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

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
          prefetch={true}
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

export function NavMenu({ children }: { children?: ReactNode }) {
  const t = useTranslations("NavMenu");
  const { data: session } = useSession();

  const pages = [
    {
      name: t("home"),
      href: "/",
    },
    {
      name: t("agency"),
      href: "/agency",
    },
    {
      name: t("properties"),
      href: "/property",
      children: [
        {
          name: t("allProperties"),
          href: "/property",
          description: t("allPropertiesDesc"),
        },
        {
          name: t("createProperty"),
          href: "/property/new",
          description: t("createPropertyDesc"),
        },
        {
          name: t("model"),
          href: "/model",
          description: t("modelDesc"),
        },
      ],
      },
      {
        name: t("inspections"),
        href: "/inspection",
      },
      {
        name: t("employees"),
        href: "/employee",
      },
  ];

  return (
    <div className="flex items-center w-full justify-between px-4">
      <div className="flex-1 flex">
        {children || (
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
                                prefetch={true}
                              >
                                <div className="mb-2 text-lg font-medium sm:mt-4">
                                  {page.name}
                                </div>
                                <p className="text-muted-foreground text-sm leading-tight">
                                  {t("propertiesDesc")}
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
                    <NavigationMenuLink asChild>
                      <Link
                        href={page.href}
                        prefetch={true}
                        className={navigationMenuTriggerStyle()}
                      >
                        {page.name}
                      </Link>
                    </NavigationMenuLink>
                  )}
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        )}
      </div>
      <div className="flex-shrink-0 flex items-center gap-2">
        {session && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            {t("signOut")}
          </Button>
        )}
        <LocaleSwitcher />
      </div>
    </div>
  );
}
