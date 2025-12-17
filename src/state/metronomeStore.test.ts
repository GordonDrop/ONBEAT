import { beforeEach, describe, expect, it } from "vitest";
import { useMetronomeStore } from "./metronomeStore";

describe("metronomeStore", () => {
  beforeEach(() => {
    useMetronomeStore.setState({
      settings: {
        bpm: 120,
        timeSignature: { beats: 4, noteValue: 4 },
        swing: { enabled: false, type: "sixteenth" },
        beatAccents: ["accent", "normal", "normal", "normal"],
      },
      training: {
        countIn: { enabled: false, bars: 1 },
        clickSkip: { enabled: false, playBars: 4, muteBars: 4 },
        tempoRamp: { enabled: false, incrementBpm: 5, everyBars: 8, maxBpm: 200 },
        selectedExerciseId: null,
      },
      playback: {
        status: "stopped",
        position: { bar: 1, beat: 1 },
        currentBpm: 120,
        isInMutePhase: false,
        countInBeatsLeft: null,
      },
    });
  });

  describe("setBpm", () => {
    it("should update bpm in settings", () => {
      useMetronomeStore.getState().setBpm(140);
      expect(useMetronomeStore.getState().settings.bpm).toBe(140);
    });

    it("should clamp bpm to min 20", () => {
      useMetronomeStore.getState().setBpm(10);
      expect(useMetronomeStore.getState().settings.bpm).toBe(20);
    });

    it("should clamp bpm to max 300", () => {
      useMetronomeStore.getState().setBpm(400);
      expect(useMetronomeStore.getState().settings.bpm).toBe(300);
    });

    it("should update currentBpm in playback", () => {
      useMetronomeStore.getState().setBpm(160);
      expect(useMetronomeStore.getState().playback.currentBpm).toBe(160);
    });
  });

  describe("incrementBpm", () => {
    it("should increase bpm by delta", () => {
      useMetronomeStore.getState().incrementBpm(10);
      expect(useMetronomeStore.getState().settings.bpm).toBe(130);
    });

    it("should decrease bpm by negative delta", () => {
      useMetronomeStore.getState().incrementBpm(-20);
      expect(useMetronomeStore.getState().settings.bpm).toBe(100);
    });
  });

  describe("setTimeSignature", () => {
    it("should update time signature", () => {
      useMetronomeStore.getState().setTimeSignature({ beats: 3, noteValue: 4 });
      expect(useMetronomeStore.getState().settings.timeSignature).toEqual({
        beats: 3,
        noteValue: 4,
      });
    });

    it("should expand beat accents when beats increase", () => {
      useMetronomeStore.getState().setTimeSignature({ beats: 6, noteValue: 8 });
      expect(useMetronomeStore.getState().settings.beatAccents).toHaveLength(6);
      expect(useMetronomeStore.getState().settings.beatAccents[4]).toBe("normal");
      expect(useMetronomeStore.getState().settings.beatAccents[5]).toBe("normal");
    });

    it("should trim beat accents when beats decrease", () => {
      useMetronomeStore.getState().setTimeSignature({ beats: 2, noteValue: 4 });
      expect(useMetronomeStore.getState().settings.beatAccents).toHaveLength(2);
    });

    it("should ensure first beat remains accented", () => {
      useMetronomeStore.setState((state) => ({
        settings: { ...state.settings, beatAccents: ["normal", "normal", "normal", "normal"] },
      }));
      useMetronomeStore.getState().setTimeSignature({ beats: 3, noteValue: 4 });
      expect(useMetronomeStore.getState().settings.beatAccents[0]).toBe("accent");
    });
  });

  describe("toggleSwing", () => {
    it("should toggle swing.enabled", () => {
      expect(useMetronomeStore.getState().settings.swing.enabled).toBe(false);
      useMetronomeStore.getState().toggleSwing();
      expect(useMetronomeStore.getState().settings.swing.enabled).toBe(true);
      useMetronomeStore.getState().toggleSwing();
      expect(useMetronomeStore.getState().settings.swing.enabled).toBe(false);
    });
  });

  describe("setSwingType", () => {
    it("should update swing type", () => {
      useMetronomeStore.getState().setSwingType("triplet");
      expect(useMetronomeStore.getState().settings.swing.type).toBe("triplet");
    });
  });

  describe("toggleBeatAccent", () => {
    it("should cycle: normal -> accent -> mute -> normal", () => {
      useMetronomeStore.getState().toggleBeatAccent(1);
      expect(useMetronomeStore.getState().settings.beatAccents[1]).toBe("accent");

      useMetronomeStore.getState().toggleBeatAccent(1);
      expect(useMetronomeStore.getState().settings.beatAccents[1]).toBe("mute");

      useMetronomeStore.getState().toggleBeatAccent(1);
      expect(useMetronomeStore.getState().settings.beatAccents[1]).toBe("normal");
    });
  });

  describe("start", () => {
    it("should set status to playing", () => {
      useMetronomeStore.getState().start();
      expect(useMetronomeStore.getState().playback.status).toBe("playing");
    });

    it("should reset position to bar 1, beat 1", () => {
      useMetronomeStore.setState((state) => ({
        playback: { ...state.playback, position: { bar: 5, beat: 3 } },
      }));
      useMetronomeStore.getState().start();
      expect(useMetronomeStore.getState().playback.position).toEqual({ bar: 1, beat: 1 });
    });

    it("should set status to countIn when countIn enabled", () => {
      useMetronomeStore.setState((state) => ({
        training: { ...state.training, countIn: { enabled: true, bars: 1 } },
      }));
      useMetronomeStore.getState().start();
      expect(useMetronomeStore.getState().playback.status).toBe("countIn");
    });

    it("should calculate countInBeatsLeft", () => {
      useMetronomeStore.setState((state) => ({
        training: { ...state.training, countIn: { enabled: true, bars: 2 } },
      }));
      useMetronomeStore.getState().start();
      expect(useMetronomeStore.getState().playback.countInBeatsLeft).toBe(8);
    });
  });

  describe("pause", () => {
    it("should set status to paused", () => {
      useMetronomeStore.getState().start();
      useMetronomeStore.getState().pause();
      expect(useMetronomeStore.getState().playback.status).toBe("paused");
    });
  });

  describe("resume", () => {
    it("should set status to playing", () => {
      useMetronomeStore.getState().start();
      useMetronomeStore.getState().pause();
      useMetronomeStore.getState().resume();
      expect(useMetronomeStore.getState().playback.status).toBe("playing");
    });
  });

  describe("stop", () => {
    it("should reset playback to defaults", () => {
      useMetronomeStore.getState().start();
      useMetronomeStore.setState((state) => ({
        playback: { ...state.playback, position: { bar: 5, beat: 3 } },
      }));
      useMetronomeStore.getState().stop();
      expect(useMetronomeStore.getState().playback.status).toBe("stopped");
      expect(useMetronomeStore.getState().playback.position).toEqual({ bar: 1, beat: 1 });
    });

    it("should preserve currentBpm from settings", () => {
      useMetronomeStore.getState().setBpm(180);
      useMetronomeStore.getState().start();
      useMetronomeStore.getState().stop();
      expect(useMetronomeStore.getState().playback.currentBpm).toBe(180);
    });
  });

  describe("tick", () => {
    it("should update position", () => {
      useMetronomeStore.getState().tick({ bar: 2, beat: 3 });
      expect(useMetronomeStore.getState().playback.position).toEqual({ bar: 2, beat: 3 });
    });
  });
});
