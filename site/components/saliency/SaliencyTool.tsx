"use client";

import { useRef, useState } from "react";
import CompareView from "./CompareView";
import { DEFAULT_SETTINGS, type Result, type Settings, type Source } from "./shared";
import SingleView from "./SingleView";

type Mode = "single" | "compare";

const MODES: readonly { id: Mode; label: string }[] = [
  { id: "single", label: "Single image" },
  { id: "compare", label: "Compare images" },
];

// Both views stay mounted (the inactive one is hidden), so switching tabs keeps each view's images.
// Model and view settings are shared between them.
export default function SaliencyTool() {
  const [mode, setMode] = useState<Mode>("single");
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [singleSource, setSingleSource] = useState<Source | null>(null);
  const [singleResult, setSingleResult] = useState<Result | null>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const select = (index: number) => {
    setMode(MODES[index].id);
    tabRefs.current[index]?.focus();
  };

  const onTabKey = (event: React.KeyboardEvent, index: number) => {
    const last = MODES.length - 1;
    const next =
      event.key === "ArrowRight" ? (index === last ? 0 : index + 1)
      : event.key === "ArrowLeft" ? (index === 0 ? last : index - 1)
      : event.key === "Home" ? 0
      : event.key === "End" ? last
      : null;
    if (next === null) return;
    event.preventDefault();
    select(next);
  };

  const openInSingle = (source: Source, result: Result | null) => {
    setSingleSource(source);
    if (result) setSingleResult(result);
    setMode("single");
    tabRefs.current[0]?.scrollIntoView({ block: "start" });
    tabRefs.current[0]?.focus({ preventScroll: true });
  };

  return (
    <>
      <div className="tool-tabs" role="tablist" aria-label="Saliency tool mode">
        {MODES.map((m, index) => (
          <button
            key={m.id}
            ref={(el) => {
              tabRefs.current[index] = el;
            }}
            id={`tab-${m.id}`}
            className="tool-tab"
            type="button"
            role="tab"
            aria-selected={mode === m.id}
            aria-controls={`panel-${m.id}`}
            tabIndex={mode === m.id ? 0 : -1}
            onClick={() => setMode(m.id)}
            onKeyDown={(event) => onTabKey(event, index)}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div id="panel-single" role="tabpanel" aria-labelledby="tab-single" hidden={mode !== "single"}>
        <SingleView
          settings={settings}
          onSettings={setSettings}
          source={singleSource}
          onSource={setSingleSource}
          result={singleResult}
          onResult={setSingleResult}
        />
      </div>
      <div id="panel-compare" role="tabpanel" aria-labelledby="tab-compare" hidden={mode !== "compare"}>
        <CompareView settings={settings} onSettings={setSettings} onOpen={openInSingle} />
      </div>
    </>
  );
}
