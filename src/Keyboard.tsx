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
  startNote(note: string): React.MouseEventHandler
  stopNote(note: string): React.MouseEventHandler
}

export default function Keyboard(props: Props) {
  const { octaves, keyPressed, startNote, stopNote } = props;
  return <KeyboardContainer>
    {octaves.map((notes, i) => <Octave key={i}>
      {notes.map((note, i) => {
        let blackKey = null;
        if (note[0] !== 'E' && note[0] !== 'B') {
          const sharp = note[0] + '#' + note[1];
          blackKey = <Blackkey key={i} pressed={keyPressed[sharp] !== undefined} onMouseDown={startNote(sharp)} onMouseUp={stopNote(sharp)} />;
        }
        return <Whitekey key={i} pressed={keyPressed[note] !== undefined} onMouseDown={startNote(note)} onMouseUp={stopNote(note)}>
          {blackKey}
        </Whitekey>;
      })}
    </Octave>)}
  </KeyboardContainer>;
}