"use client";

import * as React from "react";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@repo/design-system/components/ui/sidebar";
import { Separator } from "@repo/design-system/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@repo/design-system/components/ui/breadcrumb";
import { ModeToggle } from "@repo/design-system/components/mode-toggle";
import { AppSidebar } from "./app-sidebar";
import { logout } from "../actions";

interface DashboardShellProps {
  children: React.ReactNode;
  user: {
    name?: string | null;
    email?: string | null;
    avatarUrl?: string | null;
  };
  breadcrumbs?: Array<{
    label: string;
    href?: string;
  }>;
}

export function DashboardShell({
  children,
  user,
  breadcrumbs = [],
}: DashboardShellProps) {
  return (
    <SidebarProvider>
      <AppSidebar user={user} onLogout={() => logout()} />
      <SidebarInset>
        <header className="sticky top-0 z-50 flex h-16 shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex flex-1 items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            {breadcrumbs.length > 0 && (
              <Breadcrumb>
                <BreadcrumbList>
                  {breadcrumbs.map((item, index) => {
                    const isLast = index === breadcrumbs.length - 1;
                    return (
                      <React.Fragment key={item.label}>
                        <BreadcrumbItem
                          className={isLast ? "" : "hidden md:block"}
                        >
                          {isLast ? (
                            <BreadcrumbPage>{item.label}</BreadcrumbPage>
                          ) : (
                            <BreadcrumbLink href={item.href ?? "#"}>
                              {item.label}
                            </BreadcrumbLink>
                          )}
                        </BreadcrumbItem>
                        {!isLast && (
                          <BreadcrumbSeparator className="hidden md:block" />
                        )}
                      </React.Fragment>
                    );
                  })}
                </BreadcrumbList>
              </Breadcrumb>
            )}
          </div>
          <div className="flex items-center gap-2 px-4">
            <ModeToggle />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
