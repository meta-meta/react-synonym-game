import React, {Component} from 'react';

const obfuscateLetter = (letter, input) => input.includes(letter) ? letter : '*';

export default class Synonym extends Component {
  
  render() {
    
    const display = this.props.value.val
      .split('')
      .map((letter) => obfuscateLetter(letter, this.props.inputVal))
      .join('');
    
    return <div>{this.props.value.guessed ? this.props.value.val : display}</div>;
  }
}