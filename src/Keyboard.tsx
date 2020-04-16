import React from 'react';
import styled from 'styled-components'

const KeyboardContainer = styled.div`
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

interface Props {
  octaves: string[][]
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
  return <KeyboardContainer>
    {octaves.map((notes, i) => <Octave key={i}>
      {notes.map((note, i) => {
        let blackKey = null;
        if (note[0] !== 'E' && note[0] !== 'B') {
          const sharp = note[0] + '#' + note[1];
          blackKey = <Blackkey
            key={i}
            pressed={keyPressed[sharp] !== undefined}
            onMouseDown={mouseDown(sharp)}
            onMouseUp={mouseUp(sharp)}
          />;
        }
        return <Whitekey
          key={i}
          pressed={keyPressed[note] !== undefined}
          onMouseDown={mouseDown(note)}
          onMouseUp={mouseUp(note)}>
          {blackKey}
        </Whitekey>;
      })}
    </Octave>)}
  </KeyboardContainer>;
}