import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import AudiotrackOutlinedIcon from "@mui/icons-material/AudiotrackOutlined";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import MusicNoteRoundedIcon from "@mui/icons-material/MusicNoteRounded";
import VolumeUpRoundedIcon from "@mui/icons-material/VolumeUpRounded";
import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { AppContainer } from "../components";
import { useBooks } from "../features/books/bookStore";
import { useSettings } from "../features/settings/settingsStore";
import styles from "./AudioStudioPage.module.css";

type MusicCategory = "none" | "ambient" | "cinematic" | "acoustic";

const music: Record<MusicCategory, string[]> = {
  none: [],
  ambient: ["Quiet Pages", "Soft Horizon"],
  cinematic: ["Distant Lights", "First Light"],
  acoustic: ["Warm Strings", "Evening Notes"],
};

export function AudioStudioPage() {
  const { bookId } = useParams();
  const book = useBooks().find((item) => item.id === bookId);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const { narrationSpeed } = useSettings();
  const [speed, setSpeed] = useState(narrationSpeed);
  const [category, setCategory] = useState<MusicCategory>("none");
  const [track, setTrack] = useState("");
  const [volume, setVolume] = useState(20);

  const approved = useMemo(
    () =>
      book?.chapterItems?.filter(
        (chapter) =>
          chapter.translationStatus === "approved" &&
          chapter.translatedText?.trim(),
      ) ?? [],
    [book],
  );

  const selected = approved.filter((chapter) =>
    selectedIds.includes(chapter.id),
  );

  const estimatedMinutes = Math.ceil(
    selected.reduce(
      (total, chapter) =>
        total +
        (chapter.translatedText?.trim().match(/\S+/gu)?.length ?? 0),
      0,
    ) /
      (145 * speed),
  );

  const estimatedParts = Math.max(
    1,
    Math.ceil(estimatedMinutes / 60),
  );

  function toggleChapter(id: string) {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  }

  if (!book) {
    return (
      <AppContainer>
        <div className={styles.missing}>
          <h1>Book not found</h1>
          <p>This book may have been removed.</p>
          <Link to="/books">Back to Books</Link>
        </div>
      </AppContainer>
    );
  }

  return (
    <AppContainer>
      <Link className={styles.back} to={`/books/${book.id}`}>
        <ArrowBackRoundedIcon fontSize="small" />
        {book.title}
      </Link>

      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Audio workspace</p>
          <h1>Audio Studio</h1>
          <p>Prepare an audiobook for {book.title}.</p>
        </div>

        <span className={styles.previewBadge}>
          Setup preview
        </span>
      </header>

      <div className={styles.notice} role="note">
        Audio generation, voice previews, and playback need the audio
        service. Settings on this page are a local preview and are not
        saved yet.
      </div>

      <div className={styles.layout}>
        <div className={styles.main}>
          <section
            className={styles.panel}
            aria-labelledby="chapters-title"
          >
            <div className={styles.panelHead}>
              <span className={styles.icon}>
                <CheckCircleOutlineRoundedIcon fontSize="small" />
              </span>

              <div>
                <h2 id="chapters-title">Choose chapters</h2>
                <p>
                  Only approved translations are ready for narration.
                </p>
              </div>
            </div>

            {approved.length === 0 ? (
              <div className={styles.empty}>
                <AudiotrackOutlinedIcon
                  fontSize="large"
                  aria-hidden="true"
                />
                <h3>No approved translations yet</h3>
                <p>
                  Upload a chapter, add its translation, and approve
                  it to prepare audio.
                </p>
                <Link to={`/books/${book.id}/translation`}>
                  Open translation workspace
                </Link>
              </div>
            ) : (
              <>
                <div className={styles.selectionActions}>
                  <span>
                    {selected.length} of {approved.length} selected
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      setSelectedIds(
                        selected.length === approved.length
                          ? []
                          : approved.map((chapter) => chapter.id),
                      )
                    }
                  >
                    {selected.length === approved.length
                      ? "Clear selection"
                      : "Select all"}
                  </button>
                </div>

                <div className={styles.chapterList}>
                  {approved.map((chapter, index) => (
                    <label
                      className={styles.chapter}
                      key={chapter.id}
                    >
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(chapter.id)}
                        onChange={() =>
                          toggleChapter(chapter.id)
                        }
                      />
                      <span className={styles.chapterNumber}>
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className={styles.chapterTitle}>
                        {chapter.title}
                      </span>
                      <span className={styles.chapterState}>
                        Approved
                      </span>
                    </label>
                  ))}
                </div>
              </>
            )}
          </section>

          <section
            className={styles.panel}
            aria-labelledby="narration-title"
          >
            <div className={styles.panelHead}>
              <span className={styles.icon}>
                <VolumeUpRoundedIcon fontSize="small" />
              </span>

              <div>
                <h2 id="narration-title">Narration</h2>
                <p>Set the pace for the audiobook.</p>
              </div>
            </div>

            <div className={styles.field}>
              <label htmlFor="narration-speed">
                Narration speed{" "}
                <strong>{speed.toFixed(1)}×</strong>
              </label>

              <input
                id="narration-speed"
                type="range"
                min="0.8"
                max="1.2"
                step="0.1"
                value={speed}
                onChange={(event) =>
                  setSpeed(Number(event.target.value))
                }
              />

              <div className={styles.rangeEnds}>
                <span>Slower</span>
                <span>Faster</span>
              </div>
            </div>

            <p className={styles.hint}>
              Voices will appear here when the voice library is
              connected.
            </p>
          </section>

          <section
            className={styles.panel}
            aria-labelledby="music-title"
          >
            <div className={styles.panelHead}>
              <span className={styles.icon}>
                <MusicNoteRoundedIcon fontSize="small" />
              </span>

              <div>
                <h2 id="music-title">Background music</h2>
                <p>Optional built-in Novel Studio tracks.</p>
              </div>
            </div>

            <div className={styles.fields}>
              <label
                className={styles.selectField}
                htmlFor="music-category"
              >
                Category
                <select
                  id="music-category"
                  value={category}
                  onChange={(event) => {
                    setCategory(
                      event.target.value as MusicCategory,
                    );
                    setTrack("");
                  }}
                >
                  <option value="none">No music</option>
                  <option value="ambient">Ambient</option>
                  <option value="cinematic">Cinematic</option>
                  <option value="acoustic">Acoustic</option>
                </select>
              </label>

              {category !== "none" && (
                <label
                  className={styles.selectField}
                  htmlFor="music-track"
                >
                  Track
                  <select
                    id="music-track"
                    value={track}
                    onChange={(event) =>
                      setTrack(event.target.value)
                    }
                  >
                    <option value="">Choose a track</option>
                    {music[category].map((name) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                  </select>
                </label>
              )}
            </div>

            {category !== "none" && (
              <div className={styles.field}>
                <label htmlFor="music-volume">
                  Music volume{" "}
                  <strong>{volume}%</strong>
                </label>

                <input
                  id="music-volume"
                  type="range"
                  min="0"
                  max="50"
                  step="5"
                  value={volume}
                  onChange={(event) =>
                    setVolume(Number(event.target.value))
                  }
                />
              </div>
            )}

            {category !== "none" && (
              <p className={styles.hint}>
                Track names are interface examples. Audio files and
                previews are not connected yet.
              </p>
            )}
          </section>
        </div>

        <aside
          className={styles.summary}
          aria-labelledby="summary-title"
        >
          <h2 id="summary-title">Production summary</h2>

          <dl>
            <div>
              <dt>Chapters</dt>
              <dd>{selected.length}</dd>
            </div>
            <div>
              <dt>Estimated length</dt>
              <dd>
                {selected.length
                  ? `~${estimatedMinutes} min`
                  : "—"}
              </dd>
            </div>
            <div>
              <dt>Estimated files</dt>
              <dd>{selected.length ? estimatedParts : "—"}</dd>
            </div>
            <div>
              <dt>Narration speed</dt>
              <dd>{speed.toFixed(1)}×</dd>
            </div>
            <div>
              <dt>Music</dt>
              <dd>
                {category === "none"
                  ? "Off"
                  : track || "Not selected"}
              </dd>
            </div>
          </dl>

          <p>
            Final audio files will be capped at 60 minutes each.
            Actual length and splits depend on the generated
            narration.
          </p>

          <button
            className={styles.generate}
            type="button"
            disabled
          >
            Generate audiobook
          </button>

          <small>
            Available after the audio service is connected.
          </small>
        </aside>
      </div>
    </AppContainer>
  );
}