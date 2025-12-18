/**
 * @vitest-environment jsdom
 */
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("App", () => {
  it("renders BPM control", () => {
    render(<App />);
    const bpmLabel = screen.getByText("BPM");
    const bpmInput = screen.getByRole("spinbutton");
    expect(bpmLabel).toBeInTheDocument();
    expect(bpmInput).toBeInTheDocument();
    expect(bpmInput).toHaveValue(120);
  });

  it("renders time signature select", () => {
    render(<App />);
    const timeSignatureSelect = screen.getByLabelText("Time signature");
    expect(timeSignatureSelect).toBeInTheDocument();
  });

  it("renders transport controls", () => {
    render(<App />);
    const playButton = screen.getByLabelText("Play");
    const stopButton = screen.getByLabelText("Stop");
    expect(playButton).toBeInTheDocument();
    expect(stopButton).toBeInTheDocument();
  });

  it("renders beat grid with 4 beats by default", () => {
    render(<App />);
    const beat1 = screen.getByLabelText(/Beat 1/);
    const beat4 = screen.getByLabelText(/Beat 4/);
    expect(beat1).toBeInTheDocument();
    expect(beat4).toBeInTheDocument();
  });
});
