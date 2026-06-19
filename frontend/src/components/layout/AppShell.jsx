import TopNav from './TopNav';
import ActivityDrawer from '../activity/ActivityDrawer';
import ToastViewport from '../feedback/ToastViewport';
import LoadingOverlay from '../feedback/LoadingOverlay';
import { useUI } from '../../context/UIContext';

export default function AppShell({ children }) {
  const { blocking } = useUI();

  return (
    <div className="app-shell">
      <TopNav />
      <main className="app-main">
        <div className="page-container">{children}</div>
      </main>
      <ActivityDrawer />
      <ToastViewport />
      {blocking && <LoadingOverlay />}
    </div>
  );
}