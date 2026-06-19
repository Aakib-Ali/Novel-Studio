import { useEffect, useMemo, useState } from 'react';
import { useUI } from '../../context/UIContext';
import { useChapterActions } from '../../hooks/useChapterActions';
import { parseReplacementRules } from '../../utils/chapter';
import AudioGenerationPanel from '../audio/AudioGenerationPanel';
import AudioAssetList from '../audio/AudioAssetList';

export default function ChapterEditorOffcanvas({ book, speakers }) {
  const { editorChapter, setEditorChapter } = useUI();
  const actions = useChapterActions(book?.id);
  const [translatedText, setTranslatedText] = useState('');
  const [replacedText, setReplacedText] = useState('');
  const [rulesText, setRulesText] = useState('John:जॉन');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!editorChapter) return;
    setTranslatedText(editorChapter.translated_text || '');
    setReplacedText(editorChapter.replaced_text || '');
  }, [editorChapter]);

  const current = useMemo(() => {
    if (!editorChapter || !book?.chapters) return null;
    return book.chapters.find(c => c.id === editorChapter.id) || editorChapter;
  }, [book, editorChapter]);

  if (!current) return null;

  const saveTranslated = async () => {
    setSaving(true);
    try {
      await actions.saveTranslatedText(current.id, translatedText);
    } finally {
      setSaving(false);
    }
  };

  const applyReplacement = async () => {
    setSaving(true);
    try {
      await actions.replaceChapter(current.id, parseReplacementRules(rulesText), 'translated');
    } finally {
      setSaving(false);
    }
  };

  const saveReplaced = async () => {
    setSaving(true);
    try {
      await actions.saveReplacedText(current.id, replacedText);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={`editor-offcanvas ${current ? 'open' : ''}`}>
      <div className="editor-header">
        <div>
          <h3>Chapter {current.chapter_number}</h3>
          <p>{current.title || 'Editorial workspace'}</p>
        </div>
        <button className="icon-button" onClick={() => setEditorChapter(null)}>Close</button>
      </div>

      <div className="editor-body">
        <div className="editor-columns">
          <section className="editor-panel">
            <div className="panel-head">
              <h4>Original text</h4>
              <span className={`status-pill ${current.translation_status}`}>{current.translation_status}</span>
            </div>
            <textarea className="form-control ns-textarea fixed" rows="18" value={current.original_text || ''} readOnly />
          </section>

          <section className="editor-panel">
            <div className="panel-head">
              <h4>Translated text</h4>
              <button className="btn ns-btn ns-btn-secondary" onClick={() => actions.translateChapter(current.id, 'hi')}>
                Translate
              </button>
            </div>
            <textarea className="form-control ns-textarea fixed" rows="18" value={translatedText} onChange={e => setTranslatedText(e.target.value)} />
            <div className="action-row">
              <button className="btn ns-btn ns-btn-secondary" onClick={() => setTranslatedText(current.translated_text || '')}>Reset draft</button>
              <button className="btn ns-btn ns-btn-primary" onClick={saveTranslated} disabled={saving}>Save translated text</button>
            </div>
          </section>
        </div>

        <div className="editor-columns">
          <section className="editor-panel">
            <div className="panel-head">
              <h4>Replacement rules</h4>
              <span className={`status-pill ${current.replacement_status}`}>{current.replacement_status}</span>
            </div>
            <textarea className="form-control ns-textarea" rows="8" value={rulesText} onChange={e => setRulesText(e.target.value)} />
            <button className="btn ns-btn ns-btn-secondary" onClick={applyReplacement} disabled={saving}>Run replacement</button>
          </section>

          <section className="editor-panel">
            <div className="panel-head">
              <h4>Replaced text</h4>
              <span className={`status-pill ${current.audio_status}`}>{current.audio_status}</span>
            </div>
            <textarea className="form-control ns-textarea fixed" rows="8" value={replacedText} onChange={e => setReplacedText(e.target.value)} />
            <div className="action-row">
              <button className="btn ns-btn ns-btn-secondary" onClick={() => setReplacedText(current.replaced_text || '')}>Reset</button>
              <button className="btn ns-btn ns-btn-primary" onClick={saveReplaced} disabled={saving}>Save replaced text</button>
            </div>
          </section>
        </div>

        <AudioGenerationPanel chapter={current} speakers={speakers} onGenerate={actions.generateChapterAudio} />
        <AudioAssetList assets={current.audio_assets || []} />
      </div>
    </div>
  );
}