import React, { useEffect } from 'react';
import styled from 'styled-components';

import { Part } from './State';
import ChordElement from './Chord';
import PlayControls from './PlayControls';

const Container = styled.div`
  width: 90%;
  margin: 16px 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 200px;
  border: 1px solid black;
`

const Staff = styled.div`
  display: flex;
  flex-direction: row;
  margin: 16px;
  flex: 1;
  overflow: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
`

const Bar = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
`

interface Props {
  part: Part
  octaves: string[][]
}

export default function PartElement(props: Props) {
  const { octaves, part } = props;
  const { chords, playingChord, paused, recording } = part;
  useEffect(() => {
    if (chords.length > 0) {
      chords[playingChord === undefined ? chords.length - 1 : playingChord].ref?.current?.scrollIntoView();
    }
  });
  return <Container>
    <Staff>
      <Bar>
        {chords.map((chord, i) => <ChordElement key={i} playing={i === playingChord} chord={chord} octaves={octaves} />)}
      </Bar>
    </Staff>
    <PlayControls
      playing={playingChord !== undefined}
      paused={paused}
      recording={recording}
      onPlay={part.play}
      onPause={part.pause}
      onStop={part.stop}
      toggleRecord={part.toggleRecord}
    />
  </Container>;
}