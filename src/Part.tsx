import React from 'react';
import styled from 'styled-components';

import { Part, Chord } from './App';
import PlayControls from './PlayControls';
import { NoteElement, RestElement } from './Notation';

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`

const Staff = styled.div`
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

const ChordElement = styled.div<ChordProps>`
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

interface Props {
  part: Part
  octaves: string[][]
  onPlay(): void
  onPause(): void
  onStop(): void
  toggleRecord(): void
}

export default function PartElement(props: Props) {
  const { octaves, part, onPlay, onPause, onStop, toggleRecord } = props;
  const { chords, playingChord, paused, recording } = part;
  return <Container>
    <Staff>
      <Bar>
        {chords.map((chord, i) => <ChordElement key={i} playing={i === playingChord}>
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
        </ChordElement>
        )}
      </Bar>
    </Staff>
    <PlayControls
      playing={playingChord !== undefined}
      paused={paused}
      recording={recording}
      onPlay={onPlay}
      onPause={onPause}
      onStop={onStop}
      toggleRecord={toggleRecord}
    />
  </Container>;
}