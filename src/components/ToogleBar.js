

export default function ToggleBar({handleOnChange, value}) {
  return (
    <div>
      <p>Adjust Selection Size</p>
      <input
        className="interactive-grid--toggle"
        type="range"
        min="1"
        max="50"
        value={value}
        onChange={handleOnChange}
      />
      <div
        id="tooltip"
        style={{
          position: "absolute",
          display: "none",
          background: "rgba(255, 255, 255, 0.8)",
          padding: "4px",
          border: "1px solid #ccc",
        }}
      ></div>
    </div>
  );
}
