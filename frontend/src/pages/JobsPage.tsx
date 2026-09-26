import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import HourglassEmptyRoundedIcon from "@mui/icons-material/HourglassEmptyRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { AppContainer, PageHeader } from "../components";
import styles from "./JobsPage.module.css";

type JobStatus = "running" | "completed" | "partial" | "failed";
type ItemStatus = "completed" | "running" | "queued" | "failed";
type Filter = "all" | "running" | "completed" | "attention";

type JobItem = {
  name: string;
  status: ItemStatus;
  detail?: string;
};

type Job = {
  id: string;
  title: string;
  type: string;
  status: JobStatus;
  progress: number;
  created: string;
  description: string;
  items: JobItem[];
};

const jobs: Job[] = [
  {
    id: "translation-silent-house",
    title: "The Silent House",
    type: "Hindi translation",
    status: "running",
    progress: 75,
    created: "Today, 10:24 AM",
    description: "18 of 24 chapters processed",
    items: [
      { name: "Chapters 1–18", status: "completed" },
      { name: "Chapter 19", status: "running", detail: "Processing content" },
      { name: "Chapters 20–24", status: "queued" },
    ],
  },
  {
    id: "audio-last-lantern",
    title: "The Last Lantern",
    type: "Hindi audiobook",
    status: "running",
    progress: 42,
    created: "Today, 9:12 AM",
    description: "Generating narration",
    items: [
      { name: "Chapters 1–8", status: "completed" },
      { name: "Chapter 9", status: "running", detail: "Generating audio" },
      { name: "Remaining chapters", status: "queued" },
    ],
  },
  {
    id: "upload-echoes",
    title: "Echoes of Rain",
    type: "Chapter upload",
    status: "partial",
    progress: 67,
    created: "Yesterday, 4:36 PM",
    description: "2 of 3 files imported; one needs attention",
    items: [
      { name: "chapter-17.txt", status: "completed" },
      { name: "chapter-18.txt", status: "completed" },
      {
        name: "chapter-19.txt",
        status: "failed",
        detail: "File could not be read",
      },
    ],
  },
  {
    id: "translation-echoes",
    title: "Echoes of Rain",
    type: "Hindi translation",
    status: "completed",
    progress: 100,
    created: "Yesterday, 1:08 PM",
    description: "All 18 chapters processed",
    items: [{ name: "Chapters 1–18", status: "completed" }],
  },
  {
    id: "audio-silent-house",
    title: "The Silent House",
    type: "Hindi audiobook",
    status: "failed",
    progress: 0,
    created: "Sep 23, 3:40 PM",
    description: "Audio generation stopped",
    items: [
      {
        name: "Chapter 1",
        status: "failed",
        detail: "Audio service unavailable",
      },
      { name: "Remaining chapters", status: "queued" },
    ],
  },
];

const filters: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "running", label: "Running" },
  { value: "completed", label: "Completed" },
  { value: "attention", label: "Needs attention" },
];

const statusLabels: Record<JobStatus | ItemStatus, string> = {
  running: "Running",
  completed: "Completed",
  partial: "Partial",
  failed: "Failed",
  queued: "Queued",
};

function statusClass(status: JobStatus | ItemStatus) {
  return `${styles.status} ${styles[status]}`;
}

export function JobsPage() {
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const visibleJobs = useMemo(() => {
    const search = query.trim().toLocaleLowerCase();

    return jobs.filter((job) => {
      const matchesFilter =
        filter === "all" ||
        (filter === "attention"
          ? job.status === "failed" || job.status === "partial"
          : job.status === filter);

      const matchesSearch =
        !search ||
        `${job.title} ${job.type} ${job.description}`
          .toLocaleLowerCase()
          .includes(search);

      return matchesFilter && matchesSearch;
    });
  }, [filter, query]);

  return (
    <AppContainer>
      <PageHeader
        eyebrow="Workflow"
        title="Jobs"
        description="Follow chapter uploads, translations, and audiobook generation."
      />

      <div className={styles.notice} role="note">
        <strong>Preview data</strong> · These are sample jobs for the interface.
        Your uploads and edits do not create background jobs yet.
      </div>

      <section className={styles.workspace} aria-label="Job history">
        <div className={styles.toolbar}>
          <div
            className={styles.filters}
            role="group"
            aria-label="Filter jobs"
          >
            {filters.map((option) => (
              <button
                key={option.value}
                type="button"
                className={`${styles.filter} ${
                  filter === option.value ? styles.selected : ""
                }`}
                aria-pressed={filter === option.value}
                onClick={() => setFilter(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>

          <label className={styles.search}>
            <SearchRoundedIcon fontSize="small" aria-hidden="true" />
            <span className={styles.srOnly}>Search jobs</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search jobs"
            />
          </label>
        </div>

        <div className={styles.list}>
          {visibleJobs.length === 0 ? (
            <div className={styles.empty}>
              <HourglassEmptyRoundedIcon aria-hidden="true" />
              <h2>No matching jobs</h2>
              <p>Try another filter or search term.</p>
            </div>
          ) : (
            visibleJobs.map((job) => {
              const expanded = expandedId === job.id;

              return (
                <article className={styles.card} key={job.id}>
                  <div className={styles.cardTop}>
                    <div className={styles.jobIcon} aria-hidden="true">
                      {job.status === "completed" ? (
                        <CheckCircleOutlineRoundedIcon />
                      ) : job.status === "failed" ||
                        job.status === "partial" ? (
                        <ErrorOutlineRoundedIcon />
                      ) : (
                        <HourglassEmptyRoundedIcon />
                      )}
                    </div>

                    <div className={styles.identity}>
                      <h2>{job.title}</h2>
                      <p>
                        {job.type} <span aria-hidden="true">·</span>{" "}
                        {job.created}
                      </p>
                    </div>

                    <span className={statusClass(job.status)}>
                      {statusLabels[job.status]}
                    </span>
                  </div>

                  <p className={styles.description}>{job.description}</p>

                  <div className={styles.progressHeading}>
                    <span>Progress</span>
                    <strong>{job.progress}%</strong>
                  </div>

                  <progress
                    className={styles.progressTrack}
                    value={job.progress}
                    max={100}
                    aria-label={`${job.title} ${job.type} progress`}
                  />

                  <button
                    type="button"
                    className={styles.detailsButton}
                    aria-expanded={expanded}
                    aria-controls={`job-details-${job.id}`}
                    onClick={() => setExpandedId(expanded ? null : job.id)}
                  >
                    {expanded ? "Hide details" : "View details"}
                    <ExpandMoreRoundedIcon
                      className={expanded ? styles.rotated : ""}
                      fontSize="small"
                    />
                  </button>

                  {expanded && (
                    <div
                      className={styles.details}
                      id={`job-details-${job.id}`}
                    >
                      <h3>Items</h3>

                      <ul>
                        {job.items.map((item) => (
                          <li key={item.name}>
                            <span className={styles.itemName}>
                              <strong>{item.name}</strong>
                              {item.detail && <small>{item.detail}</small>}
                            </span>
                            <span className={statusClass(item.status)}>
                              {statusLabels[item.status]}
                            </span>
                          </li>
                        ))}
                      </ul>

                      {(job.status === "partial" ||
                        job.status === "failed") && (
                        <p className={styles.help}>
                          Retry will be available when the background worker
                          is connected. You can return to{" "}
                          <Link to="/books">Books</Link> to manage your
                          chapters.
                        </p>
                      )}
                    </div>
                  )}
                </article>
              );
            })
          )}
        </div>
      </section>
    </AppContainer>
  );
}