import Topbar from "./Topbar";
import ToastStack from "../feedback/ToastStack";
import LoadingOverlay from "../feedback/LoadingOverlay";
import { useUI } from "../../context/UIContext";

export default function AppShell({ children }) {
  const { blocking } = useUI();

  return (
    <div className="ns-app-shell">
      <Topbar />
      <main className="ns-main">
        <div className="ns-container">{children}</div>
      </main>
      <ToastStack />
      {blocking ? <LoadingOverlay /> : null}
    </div>
  );
}