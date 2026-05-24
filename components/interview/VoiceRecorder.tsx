"use client";

import { useRef, useState } from "react";
import { Mic, RotateCcw, Square, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type SpeechRecognitionLike = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: ((event: { results: ArrayLike<{ 0: { transcript: string }; isFinal: boolean }> }) => void) | null;
  onerror: (() => void) | null;
};

type WindowWithSpeech = Window & {
  SpeechRecognition?: new () => SpeechRecognitionLike;
  webkitSpeechRecognition?: new () => SpeechRecognitionLike;
};

export function VoiceRecorder({ onTranscript }: { onTranscript: (value: string) => void }) {
  const [isRecording, setIsRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const timerRef = useRef<number | null>(null);
  const chunksRef = useRef<string[]>([]);

  function startTimer() {
    setElapsed(0);
    timerRef.current = window.setInterval(() => setElapsed((value) => value + 1), 1000);
  }

  function stopTimer() {
    if (timerRef.current) window.clearInterval(timerRef.current);
    timerRef.current = null;
  }

  function start() {
    const SpeechRecognition = (window as WindowWithSpeech).SpeechRecognition ?? (window as WindowWithSpeech).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      onTranscript("Your browser does not support Web Speech transcription. Type your answer here after recording separately.");
      return;
    }

    chunksRef.current = [];
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    recognition.onresult = (event) => {
      const finalText: string[] = [];
      for (let index = 0; index < event.results.length; index += 1) {
        const result = event.results[index];
        if (result.isFinal) finalText.push(result[0].transcript);
      }
      if (finalText.length) {
        chunksRef.current = finalText;
        onTranscript(finalText.join(" ").trim());
      }
    };
    recognition.onerror = () => setIsRecording(false);
    recognition.start();
    recognitionRef.current = recognition;
    setIsRecording(true);
    startTimer();
  }

  function stop() {
    recognitionRef.current?.stop();
    setIsRecording(false);
    stopTimer();
  }

  function reset() {
    stop();
    chunksRef.current = [];
    setElapsed(0);
    onTranscript("");
  }

  const minutes = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const seconds = String(elapsed % 60).padStart(2, "0");

  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">Voice Answer</p>
          <p className="text-sm text-slate-400">{isRecording ? "Listening and transcribing..." : "Record, then review the transcript."}</p>
        </div>
        <div className="rounded-md bg-slate-950 px-3 py-1 font-mono text-sm text-cyan-200">{minutes}:{seconds}</div>
      </div>
      <div className="flex flex-wrap gap-2">
        {!isRecording ? (
          <Button onClick={start}><Mic size={18} />Record</Button>
        ) : (
          <Button variant="danger" onClick={stop}><Square size={18} />Stop</Button>
        )}
        <Button variant="secondary" onClick={reset}><RotateCcw size={18} />Re-record</Button>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Wand2 size={14} /> Web Speech API MVP
        </div>
      </div>
    </div>
  );
}
