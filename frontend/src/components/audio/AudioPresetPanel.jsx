import { useMemo, useState } from "react";
import VoicePicker from "./VoicePicker";

export default function AudioPresetPanel({ chapter, speakers, onGenerate }) {
  const [form, setForm] = useState({
    language: "hi",
    speakerId: "",
    sourceTextType: "translated",
    accent: "indian"
  });

  const valid = useMemo(
    () => speakers.filter((speaker) => speaker.language === form.language && speaker.active),
    [speakers, form.language]
  );

  return (
    <section className="ns-surface embedded">
      <div className="section-top">
        <div>
          <h3>Audio generation</h3>
          <p>Store multiple outputs for the same chapter, voice, and source text path.</p>
        </div>
      </div>

      <VoicePicker form={form} setForm={setForm} speakers={valid} />

      <div className="action-row left">
        <button
          className="ns-btn ns-btn-primary"
          type="button"
          disabled={!form.speakerId}
          onClick={() => onGenerate(chapter.id, form)}
        >
          Generate chapter audio
        </button>
      </div>
    </section>
  );
}