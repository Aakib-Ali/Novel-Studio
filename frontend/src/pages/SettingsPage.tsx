import AudiotrackOutlinedIcon from "@mui/icons-material/AudiotrackOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import { useState } from "react";

import { AppContainer, PageHeader } from "../components";
import {
  updateSettings,
  useSettings,
} from "../features/settings/settingsStore";
import styles from "./SettingsPage.module.css";

const sections = [
  { id: "profile", label: "Profile" },
  { id: "preferences", label: "Preferences" },
  { id: "audio", label: "Audio" },
  { id: "security", label: "Security" },
  { id: "notifications", label: "Notifications" },
];

export function SettingsPage() {
  const settings = useSettings();
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  function change(patch: Parameters<typeof updateSettings>[0]) {
    try {
      updateSettings(patch);
      setError("");
      setSaved(true);
    } catch (cause) {
      setSaved(false);
      setError(
        cause instanceof Error
          ? cause.message
          : "Could not save settings.",
      );
    }
  }

  return (
    <AppContainer>
      <PageHeader
        eyebrow="Your account"
        title="Settings"
        description="Set up your reading and audio preferences."
      />

      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}

      {saved && !error && (
        <p className={styles.saved} role="status">
          Saved on this device.
        </p>
      )}

      <div className={styles.layout}>
        <nav
          className={styles.navigation}
          aria-label="Settings sections"
        >
          {sections.map((section) => (
            <a key={section.id} href={`#${section.id}`}>
              {section.label}
            </a>
          ))}
        </nav>

        <div className={styles.content}>
          <section
            className={styles.panel}
            id="profile"
            aria-labelledby="profile-title"
          >
            <div className={styles.heading}>
              <PersonOutlineRoundedIcon />
              <div>
                <h2 id="profile-title">Profile</h2>
                <p>Account details</p>
              </div>
            </div>

            <div className={styles.profile}>
              <span className={styles.avatar}>AA</span>
              <div>
                <strong>Aakib Ali</strong>
                <small>Demo profile</small>
              </div>
            </div>

            <p className={styles.note}>
              Profile editing will be available when account
              authentication is connected.
            </p>
          </section>

          <section
            className={styles.panel}
            id="preferences"
            aria-labelledby="preferences-title"
          >
            <div className={styles.heading}>
              <TuneRoundedIcon />
              <div>
                <h2 id="preferences-title">Preferences</h2>
                <p>Make the reading workspace comfortable.</p>
              </div>
            </div>

            <fieldset className={styles.fieldset}>
              <legend>Story text size</legend>

              <div className={styles.choices}>
                <label className={styles.choice}>
                  <input
                    type="radio"
                    name="reading-size"
                    checked={
                      settings.readingSize === "comfortable"
                    }
                    onChange={() =>
                      change({ readingSize: "comfortable" })
                    }
                  />
                  Comfortable
                </label>

                <label className={styles.choice}>
                  <input
                    type="radio"
                    name="reading-size"
                    checked={settings.readingSize === "large"}
                    onChange={() =>
                      change({ readingSize: "large" })
                    }
                  />
                  Large
                </label>
              </div>

              <p>
                This changes Read and Original modes in the chapter
                workspace.
              </p>
            </fieldset>
          </section>

          <section
            className={styles.panel}
            id="audio"
            aria-labelledby="audio-title"
          >
            <div className={styles.heading}>
              <AudiotrackOutlinedIcon />
              <div>
                <h2 id="audio-title">Audio</h2>
                <p>Default setup for new Audio Studio sessions.</p>
              </div>
            </div>

            <label
              className={styles.selectField}
              htmlFor="default-speed"
            >
              Narration speed
              <select
                id="default-speed"
                value={settings.narrationSpeed}
                onChange={(event) =>
                  change({
                    narrationSpeed: Number(event.target.value),
                  })
                }
              >
                <option value={0.8}>0.8×</option>
                <option value={0.9}>0.9×</option>
                <option value={1}>1.0×</option>
                <option value={1.1}>1.1×</option>
                <option value={1.2}>1.2×</option>
              </select>
            </label>

            <p className={styles.note}>
              The selected speed opens by default in Audio Studio.
              Audio generation is not connected yet.
            </p>
          </section>

          <section
            className={styles.panel}
            id="security"
            aria-labelledby="security-title"
          >
            <div className={styles.heading}>
              <SecurityOutlinedIcon />
              <div>
                <h2 id="security-title">Security</h2>
                <p>Sign-in and account protection.</p>
              </div>
            </div>

            <p className={styles.note}>
              Password, sessions, and account security controls will
              appear when authentication is connected.
            </p>
          </section>

          <section
            className={styles.panel}
            id="notifications"
            aria-labelledby="notifications-title"
          >
            <div className={styles.heading}>
              <NotificationsNoneOutlinedIcon />
              <div>
                <h2 id="notifications-title">Notifications</h2>
                <p>Choose the updates you want to receive.</p>
              </div>
            </div>

            <label className={styles.toggleRow}>
              <span>
                <strong>Job updates</strong>
                <small>
                  Processing completed or needs attention
                </small>
              </span>
              <input
                type="checkbox"
                checked={settings.jobNotifications}
                onChange={(event) =>
                  change({
                    jobNotifications: event.target.checked,
                  })
                }
              />
            </label>

            <label className={styles.toggleRow}>
              <span>
                <strong>Product updates</strong>
                <small>New features and studio news</small>
              </span>
              <input
                type="checkbox"
                checked={settings.productNotifications}
                onChange={(event) =>
                  change({
                    productNotifications: event.target.checked,
                  })
                }
              />
            </label>

            <p className={styles.note}>
              These choices are saved locally. Notification delivery
              needs the backend.
            </p>
          </section>
        </div>
      </div>
    </AppContainer>
  );
}