import React from 'react';

import { Part as TonePart, PolySynth, Sampler, Synth, Time, Transport } from 'tone';

import Samples from './Samples';

export const notes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

export const keyBindings = ["zxcvbnm", "asdfghj", "qwertyu"];

export const samples = new Samples()

interface PartEvent {
  time: number
  index: number
  notes: string[]
  dur: number
}

export class Part {
  instrumentName: string = 'default'
  chords: Chord[] = []
  recording: boolean = false
  instrument: Sampler | PolySynth = new PolySynth({ maxPolyphony: 10, voice: Synth }).toDestination()
  playback: TonePart = new TonePart<PartEvent>()
  playingChordIndex?: number

  play = () => {
    if (this.playback.state === 'stopped' && this.playingChordIndex !== undefined) {
      this.playback.start(undefined, this.currentTime());
      updateState();
    } else {
      this.playback.stop();
      if (!this.chords) return;
      let t = 0;
      this.playback.clear();
      this.chords.forEach((chord, i) => {
        this.playback.add({ time: t, index: i, notes: chord.notes, dur: chord.duration });
        t += chord.duration;
      });
      this.playback.callback = (time, event: PartEvent) => {
        this.instrument.triggerAttackRelease(event.notes, event.dur, time);
        this.playingChordIndex = event.index;
        if (event.index === this.playback.length - 1) {
          Transport.scheduleOnce(this.stop, t);
        }
        updateState();
      };
      this.playback.loopEnd = t;
      this.playback.start();
      updateState();
    }
  }

  pause = () => {
    this.playback.stop();
    updateState();
  }

  stop = () => {
    this.playback.stop();
    this.playback.dispose();
    this.playingChordIndex = undefined;
    updateState();
  }

  toggleRecord = () => {
    this.recording = !this.recording;
    updateState();
  }

  toggleLoop = () => {
    this.playback.loop = !this.playback.loop;
    updateState();
  }

  toggleSelect = (chordIndex: number) => {
    this.chords.forEach((chord, i) => {
      if (i !== chordIndex) {
        chord.selected = false;
      }
    });
    this.chords[chordIndex].selected = !this.chords[chordIndex].selected;
    updateState();
  }

  currentTime = () => {
    return this.chords.reduce((t, chord, i) => {
      if (this.playingChordIndex !== undefined && i <= this.playingChordIndex) return t + chord.duration;
      return t;
    }, 0);
  }

