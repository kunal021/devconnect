import { AuthProvider } from "./AuthProvider";
import { ChatProvider } from "./ChatProvider";
import { ThemeProvider } from "./ThemeProvider";
import { ToastProvider } from "./ToastProvider";

function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <ThemeProvider defaultTheme="dark" storageKey="devconnect-ui-theme">
        <AuthProvider>
          <ChatProvider>{children}</ChatProvider>
        </AuthProvider>
      </ThemeProvider>
    </ToastProvider>
  );
}

export default AppProviders;
