import { ThemeToggle } from "../ThemeToggle";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { AppSidebar } from "./app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

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
            <Button
              variant="secondary"
              className="bg-lime-500 hover:bg-lime-400 text-black"
            >
              Log Out
            </Button>
          </div>
        </header>
        <>{children}</>
      </SidebarInset>
    </SidebarProvider>
  );
}