  async setInstrument(name: string) {
    this.instrumentName = name;
    this.instrument = await samples.instrument(name);
    this.instrument.toDestination();
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
  octaves = [4, 5, 6]
  parts: Part[] = [
    new Part(),
  ]
  keyPressed: { [key: string]: Date } = {}
  currentPart: number = 0
  lastRelease?: Date
  restDuration: number = 0

  constructor() {
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
    this.parts[this.currentPart].instrument.triggerAttack([note]);
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
    this.parts[this.currentPart].instrument.triggerRelease(Object.keys(this.keyPressed));
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
        if (selected !== -1 || part.recording) {
          part.chords.splice(selected, 1);
        }
      });
      updateState();
      return;
    }
    if (event.key === 'ArrowUp') {
      this.increasePitch();
    } else if (event.key === 'ArrowDown') {
      this.decreasePitch();
    } else if (event.key === 'ArrowLeft') {
      this.shorten();
    } else if (event.key === 'ArrowRight') {
      this.lengthen();
    }
    keyBindings.forEach((binding, octaveOffset) => {
      const i = binding.indexOf(event.key.toLowerCase());
      if (i >= 0) {
        let note = notes[i];
        if (note !== 'E' && note !== 'B' && event.shiftKey) note += '#';
        const octave = this.octaves[0] + octaveOffset;
        note += octave;
        if (this.keyPressed[note]) return;
        this.startNote(note);
      }
    });
    updateState();
  }

  keyUp = (event: React.KeyboardEvent) => {
    keyBindings.forEach((binding, octaveOffset) => {
      const i = binding.indexOf(event.key.toLowerCase());
      if (i >= 0) {
        let note = notes[i];
        if (note !== 'E' && note !== 'B' && event.shiftKey) note += '#';
        const octave = this.octaves[0] + octaveOffset;
        note += octave;
        this.stopNote(note);
      }
    });
    updateState();
  }

  increasePitch = () => {
    this.parts.forEach(part => {
      const selected = part.chords.findIndex(chord => chord.selected);
      if (selected !== -1) {
        part.chords[selected].notes = part.chords[selected].notes.map(higher);
      }
    });
    updateState();
  }

  decreasePitch = () => {
    this.parts.forEach(part => {
      const selected = part.chords.findIndex(chord => chord.selected);
      if (selected !== -1) {
        part.chords[selected].notes = part.chords[selected].notes.map(lower);
      }
    });
    updateState();
  }

  lengthen = () => {
    this.parts.forEach(part => {
      const selected = part.chords.findIndex(chord => chord.selected);
      if (selected !== -1) {
        part.chords[selected].duration = longer(part.chords[selected].duration);
      }
    });
    updateState();
  }

  shorten = () => {
    this.parts.forEach(part => {
      const selected = part.chords.findIndex(chord => chord.selected);
      if (selected !== -1) {
        part.chords[selected].duration = shorter(part.chords[selected].duration);
      }
    });
    updateState();
  }

  addPart = () => {
    this.parts.push(new Part());
    updateState();
  }

  removePart = (i: number) => {
    if (this.parts.length >= 2) {
      this.parts.splice(i, 1);
      updateState();
    }
  }

  selectPart = (i: number) => {
    if (i !== this.currentPart) {
      this.parts[this.currentPart].recording = false;
    }
    this.currentPart = i;
    updateState();
  }

  setOctave = (octave: number) => {
    this.octaves = [octave, octave + 1, octave + 2];
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

function higher(note: string): string {
  const octave = parseInt(note[note.length - 1]);
  const noteIndex = notes.indexOf(note[0]);
  if (noteIndex === notes.length - 1) {
    if (octave >= 6) {
      return note;
    }
    return notes[0] + (octave + 1);
  }
  if (note[1] !== "#" && note[0] !== 'E' && note[0] !== 'B') {
    return note[0] + '#' + octave;
  }
  return notes[noteIndex + 1] + octave;
}

function lower(note: string): string {
  const octave = parseInt(note[note.length - 1]);
  const noteIndex = notes.indexOf(note[0]);
  if (noteIndex === 0) {
    if (octave <= 4) {
      return note;
    }
    return notes[notes.length - 1] + (octave - 1);
  }
  if (note[1] !== "#" && notes[noteIndex - 1] !== 'E' && note[noteIndex - 1] !== 'B') {
    return notes[noteIndex - 1] + '#' + octave;
  }
  return notes[noteIndex - 1] + octave;
}

// 1n., 1n, 1t, 2n., 2n, 2t, 4n., ...
function shorter(duration: number): number {
  const d = Time(duration).toNotation();
  const t = parseInt(d);
  if (d.includes('t')) {
    return Time((t * 2).toString() + 'n.').toSeconds();
  } else if (d.includes('.')) {
    return Time(t.toString() + 'n').toSeconds();
  }
  return Time(t.toString() + 't').toSeconds();
}

// 8t, 8n, 8n., 4t, 4n, 4n., 2t, 2n, 2n., ...
function longer(duration: number): number {
  const d = Time(duration).toNotation();
  const t = parseInt(d);
  if (d.includes('.')) {
    return Time((t / 2).toString() + 't').toSeconds();
  } else if (d.includes('t')) {
    return Time(t.toString() + 'n').toSeconds();
  }
  return Time(t.toString() + 'n.').toSeconds();
}