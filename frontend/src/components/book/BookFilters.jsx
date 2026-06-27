import { useWorkspace } from "../../context/WorkspaceContext";
import { WORKFLOW_STATUS_OPTIONS } from "../../utils/constants";

export default function BookFilters() {
  const { libraryQuery, setLibraryQuery, statusFilter, setStatusFilter } = useWorkspace();

  return (
    <div className="book-filters">
      <input
        className="ns-input"
        placeholder="Search title or author"
        value={libraryQuery}
        onChange={(e) => setLibraryQuery(e.target.value)}
      />

      <select
        className="ns-input"
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
      >
        {WORKFLOW_STATUS_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}