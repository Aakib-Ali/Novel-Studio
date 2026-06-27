export default function LibraryHero({ onCreate }) {
  return (
    <section className="library-hero">
      <div>
        <p className="ns-eyebrow">Library</p>
        <h1>Book production workspace</h1>
        <p>
          Upload manuscripts, track translation, manage editorial correction, and generate
          multiple audiobook outputs from one operational console.
        </p>
      </div>

      <div className="library-hero-actions">
        <button className="ns-btn ns-btn-primary" type="button" onClick={onCreate}>
          Create book
        </button>
      </div>
    </section>
  );
}