import { api } from '../../api/api';

export default function AudioAssetList({ assets }) {
  const resolveUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;

    const apiOrigin = new URL(api.baseURL).origin;
    return `${apiOrigin}${url}`;
  };

  return (
    <section className="surface-card nested">
      <div className="section-header">
        <div>
          <h3 className="section-title">Audio outputs</h3>
          <p className="section-note">Each generated voice remains stored as a separate asset.</p>
        </div>
      </div>

      <div className="audio-list">
        {assets.map(asset => {
          const audioUrl = resolveUrl(asset.download_url);

          return (
            <article key={asset.id} className="audio-item">
              <div className="audio-item-top">
                <div>
                  <h4>{asset.voice_name}</h4>
                  <p>{asset.language.toUpperCase()} · {asset.accent} · {asset.source_text_type}</p>
                </div>
                <span className={`status-pill ${asset.status}`}>{asset.status}</span>
              </div>

              <audio controls className="w-100">
                <source src={audioUrl} type="audio/mpeg" />
                Your browser does not support audio playback.
              </audio>

              <a
                href={audioUrl}
                className="btn ns-btn ns-btn-secondary"
                target="_blank"
                rel="noreferrer"
                download
              >
                Download
              </a>
            </article>
          );
        })}
        {assets.length === 0 && <div className="empty-lite">No audio versions yet.</div>}
      </div>
    </section>
  );
}