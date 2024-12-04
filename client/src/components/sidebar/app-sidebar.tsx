import * as React from "react";
import { motion } from "framer-motion";
import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useLocation, useNavigate } from "react-router-dom";
import {
  BookOpen,
  CircleUser,
  Home,
  MessageCircleMore,
  UserPlus,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

// This is sample data.
const data = {
  navMain: [
    {
      title: "Home",
      url: "/home",
      icon: Home,
    },
    {
      title: "Posts",
      url: "/posts",
      icon: BookOpen,
    },
    {
      title: "Connections",
      url: "/connections",
      icon: UserPlus,
    },
    {
      title: "Chats",
      url: "/chats",
      icon: MessageCircleMore,
    },
    {
      title: "Profile",
      url: "/profile",
      icon: CircleUser,
    },
    // {
    //   title: "Settings",
    //   url: "/settings",
    //   icon: Settings,
    // },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="flex gap-1 items-center">
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex leading-none">
                  <span className="text-2xl font-bold text-black dark:text-white">
                    Dev
                  </span>
                  <span className="text-2xl font-bold text-lime-500">
                    Connect
                  </span>
                </div>
              </a>
            </SidebarMenuButton>
            {useIsMobile() && <SidebarTrigger />}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="sidebarScroll">
        <SidebarGroup>
          <SidebarMenu className="gap-3">
            {data.navMain.map((item, index) => {
              const isActive = location.pathname.includes(item.url);
              return (
                <Collapsible
                  key={item.title}
                  defaultOpen={index === 1}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        className={`relative font-semibold py-6`}
                      >
                        <div className="size-6 pt-0.5">
                          <item.icon />
                        </div>
                        <div
                          onClick={() => navigate(item.url)}
                          className="w-full text-lg p-1"
                        >
                          {item.title}
                        </div>
                        {isActive && (
                          <motion.div
                            layoutId="active-tab"
                            className="absolute inset-0 flex items-center px-2 gap-1.5 rounded-lg bg-lime-500 text-black font-bold"
                            initial={false}
                            transition={{
                              type: "spring",
                              stiffness: 500,
                              damping: 30,
                            }}
                          >
                            <div className="size-6 pt-0.5">
                              <item.icon />
                            </div>
                            <div
                              onClick={() => navigate(item.url)}
                              className="w-full text-lg p-1"
                            >
                              {item.title}
                            </div>
                          </motion.div>
                        )}
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                  </SidebarMenuItem>
                </Collapsible>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
