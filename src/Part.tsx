import React, { useEffect } from 'react';
import styled from 'styled-components';

import { Transport } from 'tone';

import { Part } from './State';
import ChordElement from './Chord';
import PlayControls from './PlayControls';

const Container = styled.div`
  width: 90%;
  margin: 16px 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  border: 1px solid black;
`

const Staff = styled.div`
  display: flex;
  flex-direction: row;
  margin: 16px;
  padding: 8px;
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
  const { chords } = part;
  useEffect(() => {
    if (chords.length > 0) {
      let index = part.playingChordIndex;
      if (index === undefined) {
        index = chords.length - 1;
      }
      chords[index].ref?.current?.scrollIntoView();
    }
  });
  return <Container>
    <Staff>
      <Bar>
        {chords.map((chord, i) => <ChordElement
          key={i}
          chord={chord}
          octaves={octaves}
          index={i}
          part={part}
        />)}
      </Bar>
    </Staff>
    <PlayControls
      playing={Transport.state === 'started' && part.playback.state === 'started'}
      paused={Transport.state === 'paused'}
      recording={part.recording}
      loop={typeof part.playback.loop === 'number' ? part.playback.loop !== 0 : part.playback.loop}
      onPlay={part.play}
      onPause={part.pause}
      onStop={part.stop}
      toggleRecord={part.toggleRecord}
      toggleLoop={part.toggleLoop}
    />
  </Container>;
}