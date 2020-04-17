import React, { useRef } from 'react';
import styled from 'styled-components';

import { NoteElement, RestElement } from './Notation';
import { Chord } from './State';

interface Props {
  playing?: boolean
  chord: Chord
  octaves: string[][]
}

const Container = styled.div<{ playing?: boolean }>`
  display: flex;
  flex-direction: column;
  background: ${props => props.playing ? '#ADD8E6' : ''};
  :hover {
    background: #ddd;
  }
`

const Line = styled.div`
  width: 30px;
  height: 8px;
  position: relative;
  ::after {
    content: '';
    position: absolute;
    width: 30px;
    height: 2px;
    background: black;
    top: 4px;
  }
`

const Space = styled.div`
  width: 8px;
  height: 8px;
  position: relative;
`

function chordContains(chord: Chord, baseNote: string): string | undefined {
  const key = baseNote[0];
  const octave = baseNote[1];
  return chord.notes.find(note => {
    return note[0] === key && note[note.length - 1] === octave;
  })?.toString();
}

export default function ChordElement(props: Props) {
  const { playing, chord, octaves } = props;
  const ref = useRef(null);
  chord.ref = ref;
  return <Container playing={playing} ref={ref}>
    {octaves.flat().reverse().map((baseNote, j) => {
      const note = chordContains(chord, baseNote);
      if (j % 2 === 0) {
        return <Line key={j}>
          {(note && <NoteElement note={note} duration={chord.duration} />) ||
            (baseNote === 'F5' && chord.notes.length === 0 && <RestElement duration={chord.duration} />)
          }
        </Line>;
      }
      return <Space key={j}>{note && <NoteElement note={note} duration={chord.duration} />}</Space>;
    })}
  </Container>
}