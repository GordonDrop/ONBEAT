import { useCallback, useEffect, useRef } from "react";
import { useShallow } from "zustand/react/shallow";
import { AudioEngine } from "../audio/AudioEngine";
import {
  selectBeatAccents,
  selectBpm,
  selectCurrentAccent,
  selectIsPaused,
  selectIsPlaying,
  selectPlaybackStatus,
  selectPosition,
  selectSwing,
  selectTimeSignature,
  useMetronomeStore,
} from "../state/metronomeStore";
import type { BeatAccent, PlaybackPosition, SwingType } from "../types";

interface UseMetronomeReturn {
  bpm: number;
  setBpm: (bpm: number) => void;
  incrementBpm: (delta: number) => void;

  timeSignature: { beats: number; noteValue: number };
  setTimeSignature: (beats: number, noteValue: number) => void;

  isSwingEnabled: boolean;
  swingType: SwingType;
  toggleSwing: () => void;
  setSwingType: (type: SwingType) => void;

  beatAccents: BeatAccent[];
  toggleBeatAccent: (beat: number) => void;

  isPlaying: boolean;
  isPaused: boolean;
  currentPosition: PlaybackPosition;
  currentAccent: BeatAccent;

  start: () => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  togglePlayback: () => void;
}

export function useMetronome(): UseMetronomeReturn {
  const audioEngineRef = useRef<AudioEngine | null>(null);

  const bpm = useMetronomeStore(selectBpm);
  const timeSignature = useMetronomeStore(selectTimeSignature);
  const swing = useMetronomeStore(selectSwing);
  const beatAccents = useMetronomeStore(selectBeatAccents);
  const playbackStatus = useMetronomeStore(selectPlaybackStatus);
  const currentPosition = useMetronomeStore(selectPosition);
  const isPlaying = useMetronomeStore(selectIsPlaying);
  const isPaused = useMetronomeStore(selectIsPaused);
  const currentAccent = useMetronomeStore(selectCurrentAccent);

  const {
    setBpm,
    incrementBpm,
    setTimeSignature: setTimeSignatureAction,
    toggleSwing,
    setSwingType,
    toggleBeatAccent,
    start,
    pause,
    resume,
    stop,
    tick,
  } = useMetronomeStore(
    useShallow((state) => ({
      setBpm: state.setBpm,
      incrementBpm: state.incrementBpm,
      setTimeSignature: state.setTimeSignature,
      toggleSwing: state.toggleSwing,
      setSwingType: state.setSwingType,
      toggleBeatAccent: state.toggleBeatAccent,
      start: state.start,
      pause: state.pause,
      resume: state.resume,
      stop: state.stop,
      tick: state.tick,
    }))
  );

  const handleBeat = useCallback(
    (position: PlaybackPosition) => {
      tick(position);
    },
    [tick]
  );

  const handleBarComplete = useCallback((_barNumber: number) => {}, []);

  useEffect(() => {
    audioEngineRef.current = new AudioEngine({
      onBeat: handleBeat,
      onBarComplete: handleBarComplete,
    });

    return () => {
      audioEngineRef.current?.stop();
      audioEngineRef.current = null;
    };
  }, [handleBeat, handleBarComplete]);

  useEffect(() => {
    audioEngineRef.current?.setBpm(bpm);
  }, [bpm]);

  useEffect(() => {
    audioEngineRef.current?.setTimeSignature(timeSignature);
  }, [timeSignature]);

  useEffect(() => {
    audioEngineRef.current?.setSwing(swing);
  }, [swing]);

  useEffect(() => {
    audioEngineRef.current?.setBeatAccents(beatAccents);
  }, [beatAccents]);

  useEffect(() => {
    const engine = audioEngineRef.current;
    if (!engine) return;

    if (playbackStatus === "playing" || playbackStatus === "countIn") {
      if (!engine.isPlaying()) {
        engine.start();
      }
    } else if (playbackStatus === "paused") {
      engine.pause();
    } else if (playbackStatus === "stopped") {
      engine.stop();
    }
  }, [playbackStatus]);

  const setTimeSignature = useCallback(
    (beats: number, noteValue: number) => {
      setTimeSignatureAction({ beats, noteValue });
    },
    [setTimeSignatureAction]
  );

  const togglePlayback = useCallback(() => {
    if (playbackStatus === "stopped") {
      start();
    } else if (playbackStatus === "playing" || playbackStatus === "countIn") {
      pause();
    } else if (playbackStatus === "paused") {
      resume();
    }
  }, [playbackStatus, start, pause, resume]);

  return {
    bpm,
    setBpm,
    incrementBpm,
    timeSignature,
    setTimeSignature,
    isSwingEnabled: swing.enabled,
    swingType: swing.type,
    toggleSwing,
    setSwingType,
    beatAccents,
    toggleBeatAccent,
    isPlaying,
    isPaused,
    currentPosition,
    currentAccent,
    start,
    pause,
    resume,
    stop,
    togglePlayback,
  };
}
