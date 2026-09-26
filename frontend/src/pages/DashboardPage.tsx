import AddRoundedIcon from "@mui/icons-material/AddRounded";
import AutoStoriesOutlinedIcon from "@mui/icons-material/AutoStoriesOutlined";
import AudiotrackOutlinedIcon from "@mui/icons-material/AudiotrackOutlined";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import TranslateOutlinedIcon from "@mui/icons-material/TranslateOutlined";
import WorkHistoryOutlinedIcon from "@mui/icons-material/WorkHistoryOutlined";
import { Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

import {
  AppContainer,
  BookCard,
  JobCard,
  PageHeader,
  StatCard,
} from "../components";
import { useBooks } from "../features/books/bookStore";
import { useNotifications } from "../features/notifications/notificationStore";
import styles from "./DashboardPage.module.css";

function formatDate(value: string) {
  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? "Recently"
    : new Intl.DateTimeFormat("en", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(date);
}

export function DashboardPage() {
  const books = useBooks();
  const notifications = useNotifications();
  const navigate = useNavigate();

  const recentBooks = books.slice(0, 3);

  const totalChapters = books.reduce(
    (total, book) => total + book.chapters,
    0,
  );

  const approvedTranslations = books.reduce(
    (total, book) =>
      total +
      (book.chapterItems?.filter(
        (chapter) =>
          chapter.translationStatus === "approved",
      ).length ?? 0),
    0,
  );

  const bookWithChapter = books.find(
    (book) => (book.chapterItems?.length ?? 0) > 0,
  );

  const latestChapter = bookWithChapter?.chapterItems?.at(-1);
  const continueBook = bookWithChapter ?? books[0];

  const continuePath =
    latestChapter && bookWithChapter
      ? `/books/${bookWithChapter.id}/chapters/${latestChapter.id}`
      : continueBook
        ? `/books/${continueBook.id}`
        : "/books?create=1";

  return (
    <AppContainer>
      <div className={styles.page}>
        <PageHeader
          eyebrow="Your story space"
          title="Welcome back, Aakib"
          description="Pick up where you left off or bring your next story to life."
          actions={
            <Button
              variant="contained"
              startIcon={<AddRoundedIcon />}
              component={Link}
              to="/books?create=1"
              className={styles.createButton}
            >
              Create Book
            </Button>
          }
        />

        <div className={styles.stats}>
          <StatCard
            label="Total Books"
            value={String(books.length)}
            description="In your library"
            icon={<MenuBookOutlinedIcon />}
            accent="violet"
          />

          <StatCard
            label="Total Chapters"
            value={String(totalChapters)}
            description="Including sample books"
            icon={<AutoStoriesOutlinedIcon />}
            accent="pink"
          />

          <StatCard
            label="Approved Text"
            value={String(approvedTranslations)}
            description="Translations saved here"
            icon={<TranslateOutlinedIcon />}
            accent="violet"
          />

          <StatCard
            label="Audio Files"
            value="0"
            description="Generation not connected"
            icon={<AudiotrackOutlinedIcon />}
            accent="cyan"
          />
        </div>

        <section aria-labelledby="recent-books-title">
          <div className={styles.sectionHead}>
            <div>
              <h2 id="recent-books-title">Recent Books</h2>
              <p>Continue working on your latest stories.</p>
            </div>

            <Link
              to="/books"
              className={styles.sectionLink}
            >
              View All
              <ChevronRightRoundedIcon fontSize="small" />
            </Link>
          </div>

          {recentBooks.length ? (
            <div className={styles.bookGrid}>
              {recentBooks.map((book) => (
                <BookCard
                  key={book.id}
                  title={book.title}
                  author={book.author}
                  chapters={book.chapters}
                  words={book.words}
                  progress={book.progress}
                  status={book.status}
                  onOpen={() =>
                    navigate(`/books/${book.id}`)
                  }
                />
              ))}
            </div>
          ) : (
            <div className={styles.empty}>
              <p>
                No books yet. Create your first book to start
                your studio.
              </p>
              <Link to="/books?create=1">
                Create Book
              </Link>
            </div>
          )}
        </section>

        <div className={styles.workGrid}>
          <section aria-labelledby="continue-title">
            <div className={styles.sectionHead}>
              <div>
                <h2 id="continue-title">
                  Continue Working
                </h2>
                <p>Your latest available workspace.</p>
              </div>
            </div>

            <div className={styles.continueCard}>
              <span className={styles.featureIcon}>
                <AutoStoriesOutlinedIcon />
              </span>

              <div className={styles.continueText}>
                <small>
                  {continueBook?.title ??
                    "Your library"}
                </small>

                <h3>
                  {latestChapter?.title ??
                    (continueBook
                      ? "Book workspace"
                      : "Start a new book")}
                </h3>

                <p>
                  {latestChapter
                    ? "Open the chapter to read or edit its translation."
                    : continueBook
                      ? "Add chapters or open the translation workspace."
                      : "Your writing space is ready."}
                </p>
              </div>

              <Button
                variant="outlined"
                component={Link}
                to={continuePath}
                endIcon={<ChevronRightRoundedIcon />}
              >
                Continue
              </Button>
            </div>
          </section>

          <section aria-labelledby="jobs-title">
            <div className={styles.sectionHead}>
              <div>
                <h2 id="jobs-title">Jobs Preview</h2>
                <p>
                  Sample workflow cards until background
                  workers are connected.
                </p>
              </div>

              <Link
                to="/jobs"
                className={styles.sectionLink}
              >
                Jobs
                <ChevronRightRoundedIcon fontSize="small" />
              </Link>
            </div>

            <div className={styles.jobs}>
              <JobCard
                title="The Silent House"
                type="Hindi translation · sample"
                status="translating"
                progress={75}
                current={18}
                total={24}
                description="Preview data"
                onClick={() => navigate("/jobs")}
              />

              <JobCard
                title="The Last Lantern"
                type="Audiobook generation · sample"
                status="processing"
                progress={42}
                description="Preview data"
                onClick={() => navigate("/jobs")}
              />
            </div>
          </section>
        </div>

        <section aria-labelledby="activity-title">
          <div className={styles.sectionHead}>
            <div>
              <h2 id="activity-title">
                Recent Activity
              </h2>
              <p>Changes made in this browser.</p>
            </div>
          </div>

          {notifications.length ? (
            <ul className={styles.activityList}>
              {notifications.slice(0, 4).map((item) => (
                <li key={item.id}>
                  <Link
                    to={item.href}
                    className={styles.activityRow}
                  >
                    <span className={styles.activityIcon}>
                      {item.type === "chapter" ? (
                        <AutoStoriesOutlinedIcon fontSize="small" />
                      ) : (
                        <TranslateOutlinedIcon fontSize="small" />
                      )}
                    </span>

                    <span className={styles.activityText}>
                      <strong>{item.title}</strong>
                      <small>{item.description}</small>
                    </span>

                    <time dateTime={item.createdAt}>
                      {formatDate(item.createdAt)}
                    </time>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className={styles.empty}>
              <p>
                No activity yet. Upload a chapter or approve
                a translation to see it here.
              </p>
            </div>
          )}
        </section>

        <div className={styles.info}>
          <span className={styles.infoIcon}>
            <WorkHistoryOutlinedIcon />
          </span>

          <div>
            <strong>
              Background processing is not connected yet
            </strong>
            <p>
              Jobs on this dashboard are examples. Chapter
              uploads and translated text are saved in this
              browser.
            </p>
          </div>
        </div>
      </div>
    </AppContainer>
  );
}