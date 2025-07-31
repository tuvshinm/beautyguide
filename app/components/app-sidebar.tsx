import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "~/components/ui/sidebar";

// Sample nav data
const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/admin",
    },
    {
      title: "Products",
      url: "/admin/products",
      items: [
        {
          title: "All Products",
          url: "/admin/products",
        },
        {
          title: "Pending Approval",
          url: "/admin/products/pending",
        },
        {
          title: "Categories",
          url: "/admin/products/categories",
        },
      ],
    },
    {
      title: "Reviews",
      url: "/admin/reviews",
      items: [
        {
          title: "All Reviews",
          url: "/admin/reviews",
        },
        {
          title: "Pending Approval",
          url: "/admin/reviews/pending",
        },
      ],
    },
    {
      title: "Users",
      url: "/admin/users",
      items: [
        {
          title: "All Users",
          url: "/admin/users",
        },
        {
          title: "Suspended Users",
          url: "/admin/users/suspended",
        },
      ],
    },
    {
      title: "Moderation",
      url: "/admin/moderation",
      items: [
        {
          title: "Flagged Reviews",
          url: "/admin/moderation/reviews",
        },
        {
          title: "Flagged Products",
          url: "/admin/moderation/products",
        },
      ],
    },
    {
      title: "Settings",
      url: "/admin/settings",
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <h1 className="volkhov-regular text-4xl text-center">B.G.</h1>
      </SidebarHeader>
      <SidebarContent>
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            {item.items ? (
              <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            ) : (
              <></>
            )}
            <SidebarGroupContent>
              <SidebarMenu>
                {/* If the item has children, render them; otherwise render the item itself */}
                {item.items ? (
                  item.items.map((subItem) => (
                    <SidebarMenuItem key={subItem.title}>
                      <SidebarMenuButton asChild>
                        <a href={subItem.url}>{subItem.title}</a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))
                ) : (
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <a href={item.url}>{item.title}</a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
