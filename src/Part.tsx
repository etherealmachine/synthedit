import React, { useEffect } from 'react';
import styled from 'styled-components';
import { Paper } from '@material-ui/core';

import { Transport } from 'tone';

import State from './State';
import ChordElement from './Chord';
import PlayControls from './PlayControls';
import { FaTimes } from 'react-icons/fa';

const Container = styled(Paper)`
  width: 90%;
  min-height: 220px;
  margin: 16px 0;
  display: flex;
  flex-direction: row;
  align-items: center;
`

const Staff = styled.div`
  display: flex;
  flex-direction: row;
  margin: 16px;
  padding-top: 36px;
  padding-bottom: 8px;
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

const Controls = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
  & > :first-child {
    position: absolute;
    top: 8px;
    right: 8px;
  }
  & > :last-child {
    flex: 1;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
`;

interface Props {
  state: State
  index: number
}

export default function PartElement(props: Props) {
  const { state, index } = props;
  const { octaves } = props.state;
  const part = props.state.parts[props.index];
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
  const onSelect = (event: React.SyntheticEvent) => {
    event.stopPropagation();
    state.selectPart(index);
  }
  const onRemove = (event: React.SyntheticEvent) => {
    event.stopPropagation();
    state.removePart(index);
  }
  return <Container elevation={state.currentPart === index ? 10 : 1} onClick={onSelect}>
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
    <Controls>
      <FaTimes onClick={onRemove} />
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
    </Controls>
  </Container>;
}