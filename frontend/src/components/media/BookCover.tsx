import type { CSSProperties } from "react";
import styles from "./BookCover.module.css";

interface BookCoverProps {
  src?: string;
  title: string;
  author?: string;
  width?: number | string;
  height?: number | string;
}

export function BookCover({
  src,
  title,
  author,
  width = 160,
  height = 240,
}: BookCoverProps) {
  const hash = [...title].reduce((value, letter) => value + letter.charCodeAt(0), 0);
  const variant = hash % 4;

  return (
    <div
      className={`${styles.cover} ${styles[`variant${variant}`]}`}
      style={{ width, height } as CSSProperties}
    >
      {src ? (
        <img className={styles.image} src={src} alt={`${title} cover`} />
      ) : (
        <div className={styles.placeholder} role="img" aria-label={`${title} cover`}>
          <span className={styles.rule} />
          <div className={styles.text}>
            <span className={styles.title}>{title}</span>
            {author && <span className={styles.author}>{author}</span>}
          </div>
        </div>
      )}
    </div>
  );
}
