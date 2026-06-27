import { formatStatus } from "../../utils/format";

export default function JobTicker({ jobs }) {
  if (!jobs?.length) return null;

  return (
    <section className="job-ticker">
      {jobs.slice(0, 6).map((job) => (
        <div key={job.id} className="job-pill">
          <span>{formatStatus(job.type)}</span>
          <strong>{job.progress ?? 0}%</strong>
        </div>
      ))}
    </section>
  );
}