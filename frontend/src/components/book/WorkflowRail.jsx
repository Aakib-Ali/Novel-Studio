import { useMemo, useState } from "react";
import useBookActions from "../../hooks/useBookActions";
import { parseReplacementRules } from "../../utils/chapter";
import VoicePicker from "../audio/VoicePicker";

export default function WorkflowRail({ book, speakers }) {
  const { translateBook, replaceBook, generateBookAudio } = useBookActions();

  const [rulesText, setRulesText] = useState("Mr.=Shri");
  const [audio, setAudio] = useState({
    language: "hi",
    speakerId: "",
    sourceTextType: "translated",
    accent: "indian"
  });

  const validSpeakers = useMemo(
    () => speakers.filter((speaker) => speaker.language === audio.language && speaker.active),
    [speakers, audio.language]
  );

  return (
    <section className="workflow-rail">
      <article className="rail-card">
        <h3>Translate</h3>
        <p>Generate editable chapter drafts for Hindi-first production.</p>
        <button
          className="ns-btn ns-btn-primary"
          type="button"
          onClick={() => translateBook(book.id, "hi")}
        >
          Translate full book
        </button>
      </article>

      <article className="rail-card">
        <h3>Replace</h3>
        <p>Apply consistent terminology and name corrections across the full book.</p>
        <textarea
          className="ns-input ns-textarea"
          rows={4}
          value={rulesText}
          onChange={(e) => setRulesText(e.target.value)}
        />
        <button
          className="ns-btn ns-btn-secondary"
          type="button"
          onClick={() => replaceBook(book.id, parseReplacementRules(rulesText), "translated")}
        >
          Apply replacements
        </button>
      </article>

      <article className="rail-card">
        <h3>Generate audio</h3>
        <VoicePicker form={audio} setForm={setAudio} speakers={validSpeakers} />
        <button
          className="ns-btn ns-btn-primary"
          type="button"
          disabled={!audio.speakerId}
          onClick={() => generateBookAudio(book.id, audio)}
        >
          Generate book audio
        </button>
      </article>
    </section>
  );
}