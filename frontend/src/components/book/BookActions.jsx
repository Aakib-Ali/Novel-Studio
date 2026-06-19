import { useMemo, useState } from 'react';
import { useBookActions } from '../../hooks/useBookActions';
import { parseReplacementRules } from '../../utils/chapter';
import { SOURCE_TEXT_OPTIONS, LANGUAGE_OPTIONS } from '../../utils/constants';

export default function BookActions({ book, speakers, jobs }) {
  const { translateBook, replaceBook, generateBookAudio } = useBookActions();
  const [bulkRules, setBulkRules] = useState('Mr.:श्री\nMrs.:श्रीमती');
  const [audio, setAudio] = useState({
    language: 'hi',
    source_text_type: 'translated',
    speaker_id: '',
    accent: 'indian'
  });

  const speakerChoices = useMemo(
    () => speakers.filter(s => s.language === audio.language),
    [speakers, audio.language]
  );

  const runReplacement = async () => {
    const replacements = parseReplacementRules(bulkRules);
    await replaceBook(book.id, replacements, audio.source_text_type);
  };

  return (
    <section className="surface-card">
      <div className="section-header">
        <div>
          <h2 className="section-title">Book actions</h2>
          <p className="section-note">Run operations across all chapters.</p>
        </div>
      </div>

      <div className="book-actions-grid">
        <div className="action-panel">
          <h4>Translate</h4>
          <p>Translate all original chapter text, mainly for Hindi editorial work.</p>
          <button className="btn ns-btn ns-btn-primary" onClick={() => translateBook(book.id, 'hi')}>
            Translate full book to Hindi
          </button>
        </div>

        <div className="action-panel">
          <h4>Bulk replacement</h4>
          <p>Apply consistent replacements across translated or replaced text.</p>
          <textarea className="form-control ns-textarea" rows="5" value={bulkRules} onChange={e => setBulkRules(e.target.value)} />
          <button className="btn ns-btn ns-btn-secondary" onClick={runReplacement}>Apply replacement rules</button>
        </div>

        <div className="action-panel">
          <h4>Generate book audio</h4>
          <div className="form-stack tight">
            <select className="form-select ns-input" value={audio.language} onChange={e => setAudio({ ...audio, language: e.target.value, speaker_id: '' })}>
              {LANGUAGE_OPTIONS.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
            <select className="form-select ns-input" value={audio.source_text_type} onChange={e => setAudio({ ...audio, source_text_type: e.target.value })}>
              {SOURCE_TEXT_OPTIONS.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
            <select className="form-select ns-input" value={audio.speaker_id} onChange={e => setAudio({ ...audio, speaker_id: e.target.value })}>
              <option value="">Select speaker</option>
              {speakerChoices.map(option => <option key={option.id} value={option.id}>{option.display_name}</option>)}
            </select>
            <button className="btn ns-btn ns-btn-primary" onClick={() => generateBookAudio(book.id, audio)} disabled={!audio.speaker_id}>
              Generate audio for all chapters
            </button>
          </div>
        </div>
      </div>

      {jobs.length > 0 && (
        <div className="job-list-inline">
          {jobs.map(job => (
            <div key={job.id} className="job-chip">
              <span>{job.type.replaceAll('_', ' ')}</span>
              <strong>{job.progress}%</strong>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}