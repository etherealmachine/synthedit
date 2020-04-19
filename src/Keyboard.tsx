import React from 'react';
import styled from 'styled-components';
import { Paper } from '@material-ui/core';

import { notes } from './State';

const KeyboardContainer = styled(Paper)`
  display: flex;
  flex-direction: row;
  height: 200px;
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
  border-top: 1px solid black;
  border-right: 1px solid black;
  :first-child {
    border-left: 1px solid black;
  }
`;

const Blackkey = styled.div<ButtonProps>`
  position: absolute;
  height: 65%;
  width: 55%;
  z-index: 1;
  background: ${props => props.pressed ? '#CCC' : '#444'};
  left: 68%;
`;

interface Props {
  octaves: number[]
  keyPressed: { [key: string]: Date }
  startNote(note: string): void
  stopNote(note: string): void
}

export default function Keyboard(props: Props) {
  const { octaves, keyPressed } = props;
  const mouseDown = (note: string) => (event: React.SyntheticEvent) => {
    event.stopPropagation();
    props.startNote(note);
  };
  const mouseUp = (note: string) => (event: React.SyntheticEvent) => {
    event.stopPropagation();
    props.stopNote(note);
  };
  return <KeyboardContainer elevation={3}>
    {octaves.map((octave, i) => notes.map((note, j) => {
      note = note + octave;
      let blackKey = null;
      if (note[0] !== 'E' && note[0] !== 'B') {
        const sharp = note[0] + '#' + note[1];
        blackKey = <Blackkey
          key={`blackkey-${i}-${j}`}
          pressed={keyPressed[sharp] !== undefined}
          onMouseDown={mouseDown(sharp)}
          onMouseUp={mouseUp(sharp)}
        />;
      }
      return <Whitekey
        key={`whitekey-${i}-${j}`}
        pressed={keyPressed[note] !== undefined}
        onMouseDown={mouseDown(note)}
        onMouseUp={mouseUp(note)}>
        {blackKey}
      </Whitekey>;
    })).flat()}
  </KeyboardContainer>;
}