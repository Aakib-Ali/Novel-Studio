import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./app/routes";
import { BookProvider } from "./context/BookContext";
import { NotificationProvider } from "./context/NotificationContext";
import { UIProvider } from "./context/UIContext";
import { WorkspaceProvider } from "./context/WorkspaceContext";
import AppShell from "./components/layout/AppShell";

export default function App() {
  return (
    <BrowserRouter>
      <NotificationProvider>
        <BookProvider>
          <UIProvider>
            <WorkspaceProvider>
              <AppShell>
                <AppRoutes />
              </AppShell>
            </WorkspaceProvider>
          </UIProvider>
        </BookProvider>
      </NotificationProvider>
    </BrowserRouter>
  );
}