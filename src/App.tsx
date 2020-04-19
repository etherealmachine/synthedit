import React from 'react';
import './App.css';
import styled from 'styled-components';
import { Fab } from '@material-ui/core';
import { FaPlus } from 'react-icons/fa';

import { Transport } from 'tone';

import State, { state, bindSetState } from './State';
import PartElement from './Part';
import Keyboard from './Keyboard';

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;

  button { 
    margin-bottom: 24px;
  }
`;

const KeyboardContainer = styled.div`
  margin-bottom: 24px;
`;

export default class App extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = state;
    bindSetState(this.setState.bind(this));
    Transport.start();
  }

  render() {
    return (
      <Container onKeyDown={this.state.keyDown} onKeyUp={this.state.keyUp} tabIndex={-1}>
        <Fab color="primary" onClick={this.state.addPart}><FaPlus /></Fab>
        {this.state.parts.map((part, i) => <PartElement key={i} state={this.state} index={i} />)}
        <KeyboardContainer>
          <Keyboard octaves={this.state.octaves} keyPressed={this.state.keyPressed} startNote={this.state.startNote} stopNote={this.state.stopNote} />
        </KeyboardContainer>
      </Container >
    );
  }
}
