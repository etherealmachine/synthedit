import React from 'react';
import './App.css';

import styled from 'styled-components'
import { Synth, PolySynth } from 'tone';

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
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

interface State {
  keyPressed: { [key: string]: boolean }
}

export default class App extends React.Component<{}, State> {

  synth: PolySynth = new PolySynth({ maxPolyphony: 10, voice: Synth }).toDestination()
  notes = ['C', 'D', 'E', 'F', 'G', 'A', 'B']
  keybindings = {
    4: "zxcvbnm",
    5: "asdfghj",
    6: "qwertyu",
  }

  constructor(props: any) {
    super(props);
    this.state = {
      keyPressed: {}
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
      this.state.keyPressed[note] = true;
      this.setState({
        keyPressed: this.state.keyPressed,
      });
    }
  }

  stopNote(note: string) {
    return (event: React.SyntheticEvent) => {
      this.synth.triggerRelease([note]);
      event.stopPropagation();
      this.state.keyPressed[note] = false;
      this.setState({
        keyPressed: this.state.keyPressed,
      });
    }
  }

  classFor(note: string) {
    return
  }

  render() {
    const octaves = [
      this.notes.map(note => note + 4),
      this.notes.map(note => note + 5),
      this.notes.map(note => note + 6),
    ];
    return (
      <Container onKeyDown={this.onKeyDown.bind(this)} onKeyUp={this.onKeyUp.bind(this)} tabIndex={-1}>
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
