import { ThemeToggle } from "../ThemeToggle";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { AppSidebar } from "./app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { motion } from "framer-motion";

export default function SideBar({ children }: { children: JSX.Element }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-10 flex justify-between h-16 shrink-0 items-center gap-2 border-b px-4 bg-sidebar">
          <div className="flex justify-center items-center gap-2">
            <SidebarTrigger className="ml-1" />
            <Separator orientation="vertical" className="h-4" />
          </div>
          <div className="flex justify-center items-center gap-2">
            <ThemeToggle />
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={{
                duration: 0.2,
                type: "spring",
                stiffness: 200,
                damping: 10,
              }}
            >
              <Button
                variant="secondary"
                className="bg-lime-50 hover:bg-lime-100 border-2 border-lime-500 text-black transition-all duration-200 ease-in-out"
              >
                Log Out
              </Button>
            </motion.div>
          </div>
        </header>
        <>{children}</>
      </SidebarInset>
    </SidebarProvider>
  );
}
