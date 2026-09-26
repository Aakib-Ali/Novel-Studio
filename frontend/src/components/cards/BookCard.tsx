import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import { IconButton } from "@mui/material";

import { BookCover } from "../media/BookCover";
import { ProgressBar } from "../progress/ProgressBar";
import { StatusBadge, type StatusType } from "../status/StatusBadge";
import styles from "./BookCard.module.css";

interface BookCardProps {
  title: string;
  author: string;
  chapters: number;
  words: string | number;
  progress?: number;
  status: StatusType;
  cover?: string;
  onOpen?: () => void;
  onMenu?: () => void;
}

export function BookCard({
  title,
  author,
  chapters,
  words,
  progress = 0,
  status,
  cover,
  onOpen,
  onMenu,
}: BookCardProps) {
  const coverContent = (
    <BookCover src={cover} title={title} author={author} width="100%" height="100%" />
  );

  return (
    <article className={styles.card}>
      {onOpen ? (
        <button className={styles.coverButton} type="button" onClick={onOpen} aria-label={`Open ${title}`}>
          {coverContent}
        </button>
      ) : (
        <div className={styles.coverButton}>{coverContent}</div>
      )}

      <div className={styles.content}>
        <div className={styles.heading}>
          <div className={styles.headingText}>
            {onOpen ? (
              <button className={styles.titleButton} type="button" onClick={onOpen}>
                {title}
              </button>
            ) : (
              <div className={styles.title}>{title}</div>
            )}
            <div className={styles.author}>{author}</div>
          </div>
          {onMenu && (
            <IconButton size="small" aria-label={`More options for ${title}`} onClick={onMenu}>
              <MoreVertRoundedIcon fontSize="small" />
            </IconButton>
          )}
        </div>

        <div className={styles.status}><StatusBadge status={status} /></div>
        <div className={styles.meta}>{chapters} chapters · {words} words</div>

        {progress > 0 && (
          <div className={styles.progress}>
            <div className={styles.progressLabels}>
              <span>Translation</span>
              <strong>{progress}%</strong>
            </div>
            <ProgressBar value={progress} height={4} />
          </div>
        )}

        {onOpen && (
          <button className={styles.open} type="button" onClick={onOpen}>
            Open book <ArrowForwardRoundedIcon fontSize="inherit" />
          </button>
        )}
      </div>
    </article>
  );
}
