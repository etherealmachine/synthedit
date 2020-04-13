import React from 'react';
import styled from 'styled-components';

import { NoteElement, RestElement } from './Notation';

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

interface ChordProps {
  playing?: boolean
}

const Chord = styled.div<ChordProps>`
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

export interface Staff {
  chords: Chord[]
}

export interface Chord {
  notes: string[]
  duration: number
  playing: boolean
}

interface Props {
  part: Staff
  octaves: string[][]
}

export default function Part(props: Props) {
  const { octaves, part } = props;
  return <Staff>
    <Bar>
      {part.chords.map((chord, i) => <Chord key={i} playing={chord.playing}>
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

      </Chord>
      )}
    </Bar>
  </Staff>;
}