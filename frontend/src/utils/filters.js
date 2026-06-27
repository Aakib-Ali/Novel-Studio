export function filterBooks(books, query, status) {
  return books.filter((book) => {
    const matchesText =
      !query ||
      book.title.toLowerCase().includes(query.toLowerCase()) ||
      book.author.toLowerCase().includes(query.toLowerCase());

    const matchesStatus = status === "all" || book.workflow_status === status;

    return matchesText && matchesStatus;
  });
}