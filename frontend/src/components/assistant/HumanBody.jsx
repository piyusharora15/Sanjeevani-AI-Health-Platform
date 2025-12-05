import React from "react";

/**
 * HumanBody diagram
 *
 * Props:
 *  - highlightedPart: "head" | "chest" | "abdomen" | "arms" | "legs" | "none"
 *  - riskLevel (optional): "emergency" | "urgent" | "routine" | "self-care"
 *  - selectedParts (optional): array of body areas (same values as highlightedPart)
 *  - onPartClick (optional): function(part) – toggles/selects a body part
 */

const HumanBody = ({
  highlightedPart = "none",
  riskLevel = null,
  selectedParts = [],
  onPartClick,
}) => {
  // Inject keyframes for "haptic" shake animation (only used in emergency)
  const shakeKeyframes = `
    @keyframes body-shake {
      0% { transform: translateX(0); }
      25% { transform: translateX(-2px); }
      50% { transform: translateX(2px); }
      75% { transform: translateX(-1px); }
      100% { transform: translateX(0); }
    }
  `;

  const interactiveClass =
    "cursor-pointer hover:opacity-80 transition-all duration-200";

  const getHighlightClasses = () => {
    const base = "transition-all duration-300 ease-in-out drop-shadow-sm";

    switch (riskLevel) {
      case "emergency":
        return {
          active: `fill-red-500 opacity-95 animate-pulse ${base} drop-shadow-[0_0_12px_rgba(248,113,113,0.85)]`,
          inactive: "fill-slate-300 opacity-55",
        };
      case "urgent":
        return {
          active: `fill-orange-400 opacity-95 ${base} drop-shadow-[0_0_12px_rgba(251,146,60,0.7)]`,
          inactive: "fill-slate-300 opacity-55",
        };
      case "self-care":
        return {
          active: `fill-emerald-400 opacity-95 ${base} drop-shadow-[0_0_12px_rgba(52,211,153,0.65)]`,
          inactive: "fill-slate-300 opacity-55",
        };
      case "routine":
      default:
        return {
          active: `fill-blue-400 opacity-95 ${base} drop-shadow-[0_0_12px_rgba(96,165,250,0.7)]`,
          inactive: "fill-slate-300 opacity-60",
        };
    }
  };

  const { active, inactive } = getHighlightClasses();

  const isSelected = (part) => selectedParts?.includes(part);

  const getPartClass = (part) => {
    if (!highlightedPart || highlightedPart === "none") {
      // No AI highlight: use selection to decide
      return isSelected(part)
        ? `${active}`
        : "fill-slate-300 opacity-70 transition-all duration-300 ease-in-out";
    }

    if (highlightedPart === part) {
      // AI-highlighted area (primary)
      return active;
    }

    if (isSelected(part)) {
      // User-selected area (secondary highlight)
      return `fill-blue-300 opacity-90 transition-all duration-300 ease-in-out drop-shadow-sm`;
    }

    return inactive;
  };

  const getPartStyle = (part) => {
    // Add brief "haptic-like" shake when AI marks this as emergency area
    if (riskLevel === "emergency" && highlightedPart === part) {
      return { animation: "body-shake 0.25s ease-in-out 0s 3" };
    }
    return undefined;
  };

  const handlePartClick = (part) => {
    if (onPartClick) {
      onPartClick(part);
    }
  };

  const areaLabelMap = {
    head: "Head / Brain",
    chest: "Chest / Heart / Lungs",
    abdomen: "Abdomen / Stomach area",
    arms: "Arms / Shoulders",
    legs: "Legs / Knees / Feet",
    none: "No specific area selected",
  };

  const prettyAreaLabel =
    areaLabelMap[highlightedPart] || "No specific area selected";

  return (
    <div className="w-full flex flex-col items-center justify-start">
      {/* Inject keyframes once */}
      <style>{shakeKeyframes}</style>

      <div className="relative w-full max-w-xs mx-auto aspect-[1/2] flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 200 400"
          className="w-full h-full"
          aria-label="Diagram of a human body highlighting selected area"
        >
          <g stroke="#94A3B8" strokeWidth="1.2" strokeLinejoin="round">
            {/* Head */}
            <path
              id="head"
              className={`${getPartClass("head")} ${interactiveClass}`}
              style={getPartStyle("head")}
              onClick={() => handlePartClick("head")}
              d="M 100,50 a 20,20 0 1,1 0.1,0 z"
            />

            {/* Neck (not clickable) */}
            <path
              d="M 95,70 h 10 v 10 h -10 Z"
              className="fill-slate-300 opacity-50 transition-all duration-300 ease-in-out"
            />

            {/* Chest */}
            <path
              id="chest"
              className={`${getPartClass("chest")} ${interactiveClass}`}
              style={getPartStyle("chest")}
              onClick={() => handlePartClick("chest")}
              d="M 80,80 C 75,85 70,110 70,120 L 75,140 h 50 l 5,-20 C 130,110 125,85 120,80 Z"
            />

            {/* Abdomen */}
            <path
              id="abdomen"
              className={`${getPartClass("abdomen")} ${interactiveClass}`}
              style={getPartStyle("abdomen")}
              onClick={() => handlePartClick("abdomen")}
              d="M 75,140 C 75,150 70,170 80,180 h 40 c 10,-10 5,-30 5,-40 Z"
            />

            {/* Arms */}
            <g
              id="arms"
              className={`${getPartClass("arms")} ${interactiveClass}`}
              style={getPartStyle("arms")}
              onClick={() => handlePartClick("arms")}
            >
              <path d="M 70,85 C 60,95 40,120 35,170 l 15,0 C 55,130 65,110 72,90 Z" />
              <path d="M 130,85 C 140,95 160,120 165,170 l -15,0 C 145,130 135,110 128,90 Z" />
            </g>

            {/* Legs */}
            <g
              id="legs"
              className={`${getPartClass("legs")} ${interactiveClass}`}
              style={getPartStyle("legs")}
              onClick={() => handlePartClick("legs")}
            >
              <path d="M 80,180 C 70,230 65,280 65,330 l 20,0 C 85,280 85,230 82,180 Z" />
              <path d="M 120,180 C 130,230 135,280 135,330 l -20,0 C 115,280 115,230 118,180 Z" />
            </g>
          </g>
        </svg>
      </div>

      {/* Caption */}
      <div className="mt-3 text-center text-xs text-slate-600 px-2">
        <div className="font-semibold text-slate-700">
          Highlighted area:{" "}
          <span className="text-slate-900">{prettyAreaLabel}</span>
        </div>
        <p className="mt-1 text-[11px] text-slate-500">
          Tap one or more areas where you feel discomfort. This helps the
          assistant understand your symptoms better.
        </p>
      </div>

      {/* Legend */}
      <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-[11px] text-slate-600 w-full max-w-xs">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500" />
          <span>Emergency – seek help immediately</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-orange-400" />
          <span>Urgent – see doctor soon</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-blue-400" />
          <span>Routine – discuss with doctor</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-400" />
          <span>Mild – monitor / self-care</span>
        </div>
      </div>
    </div>
  );
};

export default HumanBody;
