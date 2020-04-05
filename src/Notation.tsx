import React from 'react';
import styled from 'styled-components'

import { Time } from 'tone';

interface NoteProps {
  sharp?: boolean;
}

export const WholeNote = styled.div<NoteProps>`
  height: 10px;
  width: 20px;
  margin: 0 5px;
  background: url(${process.env.PUBLIC_URL}/images/WholeNote.svg);
  background-repeat: no-repeat;
  background-size: auto 10px;
  position: relative;
  bottom: 14px;
  z-index: 1;
  display: flex;
  flex-direction: row;
  ::after {
    content: ${props => props.sharp ? "'#'" : "''"};
    position: relative;
    left: -10px;
    bottom: -25px;
  }
`

export const HalfNote = styled.div<NoteProps>`
  height: 40px;
  width: 40px;
  margin: 0 5px;
  background: url(${process.env.PUBLIC_URL}/images/HalfNote.svg);
  background-repeat: no-repeat;
  background-size: auto 40px;
  position: relative;
  bottom: 15px;
  z-index: 1;
  display: flex;
  flex-direction: row;
  ::after {
    content: ${props => props.sharp ? "'#'" : "''"};
    position: relative;
    left: -10px;
    bottom: -25px;
  }
`

export const QuarterNote = styled.div<NoteProps>`
  height: 40px;
  width: 40px;
  margin: 0 5px;
  background: url(${process.env.PUBLIC_URL}/images/QuarterNote.svg);
  background-repeat: no-repeat;
  background-size: auto 40px;
  position: relative;
  bottom: 15px;
  z-index: 1;
  display: flex;
  flex-direction: row;
  ::after {
    content: ${props => props.sharp ? "'#'" : "''"};
    position: relative;
    left: -10px;
    bottom: -25px;
  }
`

export const EighthNote = styled.div<NoteProps>`
  height: 40px;
  width: 40px;
  margin: 0 5px;
  background: url(${process.env.PUBLIC_URL}/images/EighthNote.svg);
  background-repeat: no-repeat;
  background-size: auto 40px;
  position: relative;
  bottom: 15px;
  z-index: 1;
  display: flex;
  flex-direction: row;
  ::after {
    content: ${props => props.sharp ? "'#'" : "''"};
    position: relative;
    left: -10px;
    bottom: -25px;
  }
`

export const SixteenthNote = styled.div<NoteProps>`
  height: 40px;
  width: 40px;
  margin: 0 5px;
  background: url(${process.env.PUBLIC_URL}/images/SixteenthNote.svg);
  background-repeat: no-repeat;
  background-size: auto 40px;
  position: relative;
  bottom: 15px;
  z-index: 1;
  display: flex;
  flex-direction: row;
  ::after {
    content: ${props => props.sharp ? "'#'" : "''"};
    position: relative;
    left: -10px;
    bottom: -25px;
  }
`

export const WholeRest = styled.div`
`

export const HalfRest = styled.div`
`

export const QuarterRest = styled.div`
  height: 40px;
  width: 40px;
  margin: 0 5px;
  background: url(${process.env.PUBLIC_URL}/images/QuarterRest.svg);
  background-repeat: no-repeat;
  background-size: auto 40px;
  position: relative;
  bottom: 15px;
  z-index: 1;
  display: flex;
  flex-direction: row;
`

export const EighthRest = styled.div`
  height: 40px;
  width: 40px;
  margin: 0 5px;
  background: url(${process.env.PUBLIC_URL}/images/EighthRest.svg);
  background-repeat: no-repeat;
  background-size: auto 40px;
  position: relative;
  bottom: 15px;
  z-index: 1;
  display: flex;
  flex-direction: row;
`

export const SixteenthRest = styled.div`
  height: 40px;
  width: 40px;
  margin: 0 5px;
  background: url(${process.env.PUBLIC_URL}/images/SixteenthRest.svg);
  background-repeat: no-repeat;
  background-size: auto 40px;
  position: relative;
  bottom: 15px;
  z-index: 1;
  display: flex;
  flex-direction: row;
`

function isSharp(note: string): boolean {
  return note.includes('#');
}

interface NoteElementProps {
  note: string,
  duration: number,
}

export function NoteElement(props: NoteElementProps): JSX.Element {
  const sharp = isSharp(props.note);
  switch (Time(props.duration).toNotation().toString()) {
    case '256n':
    case '256t':
    case '256n.':
    case '128n':
    case '128t':
    case '128n.':
    case '64n':
    case '64t':
    case '64n.':
    case '32n':
    case '32n.':
    case '16n':
    case '16n.':
    case '16t':
      return <SixteenthNote sharp={sharp} />;
    case '8n':
    case '8t':
    case '8n.':
      return <EighthNote sharp={sharp} />;
    case '4n':
    case '4t':
    case '4n.':
      return <QuarterNote sharp={sharp} />;
    case '2n':
    case '2n.':
      return <HalfNote sharp={sharp} />;
    case '1n':
    case '1n.':
      return <WholeNote sharp={sharp} />;
    default:
      console.log(Time(props.duration).toNotation());
      return <WholeNote sharp={sharp} />;
  }
}

interface RestElementProps {
  duration: number,
}

export function RestElement(props: RestElementProps): JSX.Element {
  switch (Time(props.duration).toNotation().toString()) {
    case '64n':
    case '64n.':
    case '32n':
    case '32n.':
    case '16n':
    case '16n.':
    case '16t':
      return <SixteenthRest />;
    case '8n':
    case '8t':
    case '8n.':
      return <EighthRest />;
    case '4n':
    case '4n.':
      return <QuarterRest />;
    case '2n':
    case '2n.':
      return <HalfRest />;
    case '1n':
    case '1n.':
      return <WholeRest />;
    default:
      return <WholeRest />;
  }
}