import React from 'react';
import styled from 'styled-components'

import { Time } from 'tone';

const Note = styled.img`
  position: absolute;
  left: 5px;
  z-index: 1;
`

const WholeNote = styled(Note).attrs({
  src: `${process.env.PUBLIC_URL}/images/WholeNote.svg`
})`
  width: 15px;
`

const HalfNote = styled(Note).attrs({
  src: `${process.env.PUBLIC_URL}/images/HalfNote.svg`
})`
  height: 40px;
  bottom: -2px;
`

const QuarterNote = styled(Note).attrs({
  src: `${process.env.PUBLIC_URL}/images/QuarterNote.svg`
})`
  height: 40px;
  bottom: -2px;
`

const EighthNote = styled(Note).attrs({
  src: `${process.env.PUBLIC_URL}/images/EighthNote.svg`
})`
  height: 40px;
  bottom: -2px;
`

const SixteenthNote = styled(Note).attrs({
  src: `${process.env.PUBLIC_URL}/images/SixteenthNote.svg`
})`
  height: 42px;
  bottom: -2px;
`

const ThirtySecondNote = styled(Note).attrs({
  src: `${process.env.PUBLIC_URL}/images/ThirtySecondNote.svg`
})`
  height: 48px;
  bottom: -2px;
`

const SixtyFourthNote = styled(Note).attrs({
  src: `${process.env.PUBLIC_URL}/images/SixtyFourthNote.svg`
})`
  height: 58px;
  bottom: -2px;
`

const HundredTwentyEighthNote = styled(Note).attrs({
  src: `${process.env.PUBLIC_URL}/images/HundredTwentyEighthNote.svg`
})`
  height: 66px;
  bottom: -2px;
`

const TwoHundredFiftySixthNote = styled(Note).attrs({
  src: `${process.env.PUBLIC_URL}/images/TwoHundredFiftySixthNote.svg`
})`
  height: 74px;
  bottom: -2px;
`

const Rest = styled.img`
  position: absolute;
  left: 5px;
  z-index: 1;
`

const WholeRest = styled.span`
 width: 15px;
 height: 5px;
 background: black;
 position: absolute;
 bottom: -3px;
 left: 5px;
 z-index: 1;
`

const HalfRest = styled.span`
 width: 15px;
 height: 5px;
 background: black;
 position: absolute;
 left: 5px;
 z-index: 1;
`

const QuarterRest = styled(Rest).attrs({
  src: `${process.env.PUBLIC_URL}/images/QuarterRest.svg`
})`
  height: 40px;
  top: -15px;
`

const EighthRest = styled(Rest).attrs({
  src: `${process.env.PUBLIC_URL}/images/EighthRest.svg`
})`
  height: 25px;
  top: -8px;
`

const SixteenthRest = styled(Rest).attrs({
  src: `${process.env.PUBLIC_URL}/images/SixteenthRest.svg`
})`
  height: 30px;
  top: -10px;
`

const ThirtySecondRest = styled(Rest).attrs({
  src: `${process.env.PUBLIC_URL}/images/ThirtySecondRest.svg`
})`
  height: 40px;
  top: -15px;
`

const SixtyFourthRest = styled(Rest).attrs({
  src: `${process.env.PUBLIC_URL}/images/SixtyFourthRest.svg`
})`
  height: 50px;
  top: -18px;
`

const HundredTwentyEighthRest = styled(Rest).attrs({
  src: `${process.env.PUBLIC_URL}/images/HundredTwentyEighthRest.svg`
})`
  height: 60px;
  top: -25px;
`

const TwoHundredFiftySixthRest = styled(Rest).attrs({
  src: `${process.env.PUBLIC_URL}/images/TwoHundredFiftySixthRest.svg`
})`
  height: 70px;
  top: -30px;
`

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

const Sharp = styled.span`
  position: relative;
  top: -7px;
  left: -7px;
  font-size: 20px;
  &:before {
    content: '#';
  }
`;

const Dot = styled.span`
  display: block;
  position: relative;
  top: -2px;
  left: 20px;
  width: 4px;
  height: 4px;
  border-radius: 2px;
  background: black;
`;

interface NoteElementProps {
  note: string,
  duration: number,
}

export function NoteElement(props: NoteElementProps): JSX.Element {
  const subdivision = Time(props.duration).toNotation().toString();
  return <div>
    {React.createElement(NotesBySubdivision[parseInt(subdivision)], {})}
    {props.note.includes('#') && <Sharp />}
    {subdivision.includes('.') && <Dot />}
  </div>
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