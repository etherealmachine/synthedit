import React, { useRef } from 'react';
import classNames from 'classnames';
import styled from 'styled-components';

import { NoteElement, RestElement } from './Notation';
import { Chord, Part, notes } from './State';

interface Props {
  part: Part
  index: number
  chord: Chord
  octaves: number[]
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  :hover {
    background: #ddd;
  }
  &.playing {
    background: #ADD8E6;
  }
  &.selected {
    background: #bbb;
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
  const { chord, octaves, part, index } = props;
  const ref = useRef(null);
  chord.ref = ref;
  const mouseClick = (event: React.SyntheticEvent) => {
    event.stopPropagation();
    part.toggleSelect(index);
  }
  return <Container
    className={classNames({ playing: part.playingChordIndex === index, selected: chord.selected })}
    ref={ref}
    onClick={mouseClick}
  >
    {octaves.map(octave => notes.map(note => note + octave)).flat().reverse().map((baseNote, j) => {
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