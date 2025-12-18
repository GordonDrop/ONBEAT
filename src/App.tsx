import {
  BeatGrid,
  BpmControl,
  SwingToggle,
  TimeSignatureSelect,
  Transport,
  VisualPulse,
} from "./components";
import "./index.css";

function App() {
  return (
    <div className="app">
      <main className="main-content">
        <VisualPulse />
        <BpmControl />
        <BeatGrid />

        <div className="controls-row">
          <TimeSignatureSelect />
          <SwingToggle />
        </div>

        <Transport />
      </main>
    </div>
  );
}

export default App;
