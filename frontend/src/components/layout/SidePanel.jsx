export default function SidePanel({ open, title, children, onToggle }) {
  return (
    <aside className={`side-panel ${open ? "open" : "closed"}`}>
      <div className="side-panel-head">
        <div>
          <h3>{title}</h3>
          <p>Secondary controls and activity context.</p>
        </div>

        <button className="ns-icon-btn" type="button" onClick={onToggle}>
          {open ? "Collapse" : "Expand"}
        </button>
      </div>

      {open ? <div className="side-panel-body">{children}</div> : null}
    </aside>
  );
}