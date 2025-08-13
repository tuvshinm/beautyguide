import { Link, Outlet, useLocation } from "@remix-run/react";
import { AppSidebar } from "~/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import { Separator } from "~/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "~/components/ui/sidebar";

export default function Page() {
  const location = useLocation();
  const pathParts = location.pathname
    .replace(/^\/+|\/+$/g, "")
    .split("/")
    .filter(Boolean);

  const breadcrumbItems = pathParts.map((part, index) => {
    const isLast = index === pathParts.length - 1;
    const href = "/" + pathParts.slice(0, index + 1).join("/");

    const label = decodeURIComponent(part)
      .replace(/-/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());

    return (
      <BreadcrumbItem key={href}>
        {isLast ? (
          <BreadcrumbPage>{label}</BreadcrumbPage>
        ) : (
          <>
            <BreadcrumbLink asChild>
              <Link to={href}>{label}</Link>
            </BreadcrumbLink>
            <BreadcrumbSeparator />
          </>
        )}
      </BreadcrumbItem>
    );
  });

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>{breadcrumbItems}</BreadcrumbList>
          </Breadcrumb>
        </header>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}
