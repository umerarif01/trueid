import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { NavItem } from "../types/nav";
import { siteConfig } from "../config/site";
import { cn } from "../lib/utils";
import { Icons } from "../components/icons";

interface MainNavProps {
  items?: NavItem[];
}

export function MainNav({ items }: MainNavProps) {
  const pathname = usePathname();

  return (
    <div className="flex gap-6 md:gap-10">
      <Link href="/" className="flex items-center space-x-2">
        <span className="inline-block font-bold">{siteConfig.name}</span>
      </Link>
      {items?.length ? (
        <nav className="flex gap-6">
          {items?.map(
            (item, index) =>
              item.href && (
                <Link
                  key={index}
                  href={item.href}
                  className={cn(
                    "flex items-center text-sm font-medium text-muted-foreground",
                    item.disabled && "cursor-not-allowed opacity-80"
                  )}
                >
                  {item.title}
                </Link>
              )
          )}
          {pathname === "/admin" ? (
            <Link
              href={`/admin/claimed-degrees`}
              className={cn(
                "flex items-center text-sm font-medium text-muted-foreground"
              )}
            >
              Claimed Degrees
            </Link>
          ) : pathname === "/admin/claimed-degrees" ? (
            <Link
              href={`/admin`}
              className={cn(
                "flex items-center text-sm font-medium text-muted-foreground"
              )}
            >
              Not Claimed Degrees
            </Link>
          ) : null}
        </nav>
      ) : null}
    </div>
  );
}
