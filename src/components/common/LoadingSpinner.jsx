import "./LoadingSpinner.css";

export default function LoadingSpinner({ fullScreen = false }) {
  return (
    <div className={`spinner-container ${fullScreen ? "fullscreen" : ""}`}>
      <div className="spinner"></div>
    </div>
  );
}
