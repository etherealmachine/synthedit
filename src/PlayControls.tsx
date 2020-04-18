import React from 'react';
import styled from 'styled-components';

import { FaPlay, FaPause, FaStop, FaCircle, FaRedo } from 'react-icons/fa';

interface Props {
  playing: boolean
  paused: boolean
  recording: boolean
  loop: boolean
  onPlay(): void
  onPause(): void
  onStop(): void
  toggleRecord(): void
  toggleLoop(): void
}

const Container = styled.div`
  svg {
    margin: 10px 6px;
  }
`

export default function PlayControls(props: Props) {
  return <Container>
    {(!props.playing || props.paused) ? <FaPlay onClick={props.onPlay} /> : <FaPause onClick={props.onPause} />}
    {(props.playing || props.paused) && <FaStop onClick={props.onStop} />}
    {<FaCircle style={{ color: props.recording ? "#ff2222" : "#000" }} onClick={props.toggleRecord} />}
    {<FaRedo style={{ color: props.loop ? "#58bc82" : "#000" }} onClick={props.toggleLoop} />}
  </Container>;
}