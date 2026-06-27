import { useState } from "react";
import { parseReplacementRules } from "../../utils/chapter";
import { formatStatus } from "../../utils/format";

export default function ReplacementRuleEditor({ chapter, onReplace }) {
  const [rules, setRules] = useState("John=Jॉन");

  return (
    <div>
      <div className="pane-head">
        <h3>Replacement rules</h3>
        <span className={`ns-badge ${chapter.replacement_status || chapter.replacementstatus}`}>
          {formatStatus(chapter.replacement_status || chapter.replacementstatus)}
        </span>
      </div>

      <textarea
        className="ns-input ns-textarea"
        rows={10}
        value={rules}
        onChange={(e) => setRules(e.target.value)}
      />

      <div className="action-row">
        <button
          className="ns-btn ns-btn-secondary"
          type="button"
          onClick={() => onReplace(chapter.id, parseReplacementRules(rules), "translated")}
        >
          Run replacement
        </button>
      </div>
    </div>
  );
}