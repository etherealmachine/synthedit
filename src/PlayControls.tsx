import React from 'react';

import { FaPlay, FaPause, FaStop } from 'react-icons/fa';

interface Props {
  playing: boolean
  paused: boolean
  onPlay(): void
  onPause(): void
  onStop(): void
}

export default function PlayControls(props: Props) {
  const { playing, paused, onPlay, onPause, onStop } = props;
  return <div>
    {(!playing || paused) ? <FaPlay onClick={onPlay} /> : <FaPause onClick={onPause} />}
    {playing && <FaStop onClick={onStop} />}
  </div>;
}