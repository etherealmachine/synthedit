import { PolySynth, Synth } from 'tone';

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

  play = () => {
    this.playingChord = 0;
    this.paused = false;
    this.recording = false;
    updateState();
  }

  pause = () => {
    this.paused = true;
    this.recording = false;
    updateState();
  }

  stop = () => {
    this.playingChord = undefined;
    this.paused = false;
    this.recording = false;
    updateState();
  }

  toggleRecord = () => {
    this.recording = !this.recording;
    updateState();
  }
}

export class Chord {
  notes: string[] = []
  duration: number = 0
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
        chords.push({
          notes: [],
          duration: this.restDuration,
        });
      }
      chords.push({
        notes: Object.keys(this.keyPressed),
        duration: duration,
      });
    }
    this.keyPressed = {};
    this.lastRelease = curr;
    updateState();
  }

  keyDown = (event: React.KeyboardEvent) => {
    console.log(event);
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

function updateState() {
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

onPlay(partIndex: number) {
  return () => {
    if (partIndex === -1) {
      return;
    }
    this.onStop(this.state.currentPart)();
    if (this.state.parts[partIndex].paused) {
      Transport.start();
    } else {
      Transport.start();
      if (!this.state.parts[partIndex].chords) return;
      let t = 0;
      const notes: { time: number, index: number, notes: string[], dur: number }[] = [];
      this.state.parts[partIndex].chords.forEach((chord, i) => {
        notes.push({ time: t, index: i, notes: chord.notes, dur: chord.duration });
        t += chord.duration;
      });
      this.playback = new TonePart((time, event) => {
        this.synth.triggerAttackRelease(event.notes, event.dur, time);
        this.setState(produce(this.state, state => {
          state.parts[partIndex].playingChord = event.index;
        }));
        if (event.index === notes.length - 1) {
          Transport.scheduleOnce(this.onStop.bind(this), time);
        }
      }, notes);
      this.playback.start(0);
    }
    this.setState(produce(this.state, state => {
      state.parts[partIndex].playingChord = 0;
      state.parts[partIndex].paused = false;
    }));
  }
}

onPause(partIndex: number) {
  return () => {
    Transport.pause();
    this.setState(produce(this.state, state => {
      state.parts[partIndex].paused = true;
    }));
  }
}

onStop(partIndex: number) {
  return () => {
    this.playback?.stop();
    Transport.stop();
    this.setState(produce(this.state, state => {
      state.parts[partIndex].playingChord = undefined;
      state.parts[partIndex].paused = false;
    }));
  }
}

toggleRecord(partIndex: number) {
  return () => {
    this.setState(produce(this.state, state => {
      if (partIndex === -1) {
        state.parts.push({
          chords: [],
          playingChord: undefined,
          paused: false,
          recording: false,
        });
        partIndex = state.parts.length - 1;
      }
      state.currentPart = partIndex;
      state.parts[state.currentPart].recording = !state.parts[state.currentPart].recording;
    }));
  }
}

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
*/