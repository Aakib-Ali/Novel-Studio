import { LANGUAGE_OPTIONS, SOURCE_TEXT_OPTIONS } from "../../utils/constants";

export default function VoicePicker({ form, setForm, speakers }) {
  return (
    <div className="voice-picker">
      <select
        className="ns-input"
        value={form.language}
        onChange={(e) =>
          setForm((prev) => ({
            ...prev,
            language: e.target.value,
            speakerId: ""
          }))
        }
      >
        {LANGUAGE_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <select
        className="ns-input"
        value={form.sourceTextType}
        onChange={(e) =>
          setForm((prev) => ({
            ...prev,
            sourceTextType: e.target.value
          }))
        }
      >
        {SOURCE_TEXT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <select
        className="ns-input"
        value={form.speakerId}
        onChange={(e) =>
          setForm((prev) => ({
            ...prev,
            speakerId: e.target.value
          }))
        }
      >
        <option value="">Select speaker</option>
        {speakers.map((speaker) => (
          <option key={speaker.id} value={speaker.id}>
            {speaker.display_name || speaker.displayname} · {speaker.accent}
          </option>
        ))}
      </select>
    </div>
  );
}