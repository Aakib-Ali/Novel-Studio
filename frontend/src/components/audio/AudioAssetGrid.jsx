import { resolveAssetUrl } from "../../utils/audio";
import { formatStatus } from "../../utils/format";

export default function AudioAssetGrid({ assets }) {
  return (
    <section className="ns-surface embedded">
      <div className="section-top">
        <div>
          <h3>Audio outputs</h3>
          <p>Each generated result remains available as a separate version.</p>
        </div>
      </div>

      <div className="audio-grid">
        {assets.map((asset) => {
          const audioUrl = resolveAssetUrl(asset.download_url || asset.downloadurl);

          return (
            <article key={asset.id} className="audio-card">
              <div className="card-row">
                <div>
                  <h4>{asset.voice_name || asset.voicename}</h4>
                  <p>
                    {(asset.language || "").toUpperCase()} · {asset.accent} ·{" "}
                    {asset.source_text_type || asset.sourcetexttype}
                  </p>
                </div>

                <span className={`ns-badge ${asset.status}`}>{formatStatus(asset.status)}</span>
              </div>

              <audio controls className="w-100" src={audioUrl} />

              <a
                className="ns-btn ns-btn-secondary"
                href={audioUrl}
                target="_blank"
                rel="noreferrer"
                download
              >
                Download
              </a>
            </article>
          );
        })}

        {!assets.length ? <div className="empty-inline">No generated audio yet.</div> : null}
      </div>
    </section>
  );
}