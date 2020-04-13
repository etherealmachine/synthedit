import React from 'react';
import './App.css';
import produce from "immer"
import styled from 'styled-components'
import { Part as TonePart, PolySynth, Synth, Time, Transport } from 'tone';

import PartElement from './Part';
import Keyboard from './Keyboard';

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export interface Part {
  chords: Chord[]
  playingChord?: number
  paused: boolean
  recording: boolean
}

export interface Chord {
  notes: string[]
  duration: number
}

interface State {
  parts: Part[]
  keyPressed: { [key: string]: Date }
  currentPart: number
}

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

export default class App extends React.Component<{}, State> {

  TestSynthConfig = {
    oscillator: {
      type: 'fmsine' as const,
      modulationType: 'sawtooth' as const,
      modulationIndex: 3,
      harmonicity: 3.4
    },
    envelope: {
      attack: 0.001,
      decay: 0.1,
      sustain: 0.1,
      release: 0.1
    }
  }

  synth: PolySynth = new PolySynth({ maxPolyphony: 10, voice: Synth }).toDestination()
  playback?: TonePart
  notes = ['C', 'D', 'E', 'F', 'G', 'A', 'B']
  keybindings = {
    4: "zxcvbnm",
    5: "asdfghj",
    6: "qwertyu",
  }

  lastRelease?: Date
  restDuration: number = 0
  hoverPartIndex?: number
  hoverChordIndex?: number

  constructor(props: any) {
    super(props);
    const initialChords = [];
    for (let subdivision of [1, 2, 4, 8, 16, 32, 64, 128, 256]) {
      const duration = Time(subdivision.toString() + 'n').toSeconds();
      initialChords.push({
        notes: ['C4'],
        duration: duration,
        playing: false,
      });
      initialChords.push({
        notes: [],
        duration: duration,
        playing: false,
      });
    }
    const parts = JSON.parse(window.localStorage.getItem('parts') || 'false') as any;
    this.state = {
      parts: parts || [{
        chords: initialChords,
        paused: false,
        recording: false,
      }],
      keyPressed: {},
      currentPart: 0,
    }
  }

  componentDidUpdate(props: {}, state: State) {
    window.localStorage.setItem('parts', JSON.stringify(state.parts));
  }

  onKeyDown(event: React.KeyboardEvent) {
    if (event.key.startsWith('Arrow')) {
      this.setState(produce(this.state, state => {
        if (this.hoverPartIndex === undefined || this.hoverChordIndex === undefined) return;
        const duration = state.parts[this.hoverPartIndex].chords[this.hoverChordIndex].duration;
        if (event.key === 'ArrowLeft') {
          state.parts[this.hoverPartIndex].chords[this.hoverChordIndex].duration = shorter(duration);
        } else if (event.key === 'ArrowRight') {
          state.parts[this.hoverPartIndex].chords[this.hoverChordIndex].duration = longer(duration);
        }
      }));
    }
    for (let octave of Object.entries(this.keybindings)) {
      const i = octave[1].indexOf(event.key.toLowerCase());
      if (i >= 0) {
        let note = this.notes[i];
        if (note !== 'E' && note !== 'B' && event.shiftKey) note += '#';
        note += parseInt(octave[0]);
        if (this.state.keyPressed[note]) return;
        this.startNote(note)(event);
      }
    }
  }

  onKeyUp(event: React.KeyboardEvent) {
    if (event.key === 'Backspace') {
      this.setState(produce(this.state, state => {
        const part = state.parts[this.hoverPartIndex || state.currentPart];
        part.chords.splice(this.hoverChordIndex || part.chords.length - 1, 1);
        this.lastRelease = undefined;
      }));
    }
    for (let octave of Object.entries(this.keybindings)) {
      const i = octave[1].indexOf(event.key.toLowerCase());
      if (i >= 0) {
        let note = this.notes[i];
        if (note !== 'E' && note !== 'B' && event.shiftKey) note += '#';
        note += parseInt(octave[0]);
        this.stopNote(note)(event);
      }
    }
  }

  onMouseDown(event: React.MouseEvent) {
    if (this.hoverPartIndex !== undefined && this.hoverChordIndex !== undefined) {
      const part = this.state.parts[this.hoverPartIndex];
      const chord = part.chords[this.hoverChordIndex];
      this.synth.triggerAttack(chord.notes);
    }
  }

  onMouseUp(event: React.MouseEvent) {
    if (this.hoverPartIndex !== undefined && this.hoverChordIndex !== undefined) {
      const part = this.state.parts[this.hoverPartIndex];
      const chord = part.chords[this.hoverChordIndex];
      this.synth.triggerRelease(chord.notes);
    }
  }

