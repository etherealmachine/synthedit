import React from 'react';
import './App.css';

import { FaPlay, FaPause, FaStop } from 'react-icons/fa';
import update from 'immutability-helper';
import styled from 'styled-components'
import { Synth, PolySynth, Part, Transport } from 'tone';

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Keyboard = styled.div`
  display: flex;
  flex-direction: row;
  height: 200px;
  border: 5px solid black;
`;

const Octave = styled.div`
  display: flex;
  flex-direction: row;
`;

interface ButtonProps {
  pressed?: boolean
}

const Whitekey = styled.div<ButtonProps>`
  position: relative;
  height: 100%;
  width: 50px;
  background: ${props => props.pressed ? '#CCC' : 'white'};
  float: left;
  border-right: 1px solid black;
`;

const Blackkey = styled.div<ButtonProps>`
  position: absolute;
  height: 65%;
  width: 55%;
  z-index: 1;
  background: ${props => props.pressed ? '#CCC' : '#444'};
  left: 68%;
`;

const Staff = styled.div`
  width: 80%;
  display: flex;
  flex-direction: row;
  margin: 16px;
`

const Bar = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
`

const Beat = styled.div`
  display: flex;
  flex-direction: column;
`

const Line = styled.div`
  height: 2px;
  background: black;
  display: flex;
  flex-direction: row;
  align-items: center;
`

const Space = styled.div`
  height: 12px;
  background: white;
  display: flex;
  flex-direction: row;
  align-items: center;
`

interface NoteProps {
  sharp?: boolean;
}

const Note = styled.div<NoteProps>`
  height: 10px;
  width: 10px;
  background: black;
  border-radius: 5px;
  margin: 0 5px;
  z-index: 1;
  display: flex;
  flex-direction: row;
  ::after {
    content: ${props => props.sharp ? "'#'" : "''"};
    position: relative;
    left: 10px;
    top: -5px;
  }
`

interface State {
  keyPressed: { [key: string]: Date }
  parts: Array<Staff>
  playing: boolean
  paused: boolean
}

interface Staff {
  beats: Array<Beat>
}

interface Beat {
  notes: Array<String>
  duration: number
}

export default class App extends React.Component<{}, State> {

  synth: PolySynth = new PolySynth({ maxPolyphony: 10, voice: Synth }).toDestination()
  playback?: Part
  notes = ['C', 'D', 'E', 'F', 'G', 'A', 'B']
  keybindings = {
    4: "zxcvbnm",
    5: "asdfghj",
    6: "qwertyu",
  }

  constructor(props: any) {
    super(props);
    this.state = {
      keyPressed: {},
      parts: [{
        beats: [],
      }],
      playing: false,
      paused: false,
    }
  }

  onKeyDown(event: React.KeyboardEvent) {
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
      this.setState(update(this.state, { parts: { 0: { beats: { $splice: [[this.state.parts[0].beats.length - 1, 1]] } } } }));
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

  startNote(note: string) {
    return (event: React.SyntheticEvent) => {
      this.synth.triggerAttack([note]);
      event.stopPropagation();
      this.setState({
        ...this.state,
        keyPressed: update(this.state.keyPressed, { [note]: { $set: new Date() } }),
      });
    }
  }

  stopNote(note: string) {
    return (event: React.SyntheticEvent) => {
      this.synth.triggerRelease([note]);
      const curr = new Date().getTime();
      const duration = (curr - this.state.keyPressed[note].getTime()) / 1000.0;
      event.stopPropagation();
      this.setState({
        ...this.state,
        parts: update(this.state.parts, { 0: { beats: { $push: [{ notes: [note], duration: duration }] } } }),
        keyPressed: update(this.state.keyPressed, { $unset: [note] }),
      });
    }
  }

  onPlay() {
    if (this.state.paused) {
      Transport.start();
    } else {
      Transport.start();
      const notes = [];
      let t = 0;
      for (let beat of this.state.parts[0].beats) {
        for (let note of beat.notes) {
          notes.push({ time: t, note: note, dur: beat.duration });
          t += beat.duration;
        }
      }
      this.playback = new Part((time, event) => {
        this.synth.triggerAttackRelease(event.note.toString(), event.dur, time);
      }, notes);
      this.playback.start(0);
    }
    this.setState({
      ...this.state,
      playing: true,
      paused: false,
    });
  }

  onPause() {
    Transport.pause();
    this.setState({
      ...this.state,
      paused: true,
    });
  }

  onStop() {
    this.playback?.stop();
    Transport.stop();
    this.setState({
      ...this.state,
      playing: false,
      paused: false,
    });
  }

  render() {
    const octaves = [
      this.notes.map(note => note + 4),
      this.notes.map(note => note + 5),
      this.notes.map(note => note + 6),
    ];
    return (
      <Container onKeyDown={this.onKeyDown.bind(this)} onKeyUp={this.onKeyUp.bind(this)} tabIndex={-1}>
        <div>
          {(!this.state.playing || this.state.paused) ? <FaPlay onClick={this.onPlay.bind(this)} /> : <FaPause onClick={this.onPause.bind(this)} />}
          {this.state.playing && <FaStop onClick={this.onStop.bind(this)} />}
        </div>
        {this.state.parts.map((part, i) => <Staff key={i}>
          <Bar>
            {part.beats.map((beat, j) => <Beat key={j}>
              {octaves.flat().reverse().map((note, k) => {
                if (k % 2 === 0) {
                  return <Line key={k}>{note[0] === beat.notes[0][0] && note[note.length - 1] === beat.notes[0][beat.notes[0].length - 1] && <Note sharp={beat.notes[0].includes('#')} />}</Line>;
                }
                return <Space key={k}>{note[0] === beat.notes[0][0] && note[note.length - 1] === beat.notes[0][beat.notes[0].length - 1] && <Note sharp={beat.notes[0].includes('#')} />}</Space>;
              })}
            </Beat>
            )}
          </Bar>
        </Staff>
        )}
        <Keyboard>
          {octaves.map((notes, i) => <Octave key={i}>
            {notes.map((note, i) => {
              let blackKey = null;
              if (note[0] !== 'E' && note[0] !== 'B') {
                const sharp = note[0] + '#' + note[1];
                blackKey = <Blackkey key={i} pressed={this.state.keyPressed[sharp] !== undefined} onMouseDown={this.startNote(sharp)} onMouseUp={this.stopNote(sharp)} />;
              }
              return <Whitekey key={i} pressed={this.state.keyPressed[note] !== undefined} onMouseDown={this.startNote(note)} onMouseUp={this.stopNote(note)}>
                {blackKey}
              </Whitekey>;
            })}
          </Octave>)}
        </Keyboard>
      </Container>
    );
  }
};
