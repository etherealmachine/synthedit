import React from 'react';

import { PolySynth, Synth, Transport, Part as TonePart } from 'tone';

export const notes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

export const keyBindings = {
  4: "zxcvbnm",
  5: "asdfghj",
  6: "qwertyu",
}

export class Part {
  chords: Chord[] = []
  playingChord?: number
  paused: boolean = false
  recording: boolean = false
  synth: PolySynth = new PolySynth({ maxPolyphony: 10, voice: Synth }).toDestination()
  playback?: TonePart

  play = () => {
    if (this.paused) {
      Transport.start();
      this.paused = false;
    } else {
      Transport.start();
      if (!this.chords) return;
      this.playingChord = 0;
      let t = 0;
      const notes: { time: number, index: number, notes: string[], dur: number }[] = [];
      this.chords.forEach((chord, i) => {
        notes.push({ time: t, index: i, notes: chord.notes, dur: chord.duration });
        t += chord.duration;
      });
      this.playback = new TonePart((time, event) => {
        this.synth.triggerAttackRelease(event.notes, event.dur, time);
        this.playingChord = event.index;
        if (event.index === notes.length - 1) {
          Transport.scheduleOnce(this.stop, time);
        }
        updateState();
      }, notes);
      this.paused = false;
      this.recording = false;
      this.playback.start(0);
    }
    updateState();
  }

  pause = () => {
    this.paused = true;
    this.recording = false;
    Transport.pause();
    updateState();
  }

  stop = () => {
    this.playingChord = undefined;
    this.paused = false;
    this.recording = false;
    this.playback?.stop();
    Transport.stop();
    updateState();
  }

  toggleRecord = () => {
    this.recording = !this.recording;
    updateState();
  }

  toggleSelect = (chordIndex: number) => {
    this.chords.forEach(chord => {
      chord.selected = false;
    });
    this.chords[chordIndex].selected = !this.chords[chordIndex].selected;
    updateState();
  }

  toJSON() {
    return { chords: this.chords };
  }
}

export class Chord {
  notes: string[]
  duration: number
  selected?: boolean
  ref?: React.RefObject<HTMLDivElement | null>

  constructor(notes: string[], duration: number) {
    this.notes = notes;
    this.duration = duration;
  }

  toJSON() {
    return {
      notes: this.notes,
      duration: this.duration,
    };
  }
}

export default class State {
  synth: PolySynth = new PolySynth({ maxPolyphony: 10, voice: Synth }).toDestination()
  octaves: string[][]
  parts: Part[] = [
    new Part(),
  ]
  keyPressed: { [key: string]: Date } = {}
  currentPart: number = 0
  lastRelease?: Date
  restDuration: number = 0

  constructor() {
    this.octaves = [
      notes.map(note => note + 4),
      notes.map(note => note + 5),
      notes.map(note => note + 6),
    ];
    const parts = window.localStorage.getItem('parts');
    this.inflate(parts);
  }

  inflate(parts: string | null) {
    if (parts) {
      const oldParts = this.parts;
      this.parts = [];
      (JSON.parse(parts) as Part[]).forEach((part, i) => {
        this.parts.push(new Part());
        part.chords.forEach(chord => {
          this.parts[i].chords.push(new Chord(chord.notes, chord.duration));
        });
        if (oldParts[i]) {
          this.parts[i].recording = oldParts[i].recording;
        }
      });
    }
  }

  startNote = (note: string) => {
    this.synth.triggerAttack([note]);
    this.keyPressed[note] = new Date();
    if (this.lastRelease) {
      this.restDuration = (new Date().getTime() - this.lastRelease.getTime()) / 1000.0;
    } else {
      this.restDuration = 0;
    }
    updateState();
  }

  stopNote = (note: string) => {
    if (this.keyPressed[note] === undefined) return;
    this.synth.triggerRelease(Object.keys(this.keyPressed));
    const curr = new Date();
    const duration = (curr.getTime() - this.keyPressed[note].getTime()) / 1000.0;
    const part = this.parts[this.currentPart];
    if (part.recording) {
      const chords = this.parts[this.currentPart].chords;
      if (this.restDuration > 0 && chords.length > 0 && chords[chords.length - 1].notes.length > 0) {
        chords.push(new Chord([], this.restDuration));
      }
      chords.push(new Chord(Object.keys(this.keyPressed), duration));
    }
    this.keyPressed = {};
    this.lastRelease = curr;
    updateState();
  }

  keyDown = (event: React.KeyboardEvent) => {
    if (event.keyCode === 90 && event.metaKey && history.length >= 2) {
      this.inflate(history[history.length - 2]);
      history.splice(history.length - 1, 1);
      updateState();
      return;
    }
    if (event.key === 'Backspace') {
      this.parts.forEach(part => {
        const selected = part.chords.findIndex(chord => chord.selected);
        part.chords.splice(selected, 1);
      });
      updateState();
      return;
    }
    for (let octave of Object.entries(keyBindings)) {
      const i = octave[1].indexOf(event.key.toLowerCase());
      if (i >= 0) {
        let note = notes[i];
        if (note !== 'E' && note !== 'B' && event.shiftKey) note += '#';
        note += parseInt(octave[0]);
        if (this.keyPressed[note]) return;
        this.startNote(note);
      }
    }
    updateState();
  }

  keyUp = (event: React.KeyboardEvent) => {
    for (let octave of Object.entries(keyBindings)) {
      const i = octave[1].indexOf(event.key.toLowerCase());
      if (i >= 0) {
        let note = notes[i];
        if (note !== 'E' && note !== 'B' && event.shiftKey) note += '#';
        note += parseInt(octave[0]);
        this.stopNote(note);
      }
    }
    updateState();
  }
}

export const state = new State();

let setState: (state: State) => void = state => { }

export function bindSetState(fn: (state: State) => void) {
  setState = fn;
}

let history: string[] = [];

function updateState() {
  const s = JSON.stringify(state.parts);
  window.localStorage.setItem('parts', s);
  if (history.length === 0 || s !== history[history.length - 1]) {
    history.push(s);
  }
  setState(state);
}

/*
// 1n, 2.n, 2n, 4.n, ...
function shorter(duration: number): number {
  const d = Time(duration).toNotation();
  const t = parseInt(d);
  if (d.includes('.')) {
    return Time(t.toString() + 'n').toSeconds();
  }
  return Time((t * 2).toString() + 'n.').toSeconds();
}

// 8n, 8.n, 4n, 4.n, 2n, 2.n, ...
function longer(duration: number): number {
  const d = Time(duration).toNotation();
  const t = parseInt(d);
  if (d.includes('.')) {
    return Time((t / 2).toString() + 'n').toSeconds();
  }
  return Time(t.toString() + 'n.').toSeconds();
}

*/