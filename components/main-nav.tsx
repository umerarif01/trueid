import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { NavItem } from "../types/nav";
import { siteConfig } from "../config/site";
import { cn } from "../lib/utils";

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
          <Link
            href={`/recent`}
            className={cn(
              "flex items-center text-sm font-medium text-muted-foreground"
            )}
          >
            Recently Issued Degrees
          </Link>
          {pathname === "/admin" ? (
            <Link
              href={`/admin/claimed-degrees`}
              className={cn(
                "flex items-center text-sm font-medium text-muted-foreground"
              )}
            >
              Issued Degrees (Admin)
            </Link>
          ) : pathname === "/admin/claimed-degrees" ? (
            <Link
              href={`/admin`}
              className={cn(
                "flex items-center text-sm font-medium text-muted-foreground"
              )}
            >
              Requested Degrees (Admin)
            </Link>
          ) : null}
        </nav>
      ) : null}
    </div>
  );
}
