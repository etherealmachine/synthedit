import React from 'react';
import styled from 'styled-components'

import { Time } from 'tone';

interface NoteProps {
  sharp?: boolean;
  dotted?: boolean;
  triple?: boolean;
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

export const ThirtySecondNote = styled.div<NoteProps>`
  height: 40px;
  width: 40px;
  margin: 0 5px;
  background: url(${process.env.PUBLIC_URL}/images/ThirtySecondNote.svg);
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

export const SixtyFourthNote = styled.div<NoteProps>`
  height: 40px;
  width: 40px;
  margin: 0 5px;
  background: url(${process.env.PUBLIC_URL}/images/SixtyFourthNote.svg);
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

export const HundredTwentyEighthNote = styled.div<NoteProps>`
  height: 40px;
  width: 40px;
  margin: 0 5px;
  background: url(${process.env.PUBLIC_URL}/images/HundredTwentyEighthNote.svg);
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

export const TwoHundredFiftySixthNote = styled.div<NoteProps>`
  height: 40px;
  width: 40px;
  margin: 0 5px;
  background: url(${process.env.PUBLIC_URL}/images/TwoHundredFiftySixthNote.svg);
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

export const ThirtySecondRest = styled.div`
  height: 40px;
  width: 40px;
  margin: 0 5px;
  background: url(${process.env.PUBLIC_URL}/images/ThirtySecondRest.svg);
  background-repeat: no-repeat;
  background-size: auto 40px;
  position: relative;
  bottom: 15px;
  z-index: 1;
  display: flex;
  flex-direction: row;
`

export const SixtyFourthRest = styled.div`
  height: 40px;
  width: 40px;
  margin: 0 5px;
  background: url(${process.env.PUBLIC_URL}/images/SixtyFourthRest.svg);
  background-repeat: no-repeat;
  background-size: auto 40px;
  position: relative;
  bottom: 15px;
  z-index: 1;
  display: flex;
  flex-direction: row;
`

export const HundredTwentyEighthRest = styled.div`
  height: 40px;
  width: 40px;
  margin: 0 5px;
  background: url(${process.env.PUBLIC_URL}/images/HundredTwentyEighthRest.svg);
  background-repeat: no-repeat;
  background-size: auto 40px;
  position: relative;
  bottom: 15px;
  z-index: 1;
  display: flex;
  flex-direction: row;
`

export const TwoHundredFiftySixthRest = styled.div`
  height: 40px;
  width: 40px;
  margin: 0 5px;
  background: url(${process.env.PUBLIC_URL}/images/TwoHundredFiftySixthRest.svg);
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

const NotesBySubdivision: { [key: number]: any } = {
  256: TwoHundredFiftySixthNote,
  128: HundredTwentyEighthNote,
  64: SixtyFourthNote,
  32: ThirtySecondNote,
  16: SixteenthNote,
  8: EighthNote,
  4: QuarterNote,
  2: HalfNote,
  1: WholeNote,
}

interface NoteElementProps {
  note: string,
  duration: number,
}

export function NoteElement(props: NoteElementProps): JSX.Element {
  const subdivision = Time(props.duration).toNotation().toString();
  const num = parseInt(subdivision);
  return React.createElement(NotesBySubdivision[num], {
    sharp: isSharp(props.note),
    dotted: subdivision.includes('.'),
    triple: subdivision.includes('t'),
  });
}

interface RestElementProps {
  duration: number,
}

const RestsBySubdivision: { [key: number]: any } = {
  256: TwoHundredFiftySixthRest,
  128: HundredTwentyEighthRest,
  64: SixtyFourthRest,
  32: ThirtySecondRest,
  16: SixteenthRest,
  8: EighthRest,
  4: QuarterRest,
  2: HalfRest,
  1: WholeRest,
}

export function RestElement(props: RestElementProps): JSX.Element {
  const subdivision = Time(props.duration).toNotation().toString();
  const num = parseInt(subdivision);
  return React.createElement(RestsBySubdivision[num]);
}