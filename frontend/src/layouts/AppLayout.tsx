import { Outlet } from "react-router-dom";
import { TopNavbar } from "../components/TopNavbar";
import styles from "./AppLayout.module.css";

export function AppLayout() {
  return (
    <div className={styles.layout}>
      <TopNavbar />
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
