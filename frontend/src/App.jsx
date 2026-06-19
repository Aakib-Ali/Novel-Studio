import { BrowserRouter } from 'react-router-dom';
import { BookProvider } from './context/BookContext';
import { NotificationProvider } from './context/NotificationContext';
import { UIProvider } from './context/UIContext';
import { AppRoutes } from './app/routes';
import AppShell from './components/layout/AppShell';

export default function App() {
  return (
    <BrowserRouter>
      <NotificationProvider>
        <BookProvider>
          <UIProvider>
            <AppShell>
              <AppRoutes />
            </AppShell>
          </UIProvider>
        </BookProvider>
      </NotificationProvider>
    </BrowserRouter>
  );
}