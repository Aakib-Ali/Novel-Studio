import ChapterRowActions from "./ChapterRowActions";
import { formatStatus, formatDateTime } from "../../utils/format";

export default function ChapterTableV2({ chapters = [], selectedChapter, onSelectChapter }) {
  return (
    <section className="ns-surface">
      <div className="section-top">
        <div>
          <h2>Chapters</h2>
          <p>Browse chapters and open contextual details in the workbench below.</p>
        </div>
      </div>

      <div className="table-wrap">
        <table className="chapter-table-v2">
          <thead>
            <tr>
              <th>Chapter</th>
              <th>Text status</th>
              <th>Audio</th>
              <th>Updated</th>
              <th />
            </tr>
          </thead>

          <tbody>
            {chapters.map((chapter) => {
              const active = selectedChapter?.id === chapter.id;

              return (
                <tr
                  key={chapter.id}
                  className={active ? "active" : ""}
                  onClick={() => onSelectChapter(chapter)}
                >
                  <td>
                    <strong>Chapter {chapter.chapternumber ?? chapter.chapter_number}</strong>
                    <div className="muted">{chapter.title || "Untitled chapter"}</div>
                  </td>

                  <td>
                    <div className="status-stack">
                      <span className={`ns-badge ${chapter.translationstatus || chapter.translation_status}`}>
                        T · {formatStatus(chapter.translationstatus || chapter.translation_status)}
                      </span>
                      <span className={`ns-badge ${chapter.replacementstatus || chapter.replacement_status}`}>
                        R · {formatStatus(chapter.replacementstatus || chapter.replacement_status)}
                      </span>
                    </div>
                  </td>

                  <td>
                    <span className={`ns-badge ${chapter.audiostatus || chapter.audio_status}`}>
                      {chapter.audioassets?.length ?? chapter.audio_assets?.length ?? 0} assets
                    </span>
                  </td>

                  <td>{formatDateTime(chapter.updatedat || chapter.updated_at)}</td>

                  <td>
                    <ChapterRowActions chapter={chapter} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}