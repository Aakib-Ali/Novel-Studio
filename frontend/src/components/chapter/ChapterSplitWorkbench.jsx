import { useEffect, useState } from "react";
import useChapterActions from "../../hooks/useChapterActions";
import AudioPresetPanel from "../audio/AudioPresetPanel";
import AudioAssetGrid from "../audio/AudioAssetGrid";
import ReplacementRuleEditor from "./ReplacementRuleEditor";
import EmptyState from "../feedback/EmptyState";
import { formatStatus } from "../../utils/format";

export default function ChapterSplitWorkbench({ book, chapter, speakers }) {
  const actions = useChapterActions(book?.id);
  const [translatedText, setTranslatedText] = useState("");
  const [replacedText, setReplacedText] = useState("");

  useEffect(() => {
    setTranslatedText(chapter?.translated_text || chapter?.translatedtext || "");
    setReplacedText(chapter?.replaced_text || chapter?.replacedtext || "");
  }, [chapter]);

  if (!chapter) {
    return (
      <section className="ns-surface">
        <EmptyState
          title="No chapter selected"
          description="Choose a chapter row to open the workbench."
        />
      </section>
    );
  }

  return (
    <section className="workbench-shell">
      <div className="workbench-header">
        <div>
          <h2>Chapter {chapter.chapter_number || chapter.chapternumber} workbench</h2>
          <p>Edit translation, run replacements, and generate multiple audio outputs in one place.</p>
        </div>

        <div className="workbench-head-actions">
          <button
            className="ns-btn ns-btn-secondary"
            type="button"
            onClick={() => actions.translateChapter(chapter.id, "hi")}
          >
            Translate chapter
          </button>
        </div>
      </div>

      <div className="split-editor">
        <article className="editor-pane">
          <div className="pane-head">
            <h3>Original text</h3>
            <span className={`ns-badge ${chapter.translation_status || chapter.translationstatus}`}>
              {formatStatus(chapter.translation_status || chapter.translationstatus)}
            </span>
          </div>

          <textarea
            className="ns-input ns-textarea workbench-text"
            value={chapter.original_text || chapter.originaltext || ""}
            readOnly
          />
        </article>

        <article className="editor-pane">
          <div className="pane-head">
            <h3>Translated draft</h3>
            <button
              className="ns-btn ns-btn-secondary"
              type="button"
              onClick={() =>
                setTranslatedText(chapter.translated_text || chapter.translatedtext || "")
              }
            >
              Reset
            </button>
          </div>

          <textarea
            className="ns-input ns-textarea workbench-text"
            value={translatedText}
            onChange={(e) => setTranslatedText(e.target.value)}
          />

          <div className="action-row">
            <button
              className="ns-btn ns-btn-primary"
              type="button"
              onClick={() => actions.saveTranslatedText(chapter.id, translatedText)}
            >
              Save translated text
            </button>
          </div>
        </article>
      </div>

      <div className="split-editor lower">
        <article className="editor-pane">
          <ReplacementRuleEditor chapter={chapter} onReplace={actions.replaceChapter} />
        </article>

        <article className="editor-pane">
          <div className="pane-head">
            <h3>Replaced output</h3>
            <button
              className="ns-btn ns-btn-secondary"
              type="button"
              onClick={() => setReplacedText(chapter.replaced_text || chapter.replacedtext || "")}
            >
              Reset
            </button>
          </div>

          <textarea
            className="ns-input ns-textarea workbench-text"
            value={replacedText}
            onChange={(e) => setReplacedText(e.target.value)}
          />

          <div className="action-row">
            <button
              className="ns-btn ns-btn-primary"
              type="button"
              onClick={() => actions.saveReplacedText(chapter.id, replacedText)}
            >
              Save replaced text
            </button>
          </div>
        </article>
      </div>

      <AudioPresetPanel
        chapter={chapter}
        speakers={speakers}
        onGenerate={actions.generateChapterAudio}
      />

      <AudioAssetGrid assets={chapter.audio_assets || chapter.audioassets || []} />
    </section>
  );
}