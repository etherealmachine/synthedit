import React from 'react';
import './App.css';

import { FaPlay } from 'react-icons/fa';
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

const Note = styled.div`
  height: 10px;
  width: 10px;
  background: black;
  border-radius: 5px;
  margin: 0 5px;
  z-index: 1;
`

interface State {
  keyPressed: { [key: string]: boolean }
  history: Array<string>
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
      history: []
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
      this.setState(update(this.state, { history: { $splice: [[this.state.history.length - 1, 1]] } }));
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
        history: update(this.state.history, { $push: [note] }),
        keyPressed: update(this.state.keyPressed, { [note]: { $set: true } }),
      });
    }
  }

  stopNote(note: string) {
    return (event: React.SyntheticEvent) => {
      this.synth.triggerRelease([note]);
      event.stopPropagation();
      this.setState({
        ...this.state,
        keyPressed: update(this.state.keyPressed, { [note]: { $set: false } }),
      });
    }
  }

  onPlay() {
    if (this.playback) {
      this.playback.stop();
      Transport.stop();
    }
    Transport.start();
    this.playback = new Part((time, event) => {
      this.synth.triggerAttackRelease(event.note, event.dur, time);
    }, this.state.history.map((note, i) => { return { time: i, note: note, dur: '4n' }; }));
    this.playback.start(0);
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
          <FaPlay onClick={this.onPlay.bind(this)} />
        </div>
        <Staff>
          <Bar>
            {this.state.history.map((note, i) => <Beat key={i}>
              <Line>{note === 'A5' && <Note />}</Line>
              <Space>{note === 'G5' && <Note />}</Space>
              <Line>{note === 'F5' && <Note />}</Line>
              <Space>{note === 'E5' && <Note />}</Space>
              <Line>{note === 'D5' && <Note />}</Line>
              <Space>{note === 'C5' && <Note />}</Space>
              <Line>{note === 'B4' && <Note />}</Line>
              <Space>{note === 'A4' && <Note />}</Space>
              <Line>{note === 'G4' && <Note />}</Line>
              <Space>{note === 'F4' && <Note />}</Space>
              <Line>{note === 'E4' && <Note />}</Line>
              <Space>{note === 'D4' && <Note />}</Space>
              <Line>{note === 'C4' && <Note />}</Line>
            </Beat>
            )}
          </Bar>
        </Staff>
        <Keyboard>
          {octaves.map((notes, i) => <Octave key={i}>
            {notes.map((note, i) => {
              let blackKey = null;
              if (note[0] !== 'E' && note[0] !== 'B') {
                const sharp = note[0] + '#' + note[1];
                blackKey = <Blackkey key={i} pressed={this.state.keyPressed[sharp]} onMouseDown={this.startNote(sharp)} onMouseUp={this.stopNote(sharp)} />;
              }
              return <Whitekey key={i} pressed={this.state.keyPressed[note]} onMouseDown={this.startNote(note)} onMouseUp={this.stopNote(note)}>
                {blackKey}
              </Whitekey>;
            })}
          </Octave>)}
        </Keyboard>
      </Container>
    );
  }
};
