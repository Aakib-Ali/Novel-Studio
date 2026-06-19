import { Routes, Route } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import BookDetails from '../pages/BookDetails';
import NotFound from '../pages/NotFound';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/books/:bookId" element={<BookDetails />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}