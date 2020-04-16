import React from 'react';
import './App.css';
import styled from 'styled-components';

import State from './State';
import PartElement from './Part';
import Keyboard from './Keyboard';

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export default class App extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = new State(this.setState.bind(this));
  }

  render() {
    return (
      <Container>
        {this.state.parts.map((part, i) => <PartElement key={i} part={part} octaves={this.state.octaves} />)}
        <Keyboard octaves={this.state.octaves} keyPressed={this.state.keyPressed} startNote={this.state.startNote} stopNote={this.state.stopNote} />
      </Container>
    );
  }
}
