import type { ReactNode } from "react";
import styles from "./AppContainer.module.css";

interface AppContainerProps {
  children: ReactNode;
}

export function AppContainer({ children }: AppContainerProps) {
  return <div className={styles.container}>{children}</div>;
}