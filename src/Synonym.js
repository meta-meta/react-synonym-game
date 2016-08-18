import React, {Component} from 'react';
export default class Synonym extends Component {
  render() {
    return <div>{this.props.value.val}{this.props.value.guessed ? <strong>Y</strong> : null}</div>;
  }
}