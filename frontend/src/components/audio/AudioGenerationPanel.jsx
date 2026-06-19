import { useMemo, useState } from 'react';
import { LANGUAGE_OPTIONS, SOURCE_TEXT_OPTIONS } from '../../utils/constants';

export default function AudioGenerationPanel({ chapter, speakers, onGenerate }) {
  const [form, setForm] = useState({
    language: 'hi',
    speaker_id: '',
    source_text_type: 'translated',
    accent: 'indian'
  });

  const available = useMemo(
    () => speakers.filter(s => s.language === form.language && s.active),
    [speakers, form.language]
  );

  const submit = async () => {
    await onGenerate(chapter.id, form);
  };

  return (
    <section className="surface-card nested">
      <div className="section-header">
        <div>
          <h3 className="section-title">Audio generation</h3>
          <p className="section-note">Generate multiple audio versions for this chapter.</p>
        </div>
      </div>

      <div className="audio-form-grid">
        <select className="form-select ns-input" value={form.language} onChange={e => setForm({ ...form, language: e.target.value, speaker_id: '' })}>
          {LANGUAGE_OPTIONS.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
        <select className="form-select ns-input" value={form.source_text_type} onChange={e => setForm({ ...form, source_text_type: e.target.value })}>
          {SOURCE_TEXT_OPTIONS.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
        <select className="form-select ns-input" value={form.speaker_id} onChange={e => setForm({ ...form, speaker_id: e.target.value })}>
          <option value="">Select voice</option>
          {available.map(s => <option key={s.id} value={s.id}>{s.display_name} · {s.accent}</option>)}
        </select>
        <button className="btn ns-btn ns-btn-primary" onClick={submit} disabled={!form.speaker_id}>
          Generate audio
        </button>
      </div>
    </section>
  );
}