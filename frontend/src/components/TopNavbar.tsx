import AutoStoriesOutlinedIcon from "@mui/icons-material/AutoStoriesOutlined";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import WorkHistoryOutlinedIcon from "@mui/icons-material/WorkHistoryOutlined";
import { Popover } from "@mui/material";
import { useState, type MouseEvent } from "react";
import { Link, useLocation } from "react-router-dom";

import {
  markAllNotificationsRead,
  markNotificationRead,
  useNotifications,
} from "../features/notifications/notificationStore";
import styles from "./TopNavbar.module.css";

const navItems = [
  {
    label: "Dashboard",
    path: "/",
    icon: DashboardOutlinedIcon,
  },
  {
    label: "Books",
    path: "/books",
    icon: AutoStoriesOutlinedIcon,
  },
  {
    label: "Jobs",
    path: "/jobs",
    icon: WorkHistoryOutlinedIcon,
  },
];

function formatDate(value: string) {
  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? "Recently"
    : new Intl.DateTimeFormat("en", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(date);
}

export function TopNavbar() {
  const { pathname } = useLocation();
  const notifications = useNotifications();
  const unread = notifications.filter(
    (item) => !item.read,
  ).length;

  const [anchorEl, setAnchorEl] =
    useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  const activePath = pathname.startsWith("/books")
    ? "/books"
    : pathname.startsWith("/jobs")
      ? "/jobs"
      : pathname === "/"
        ? "/"
        : "";

  function openNotifications(
    event: MouseEvent<HTMLButtonElement>,
  ) {
    setAnchorEl(event.currentTarget);
  }

  return (
    <>
      <header className={styles.header}>
        <div className={styles.inner}>
          <Link
            to="/"
            className={styles.brand}
            aria-label="Novel Studio home"
          >
            <span
              className={styles.mark}
              aria-hidden="true"
            >
              ✦
            </span>
            <span className={styles.brandName}>
              Novel Studio
            </span>
          </Link>

          <nav
            className={styles.desktopNav}
            aria-label="Main navigation"
          >
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`${styles.desktopLink} ${
                  activePath === item.path
                    ? styles.activeLink
                    : ""
                }`}
                aria-current={
                  activePath === item.path
                    ? "page"
                    : undefined
                }
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className={styles.account}>
            <button
              className={styles.notification}
              type="button"
              aria-label={
                unread
                  ? `Notifications, ${unread} unread`
                  : "Notifications"
              }
              aria-haspopup="dialog"
              aria-expanded={open}
              aria-controls={
                open ? "notification-panel" : undefined
              }
              onClick={openNotifications}
            >
              <NotificationsNoneOutlinedIcon fontSize="small" />
              {unread > 0 && (
                <span
                  className={styles.notificationDot}
                />
              )}
            </button>

            <Link
              to="/settings"
              className={styles.avatar}
              aria-label="Settings for Aakib Ali"
            >
              AA
            </Link>
          </div>
        </div>
      </header>

      <Popover
        id="notification-panel"
        open={open}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        slotProps={{
          paper: {
            className: styles.notificationPanel,
          },
        }}
      >
        <div className={styles.panelHeader}>
          <div>
            <h2>Notifications</h2>
            <p>
              {unread
                ? `${unread} unread`
                : "You're all caught up"}
            </p>
          </div>

          <button
            type="button"
            className={styles.closeButton}
            aria-label="Close notifications"
            onClick={() => setAnchorEl(null)}
          >
            <CloseRoundedIcon fontSize="small" />
          </button>
        </div>

        {notifications.length === 0 ? (
          <div className={styles.notificationsEmpty}>
            <NotificationsNoneOutlinedIcon
              aria-hidden="true"
            />
            <strong>No notifications yet</strong>
            <p>
              Chapter uploads and translation approvals
              will appear here.
            </p>
          </div>
        ) : (
          <>
            <div className={styles.panelActions}>
              <span>Recent activity</span>

              {unread > 0 && (
                <button
                  type="button"
                  onClick={markAllNotificationsRead}
                >
                  Mark all read
                </button>
              )}
            </div>

            <ul className={styles.notificationList}>
              {notifications.map((item) => (
                <li key={item.id}>
                  <Link
                    to={item.href}
                    className={`${
                      styles.notificationItem
                    } ${
                      !item.read
                        ? styles.unreadItem
                        : ""
                    }`}
                    onClick={() => {
                      markNotificationRead(item.id);
                      setAnchorEl(null);
                    }}
                  >
                    <span
                      className={styles.itemIcon}
                      aria-hidden="true"
                    >
                      {item.type === "chapter"
                        ? "＋"
                        : "✓"}
                    </span>

                    <span className={styles.itemText}>
                      <strong>{item.title}</strong>
                      <span>{item.description}</span>
                      <small>
                        {formatDate(item.createdAt)}
                      </small>
                    </span>

                    {!item.read && (
                      <span
                        className={styles.unreadDot}
                        aria-label="Unread"
                      />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </Popover>

      <nav
        className={styles.mobileNav}
        aria-label="Mobile navigation"
      >
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`${styles.mobileLink} ${
                activePath === item.path
                  ? styles.activeMobileLink
                  : ""
              }`}
              aria-current={
                activePath === item.path
                  ? "page"
                  : undefined
              }
            >
              <Icon fontSize="small" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}