  onMouseEnter(i: number, j: number): (event: React.MouseEvent) => void {
    return (event: React.MouseEvent) => {
      this.hoverPartIndex = i;
      this.hoverChordIndex = j;
    };
  }

  onMouseLeave(i: number, j: number): (event: React.MouseEvent) => void {
    return (event: React.MouseEvent) => {
      const part = this.state.parts[this.hoverPartIndex || this.state.currentPart];
      const chord = part.chords[this.hoverChordIndex || part.chords.length - 1];
      this.synth.triggerRelease(chord.notes);
      this.hoverPartIndex = undefined;
      this.hoverChordIndex = undefined;
    };
  }

  startNote(note: string) {
    return (event: React.SyntheticEvent) => {
      this.synth.triggerAttack([note]);
      event.stopPropagation();
      this.setState(produce(this.state, state => {
        state.keyPressed[note] = new Date();
        if (this.lastRelease) {
          this.restDuration = (new Date().getTime() - this.lastRelease.getTime()) / 1000.0;
        } else {
          this.restDuration = 0;
        }
      }));
    }
  }

  stopNote(note: string) {
    return (event: React.SyntheticEvent) => {
      if (this.state.keyPressed[note] === undefined) return;
      this.synth.triggerRelease(Object.keys(this.state.keyPressed));
      const curr = new Date();
      const duration = (curr.getTime() - this.state.keyPressed[note].getTime()) / 1000.0;
      event.stopPropagation();
      this.setState(produce(this.state, state => {
        const part = this.state.parts[this.state.currentPart];
        if (part.recording) {
          const chords = state.parts[state.currentPart].chords;
          if (this.restDuration > 0 && chords.length > 0 && chords[chords.length - 1].notes.length > 0) {
            chords.push({
              notes: [],
              duration: this.restDuration,
            });
          }
          chords.push({
            notes: Object.keys(this.state.keyPressed),
            duration: duration,
          });
        }
        state.keyPressed = {};
        this.lastRelease = curr;
      }));
    }
  }

  onPlay() {
    const part = this.state.parts[this.state.currentPart];
    if (part.paused) {
      Transport.start();
    } else {
      Transport.start();
      const chords = part.chords;
      if (!chords) return;
      let t = 0;
      const notes: { time: number, index: number, notes: string[], dur: number }[] = [];
      chords.forEach((chord, i) => {
        notes.push({ time: t, index: i, notes: chord.notes, dur: chord.duration });
        t += chord.duration;
      });
      this.playback = new TonePart((time, event) => {
        this.synth.triggerAttackRelease(event.notes, event.dur, time);
        if (event.index === notes.length - 1) {
          Transport.scheduleOnce(this.onStop.bind(this), time);
        }
        this.setState(produce(this.state, state => {
          state.parts[state.currentPart].playingChord = event.index;
        }));
      }, notes);
      this.playback.start(0);
    }
    this.setState(produce(this.state, state => {
      state.parts[state.currentPart].playingChord = 0;
      state.parts[state.currentPart].paused = false;
    }));
  }

  onPause() {
    Transport.pause();
    this.setState(produce(this.state, state => {
      state.parts[state.currentPart].paused = true;
    }));
  }

  onStop() {
    this.playback?.stop();
    Transport.stop();
    this.setState(produce(this.state, state => {
      state.parts[state.currentPart].playingChord = undefined;
      state.parts[state.currentPart].paused = false;
    }));
  }

  toggleRecord() {
    this.setState(produce(this.state, state => {
      state.parts[state.currentPart].recording = !state.parts[state.currentPart].recording;
    }));
  }

  render() {
    const octaves = [
      this.notes.map(note => note + 4),
      this.notes.map(note => note + 5),
      this.notes.map(note => note + 6),
    ];
    return (
      <Container
        onKeyDown={this.onKeyDown.bind(this)}
        onKeyUp={this.onKeyUp.bind(this)} tabIndex={-1}
        onMouseDown={this.onMouseDown.bind(this)}
        onMouseUp={this.onMouseUp.bind(this)}
      >
        {this.state.parts.map((part, i) => <PartElement
          key={i}
          octaves={octaves}
          part={part}
          onPlay={this.onPlay.bind(this)}
          onPause={this.onPause.bind(this)}
          onStop={this.onStop.bind(this)}
          toggleRecord={this.toggleRecord.bind(this)}
        />)}
        <Keyboard
          octaves={octaves}
          keyPressed={this.state.keyPressed}
          startNote={this.startNote}
          stopNote={this.stopNote}
        />
      </Container>
    );
  }
};
