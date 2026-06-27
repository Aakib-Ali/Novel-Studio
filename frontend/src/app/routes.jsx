import { Routes, Route } from "react-router-dom";
import LibraryDashboard from "../pages/LibraryDashboard";
import BookWorkspace from "../pages/BookWorkspace";
import NotFound from "../pages/NotFound";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LibraryDashboard />} />
      <Route path="/books/:bookId" element={<BookWorkspace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}