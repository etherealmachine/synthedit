import React from 'react';

import { FaPlay, FaPause, FaStop, FaCircle } from 'react-icons/fa';

interface Props {
  playing: boolean
  paused: boolean
  recording: boolean
  onPlay(): void
  onPause(): void
  onStop(): void
  toggleRecord(): void
}

export default function PlayControls(props: Props) {
  const { playing, paused, recording, onPlay, onPause, onStop, toggleRecord } = props;
  return <div>
    {(!playing || paused) ? <FaPlay onClick={onPlay} /> : <FaPause onClick={onPause} />}
    {playing && <FaStop onClick={onStop} />}
    {recording && <FaCircle style={{ color: "#ff2222" }} onClick={toggleRecord} />}
    {!recording && <FaCircle onClick={toggleRecord} />}
  </div>;
}