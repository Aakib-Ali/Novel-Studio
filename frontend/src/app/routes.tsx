import { createBrowserRouter } from "react-router-dom";

import { AppLayout } from "../layouts/AppLayout";
import { AudioStudioPage } from "../pages/AudioStudioPage";
import { BookDetailsPage } from "../pages/BookDetailsPage";
import { BooksPage } from "../pages/BooksPage";
import { ChapterUploadPage } from "../pages/ChapterUploadPage";
import { ChapterWorkspacePage } from "../pages/ChapterWorkspacePage";
import { DashboardPage } from "../pages/DashboardPage";
import { JobsPage } from "../pages/JobsPage";
import { SettingsPage } from "../pages/SettingsPage";
import { TranslationPage } from "../pages/TranslationPage";

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <DashboardPage />,
      },
      {
        path: "/books",
        element: <BooksPage />,
      },
      {
        path: "/books/:bookId",
        element: <BookDetailsPage />,
      },
      {
        path: "/books/:bookId/chapters/upload",
        element: <ChapterUploadPage />,
      },
      {
        path: "/books/:bookId/audio",
        element: <AudioStudioPage />,
      },
      {
        path: "/books/:bookId/translation",
        element: <TranslationPage />,
      },
      {
        path: "/books/:bookId/chapters/:chapterId",
        element: <ChapterWorkspacePage />,
      },
      {
        path: "/settings",
        element: <SettingsPage />,
      },
      {
        path: "/jobs",
        element: <JobsPage />,
      },
    ],
  },
]);